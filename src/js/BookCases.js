import React from 'react'

import BookView from './BookView'
import BookcasesBar from './BookcasesBar'
import ShelfEditor from './ShelfEditor'

const minZoom = 100
const maxZoom = 1600

class Shelves extends React.Component {

    constructor() {
        super()
        this.state = {
            caseImageURLs: [],
            cases: [],
            libraryid: 43,
            currentBook: null,
            readOnlyLibrary: true,
            zoom: 100,
            highlights: [],
            searchValue: "",
            searchusingtitle: true,
            searchusingsubtitle: false,
            searchusingseries: false,
            searchusingauthor: false,
            showShelfEditor: false,
            arrows: [],
            currentArrow: -1
        }
        this.loadCases = this.loadCases.bind(this)
        this.openBookEditor = this.openBookEditor.bind(this)
        this.saveBook = this.saveBook.bind(this)
        this.cancelBook = this.cancelBook.bind(this)
        this.removeBook = this.removeBook.bind(this)
        this.duplicateBook = this.duplicateBook.bind(this)
        this.setZoom = this.setZoom.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        this.previousResult = this.previousResult.bind(this)
        this.nextResult = this.nextResult.bind(this)
        this.search = this.search.bind(this)
        this.openShelfEditor = this.openShelfEditor.bind(this)
        this.saveShelfEditor = this.saveShelfEditor.bind(this)
        this.closeShelfEditor = this.closeShelfEditor.bind(this)
    }

    componentDidMount() {
        this.loadCases()
        this.determineReadOnly()
        this.setZoom()
    }

    componentDidUpdate() {
        let thisClass = this;
        let openBookEditor = this.openBookEditor
        $(".bookcases object").each(function() {
            $(this).on("load", function() {
                $(this).removeClass("bookcase-hidden")
                $($(this)[0].contentDocument).find(".bookcase-book").each(function() {
                    let id = $(this)[0].id.substring($(this)[0].id.indexOf("-")+1)
                    $(this).on("click", function() {
                        openBookEditor(id)
                    })
                    $(this).css("cursor", "pointer")
                    $($(this).next().find("textPath")[0]).css("cursor", "pointer")
                    $($(this).next().find("textPath")[0]).on("click", function() {
                        openBookEditor(id)
                    })
                })
            })
        })
    }

    duplicateBook() {
        let currentBook = this.state.currentBook;
        currentBook.bookid = "";
        currentBook.imageurl = "";
        this.setState({
            currentBook: currentBook
        })
    }

    render() {
        let bookEditorVisible = this.state.currentBook === null ? 'hidden' : 'visible'
        let shelfEditorVisible = this.state.showShelfEditor ? 'visible' : 'hidden'
        return (
            <div className="bookcases-container">
                <div className={"bookcases"}>
                    <div id="bookcase-arrows">
                    </div>
                    <BookcasesBar
                        search={this.search}
                        searchValue={this.state.searchValue}
                        searchusingtitle={this.state.searchusingtitle}
                        searchusingsubtitle={this.state.searchusingsubtitle}
                        searchusingseries={this.state.searchusingseries}
                        searchusingauthor={this.state.searchusingauthor}
                        zoomIn={this.zoomIn}
                        zoomOut={this.zoomOut}
                        previousResult={this.previousResult}
                        nextResult={this.nextResult}
                        openShelfEditor={this.openShelfEditor}
                    />
                    {this.state.caseImageURLs.map((url, idx) => {
                        return <object style={{height: "100%"}} key={idx} className="bookcase bookcase-hidden" data={url+"?"+(this.props.getCasesHash())} type="image/svg+xml" />
                    })}
                </div>
                <BookView
                    book={this.state.currentBook}
                    readOnlyLibrary={this.state.readOnlyLibrary}
                    visible={bookEditorVisible}
                    saveBook={this.saveBook}
                    cancelBook={this.cancelBook}
                    removeBook={this.removeBook}
                    duplicateBook={this.duplicateBook}
                    reload={this.loadCases}
                />
                <ShelfEditor
                    visible={shelfEditorVisible}
                    saveShelfEditor={this.saveShelfEditor}
                    closeShelfEditor={this.closeShelfEditor}
                    libraryid={this.state.libraryid}
                    readOnlyLibrary={this.state.readOnlyLibrary}
                />
            </div>
        )
    }

    openShelfEditor() {
        this.setState({
            showShelfEditor: true
        })
    }

    saveShelfEditor(cases) {
        console.log(cases)
        this.setState({
            showShelfEditor: false
        })
    }

    closeShelfEditor() {
        this.setState({
            showShelfEditor: false
        })
    }

    openBookEditor(bookid) {
        fetch("/books/" + bookid)
        .then(res => res.json())
        .then((data) => {
            data.authors = ""
            data.contributors.forEach(a => {
                data.authors += a.name.first + " " + a.name.middles + " " + a.name.last + ":" + a.role + "---"
            })
            data.authors = data.authors.replace(/---/g, "\n")
            this.setState({
                currentBook: data
            })
        })
        .catch(console.log)
    }

    saveBook(b, reload) {
        if (b.bookid) {
            this.props.saveBook(b, reload)
        } else {
            this.props.addBook(b, reload)
        }
        this.setState({
            currentBook: null
        })
    }

    cancelBook() {
        this.setState({
            currentBook: null
        })
    }

    removeBook(book, reload) {
        this.props.removeBook(book, reload)
        this.setState({
            currentBook: null
        })
    }

    loadCases() {
        fetch("/libraries/" + this.state.libraryid + "/cases/ids")
            .then(res => res.json())
            .then((data) => {
                var caseImageUrls = data.map((id) => {
                    return "/caseimages/" + id
                })
                caseImageUrls.push("/caseimages/-1")
                this.setState({
                    caseImageURLs: caseImageUrls
                })
            })
            .catch(console.log)
    }

    determineReadOnly() {
        fetch("/libraries/" + this.state.libraryid)
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    readOnlyLibrary: (data.permissions & 2) !== 2
                })
            })
            .catch(console.log)
    }

    setZoom() {
        let thisClass = this;
        $(".bookcase").each(function() {
            $(this).height(thisClass.state.zoom + "%")
        })
        thisClass.search(this.state, true)
    }

    zoomIn() {
        let thisClass = this;
        let oldX = $(".bookcases")[0].scrollLeft + $(".bookcases")[0].clientWidth / 2
        let oldY = $(".bookcases")[0].scrollTop + $(".bookcases")[0].clientHeight / 2
        if (thisClass.state.zoom < maxZoom) {
            thisClass.setState({
                zoom: thisClass.state.zoom * 2
            }, function() {
                thisClass.setZoom()
                $($(".bookcases")[0]).scrollLeft(oldX * 2 - $(".bookcases")[0].clientWidth / 2)
                $($(".bookcases")[0]).scrollTop(oldY * 2 - $(".bookcases")[0].clientHeight / 2)
            })
        }
    }

    zoomOut() {
        let thisClass = this;
        let oldX = $(".bookcases")[0].scrollLeft + $(".bookcases")[0].clientWidth / 2
        let oldY = $(".bookcases")[0].scrollTop + $(".bookcases")[0].clientHeight / 2
        if (thisClass.state.zoom > minZoom) {
            thisClass.setState({
                zoom: this.state.zoom / 2
            }, function() {
                thisClass.setZoom()
                $($(".bookcases")[0]).scrollLeft(oldX / 2 - $(".bookcases")[0].clientWidth / 2)
                $($(".bookcases")[0]).scrollTop(oldY / 2 - $(".bookcases")[0].clientHeight / 2)
            })
        }
    }

    addArrowHighlight(idx) {
        $("#arrow-" + idx).addClass("highlighted");
    }

    removeArrowHighlight(idx) {
        $("#arrow-" + idx).removeClass("highlighted");
    }

    moveToArrow(idx) {
        $(".bookcases")[0].scrollTo({
            top: this.state.arrows[idx][1]-$($(".bookcases-bar-container")[0]).height(),
            left: this.state.arrows[idx][0]+40*3-$($(".bookcases-container")[0]).width()/2,
            behavior: 'smooth'
        })
    }

    previousResult() {
        let thisClass = this;
        if (this.state.arrows.length === 0) {
            return;
        }
        thisClass.removeArrowHighlight(this.state.currentArrow);
        let prev = this.state.currentArrow == 0 ? this.state.arrows.length - 1 : this.state.currentArrow - 1
        this.setState({
                currentArrow: prev
            }, function() {
                thisClass.addArrowHighlight(thisClass.state.currentArrow);
                thisClass.moveToArrow(thisClass.state.currentArrow);
            });
    }

    nextResult() {
        let thisClass = this;
        if (this.state.arrows.length === 0) {
            return;
        }
        if (this.state.currentArrow !== -1) {
            thisClass.removeArrowHighlight(this.state.currentArrow);
        }
        let next = this.state.currentArrow === this.state.arrows.length - 1 ? 0 : this.state.currentArrow + 1
        this.setState({
                currentArrow: next
            }, function() {
                thisClass.addArrowHighlight(thisClass.state.currentArrow);
                thisClass.moveToArrow(thisClass.state.currentArrow);
            });
    }

    search(values, isZooming=false) {
        let thisClass = this;
        this.setState({
            searchValue: values["searchValue"],
            searchusingtitle: values["searchusingtitle"],
            searchusingsubtitle: values["searchusingsubtitle"],
            searchusingseries: values["searchusingseries"],
            searchusingauthor: values["searchusingauthor"]
        })
        fetch("/libraries/" + this.state.libraryid + "/search?text=" + encodeURIComponent(values["searchValue"]) + "&searchusingtitle=" + encodeURIComponent(values["searchusingtitle"]) + "&searchusingsubtitle=" + encodeURIComponent(values["searchusingsubtitle"]) + "&searchusingseries=" + encodeURIComponent(values["searchusingseries"]) + "&searchusingauthor=" + encodeURIComponent(values["searchusingauthor"]))
        .then(res => res.json())
        .then((data) => {
            if (data && data.length < 1000) {
                let arrowContainer = $("#bookcase-arrows")
                let bookcasesContainer = $($(".bookcases")[0])
                let arrows = []

                arrowContainer.empty()
                data.forEach((match, idx) => {
                    let caseX = 0
                    for (let i=0; i<match.case; i++) {
                        caseX += $($(".bookcase")[i]).width()
                    }

                    let svg = $($($(".bookcase")[match.case].contentDocument).find("svg")[0])

                    let ratio = bookcasesContainer[0].scrollHeight / parseInt(svg.attr("height"))

                    let bookcase = $($(".bookcase")[match.case])

                    let book = $(bookcase[0].contentDocument).find("#book-" + match.id)

                    let x = caseX + book.attr("x") * ratio
                    let y = book.attr("y") * ratio
                    let width = book.attr("width") * ratio
                    let height = book.attr("height") * ratio

                    let imageWidth = 40 * this.state.zoom / 100
                    let imageHeight = 40 * this.state.zoom / 100

                    let arrow = $("<div id='arrow-" + idx + "' class='highlight-arrow'><img width='" + imageWidth + "' height='" + imageHeight + "' src='/web/res/Down_Arrow.svg'></img></div>")
                    arrow.css("left", x + width/2 - imageWidth/2)
                    arrow.css("top", y - imageHeight)
                    console.log(x, y);
                    arrows.push([x + width/2 - imageWidth/2, y - imageHeight])
                    arrowContainer.append(arrow)
                })
                let currentArrow = isZooming ? this.state.currentArrow - 1 : -1;
                this.setState({
                    arrows: arrows,
                    currentArrow: currentArrow
                }, thisClass.nextResult);
            }
        })
        .catch(console.log)
    }

}

export default Shelves

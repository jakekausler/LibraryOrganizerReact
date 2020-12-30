import React from 'react'

import BookView from './BookView'
import BookcasesBar from './BookcasesBar'

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
            searchValue: ""
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
        this.search = this.search.bind(this)
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
        let visible = this.state.currentBook === null ? 'hidden' : 'visible'
        return (
            <div className="bookcases-container">
                <div className={"bookcases"}>
                    <div id="bookcase-arrows">
                    </div>
                    <BookcasesBar
                        search={this.search}
                        zoomIn={this.zoomIn}
                        zoomOut={this.zoomOut}
                    />
                    {this.state.caseImageURLs.map((url, idx) => {
                        return <object style={{height: "100%"}} key={idx} className="bookcase bookcase-hidden" data={url+"?"+(this.props.getCasesHash())} type="image/svg+xml" />
                    })}
                </div>
                <BookView
                    book={this.state.currentBook}
                    readOnlyLibrary={this.state.readOnlyLibrary}
                    visible={visible}
                    saveBook={this.saveBook}
                    cancelBook={this.cancelBook}
                    removeBook={this.removeBook}
                    duplicateBook={this.duplicateBook}
                    reload={this.loadCases}
                />
            </div>
        )
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
                this.setState({
                    caseImageURLs: data.map((id) => {
                        return "/caseimages/" + id
                    })
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
        thisClass.search(this.state.searchValue)
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

    search(value) {
        this.setState({
            searchValue: value
        })
        fetch("/libraries/" + this.state.libraryid + "/search?text=" + encodeURIComponent(value))
        .then(res => res.json())
        .then((data) => {
            if (data.length < 1000) {
                let arrowContainer = $("#bookcase-arrows")
                let bookcasesContainer = $($(".bookcases")[0])

                arrowContainer.empty()
                data.forEach(match => {
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

                    let arrow = $("<div class='highlight-arrow'><img width='" + imageWidth + "' height='" + imageHeight + "' src='/web/res/Down-Arrow.png'></img></div>")
                    arrow.css("left", x + width/2 - imageWidth/2)
                    arrow.css("top", y - imageHeight)
                    arrowContainer.append(arrow)
                })
            }
        })
        .catch(console.log)
    }

}

export default Shelves

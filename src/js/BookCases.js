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
            areaStyle: {
                width: 0,
                height: 0
            },
            bookHashes: [],
            shelfHashes: [],
            shelfViewBookHashes: [],
            canvasRefs: [],
            shelfRefs: [],
            bookLocations: {},
            containerRef: React.createRef(),
            bookcasesRef: React.createRef(),
            currentBook: null,
            showAllShelves: true,
            clickedShelf: {caseid: -1, shelfid: -1},
            readOnlyLibrary: true,
            zoom: 100,
            highlights: [],
            searchValue: ""
        }
        this.loadCases = this.loadCases.bind(this)
        this.drawCanvas = this.drawCanvas.bind(this)
        this.drawShelf = this.drawShelf.bind(this)
        this.canvasClick = this.canvasClick.bind(this)
        this.doBoxesIntersect = this.doBoxesIntersect.bind(this)
        this.getClick = this.getClick.bind(this)
        this.openShelfView = this.openShelfView.bind(this)
        this.closeShelfView = this.closeShelfView.bind(this)
        this.openBookEditor = this.openBookEditor.bind(this)
        this.saveBook = this.saveBook.bind(this)
        this.cancelBook = this.cancelBook.bind(this)
        this.removeBook = this.removeBook.bind(this)
        this.duplicateBook = this.duplicateBook.bind(this)
        this.onReturnFromShelf = this.onReturnFromShelf.bind(this)
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
                    $(this).on("click", function() {
                        openBookEditor($(this)[0].id)
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
            <div className="bookcases-container" ref={this.state.containerRef}>
                {/*
                <div width={this.state.areaStyle.width} height={this.state.areaStyle.height} className={"bookcases " + (this.state.showAllShelves ? 'visible' : 'hidden')} ref={this.state.bookcasesRef}>
                    {this.state.canvasRefs.map((ref, idx) => {
                        return <canvas ref={ref} key={idx} onClick={(event) => this.canvasClick(event, ref, idx)} />
                    })}
                </div>
                <div className={"bookshelves-return " + (this.state.showAllShelves ? 'hidden' : 'visible')} onClick={(event) => this.onReturnFromShelf(event)}>Return</div>
                <div width={this.state.areaStyle.width} height={this.state.areaStyle.height} className={"bookshelves " + (this.state.showAllShelves ? 'hidden' : 'visible')} ref={this.state.bookcasesRef}>
                    {this.state.shelfRefs.map((bookcase, bidx) => {
                        return bookcase.map((shelf, sidx) => {
                            return <canvas className={shelf.visible ? 'visible' : 'hidden'} ref={shelf.ref} key={bidx + "-" + sidx} onClick={(event) => this.canvasClick(event, shelf.ref, -1) } />
                        })
                    })}
                </div>
                */}
                <div className={"bookcases " + (this.state.showAllShelves ? 'visible' : 'hidden')} ref={this.state.bookcasesRef}>
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
                <div className={"bookshelves " + (this.state.showAllShelves ? 'hidden' : 'visible')}>
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

    openShelfView(caseId, shelfId) {
        this.setState({
            clickedShelf: {caseid: caseId, shelfid: shelfId},
            shelfRefs: this.state.shelfRefs.map((bookcase, i) => {
                return bookcase.map((shelf, j) => {
                    if (i === caseId && j === shelfId) {
                        shelf.visible = true;
                        return shelf;
                    } else {
                        shelf.visible = false;
                        return shelf;
                    }
                })
            }),
            showAllShelves: false
        })
    }

    closeShelfView() {
        this.setState({
            clickedShelf: {caseid: -1, shelfid: -1},
            shelfRefs: this.state.shelfRefs.map((bookcase, i) => {
                return bookcase.map((shelf, j) => {
                    shelf.visible = false;
                    return shelf;
                })
            }),
            showAllShelves: true
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

    canvasClick(event, ref, idx) {
        let values = this.getClick(event, ref, idx)
        if (!values.book) {
            if (!values.container) {
                return;
            } else {
                this.openShelfView(values.container.caseid, values.container.shelfid)
            }
        } else {
            this.openBookEditor(values.book.bookid)
        }
    }

    onReturnFromShelf(event) {
        if (!this.state.showAllShelves) {
            this.closeShelfView()
        }
    }

    getClick(event, ref, idx) {
        if (this.state.showAllShelves) {
            let rect = ref.current.getBoundingClientRect()
            let x = event.clientX - rect.left
            let y = event.clientY - rect.top
            let i = Math.floor(x / 100)
            let j = Math.floor(y / 100)
            if (this.state.bookHashes[idx]) {
                for (let b in this.state.bookHashes[idx][i][j]) {
                    if (x < this.state.bookHashes[idx][i][j][b].x + this.state.bookHashes[idx][i][j][b].newwidth && x > this.state.bookHashes[idx][i][j][b].x && y < this.state.bookHashes[idx][i][j][b].y + this.state.bookHashes[idx][i][j][b].newheight && y > this.state.bookHashes[idx][i][j][b].y) {
                        let book = this.state.bookHashes[idx][i][j][b]
                        return {book: book, container: null}
                    }
                }
            }
            for (let s in this.state.shelfHashes[idx]) {
                let shelf = this.state.shelfHashes[idx][s]
                if (x > shelf.x1 && x < shelf.x2 && y > shelf.y1 && y < shelf.y2) {
                    return {book: null, container: shelf}
                }
            }
            return {book: null, container: null}
        } else {
            let container = {caseid: this.state.clickedShelf.caseid, shelfid: this.state.clickedShelf.shelfid}
            let rect = ref.current.getBoundingClientRect()
            let x = event.clientX - rect.left
            let y = event.clientY - rect.top
            for (let b in this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid]) {
                if (x < this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid][b].x + this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid][b].width
                 && x > this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid][b].x
                 && y < this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid][b].y + this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid][b].height
                 && y > this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid][b].y ) {
                    return {book: this.state.shelfViewBookHashes[this.state.clickedShelf.caseid][this.state.clickedShelf.shelfid][b].book, container: null}
                }
            }
            return {book: null, container: null}
        }
    }

    doBoxesIntersect(a, b) {
        return !(a.x > b.x + b.width || a.x + a.width < b.x || a.y > b.y + b.height || a.y + a.height < b.y)
    }

    loadCases(method="svg") {
        if (method == "svg") {
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
        } else {
            fetch("/libraries/" + this.state.libraryid + "/cases")
                .then(res => res.json())
                .then((data) => {
                    this.setState({
                        canvasRefs: data.map((bookcase) => {
                            return React.createRef()
                        }),
                        shelfRefs: data.map((bookcase) => {
                            return bookcase.shelves.map((shelf) => {
                                return {
                                    ref: React.createRef(),
                                    visible: false
                                }
                            })
                        }),
                        cases: data
                    })
                    let height = this.drawCanvas()
                    this.state.bookcasesRef.current.scrollTo(0, height)
                })
                .catch(console.log)
        }
    }

    drawShelf(caseid, shelfid, books) {
        let thisClass = this
        const canvas = thisClass.state.shelfRefs[caseid][shelfid].ref.current
        const ctx = canvas.getContext('2d')
        let width = window.innerWidth;
        let height = window.innerHeight - 80 - 40;
        canvas.width = width;
        canvas.height = height;
        let totalBookWidth = 0;
        for (let b in books) {
            totalBookWidth += books[b].width;
            if (books[b].width <= 0) {
                totalBookWidth += 25
            }
        }
        let multiplier = 1.0 * width / totalBookWidth;
        let actualWidth = 0
        let x = 0;
        let y = height;

        if (this.state.shelfViewBookHashes[caseid]) {
            if (!this.state.shelfViewBookHashes[caseid][shelfid]) {
                this.state.shelfViewBookHashes[caseid][shelfid] = []
            }
        } else {
            this.state.shelfViewBookHashes[caseid] = []
            this.state.shelfViewBookHashes[caseid][shelfid] = []
        }

        for (let b in books) {
            let book = books[b]
            let spineColor = book.highlight === undefined ? book.spinecolor : (book.highlight ? "white" : "black")
            let textColor
            if (book.highlight === undefined) {
                let converted = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(book.spinecolor)
                let rgb = converted ? [
                    parseInt(converted[1], 16),
                    parseInt(converted[2], 16),
                    parseInt(converted[3], 16)
                ] : null
                if (converted) {
                    let o = Math.round(((parseInt(rgb[0], 10) * 299) + (parseInt(rgb[1], 10) * 587) + (parseInt(rgb[2], 10) * 114)) / 1000)
                    textColor = (o > 125) ? 'black' : 'white'
                } else {
                    textColor = 'white'
                }
            } else {
                textColor = book.highlight ? "black" : "white"
            }
            ctx.fillStyle = 'black'
            let bookwidth = book.width <= 0 ? (25*multiplier) : (book.width*multiplier)
            let bookheight = height
            ctx.font = Math.min(72, Math.floor(bookwidth/4.0*3)) + "px Arial"
            ctx.fillRect(x, y - bookheight, bookwidth, bookheight)
            ctx.fillStyle = spineColor
            ctx.fillRect(x + 1, y - bookheight, bookwidth - 2, bookheight - 2)
            ctx.save()
            ctx.translate(x + bookwidth / 2, y)
            ctx.rotate(-Math.PI / 2)
            ctx.textAlign = "left"
            ctx.textBaseline = "middle"
            let text = book.title
            if (ctx.measureText(text).width > bookheight - ctx.measureText("...").width) {
                while (ctx.measureText(text).width > bookheight - ctx.measureText("...").width && text.length > 4) {
                    text = text.substring(0, text.length - 2)
                }
                text = text + "..."
            }
            ctx.fillStyle = textColor
            ctx.fillText(text, 0, 0)
            ctx.restore()

            //hashes
            this.state.shelfViewBookHashes[caseid][shelfid].push({x: x, y: y-bookheight, width: bookwidth, height: bookheight, book: book})

            x += bookwidth;
        }
    }

    drawCanvas() {
        let thisClass = this
        let margin = 50
        let x = margin
        let y = margin
        let width = margin
        let height = margin
        let caseHeights = []
        thisClass.state.cases.forEach(function(bookcase) {
            let h = bookcase.spacerheight
            let maxWidth = 0
            bookcase.shelves.forEach(function(shelf) {
                if (shelf.width > maxWidth) {
                    maxWidth = shelf.width
                }
                h += bookcase.spacerheight + shelf.height
            })
            if (height < h) {
                height = h
            }
            caseHeights.push(h)
            x += bookcase.spacerheight + maxWidth + bookcase.spacerheight + margin;
            width = x;
        })
        thisClass.setState({
            areaStyle: {
                width: (width + margin) + "px",
                height: (height + margin) + "px"
            }
        })
        let bookHashes = []
        let shelfHashes = []
        let bookLocations = {}
        thisClass.state.cases.forEach(function(bookcase, case_idx) {
            shelfHashes.push([])
            const canvas = thisClass.state.canvasRefs[case_idx].current
            const ctx = canvas.getContext("2d")
            canvas.width = bookcase.spacerheight * 2
            bookcase.shelves.forEach(function(shelf) {
                if (bookcase.spacerheight * 2 + shelf.width > canvas.width) {
                    canvas.width = bookcase.spacerheight * 2 + shelf.width
                }
            })
            canvas.height = height
            canvas.style.margin = (margin / 2) + "px"
            bookHashes.push([])
            for (let i=0; i<canvas.width/100; i+=1) {
                bookHashes[case_idx].push([])
                for (let j=0; j<canvas.height/100; j+=1) {
                    bookHashes[case_idx][i].push([])
                    bookHashes[case_idx][i][j] = []
                }
            }
            y = height - caseHeights[case_idx]
            bookcase.shelves.forEach(function(shelf, shelf_idx) {
                thisClass.drawShelf(case_idx, shelf_idx, shelf.books)
                x = 0
                if (shelf.alignment == "right") {
                    x = canvas.width - bookcase.spacerheight * 2 - shelf.width
                }
                shelfHashes[shelfHashes.length-1].push({x1: x + bookcase.spacerheight, x2: x + bookcase.spacerheight + shelf.width, y1: y, y2: y + shelf.height, caseid: case_idx, shelfid: shelf_idx});
                let ix = bookcase.paddingleft + x + bookcase.spacerheight
                ctx.fillRect(x, y, bookcase.spacerheight, bookcase.spacerheight + shelf.height)
                ctx.fillRect(x + shelf.width + bookcase.spacerheight, y, bookcase.spacerheight, bookcase.spacerheight*2 + shelf.height)
                ctx.fillRect(x + bookcase.spacerheight, y, shelf.width, bookcase.spacerheight)
                if (shelf.books) {
                    shelf.books.forEach(function(book, idx) {
                        ctx.font = Math.min(10, Math.floor(book.width/4*3)) + "px Arial"
                        let spineColor = book.highlight === undefined ? book.spinecolor : (book.highlight ? "white" : "black")
                        let textColor
                        if (book.highlight === undefined) {
                            let converted = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(book.spinecolor)
                            let rgb = converted ? [
                                parseInt(converted[1], 16),
                                parseInt(converted[2], 16),
                                parseInt(converted[3], 16)
                            ] : null
                            if (converted) {
                                let o = Math.round(((parseInt(rgb[0], 10) * 299) + (parseInt(rgb[1], 10) * 587) + (parseInt(rgb[2], 10) * 114)) / 1000)
                                textColor = (o > 125) ? 'black' : 'white'
                            } else {
                                textColor = 'white'
                            }
                        } else {
                            textColor = book.highlight ? "black" : "white"
                        }
                        ctx.fillStyle = 'black'
                        let bookwidth = book.width <= 0 ? bookcase.averagebookwidth : book.width
                        let bookheight = book.height <= 0 ? bookcase.averagebookheight : book.height
                        ctx.fillRect(ix, y - bookheight + shelf.height + bookcase.spacerheight, bookwidth, bookheight)
                        ctx.fillStyle = spineColor
                        ctx.fillRect(ix + 1, y - bookheight + shelf.height + bookcase.spacerheight + 1, bookwidth - 2, bookheight - 2)
                        bookLocations[book.id] = [ix + 1, y - bookheight + shelf.height + bookcase.spacerheight + 1, bookwidth - 2, bookheight - 2]
                        ctx.save()
                        ctx.translate(ix + bookwidth / 2, y + shelf.height + bookcase.spacerheight - 2)
                        ctx.rotate(-Math.PI / 2)
                        ctx.textAlign = "left"
                        ctx.textBaseline = "middle"
                        let text = book.title
                        if (ctx.measureText(text).width > bookheight - ctx.measureText("...").width) {
                            while (ctx.measureText(text).width > bookheight - ctx.measureText("...").width && text.length > 4) {
                                text = text.substring(0, text.length - 2)
                            }
                            text = text + "..."
                        }
                        ctx.fillStyle = textColor
                        ctx.fillText(text, 0, 0)
                        ctx.restore()
                        book.x = ix
                        book.y = y - bookheight + shelf.height + bookcase.spacerheight
                        book.newwidth = bookwidth
                        book.newheight = bookheight
                        for (var i = Math.floor((ix - 1) / 100); i < Math.floor(((ix - 1) + (bookwidth + 2)) / 100) + 1; i+=1) {
                            for (var j = Math.floor((y - bookheight + shelf.height + bookcase.spacerheight - 1) / 100); j < Math.floor(((y - bookheight + shelf.height + bookcase.spacerheight - 1) + (bookheight + 2)) / 100) + 1; j += 1) {
                                if (i >= 0 && j >= 0 && thisClass.doBoxesIntersect({
                                    x: i * 100,
                                    y: j * 100,
                                    width: 100,
                                    height: 100
                                }, {
                                    x: ix - 1,
                                    y: y - bookheight + shelf.height + bookcase.spacerheight - 1,
                                    width: bookwidth + 2,
                                    height: bookheight + 2
                                })) {
                                    bookHashes[case_idx][i][j].push({
                                        bookid: book.bookid,
                                        x: book.x,
                                        y: book.y,
                                        newwidth: book.newwidth,
                                        newheight: book.newheight
                                    })
                                }
                            }
                        }
                        ix += bookwidth
                    })
                }
                ctx.fillStyle = 'black'
                y += bookcase.spacerheight + shelf.height
                ctx.fillRect(x, y, shelf.width + bookcase.spacerheight, bookcase.spacerheight)
            })
            y = 0
            x += bookcase.spacerheight + bookcase.width + bookcase.spacerheight
        })

        thisClass.setState({
            bookHashes: bookHashes,
            shelfHashes: shelfHashes,
            bookLocations: bookLocations,
        })

        return height
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

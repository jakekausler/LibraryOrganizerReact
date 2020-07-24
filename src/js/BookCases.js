import React from 'react'

import BookView from './BookView'

class Shelves extends React.Component {
    constructor() {
        super()
        this.state = {
            cases: [],
            libraryid: 43,
            areaStyle: {
                width: 0,
                height: 0
            },
            bookHashes: [],
            shelfHashes: [],
            canvasRefs: [],
            shelfRefs: [],
            bookLocations: {},
            containerRef: React.createRef(),
            bookcasesRef: React.createRef(),
            currentBook: null,
            showAllShelves: true,
            clickedShelf: {caseid: -1, shelfid: -1}
        }
        this.loadCases = this.loadCases.bind(this)
        this.drawCanvas = this.drawCanvas.bind(this)
        this.drawShelf = this.drawShelf.bind(this)
        this.canvasClick = this.canvasClick.bind(this)
        this.canvasKeyPress = this.canvasKeyPress.bind(this)
        this.doBoxesIntersect = this.doBoxesIntersect.bind(this)
        this.getClick = this.getClick.bind(this)
        this.openShelfView = this.openShelfView.bind(this)
        this.closeShelfView = this.closeShelfView.bind(this)
        this.openBookEditor = this.openBookEditor.bind(this)
        this.saveBook = this.saveBook.bind(this)
        this.cancelBook = this.cancelBook.bind(this)
        this.removeBook = this.removeBook.bind(this)
    }

    componentDidMount() {
        this.loadCases()
    }

    render() {
        let visible = this.state.currentBook === null ? 'hidden' : 'visible'
        return (
            <div className="bookcases-container" ref={this.state.containerRef}>
                <div width={this.state.areaStyle.width} height={this.state.areaStyle.height} className={"bookcases " + (this.state.showAllShelves ? 'visible' : 'hidden')} ref={this.state.bookcasesRef}>
                    {this.state.canvasRefs.map((ref, idx) => {
                        return <canvas ref={ref} key={idx} onClick={(event) => this.canvasClick(event, ref, idx)} />
                    })}
                </div>
                <div width={this.state.areaStyle.width} height={this.state.areaStyle.height} className={"bookshelves " + (this.state.showAllShelves ? 'hidden' : 'visible')} ref={this.state.bookcasesRef}>
                    {this.state.shelfRefs.map((bookcase, bidx) => {
                        return bookcase.map((shelf, sidx) => {
                            return <canvas className={shelf.visible ? 'visible' : 'hidden'} ref={shelf.ref} key={bidx + "-" + sidx} onClick={(event) => this.canvasKeyPress(event)} />
                        })
                    })}
                </div>
                <BookView
                    book={this.state.currentBook}
                    visible={visible}
                    saveBook={this.saveBook}
                    cancelBook={this.cancelBook}
                    removeBook={this.removeBook}
                    reload={this.loadCases}
                />
            </div>
        )
    }

    openShelfView(caseId, shelfId) {
        this.setState({
            clickedShelf: {caseId: caseId, shelfId: shelfId},
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
            clickedShelf: {caseId: -1, shelfId: -1},
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
        this.props.saveBook(b, reload)
        this.setState({
            currentBook: null
        })
    }

    cancelBook() {
        this.setState({
            currentBook: null
        })
    }

    removeBook(bookid, reload) {
        this.props.removeBook(bookid, reload)
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

    canvasKeyPress(event) {
        // if (!this.state.showAllShelves && event.key === 'Escape') {
        if (!this.state.showAllShelves) {
            this.closeShelfView()
        }
    }

    getClick(event, ref, idx) {
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
    }

    doBoxesIntersect(a, b) {
        return !(a.x > b.x + b.width || a.x + a.width < b.x || a.y > b.y + b.height || a.y + a.height < b.y)
    }

    loadCases() {
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

    drawShelf(caseid, shelfid, books) {
        let thisClass = this
        const canvas = thisClass.state.shelfRefs[caseid][shelfid].ref.current
        const ctx = canvas.getContext('2d')
        let width = window.innerWidth;
        let height = window.innerHeight - 80;
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
}

export default Shelves

import React from 'react'

import Filters from './Filters'
import GridView from './GridView'
import BookView from './BookView'

class Grid extends React.Component {
	constructor() {
		super()
		this.state = {
			filters: {
				fromage:'',
				fromar:'',
				fromdewey:'',
				fromdra:'',
				fromfountaspinnell:'',
				fromgrade:'',
				fromguidedreading:'',
				frominterestlevel:'',
				fromlearningaz:'',
				fromlexile:'',
				frompmreaders:'',
				fromreadingrecovery:'',
				isanthology:'both',
				isbn:'',
				isloaned:'no',
				isowned:'yes',
				userread:'both',
				isreading:'both',
				isreference:'both',
				isshipping:'no',
				libraryids:43,
				numbertoget:50,
				page:1,
				sortmethod:'dewey',
				text:'',
				searchusingtitle: true,
				searchusingsubtitle: false,
				searchusingseries: false,
				searchusingauthor: false,
				toage:'',
				toar:'',
				todewey:'',
				todra:'',
				tofountaspinnell:'',
				tograde:'',
				toguidedreading:'',
				tointerestlevel:'',
				tolearningaz:'',
				tolexile:'',
				topmreaders:'',
				toreadingrecovery:''
			},
			books: [],
			numberOfBooks: 0,
			loading: false,
			currentBook: null,
			readOnlyLibrary: true,
			selectedBookIds: new Set()
		}
		this.updateFilters = this.updateFilters.bind(this)
		this.loadBooks = this.loadBooks.bind(this)
		this.openBookEditor = this.openBookEditor.bind(this)
		this.saveBook = this.saveBook.bind(this)
		this.cancelBook = this.cancelBook.bind(this)
		this.removeBook = this.removeBook.bind(this)
		this.duplicateBook = this.duplicateBook.bind(this)
		this.nextPage = this.nextPage.bind(this)
		this.prevPage = this.prevPage.bind(this)
		this.determineReadOnly = this.determineReadOnly.bind(this)
		this.removeBooks = this.removeBooks.bind(this)
		this.toggleSelected = this.toggleSelected.bind(this)
		this.isBookSelected = this.isBookSelected.bind(this)
	}

    duplicateBook() {
    	let currentBook = this.state.currentBook;
    	currentBook.bookid = "";
    	currentBook.imageurl = "";
        this.setState({
            currentBook: currentBook
        })
    }

    toggleSelected(bookid) {
		let newSelectedBookIds = this.state.selectedBookIds;
		if (newSelectedBookIds.has(bookid)) {
			newSelectedBookIds.delete(bookid);
		} else {
			newSelectedBookIds.add(bookid);
		}
		this.setState({
			selectedBookIds: newSelectedBookIds
		});
	}

	isBookSelected(bookid) {
		return this.state.selectedBookIds.has(bookid)
	}

	componentDidMount() {
		this.setState({
			loading: true
		})
		this.loadBooks()
		this.determineReadOnly()
		this.setState({
			loading: false
		})
	}

	render() {
		let visible = this.state.currentBook === null ? 'hidden' : 'visible'
		return (
			<div className='grid-view'>
				{this.state.loading && <div>LOADING</div>}
				<Filters
					readOnlyLibrary={this.state.readOnlyLibrary}
					filters={this.state.filters}
					updateFilters={this.updateFilters}
					numBooks={this.state.numberOfBooks}
					nextPage={this.nextPage}
					prevPage={this.prevPage}
					openBookEditor={this.openBookEditor}
					selectedBookIds={this.state.selectedBookIds}
					removeBooks={this.removeBooks}
					reload={this.loadBooks}
				/>
				<GridView
					books={this.state.books}
					openBookEditor={this.openBookEditor}
					reload={this.loadBooks}
					newPastelColor={this.props.newPastelColor}
					toggleSelected={this.toggleSelected}
					isBookSelected={this.isBookSelected}
				/>
				<BookView
					readOnlyLibrary={this.state.readOnlyLibrary}
					book={this.state.currentBook}
					visible={visible}
					saveBook={this.saveBook}
					cancelBook={this.cancelBook}
					removeBook={this.removeBook}
					duplicateBook={this.duplicateBook}
					reload={this.loadBooks}
				/>
			</div>
		)
	}

	nextPage(setPage) {
		this.setState(prevState => ({
			filters: {
				...prevState.filters,
				page: prevState.filters.page + 1
			}
		}), () => {
			this.loadBooks()
		})
	}

	prevPage(setPage) {
		this.setState(prevState => ({
			filters: {
				...prevState.filters,
				page: prevState.filters.page - 1
			}
		}), () => {
			this.loadBooks()
		})
	}

	openBookEditor(bookid=null) {
		if (bookid) {
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
		} else {
			this.setState({
				currentBook: this.props.getBlankBook()
			})
		}
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

	removeBooks(bookids, reload) {
		this.props.removeBooks(bookids, reload)
	}

	updateFilters(filters, setSubmitting) {
		this.setState({
			filters: filters
		})
		this.loadBooks()
		this.determineReadOnly()
		setSubmitting(false)
	}

	loadBooks() {
		fetch("/books?" + $.param(this.state.filters))
			.then(res => res.json())
			.then((data) => {
				this.setState({
					books: data.books,
					numberOfBooks: data.numbooks,
					selectedBookIds: new Set()
				})
			})
			.catch(console.log)
	}

	determineReadOnly() {
		fetch("/libraries/" + this.state.filters.libraryids)
			.then(res => res.json())
			.then((data) => {
				this.setState({
					readOnlyLibrary: (data.permissions & 2) !== 2
				})
			})
			.catch(console.log)
	}
}

export default Grid

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
				isread:'both',
				isreading:'no',
				isreference:'both',
				isshipping:'no',
				libraryids:43,
				numbertoget:50,
				page:1,
				sortmethod:'dewey',
				text:'',
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
			currentBook: null
		}
		this.updateFilters = this.updateFilters.bind(this)
		this.loadBooks = this.loadBooks.bind(this)
		this.openBookEditor = this.openBookEditor.bind(this)
		this.saveBook = this.saveBook.bind(this)
		this.cancelBook = this.cancelBook.bind(this)
		this.removeBook = this.removeBook.bind(this)
		this.nextPage = this.nextPage.bind(this)
		this.prevPage = this.prevPage.bind(this)
	}

	componentDidMount() {
		this.setState({
			loading: true
		})
		this.loadBooks()
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
					filters={this.state.filters}
					updateFilters={this.updateFilters}
					numBooks={this.state.numberOfBooks}
					nextPage={this.nextPage}
					prevPage={this.prevPage}
				/>
				<GridView
					books={this.state.books}
					openBookEditor={this.openBookEditor}
					newPastelColor={this.props.newPastelColor}
				/>
				<BookView
					book={this.state.currentBook}
					visible={visible}
					saveBook={this.saveBook}
					cancelBook={this.cancelBook}
					removeBook={this.removeBook}
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

	updateFilters(filters, setSubmitting) {
		this.setState({
			filters: filters
		})
		this.loadBooks()
		setSubmitting(false)
	}

	loadBooks() {
		fetch("/books?" + $.param(this.state.filters))
			.then(res => res.json())
			.then((data) => {
				this.setState({
					books: data.books,
					numberOfBooks: data.numbooks
				})
			})
			.catch(console.log)
	}
}

export default Grid
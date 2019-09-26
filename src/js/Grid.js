import React from 'react'

import Filters from './Filters'
import GridView from './GridView'
import BookView from './BookView'

import books from '../SampleData/books.json'

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
			loading: false,
			currentBook: null
		}
		this.updateFilters = this.updateFilters.bind(this)
		this.loadBooks = this.loadBooks.bind(this)
		this.openBookEditor = this.openBookEditor.bind(this)
		this.saveBook = this.saveBook.bind(this)
		this.cancelBook = this.cancelBook.bind(this)
		this.removeBook = this.removeBook.bind(this)
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
				/>
				<GridView
					books={this.state.books}
					openBookEditor={this.openBookEditor}
				/>
				<BookView
					book={this.state.currentBook}
					visible={visible}
					saveBook={this.saveBook}
					cancelBook={this.cancelBook}
					removeBook={this.removeBook}
				/>
			</div>
		)
	}

	openBookEditor(bookid) {
		this.setState({
			currentBook: books.books.filter(book => {
				return book.bookid === bookid
			})[0]
		})
	}

	saveBook(book) {
		console.log("TODO: SAVE BOOK")
		this.setState({
			currentBook: null
		})
	}

	cancelBook() {
		this.setState({
			currentBook: null
		})
	}

	removeBook(bookid) {
		console.log("TODO: REMOVE BOOK")
		this.setState({
			currentBook: null
		})
	}

	updateFilters(filters, setSubmitting) {
		this.setState({
			filters: filters
		})
		console.log(this.state.filters);
		this.loadBooks()
		setSubmitting(false)
	}

	loadBooks() {
		// fetch("http://library.jakekausler.com/books?" + $.param(this.state.filters))
		// 	.then(res => res.json())
		// 	.then((data) => {
		// 		this.setState({
		// 			books: data.books
		// 		})
		// 	})
		// 	.catch(console.log)
		this.setState({
			books: books.books.slice(this.state.filters.numbertoget*(this.state.filters.page-1), this.state.filters.numbertoget*this.state.filters.page).map(book => {
				return {
					imageurl: book.imageurl,
					id: book.bookid
				}
			})
		})
		console.log(books)
	}
}

export default Grid
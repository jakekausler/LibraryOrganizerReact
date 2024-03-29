import React from 'react'

import './../css/styles.css'
import "./../../node_modules/react-vis/dist/style.css"
import "react-confirm-alert/src/react-confirm-alert.css"

import { confirmAlert } from 'react-confirm-alert';

import Header from './Header'
import Grid from './Grid'
import Priority from './Priority'
import Shelves from './BookCases'
import Stats from './Stats'
import LoginPage from './LoginPage'

import BlankBook from './blankbook.json'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			currentPage: 'grid',
			pages: ['grid', 'priority', 'shelves', 'stats'],
			loggedIn: false,
			casesHash: ''
		}
		this.changePage = this.changePage.bind(this)
        this.saveBook = this.saveBook.bind(this)
        this.removeBook = this.removeBook.bind(this)
        this.addBook = this.addBook.bind(this)
        this.refreshCases = this.refreshCases.bind(this)
        this.getCasesHash = this.getCasesHash.bind(this)
        this.getBlankBook = this.getBlankBook.bind(this)
        this.newPastelColor = this.newPastelColor.bind(this)
        this.HSLtoRGB = this.HSLtoRGB.bind(this)
        this.logout = this.logout.bind(this)
	}

	logout() {
		fetch("/users/logout", {
			method: 'GET'
		}).then((res) => 
			this.setState({
				loggedIn: false
			})
		).catch(console.log)
	}

	componentDidMount() {
		this.setState({
			loggedIn: !window.location.pathname.includes('unregistered'),
			casesHash: (new Date()).getTime()
		})
	}

	getBlankBook() {
		return BlankBook
	}

	addBook(book, reload) {
		if (book.authors) {
			book.authors = book.authors.trim()
			book.contributors = book.authors.split("\n")
			if (book.contributors.length == 1 && book.contributors[0] === "") {
				book.contributors = []
			} else {
				book.contributors = book.contributors.map((contrib) => {
					return {
						name: {
							first: contrib.substring(0, contrib.indexOf(' ')),
							middles: contrib.substring(contrib.indexOf(' ') + 1, contrib.indexOf(' ', contrib.indexOf(' ') + 1)),
							last: contrib.substring(contrib.indexOf(' ', contrib.indexOf(' ') + 1) + 1, contrib.indexOf(":"))
						},
						role: contrib.substring(contrib.indexOf(":")+1)
					}
				})
			}
		} else {
			book.contributors = []
		}
		book.originallypublished += "-01-01"
		book.editionpublished += "-01-01"
		fetch("/books", {
			method: 'POST',
			body: JSON.stringify(book)
		}).then((res) => this.refreshCases(book.library.id, reload))
		.catch(console.log)
	}

	saveBook(book, reload) {
		book.authors = book.authors.trim()
		book.contributors = book.authors.split("\n")
		if (book.contributors.length == 1 && book.contributors[0] === "") {
			book.contributors = []
		} else {
			book.contributors = book.contributors.map((contrib) => {
				return {
					name: {
						first: contrib.substring(0, contrib.indexOf(' ')),
						middles: contrib.substring(contrib.indexOf(' ') + 1, contrib.indexOf(' ', contrib.indexOf(' ') + 1)),
						last: contrib.substring(contrib.indexOf(' ', contrib.indexOf(' ') + 1) + 1, contrib.indexOf(":"))
					},
					role: contrib.substring(contrib.indexOf(":")+1)
				}
			})
		}
		book.originallypublished += "-01-01"
		book.editionpublished += "-01-01"
		fetch("/books", {
			method: 'PUT',
			body: JSON.stringify(book)
		}).then((res) => this.refreshCases(book.library.id, reload))
		.catch(console.log)
	}

	removeBook(book, reload) {
		fetch("/books/" + book.bookid, {
			method: 'DELETE'
		}).then((res) => this.refreshCases(book.library.id, reload))
		.catch(console.log)
	}

	removeBooks(bookids, reload) {
		confirmAlert({
			title: 'Warning',
			message: 'Are you sure you want to remove ' + bookids.length + ' book' + (bookids.length == 1 ? '' : 's'),
			buttons: [{
				label: 'Yes',
				onClick: () => {
					fetch('/books', {
						method: 'DELETE',
						body: JSON.stringify(bookids)
					}).then(() => reload());
				}
			}, {
				label: 'No'
			}]
		});
	}

	refreshCases(libraryid, reload) {
		this.setState({
			casesHash: this.state.casesHash + 1
		})
		fetch("/libraries/" + libraryid + "/cases", {
			method: 'POST'
		}).then((res) => reload())
		.catch(console.log)
	}

	getCasesHash() {
		return this.state.casesHash
	}

	render() {
		let mainContent
		if (this.state.loggedIn) {
	 		switch (this.state.currentPage) {
			case this.state.pages[0]:
				mainContent = <Grid
					saveBook={this.saveBook}
					removeBook={this.removeBook}
					removeBooks={this.removeBooks}
					addBook={this.addBook}
					getBlankBook={this.getBlankBook}
					newPastelColor={this.newPastelColor}
				/>
				break;
			case this.state.pages[1]:
				mainContent = <Priority
					newPastelColor={this.newPastelColor}
				/>
				break;
			case this.state.pages[2]:
				mainContent = <Shelves
					saveBook={this.saveBook}
					removeBook={this.removeBook}
					addBook={this.addBook}
					getBlankBook={this.getBlankBook}
					getCasesHash={this.getCasesHash}
				/>
				break;
			case this.state.pages[3]:
				mainContent = <Stats />
				break;
			}
		} else {
			mainContent = <LoginPage Login={this.login} />
		}
		return (
			<div>
				{this.state.loggedIn ? <Header
					currentPage={this.state.currentPage}
					pages={this.state.pages}
					changePage={this.changePage}
					logout={this.logout}
				/> : ""}
				{mainContent}
			</div>
		)
	}

	changePage(event) {
		this.setState({
			currentPage: event.target.name
		})
	}

	HSLtoRGB(h, s, l) {
	  let r, g, b;
	  
	  const rd = (a) => {
	    return Math.floor(Math.max(Math.min(a*256, 255), 0)); 
	  };
	  
	  const hueToRGB = (m, n, o) => {
	    if (o < 0) o += 1;
	    if (o > 1) o -= 1;
	    if (o < 1/6) return m + (n - m) * 6 * o;
	    if (o < 1/2) return n;
	    if (o < 2/3) return m + (n - m) * (2/3 - o) * 6;
	    return m;
	  }
	  
	  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	  const p = 2 * l - q;
	  
	  r = hueToRGB(p, q, h + 1/3);
	  g = hueToRGB(p, q, h);
	  b = hueToRGB(p, q, h - 1/3);

	  return [rd(r), rd(g), rd(b)]
	}

	newPastelColor() {
	  const hBase = Math.random();
	  const newH = Math.floor(hBase * 360);
	  const newL = Math.floor(Math.random() * 16) + 75;
	  
	  const [ r, g, b ] = this.HSLtoRGB(hBase, 1, newL*.01);
	  
	  return "rgb(" + r + ", " + g + ", " + b + ")";
	}
}

export default App

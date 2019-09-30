import React from 'react'

import './../css/styles.css'
import "./../../node_modules/react-vis/dist/style.css"

import Header from './Header'
import Grid from './Grid'
import Shelves from './Shelves'
import Stats from './Stats'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			currentPage: 'grid',
			pages: ['grid', 'shelves', 'stats']
		}
		this.changePage = this.changePage.bind(this)
        this.saveBook = this.saveBook.bind(this)
        this.removeBook = this.removeBook.bind(this)
        this.addBook = this.addBook.bind(this)
        this.getBlankBook = this.getBlankBook.bind(this)
        this.newPastelColor = this.newPastelColor.bind(this)
        this.HSLtoRGB = this.HSLtoRGB.bind(this)
	}

	getBlankBook(book) {
		//TODO: Fill in and implement
	}

	addBook(book) {
		//TODO: Implement
		book.authors = book.authors.trim()
		book.contributors = book.authors.split("\n")
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
		book.originallypublished += "-01-01"
		book.editionpublished += "-01-01"
		fetch("/books", {
			method: 'POST',
			body: JSON.stringify(book)
		}).then((res) => console.log(res))
		.catch(console.log)
		// TODO: Refresh grid and shelf views
		// TODO: Save image and create thumbnail on save/add
	}

	saveBook(book, reload) {
		book.authors = book.authors.trim()
		book.contributors = book.authors.split("\n")
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
		book.originallypublished += "-01-01"
		book.editionpublished += "-01-01"
		fetch("/books", {
			method: 'PUT',
			body: JSON.stringify(book)
		}).then((res) => reload())
		.catch(console.log)
		// TODO: Refresh grid and shelf views
		// TODO: Save image and create thumbnail on save/add
	}

	removeBook(bookid, reload) {
		fetch("/books/" + bookid, {
			method: 'DELETE'
		}).then((res) => reload())
		.catch(console.log)
		// TODO: Refresh grid and shelf views
	}

	render() {
		let mainContent
		switch (this.state.currentPage) {
		case this.state.pages[0]:
			mainContent = <Grid
				saveBook={this.saveBook}
				removeBook={this.removeBook}
				addBook={this.addBook}
				getBlankBook={this.getBlankBook}
				newPastelColor={this.newPastelColor}
			/>
			break;
		case this.state.pages[1]:
			mainContent = <Shelves
				saveBook={this.saveBook}
				removeBook={this.removeBook}
				addBook={this.addBook}
				getBlankBook={this.getBlankBook}
			/>
			break;
		case this.state.pages[2]:
			mainContent = <Stats />
			break;
		}
		return (
			<div>
				<Header
					currentPage={this.state.currentPage}
					pages={this.state.pages}
					changePage={this.changePage}
				/>
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
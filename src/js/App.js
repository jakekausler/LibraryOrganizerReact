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
        this.newPastelColor = this.newPastelColor.bind(this)
        this.HSLtoRGB = this.HSLtoRGB.bind(this)
	}

	saveBook(book) {
		console.log("TODO: SAVE BOOK")
	}

	removeBook(book) {
		console.log("TODO: REMOVE BOOK")
	}

	render() {
		let mainContent
		switch (this.state.currentPage) {
		case this.state.pages[0]:
			mainContent = <Grid
				saveBook={this.saveBook}
				removeBook={this.removeBook}
				newPastelColor={this.newPastelColor}
			/>
			break;
		case this.state.pages[1]:
			mainContent = <Shelves
				saveBook={this.saveBook}
				removeBook={this.removeBook}
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
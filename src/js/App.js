import React from 'react'

import './../css/styles.css'

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
	}

	componentDidMount() {
		// this.setState({

		// })
	}

	render() {
		let mainContent
		switch (this.state.currentPage) {
		case this.state.pages[0]:
			mainContent = <Grid />
			break;
		case this.state.pages[1]:
			mainContent = <Shelves />
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
}

export default App
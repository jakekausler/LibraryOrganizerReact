import React from 'react'

import PriorityList from './PriorityList'

class Priority extends React.Component {

	constructor() {
		super()
		this.state = {
			books: [],
			loading: false,
			readOnlyLibrary: true,
		}
		this.loadPriorityBooks = this.loadPriorityBooks.bind(this)
		this.determineReadOnly = this.determineReadOnly.bind(this)
	}

	componentDidMount() {
		this.setState({
			loading: true
		})
		this.loadPriorityBooks()
		this.determineReadOnly()
		this.setState({
			loading: false
		})
	}

	render() {
		return (
			<div className='priority'>
				<PriorityList
					books={this.state.books}
					newPastelColor={this.props.newPastelColor}
				/>
			</div>
		)
	}

	loadPriorityBooks() {
		fetch("/books/priority")
			.then(res => res.json())
			.then((data) => {
				this.setState({
					books: data
				})
			})
			.catch(console.log)
	}

	determineReadOnly() {
		fetch("/libraries/43")
			.then(res => res.json())
			.then((data) => {
				this.setState({
					readOnlyLibrary: (data.permissions & 2) !== 2
				})
			})
			.catch(console.log)
	}

}

export default Priority

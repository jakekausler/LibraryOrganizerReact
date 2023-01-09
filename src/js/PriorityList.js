import React from 'react'

import PriorityObject from './PriorityObject'

class PriorityList extends React.Component {
	constructor() {
		super()
	}

	render() {
		let priorityObjects = this.props.books.map((book) => {
			return (
				<PriorityObject
					bookid={book.bookid}
					title={book.title}
					imageurl={book.imageurl}
					priority={book.priority}
					key={book.bookid}
					openBookEditor={this.props.openBookEditor}
					newPastelColor={this.props.newPastelColor}
				/> )
		})
		return (
			<div className='priorityList'>
				{priorityObjects}
			</div>
		)
	}
}

export default PriorityList
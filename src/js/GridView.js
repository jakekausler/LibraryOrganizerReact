import React from 'react'

import GridObject from './GridObject'

class GridView extends React.Component {
	constructor() {
		super()
	}

	render() {
		let gridObjects = this.props.books.map((book) => {
			return (
				<GridObject
					bookid={book.bookid}
					title={book.title}
					key={book.bookid}
					openBookEditor={this.props.openBookEditor}
					newPastelColor={this.props.newPastelColor}
					isSelected={this.props.isBookSelected(book.bookid)}
					toggleSelected={this.props.toggleSelected}
				/>
			)
		})
		return (
			<div className='grid'>
				{gridObjects}
			</div>
		)
	}
}

export default GridView
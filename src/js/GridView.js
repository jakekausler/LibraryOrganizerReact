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
					imageurl={'/web/' + book.imageurl}
					bookid={book.bookid}
					key={book.bookid}
					openBookEditor={this.props.openBookEditor}
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
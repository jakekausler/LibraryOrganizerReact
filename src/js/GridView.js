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
					imageurl={'https://about.canva.com/wp-content/uploads/sites/3/2015/01/art_bookcover.png'/*book.imageurl*/}
					id={book.id}
					key={book.id}
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
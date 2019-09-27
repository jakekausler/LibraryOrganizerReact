import React from 'react'

class GridObject extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<div className="gridObject">
				<img
					onError={(event) => event.target.src='https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png'}
					src={this.props.imageurl}
					onClick={() => this.props.openBookEditor(this.props.bookid)}
				/>
			</div>
		)
	}
}

export default GridObject
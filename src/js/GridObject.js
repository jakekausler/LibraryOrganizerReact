import React from 'react'

class GridObject extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<div className="gridObject">
				<img src={this.props.imageurl} onClick={() => this.props.openBookEditor(this.props.id)} />
			</div>
		)
	}
}

export default GridObject
import React from 'react'

class GridObject extends React.Component {
	constructor() {
		super()
		this.divRef = React.createRef()
		this.imageRef = React.createRef()
		this.setBookImage = this.setBookImage.bind(this)
	}

	setBookImage() {
		this.imageRef.current.className = "hidden"
		this.divRef.current.className = "visible"
	}

	render() {
		return (
			<div className="gridObject">
				<img
					className="visible"
					ref={this.imageRef}
					onError={(event) => this.setBookImage()}
					src={"bookimages/" + this.props.bookid + "?size=small"}
					onClick={() => this.props.openBookEditor(this.props.bookid)}
				/>
				<div className="hidden" ref={this.divRef} >
					<div
						className="bookImage"
						style={{"background": this.props.newPastelColor()}}
						onClick={() => this.props.openBookEditor(this.props.bookid)}
					>
						{this.props.title}
					</div>
				</div>
			</div>
		)
	}
}

export default GridObject
import React from 'react'

class GridObject extends React.Component {
	constructor() {
		super()
		this.divRef = React.createRef()
		this.imageRef = React.createRef()
		this.setBookImage = this.setBookImage.bind(this)
		this.onClick = this.onClick.bind(this)
	}

	setBookImage() {
		this.imageRef.current.className = "hidden"
		this.divRef.current.className = "visible"
	}

	onClick() {
		if (window.event.ctrlKey) {
			this.props.toggleSelected(this.props.bookid);
		} else {
			this.props.openBookEditor(this.props.bookid);
		}
	}

	render() {
		return (
			<div className={"gridObject " + (this.props.isSelected ? 'selected' : "")}>
				<img
					className="visible"
					ref={this.imageRef}
					onError={(event) => this.setBookImage()}
					src={"bookimages/" + this.props.bookid + "?size=small"}
					onClick={() => this.onClick()}
				/>
				<div className="hidden" ref={this.divRef} >
					<div
						className="bookImage"
						style={{"background": this.props.newPastelColor()}}
						onClick={() => this.onClick()}
					>
						{this.props.title}
					</div>
				</div>
			</div>
		)
	}
}

export default GridObject
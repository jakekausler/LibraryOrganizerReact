import React from 'react'

class PriorityObject extends React.Component {

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
	
	render() {
		return (
			<div className={"priorityObject " + (this.props.isSelected ? 'selected' : "")} onClick={() => this.onClick()}>
				<div className="priorityNumber priorityCell">{this.props.priority}</div>
				<div className="priorityImageContainer priorityCell">
					<img
						className="visible"
						src={"bookimages/" + this.props.bookid + "?size=small"}
						onError={(event) => this.setBookImage()}
						ref={this.imageRef}
					/>
					<div className="hidden" ref={this.divRef} >
						<div
							className="priorityImage"
							style={{"background": this.props.newPastelColor()}}
							onClick={() => this.onClick()}
						>
						</div>
					</div>
				</div>
				<div className="priorityTitle priorityCell">{this.props.title}</div>
			</div>
		)
	}

	onClick() {
		if (window.event.ctrlKey) {
			this.props.toggleSelected(this.props.bookid);
		} else {
			this.props.openBookEditor(this.props.bookid);
		}
	}
}

export default PriorityObject
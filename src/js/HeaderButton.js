import React from 'react'

class HeaderButton extends React.Component {
	constructor() {
		super()
	}

	render() {
		let buttonClass
		if (this.props.selected) {
			buttonClass = ' selected'
		} else {
			buttonClass = ' not-selected'
		}
		return (
			<button className={"header-button" + buttonClass} name={this.props.type} onClick={this.props.changePage}>
				{this.props.type}
			</button>
		)
	}
}

export default HeaderButton
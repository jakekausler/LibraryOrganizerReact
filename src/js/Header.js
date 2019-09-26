import React from 'react'

import HeaderButton from './HeaderButton'

class Header extends React.Component {
	constructor(props) {
		super()
	}

	render() {
		let headerButtons = this.props.pages.map(page => (
			<HeaderButton
				key={page}
				type={page}
				selected={this.props.currentPage === page}
				changePage={this.props.changePage}
			/>
		))
		return (
			<div className="header">
				<span>Library Organizer</span>
				{headerButtons}
			</div>
		)
	}
}

export default Header
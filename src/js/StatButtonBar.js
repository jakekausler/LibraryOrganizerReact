import React from 'react'

class StatButtonBar extends React.Component {
	constructor() {
		super()
	}

	//TODO: Change active on click
	render() {
		return (
			<div className="NavBar">
				<button className="active" onClick={() => this.props.ChangeStat('generalbycounts')}>General</button>
				<div className="dropdown">
					<button className="dropbtn">Deweys</button>
					<div className="dropdown-content">
						<button onClick={() => this.props.ChangeStat('')}>Owned</button>
						<button onClick={() => this.props.ChangeStat('')}>Wishlist</button>
						<button onClick={() => this.props.ChangeStat('')}>All</button>
					</div>
				</div>
				<div className="dropdown">
					<button className="dropbtn">Contributors</button>
					<div className="dropdown-content">
						<button onClick={() => this.props.ChangeStat('')}>Top</button>
						<button onClick={() => this.props.ChangeStat('')}>Roles</button>
					</div>
				</div>
				<div className="dropdown">
					<button className="dropbtn">Publishers</button>
					<div className="dropdown-content">
						<button onClick={() => this.props.ChangeStat('')}>Top Individuals</button>
						<button onClick={() => this.props.ChangeStat('')}>Top Parents</button>
						<button onClick={() => this.props.ChangeStat('')}>Locations</button>
					</div>
				</div>
			</div>
		)
	}
}

export default StatButtonBar
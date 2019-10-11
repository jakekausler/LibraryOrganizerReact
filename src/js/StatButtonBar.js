import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

class StatButtonBar extends React.Component {
	constructor() {
		super()
		this.state = {
			active: ''
		}
        this.changeStat = this.changeStat.bind(this)
	}

	componentDidMount() {
		this.changeStat($('#generalbycounts')[0])
	}

	changeStat(target) {
		console.log(target)
		if (this.state.active) {
			$($("#" + this.state.active)[0]).parent().siblings(".dropdown-content").removeClass("active")
			$($("#" + this.state.active)[0]).removeClass("active")
		}
		this.props.ChangeStat(target.id)
		this.setState({
			active: target.id
		})
		$(target).parent().siblings(".dropdown-content").addClass("active")
		$(target).addClass("active")
	}

	//TODO: Dimensions
	render() {
		return (
			<div className="NavBar">
				<div className="dropdown">
					<button className="dropbtn">General&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} /></button>
					<div className="dropdown-content">
						<a href="#" id='generalbycounts' onClick={(event) => this.changeStat(event.target)}>Count</a>
						<a href="#" id='generalbypages' onClick={(event) => this.changeStat(event.target)}>Pages</a>
						<a href="#" id='generalbysize' onClick={(event) => this.changeStat(event.target)}>Size</a>
					</div>
				</div>
				<div className="dropdown">
					<button className="dropbtn">Deweys&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} /></button>
					<div className="dropdown-content">
						<a href="#" id='deweys' onClick={(event) => this.changeStat(event.target)}>Owned</a>
						<a href="#" id='deweyswishlist' onClick={(event) => this.changeStat(event.target)}>Wishlist</a>
						<a href="#" id='deweystotal' onClick={(event) => this.changeStat(event.target)}>All</a>
					</div>
				</div>
				<div className="dropdown">
					<button className="dropbtn">Contributors&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} /></button>
					<div className="dropdown-content">
						<a href="#" id='contributorstop' onClick={(event) => this.changeStat(event.target)}>Top</a>
						<a href="#" id='contributorsperrole' onClick={(event) => this.changeStat(event.target)}>Roles</a>
					</div>
				</div>
				<div className="dropdown">
					<button className="dropbtn">Publishers&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} /></button>
					<div className="dropdown-content">
						<a href="#" id='publishersbooksperparent' onClick={(event) => this.changeStat(event.target)}>Top Individuals</a>
						<a href="#" id='publisherstopchildren' onClick={(event) => this.changeStat(event.target)}>Top Parents</a>
						<a href="#" id='publisherstoplocations' onClick={(event) => this.changeStat(event.target)}>Locations</a>
					</div>
				</div>
				<a href="#" id='series' onClick={(event) => this.changeStat(event.target)}>Series</a>
				<div className="dropdown">
					<button className="dropbtn">Languages&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} /></button>
					<div className="dropdown-content">
						<a href="#" id='languagesprimary' onClick={(event) => this.changeStat(event.target)}>Primary</a>
						<a href="#" id='languagessecondary' onClick={(event) => this.changeStat(event.target)}>Secondary</a>
						<a href="#" id='languagesoriginal' onClick={(event) => this.changeStat(event.target)}>Original</a>
					</div>
				</div>
				<a href="#" id='formats' onClick={(event) => this.changeStat(event.target)}>Binding</a>
				<div className="dropdown">
					<button className="dropbtn">Dates&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} /></button>
					<div className="dropdown-content">
						<a href="#" id='datesoriginal' onClick={(event) => this.changeStat(event.target)}>Original</a>
						<a href="#" id='datespublication' onClick={(event) => this.changeStat(event.target)}>Publication</a>
					</div>
				</div>
				<a href="#" id='' onClick={this.changeStat}>Dimensions</a>
			</div>
		)
	}
}

export default StatButtonBar
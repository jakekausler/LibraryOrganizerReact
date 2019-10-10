import React from 'react'
import { ResponsiveBar } from 'nivo'

import StatButtonBar from './StatButtonBar'

class Stats extends React.Component {
	constructor() {
		super()
		this.state = {
			data: [],
			current: 'generalbycounts'
		}

        this.changeStat = this.changeStat.bind(this)
	}

	changeStat(newStat) {
		this.setState({
			current: newStat
		})
		fetch("/information/statistics?" + $.param({type: newStat, libraryids: '43'}))
		.then(res => res.json())
		.then((data) => {
			this.setState({
				data: data.data.map(function(d) {
					return {
						value: parseInt(d.val),
						label: d.label
					}
				})
			})
		})
		.catch(console.log)
	}

	componentDidMount() {
		this.changeStat(this.state.current)
	}

	render() {
        let generalbycountsVisible = this.state.current == 'generalbycounts' ? 'visible' : 'hidden'

		return (
			<div className="stats">
				<StatButtonBar ChangeStat={this.ChangeStat} />
				<div className={"barChart " + generalbycountsVisible} style={{width: "100%", height: "750px"}}>
					<ResponsiveBar 
		               data={this.state.data}
		               indexBy="label"
		               colorBy="value"
		               padding={0.3}
		               margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
		            />
	            </div>
            </div>
		)
	}
}

export default Stats
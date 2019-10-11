import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'

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
			console.log(data, newStat)
			this.setState({
				data: data.data.map(function(d, idx) {
					return {
						id: idx + "",
						value: parseInt(d.val),
						label: d.label
					}
				})
			})
		})
		.catch(console.log)
	}

	// TODO: Tooltips with Amount and Percentage
	// TODO: Publisher City Map
	// TODO: Publisher Country Map
	//TODO: Series-Dates
	//TODO: Dimensions
	render() {
        let barChartVisible = (
        	this.state.current == 'generalbycounts' ||
        	this.state.current == 'generalbypages' ||
        	this.state.current == 'generalbysize'
        ) ? 'visible' : 'hidden'
        let pieChartVisible = (
        	this.state.current == 'deweys' ||
        	this.state.current == 'deweyswishlist' ||
        	this.state.current == 'deweystotal' ||
        	this.state.current == 'contributorstop' ||
        	this.state.current == 'contributorsperrole' ||
        	this.state.current == 'publishersbooksperparent' ||
        	this.state.current == 'publisherstopchildren'
        ) ? 'visible' : 'hidden'

		return (
			<div className="stats">
				<StatButtonBar ChangeStat={this.changeStat} />
				<div className={"barChart " + barChartVisible} style={{width: "100%", height: "750px"}}>
					<ResponsiveBar 
		               data={this.state.data}
		               indexBy="label"
		               colorBy="value"
		               padding={0.3}
		               margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
		               colors={{"scheme": "set3"}}
		               labelFormat={(d) => <tspan y={ -12 }>{ d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</tspan>}
		            />
	            </div>
				<div className={"pieChart " + pieChartVisible} style={{width: "100%", height: "750px"}}>
					<ResponsivePie 
		               data={this.state.data}
		               colorBy="value"
		               radialLabel="label"
		               padding={0.3}
		               margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
		               colors={{"scheme": "pastel1"}}
		            />
	            </div>
            </div>
		)
	}
}

export default Stats
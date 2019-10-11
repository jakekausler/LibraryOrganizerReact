import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveGeoMap } from '@nivo/geo'


import StatButtonBar from './StatButtonBar'

class Stats extends React.Component {
	constructor() {
		super()
		this.state = {
			data: [],
			total: 0,
			current: 'generalbycounts'
		}

        this.changeStat = this.changeStat.bind(this)
	}

	changeStat(newStat) {
		console.log("CHANGING TO: " + newStat)
		if (newStat == 'dimensions') {
			fetch("/information/dimensions?" + $.param({libraryids: '43'}))
			.then(res => res.json())
			.then((data) => {
				console.log(data)
				this.setState({
					current: newStat,
					data: data,
					total: 0
				})
			})
			.catch(console.log)
		} else {
			fetch("/information/statistics?" + $.param({type: newStat, libraryids: '43'}))
			.then(res => res.json())
			.then((data) => {
				this.setState({
					current: newStat,
					data: data.data.map(function(d, idx) {
						return {
							id: idx + "",
							value: parseInt(d.val),
							label: d.label
						}
					}),
					total: data.total
				})
			})
			.catch(console.log)
		}
	}

	// TODO: Tooltips with Amount and Percentage
	// TODO: Publisher City Map
	// TODO: Publisher Country Map
	//TODO: Dive into deweys and dates (centuries/decades/years. Is there a timeline?)
	render() {
		console.log("RENDERING: " + this.state.current)
        let barChartVisible = (
        	this.state.current == 'generalbycounts' ||
        	this.state.current == 'generalbypages' ||
        	this.state.current == 'generalbysize' ||
        	this.state.current == 'contributorstop' ||
        	this.state.current == 'publishersbooksperparent' ||
        	this.state.current == 'publisherstopchildren' ||
        	this.state.current == 'publisherstoplocations' ||
        	this.state.current == 'series' ||
        	this.state.current == 'datesoriginal' ||
        	this.state.current == 'datespublication'
        )
        let pieChartVisible = (
        	this.state.current == 'deweys' ||
        	this.state.current == 'deweyswishlist' ||
        	this.state.current == 'deweystotal' ||
        	this.state.current == 'contributorsperrole' ||
        	this.state.current == 'languagesprimary' ||
        	this.state.current == 'languagessecondary' ||
        	this.state.current == 'languagesoriginal' ||
        	this.state.current == 'formats'
        )
		let mapChartVisible = false
		let dimensionChartVisible = (
			this.state.current == 'dimensions'
		)
		console.log("barChartVisible: " + barChartVisible)
		console.log("dimensionChartVisible: " + dimensionChartVisible)
		return (
			<div className="stats">
				<StatButtonBar ChangeStat={this.changeStat} />
				{this.state.total ? <div className="totalLabel">Total: {this.state.total}</div> : ""}
				{barChartVisible && <div className="barChart" style={{width: "100%", height: "750px"}}>
					<ResponsiveBar 
		               data={this.state.data}
		               indexBy="label"
		               colorBy="value"
		               padding={0.3}
		               margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
		               colors={{"scheme": "set3"}}
		               labelFormat={(d) => <tspan y={ -12 }>{ d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</tspan>}
		            />
	            </div>}
				{pieChartVisible && <div className="pieChart" style={{width: "100%", height: "750px"}}>
					<ResponsivePie 
		               data={this.state.data}
		               colorBy="value"
		               radialLabel="label"
		               padding={0.3}
		               margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
		               colors={{"scheme": "pastel1"}}
		            />
	            </div>}
				{mapChartVisible && <div className="mapChart" style={{width: "100%", height: "750px"}}>
		            <ResponsiveGeoMap
				        features={[]}
				        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
				        projectionTranslation={[ 0.5, 0.5 ]}
				        projectionRotation={[ 0, 0, 0 ]}
				        fillColor="#eeeeee"
				        borderWidth={0.5}
				        borderColor="#333333"
				        enableGraticule={false}
				        graticuleLineColor="#666666"
				    />
				</div>}
				{dimensionChartVisible && <div className="dimensionChart" style={{width: "100%", height: "750px"}}>
					<table>
					<tbody>
					<tr>
						<th></th>
						<th>Minimum</th>
						<th>Average</th>
						<th>Maximum</th>
						<th>Total</th>
					</tr>
					<tr>
						<th>Width</th>
						<td>{this.state.data.minimumwidth} mm</td>
						<td>{this.state.data.averagewidth ? (this.state.data.averagewidth).toFixed(2) : ""} mm</td>
						<td>{this.state.data.maximumwidth} mm</td>
						<td>{this.state.data.totalwidth ? (this.state.data.totalwidth/1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""} m</td>
					</tr>
					<tr>
						<th>Height</th>
						<td>{this.state.data.minimumheight} mm</td>
						<td>{this.state.data.averageheight ? (this.state.data.averageheight).toFixed(2) : ""} mm</td>
						<td>{this.state.data.maximumheight} mm</td>
						<td>{this.state.data.totalheight ? (this.state.data.totalheight/1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""} m</td>
					</tr>
					<tr>
						<th>Depth</th>
						<td>{this.state.data.minimumdepth} mm</td>
						<td>{this.state.data.averagedepth ? (this.state.data.averagedepth).toFixed(2) : ""} mm</td>
						<td>{this.state.data.maximumdepth} mm</td>
						<td>{this.state.data.totaldepth ? (this.state.data.totaldepth/1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""} m</td>
					</tr>
					<tr>
						<th>Weight</th>
						<td>{this.state.data.minimumweight} oz</td>
						<td>{this.state.data.averageweight ? (this.state.data.averageweight).toFixed(2) : ""} oz</td>
						<td>{this.state.data.maximumweight} oz</td>
						<td>{this.state.data.totalweight ? (this.state.data.totalweight/16).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""} lbs</td>
					</tr>
					<tr>
						<th>Pages</th>
						<td>{this.state.data.minimumpages}</td>
						<td>{this.state.data.averagepages ? (this.state.data.averagepages).toFixed(2) : ""}</td>
						<td>{this.state.data.maximumpages}</td>
						<td>{this.state.data.totalpages ? (this.state.data.totalpages).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</td>
					</tr>
					</tbody>
					</table>
				</div>}
            </div>
		)
	}
}

export default Stats
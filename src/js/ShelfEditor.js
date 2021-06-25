import React from 'react'

import Tree from '@naisutech/react-tree'
import {Formik, Form, Field} from 'formik'

class ShelfEditor extends React.Component {
	constructor() {
		super()
        this.state = {
            cases: [],
            currentCase: null,
            currentShelf: null
        }
        this.loadCases = this.loadCases.bind(this)
        this.onNodeSelect = this.onNodeSelect.bind(this)
	}

	componentWillReceiveProps() {
        this.loadCases()
    }

    onNodeSelect(item) {
    	console.log(this.state.cases)
    	if (item.parentId) {
    		this.setState({
    			currentCase: item.parentId,
    			currentShelf: item.id
    		})
    	} else {
    		this.setState({
    			currentCase: item.id,
    			currentShelf: null
    		})
    	}
    }

	loadCases() {
		fetch("/libraries/" + this.props.libraryid + "/cases")
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    cases: data
                })
            })
            .catch(console.log)
	}

	render() {
		if (this.props.visible==="hidden") {
			return(<div className={"shelfEditor " + this.props.visible}></div>)
		}

		let editorContents = ""
		if (this.state.currentShelf) {
			editorContents = (
				<div className="editorContents">
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Alignment
						</label>
						<input
							className="form-field-long"
							type="text"
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).shelves.find(s => s.id == this.state.currentShelf).alignment}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).shelves.find(s => s.id == this.state.currentShelf).alignment = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Height
						</label>
						<input
							className="form-field-long"
							type="number"
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).shelves.find(s => s.id == this.state.currentShelf).height}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).shelves.find(s => s.id == this.state.currentShelf).height = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Width
						</label>
						<input
							className="form-field-long"
							type="number"
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).shelves.find(s => s.id == this.state.currentShelf).width}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).shelves.find(s => s.id == this.state.currentShelf).width = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
				</div>
			)
		} else if (this.state.currentCase) {
			editorContents = (
				<div className="editorContents">
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Average Book Height
						</label>
						<input
							className="form-field-long"
							type="text"
							readOnly
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).averagebookheight}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).averagebookheight = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Average Book Width
						</label>
						<input
							className="form-field-long"
							type="text"
							readOnly
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).averagebookwidth}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).averagebookwidth = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Book Margin
						</label>
						<input
							className="form-field-long"
							type="number"
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).bookmargin}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).bookmargin = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Padding Left
						</label>
						<input
							className="form-field-long"
							type="number"
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).paddingleft}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).paddingleft = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Padding Right
						</label>
						<input
							className="form-field-long"
							type="number"
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).paddingright}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).paddingright = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
					<div className="cases-search-form-field-container">
						<label className="form-field-label">
							Spacer Height
						</label>
						<input
							className="form-field-long"
							type="number"
							value={this.state.cases.find(c => {return c.id == this.state.currentCase}).spacerheight}
							onChange={(evt) => {
								let cases = this.state.cases
								cases.find(c => {return c.id == this.state.currentCase}).spacerheight = evt.target.value
								this.setState({
									cases: cases
								})
							}}
						>
						</input>
					</div>
				</div>
			)
		}

		return (
			<div className="shelfEditor">
				<div className="shelfEditorMain">
					<div className="caseTreeContainer">
						<Tree
							nodes={this.state.cases.map(c => {
								return {
									id: c.id,
									parentId: null,
									label: "Case " + c.casenumber,
									items: c.shelves.map(s => {
										return {
											id: s.id,
											parentId: c.id,
											label: "Shelf " + s.shelfnumber,
											items: null
										}
									})
								}
							})}
							onSelect={this.onNodeSelect}
						/>
					</div>
					<div className="caseEditorContainer">
						{editorContents}
					</div>
				</div>
				<div className="shelfEditorButtons">
					<div className="cases-edit-button-container">
						<button
							type="button"
							className="form-button cases-edit-button"
							disabled={this.props.readOnlyLibrary}
							onClick={() => this.props.saveShelfEditor(this.state.cases)}
						> 
							Save
						</button>
					</div>
					<div className="cases-edit-button-container">
						<button
							type="button"
							className="form-button cases-edit-button"
							onClick={() => this.props.closeShelfEditor()}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default ShelfEditor

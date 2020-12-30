import React from 'react'
import {Formik, Form, Field} from 'formik'

class BookcasesBar extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<div className="bookcases-bar-container">
				<div className="bookcases-bar">
					<Formik
						initialValues={{
							search: ""
						}}
						onSubmit={(values, { setSubmitting }) => {
							this.props.search(values["search"])
						}}
					>
					{({
						handleSubmit
					}) => (
						<Form>
							<div className="form-field-row">
								<div className="cases-search-form-field-container">
									<label className="form-field-label">
										Search for...
									</label>
									<Field
										className="form-field-long"
										type="text"
										name="search"
									>
									</Field>
								</div>
								<div className="cases-search-form-button-container">
									<button
										type="submit"
										className="form-button cases-search-button"
									>
										Search
									</button>
								</div>
								<div className="cases-zoom-button-container">
									<button
										type="button"
										className="form-button cases-zoom-buttom"
										onClick={() => this.props.zoomIn()}
									>
										+
									</button>
								</div>
								<div className="cases-zoom-button-container">
									<button
										type="button"
										className="form-button cases-zoom-button"
										onClick={() => this.props.zoomOut()}
									>
										-
									</button>
								</div>
							</div>
						</Form>
						)}
					</Formik>
				</div>
			</div>
		)
	}
}

export default BookcasesBar

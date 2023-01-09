import React from 'react'
import {Formik, Form, Field} from 'formik'

const Checkbox = ({field}) => {
	return (
		<input
			className="form-radio"
			type="checkbox"
			{...field}
		/>
	);
};

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
							searchValue: this.props.searchValue,
							searchusingtitle: this.props.searchusingtitle,
							searchusingsubtitle: this.props.searchusingsubtitle,
							searchusingseries: this.props.searchusingseries,
							searchusingauthor: this.props.searchusingauthor,
						}}
						onSubmit={(values, { setSubmitting }) => {
							this.props.search(values)
						}}
					>
					{({
						handleSubmit,
						values
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
										name="searchValue"
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
								{/*<div className="cases-edit-button-container">
									<button
										type="button"
										className="form-button cases-edit-button"
										onClick={() => this.props.openShelfEditor()}
									>
										Edit
									</button>
								</div>*/}
							</div>
							<div className="form-field-row">
								<div className="form-field-container">
									<label>
										<Field
											type="checkbox"
											name="searchusingtitle"
											component={Checkbox}
										/>Title
									</label>
									<label>
										<Field
											type="checkbox"
											name="searchusingsubtitle"
											component={Checkbox}
										/>Subtitle
									</label>
									<label>
										<Field
											type="checkbox"
											name="searchusingseries"
											component={Checkbox}
										/>Series
									</label>
									<label>
										<Field
											type="checkbox"
											name="searchusingauthor"
											component={Checkbox}
										/>Author
									</label>
								</div>
								<div className="cases-zoom-button-container">
									<button
										type="button"
										className="form-button cases-zoom-buttom"
										onClick={() => this.props.previousResult()}
									>
										&larr;
									</button>
								</div>
								<div className="cases-zoom-button-container">
									<button
										type="button"
										className="form-button cases-zoom-button"
										onClick={() => this.props.nextResult()}
									>
										&rarr;
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

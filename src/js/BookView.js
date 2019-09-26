import React from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik'

class BookView extends React.Component {
	constructor() {
		super()
	}

	render() {
		console.log(this.props.book)
		if (this.props.visible==="hidden") {
			return(<div className={"bookView " + this.props.visible}></div>)
		}
		return (
			<div className={"bookView " + this.props.visible}>
				<Formik
					initialValues={this.props.book}
					validate={values =>{
						let errors = {}

						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						this.props.saveBook(values, setSubmitting)
					}}
				>
					{({
						values,
						errors,
						touched,
						dirty,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
						handleReset,
						setFieldValue
					}) => (
						<Form>
							<div
								className="book-form-main"
							>

							</div>
							<div
								className="book-form-buttons"
							>
								<button
									type="submit"
									disabled={isSubmitting}
									className="book-form-button"
								>
									Save
								</button>
								<button
									type="button"
									className="book-form-button"
									onClick={() => this.props.cancelBook()}
								>
									Cancel
								</button>
								<button
									type="button"
									className="book-form-button"
									onClick={() => this.props.removeBook(this.props.id)}
								>
									Remove
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		)
	}
}

export default BookView
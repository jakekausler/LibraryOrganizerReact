import React from 'react'
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik'

import Checkbox from './Checkbox'

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
						this.props.saveBook(values, this.props.reload)
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
							<div className="book-form-main">
								<div className="form-field-left">
									<div className="form-field-left-top">
										<div className="form-field-left-top-left">
											<div className="book-form-field-container">
												<label className="form-field-label">
													Library
												</label>
												<Field
													className="form-field-long"
													type="text"
													name="library.name"
												>
												</Field>
											</div>
											<div className="book-form-field-container">
												<label className="form-field-label">
													Title
												</label>
												<Field
													className="form-field-long"
													type="text"
													name="title"
												>
												</Field>
											</div>
											<div className="book-form-field-container">
												<label className="form-field-label">
													Subtitle
												</label>
												<Field
													className="form-field-long"
													type="text"
													name="subtitle"
												>
												</Field>
											</div>
										</div>
										<div className="form-field-left-top-right">
											<div className="book-form-image-container">
												<img src={"/web/" + this.props.book.imageurl} />
											</div>
											<div className="book-form-field-container">
												<label className="form-field-label">
													Image URL
												</label>
												<Field
													className="form-field-long"
													type="text"
													name="imageurl"
												>
												</Field>
											</div>
										</div>
									</div>
									<div className="form-field-left-middle">
										<div className="book-form-field-container-long">
											<label className="form-field-label">
												Series
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="series"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Volume
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="volume"
											>
											</Field>
										</div>
									</div>
									<div className="form-field-left-bottom">
										<div className="book-form-field-container">
											<label className="form-field-label">
												Authors
											</label>
											<Field
												className="form-field-long"
												component="textarea"
												name="authors"
											>
											</Field>
										</div>
									</div>
								</div>
								<div className="form-field-right">
									<div className="form-field-row">
										<div className="book-form-field-container">
											<label className="form-field-label">
												Publisher
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="publisher.publisher"
											>
											</Field>
										</div>
									</div>
									<div className="form-field-row">
										<div className="book-form-field-container">
											<label className="form-field-label">
												City
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="publisher.city"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												State
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="publisher.state"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Country
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="publisher.country"
											>
											</Field>
										</div>
									</div>
									<div className="form-field-row">
										<div className="book-form-field-container">
											<label className="form-field-label">
												Originally Published
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="originallypublished"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Edition Published
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="editionpublished"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Edition
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="edition"
											>
											</Field>
										</div>
									</div>
									<div className="form-field-row">
										<div className="book-form-field-container">
											<label className="form-field-label">
												ISBN
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="isbn"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Dewey
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="dewey"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Binding
											</label>
											<Field
												className="form-field-long"
												type="text"
												name="format"
											>
											</Field>
										</div>
									</div>
									<div className="form-field-row">
										<div className="book-form-field-container">
											<label className="form-field-label">
												Pages
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="pages"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Width
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="width"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Height
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="height"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Depth
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="depth"
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="form-field-label">
												Weight
											</label>
											<Field
												className="form-field-long"
												type="number"
												name="weight"
											>
											</Field>
										</div>
									</div>
									<div className="form-field-row">
										<div className="book-form-field-container">
											<label className="book-form-radio-label">
												Owned
											</label>
											<Field
												type="checkbox"
												name="isowned"
												checked={values.isowned}
												component={Checkbox}
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="book-form-radio-label">
												Read
											</label>
											<Field
												className="form-radio"
												type="checkbox"
												name="isread"
												checked={values.isread}
												component={Checkbox}
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="book-form-radio-label">
												Reference
											</label>
											<Field
												className="form-radio"
												type="checkbox"
												name="isreference"
												checked={values.isreference}
												component={Checkbox}
											>
											</Field>
										</div>
									</div>
									<div className="form-field-row">
										<div className="book-form-field-container">
											<label className="book-form-radio-label">
												Anthology
											</label>
											<Field
												className="form-radio"
												type="checkbox"
												name="isanthology"
												checked={values.isanthology}
												component={Checkbox}
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="book-form-radio-label">
												Reading
											</label>
											<Field
												className="form-radio"
												type="checkbox"
												name="isreading"
												checked={values.isreading}
												component={Checkbox}
											>
											</Field>
										</div>
										<div className="book-form-field-container">
											<label className="book-form-radio-label">
												Shipping
											</label>
											<Field
												className="form-radio"
												type="checkbox"
												name="isshipping"
												checked={values.isshipping}
												component={Checkbox}
											>
											</Field>
										</div>
									</div>
								</div>
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
									onClick={() => this.props.removeBook(this.props.book.bookid, this.props.reload)}
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
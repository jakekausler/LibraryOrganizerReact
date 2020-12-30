import React from 'react'
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik'
import * as Yup from 'yup'

import Checkbox from './Checkbox'

class BookView extends React.Component {
	constructor() {
		super()
	}

	render() {
		if (this.props.visible==="hidden") {
			return(<div className={"bookView " + this.props.visible}></div>)
		}
		const BookViewSchema = Yup.object().shape({
			library: Yup.string()
				.required('Required'),
			title: Yup.string()
				.max(255, 'Title must be less than or equal to 255 characters')
				.required('Required'),
			subtitle: Yup.string()
				.max(255, 'Must be less than or equal to 255 characters'),
			series: Yup.string()
				.max(255, 'Must be less than or equal to 255 characters'),
			volume: Yup.number()
				.required('Required'),
			authors: Yup.string()
				.matches(/(^([^ \n:]+)? ([^ \n:]+)? ([^ \n:]+):[^ \n:]+\n?)+/, {message:'Not valid. Please ensure you are putting one author per line, each in the format [First [Middle1;Middle2;...;MiddleN ]]Last:Role', excludeEmptyString:true}),
			publisher: Yup.object().shape({
				publisher: Yup.string()
					.max(255, 'Must be less than or equal to 255 characters'),
				city: Yup.string()
					.max(255, 'Must be less than or equal to 255 characters'),
				state: Yup.string()
					.max(255, 'Must be less than or equal to 255 characters'),
				country: Yup.string()
					.max(255, 'Must be less than or equal to 255 characters')
			}),
			originallypublished: Yup.string()
				.required('Required')
				.matches(/^[0-9][0-9][0-9][0-9]$/, "Must be a four digit year"),
			editionpublished: Yup.string()
				.required('Required')
				.matches(/^[0-9][0-9][0-9][0-9]$/, "Must be a four digit year"),
			edition: Yup.number()
				.required('Required'),
			isbn: Yup.string()
				.test('validate-isbn', 'Invalid', function(value) {
					var sum,
			        weight,
			        digit,
			        check,
			        i;

			        if (!value) {
			        	return true;
			        }

				    value = value.replace(/[^0-9X]/gi, '');

				    if (value.length != 10 && value.length != 13) {
				        return false;
				    }

				    if (value.length == 13) {
				        sum = 0;
				        for (i = 0; i < 12; i++) {
				            digit = parseInt(value[i]);
				            if (i % 2 == 1) {
				                sum += 3*digit;
				            } else {
				                sum += digit;
				            }
				        }
				        check = (10 - (sum % 10)) % 10;
				        return (check == value[value.length-1]);
				    }

				    if (value.length == 10) {
				        weight = 10;
				        sum = 0;
				        for (i = 0; i < 9; i++) {
				            digit = parseInt(value[i]);
				            sum += weight*digit;
				            weight--;
				        }
				        check = 11 - (sum % 11);
				        if (check == 10) {
				            check = 'X';
				        }
				        return (check == value[value.length-1].toUpperCase());
				    }
				}),
			dewey: Yup.string()
				.required('Required')
				.matches(/([0-9][0-9][0-9](\.[0-9]+)?)|(aFIC|bCOM|cDND)/, "Invalid"),
			binding: Yup.string(),
			pages: Yup.number()
				.required('Required')
				.min(0, 'Must be at least zero')
				.integer('Must be an integer'),
			width: Yup.number()
				.required('Required')
				.min(0, 'Must be at least zero')
				.integer('Must be an integer'),
			height: Yup.number()
				.required('Required')
				.min(0, 'Must be at least zero')
				.integer('Must be an integer'),
			depth: Yup.number()
				.required('Required')
				.min(0, 'Must be at least zero')
				.integer('Must be an integer'),
			weight: Yup.number()
				.required('Required')
				.min(0, 'Must be at least zero'),
		})
		return (
			<div className={"bookView " + this.props.visible}>
				<Formik
					initialValues={this.props.book}
					validationSchema={BookViewSchema}
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
												{errors.library && errors.library.name ? <label className="form-field-error">{errors.library}.name</label>:""}
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
												{errors.title ? <label className="form-field-error">{errors.title}</label>:""}
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
												{errors.subtitle ? <label className="form-field-error">{errors.subtitle}</label>:""}
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
												{errors.imageurl ? <label className="form-field-error">{errors.imageurl}</label>:""}
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
												{errors.series ? <label className="form-field-error">{errors.series}</label>:""}
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
												{errors.volume ? <label className="form-field-error">{errors.volume}</label>:""}
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
												{errors.authors ? <label className="form-field-error">{errors.authors}</label>:""}
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
												{errors.publisher && errors.publisher.publisher ? <label className="form-field-error">{errors.publisher.publisher}</label>:""}
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
												{errors.publisher && errors.publisher.city ? <label className="form-field-error">{errors.publisher.city}</label>:""}
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
												{errors.publisher && errors.publisher.state ? <label className="form-field-error">{errors.publisher.state}</label>:""}
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
												{errors.publisher && errors.publisher.country ? <label className="form-field-error">{errors.publisher.country}</label>:""}
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
												{errors.originallypublished ? <label className="form-field-error">{errors.originallypublished}</label>:""}
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
												{errors.editionpublished ? <label className="form-field-error">{errors.editionpublished}</label>:""}
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
												{errors.edition ? <label className="form-field-error">{errors.edition}</label>:""}
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
												{errors.isbn ? <label className="form-field-error">{errors.isbn}</label>:""}
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
												{errors.dewey ? <label className="form-field-error">{errors.dewey}</label>:""}
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
												{errors.binding ? <label className="form-field-error">{errors.binding}</label>:""}
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
												{errors.pages ? <label className="form-field-error">{errors.pages}</label>:""}
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
												{errors.width ? <label className="form-field-error">{errors.width}</label>:""}
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
												{errors.height ? <label className="form-field-error">{errors.height}</label>:""}
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
												{errors.depth ? <label className="form-field-error">{errors.depth}</label>:""}
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
												{errors.weight ? <label className="form-field-error">{errors.weight}</label>:""}
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
									disabled={isSubmitting || this.props.readOnlyLibrary}
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
									disabled={isSubmitting || this.props.readOnlyLibrary}
									className="book-form-button"
									onClick={() => this.props.removeBook(this.props.book, this.props.reload)}
								>
									Remove
								</button>
								<button
									type="button"
									disabled={isSubmitting || this.props.readOnlyLibrary}
									className="book-form-button"
									onClick={() => this.props.duplicateBook()}
								>
									Duplicate
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

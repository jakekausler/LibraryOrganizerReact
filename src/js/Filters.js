import React from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik'

const Checkbox = ({field}) => {
	return (
		<input
			className="form-radio"
			type="checkbox"
			{...field}
		/>
	);
};

class Filters extends React.Component {
	constructor() {
		super()
		this.state = {
			hidden: true
		}
		this.onClick = this.onClick.bind(this)
	}

	onClick(event) {
		this.setState((state) => ({
			hidden: !state.hidden
		}))
	}

	render() {
		let filterClass;
		let buttonText;
		if (this.state.hidden) {
			filterClass = 'hidden';
			buttonText = '>';
		} else {
			filterClass = 'visible';
			buttonText = '<';
		}
		let nextDisabled = this.props.filters.page === (Math.ceil(this.props.numBooks/this.props.filters.numbertoget));
		let previousDisabled = this.props.filters.page === 1;
		let newDisabled = this.props.readOnlyLibrary;
		let removeDisabled = this.props.readOnlyLibrary;
		let result = (
		<div className='filters'>
			<div className={"filter " + filterClass}>
				<Formik
					initialValues={this.props.filters}
					validate={values =>{
						let errors = {}

						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						this.props.updateFilters(values, setSubmitting)
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
{/*							<button
								className='form-button'
								type="button"
							>
								Choose Libraries
							</button>*/}
							<div
								className="form-field-container"
							>
								<label
									className="form-field-label"
									htmlFor="text"
								>
									Search Text
								</label>
								<Field
									className="form-field-long"
									type="text"
									name="text"
								/>
							</div>
							<div className="form-field-container filter-container-bottom-bar">
								{/*<label
									className="form-checkbox-group-label"
									htmlFor="searchusing"
								>
									Search Using
								</label>*/}
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
							<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="userread"
								>
									Is Read
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="userread"
										value="yes"
										checked={values.userread === "yes"}
										onChange={() => setFieldValue("userread", "yes")}
									/>Yes
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="userread"
										value="no"
										checked={values.userread === "no"}
										onChange={() => setFieldValue("userread", "no")}
									/>No
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="userread"
										value="both"
										checked={values.userread === "both"}
										onChange={() => setFieldValue("userread", "both")}
									/>Both
								</label>
							</div>
							<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="isreference"
								>
									Is Reference
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isreference"
										value="yes"
										checked={values.isreference === "yes"}
										onChange={() => setFieldValue("isreference", "yes")}
									/>Yes
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isreference"
										value="no"
										checked={values.isreference === "no"}
										onChange={() => setFieldValue("isreference", "no")}
									/>No
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isreference"
										value="both"
										checked={values.isreference === "both"}
										onChange={() => setFieldValue("isreference", "both")}
									/>Both
								</label>
							</div>
							<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="isanthology"
								>
									Is Anthology
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isanthology"
										value="yes"
										checked={values.isanthology === "yes"}
										onChange={() => setFieldValue("isanthology", "yes")}
									/>Yes
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isanthology"
										value="no"
										checked={values.isanthology === "no"}
										onChange={() => setFieldValue("isanthology", "no")}
									/>No
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isanthology"
										value="both"
										checked={values.isanthology === "both"}
										onChange={() => setFieldValue("isanthology", "both")}
									/>Both
								</label>
							</div>
							<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="isowned"
								>
									Is Owned
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isowned"
										value="yes"
										checked={values.isowned === "yes"}
										onChange={() => setFieldValue("isowned", "yes")}
									/>Yes
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isowned"
										value="no"
										checked={values.isowned === "no"}
										onChange={() => setFieldValue("isowned", "no")}
									/>No
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isowned"
										value="both"
										checked={values.isowned === "both"}
										onChange={() => setFieldValue("isowned", "both")}
									/>Both
								</label>
							</div>
							<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="isloaned"
								>
									Is Loaned
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isloaned"
										value="yes"
										checked={values.isloaned === "yes"}
										onChange={() => setFieldValue("isloaned", "yes")}
									/>Yes
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isloaned"
										value="no"
										checked={values.isloaned === "no"}
										onChange={() => setFieldValue("isloaned", "no")}
									/>No
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isloaned"
										value="both"
										checked={values.isloaned === "both"}
										onChange={() => setFieldValue("isloaned", "both")}
									/>Both
								</label>
							</div>
							<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="isshipping"
								>
									Is Shipping
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isshipping"
										value="yes"
										checked={values.isshipping === "yes"}
										onChange={() => setFieldValue("isshipping", "yes")}
									/>Yes
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isshipping"
										value="no"
										checked={values.isshipping === "no"}
										onChange={() => setFieldValue("isshipping", "no")}
									/>No
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isshipping"
										value="both"
										checked={values.isshipping === "both"}
										onChange={() => setFieldValue("isshipping", "both")}
									/>Both
								</label>
							</div>
							{/*<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="isreading"
								>
									Is Reading
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isreading"
										value="yes"
										checked={values.isreading === "yes"}
										onChange={() => setFieldValue("isreading", "yes")}
									/>Yes
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isreading"
										value="no"
										checked={values.isreading === "no"}
										onChange={() => setFieldValue("isreading", "no")}
									/>No
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="isreading"
										value="both"
										checked={values.isreading === "both"}
										onChange={() => setFieldValue("isreading", "both")}
									/>Both
								</label>
							</div>*/}
							<div className="form-radio-group">
								<label
									className="form-radio-group-label"
									htmlFor="sortmethod"
								>
									Sort By
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="sortmethod"
										value="title"
										checked={values.sortby === "title"}
										onChange={() => setFieldValue("sortmethod", "title")}
									/>Title
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="sortmethod"
										value="series"
										checked={values.sortmethod === "series"}
										onChange={() => setFieldValue("sortmethod", "series")}
									/>Series
								</label>
								<label>
									<input
										className="form-radio"
										type="radio"
										name="sortmethod"
										value="dewey"
										checked={values.sortmethod === "dewey"}
										onChange={() => setFieldValue("sortmethod", "dewey")}
									/>Dewey
								</label>
							</div>
							<div
								className="form-field-container"
							>
								<label
									className="form-field-label"
									htmlFor="numbertoget"
								>
									Limit
								</label>
								<Field
									className="form-field-short"
									type="number"
									name="numbertoget"
									min="0"
									step="1"
								/>
							</div>
							<div
								className="form-field-container"
							>
								<label
									className="form-field-label"
									htmlFor="page"
								>
									Page
								</label>
								<Field
									className="form-field-short"
									type="number"
									name="page"
									min="1"
									step="1"
								/>
							</div>
							<div
								className="form-field-container"
							>
								<label
									className="form-field-label"
									htmlFor="fromdewey"
								>
									From Dewey
								</label>
								<Field
									className="form-field-short"
									type="text"
									name="fromdewey"
								/>
							</div>
							<div
								className="form-field-container"
							>
								<label
									className="form-field-label"
									htmlFor="todewey"
								>
									To Dewey
								</label>
								<Field
									className="form-field-short"
									type="text"
									name="todewey"
								/>
							</div>
							<button
								className="form-button"
								type="submit"
								disabled={isSubmitting}
							>
								Submit
							</button>
						</Form>
					)}
				</Formik>
			</div>
			<div className="filter-buttons">
				<button className="filter-showhide" onClick={this.onClick}>
					{buttonText}
				</button>
				<button className="filter-showhide" disabled={nextDisabled} onClick={this.props.nextPage}>
					<div className="filter-nextprevious">Next</div>
				</button>
				<button className="filter-showhide" disabled={previousDisabled} onClick={this.props.prevPage}>
					<div className="filter-nextprevious">Previous</div>
				</button>
				<button className="filter-showhide" disabled={removeDisabled || this.props.selectedBookIds.size == 0} onClick={() => this.props.removeBooks(Array.from(this.props.selectedBookIds), this.props.reload)}>
					<div className="filter-nextprevious filter-remove">{"Remove " + this.props.selectedBookIds.size + " Book" + (this.props.selectedBookIds.size == 1 ? "" : "s")}</div>
				</button>
				<button className="filter-showhide" disabled={newDisabled} onClick={() => this.props.openBookEditor()}>
					<div className="filter-nextprevious">New</div>
				</button>
			</div>
		</div>
		)
		return result
	}
}

export default Filters
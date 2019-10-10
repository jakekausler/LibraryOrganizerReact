import React from 'react'

class LoginPage extends React.Component {
    constructor() {
		super()
    }

    render() {
		return (
		    <div className="loginPage">
		    	<form
					action="/users/login"
					method="POST"
				>
					<div className="login-form-field-container">
						<label className="form-field-label">
							Username
						</label>
						<input
							className="form-field-long"
							type="text"
							name="username"
						>
						</input>
					</div>
					<div className="login-form-field-container">
						<label className="form-field-label">
							Password
						</label>
						<input
							className="form-field-long"
							type="password"
							name="password"
						>
						</input>
					</div>
					<button
						type="submit"
						className="login-form-button"
					>
						Log In
					</button>
				</form>
		    </div>
		)
    }
}

export default LoginPage

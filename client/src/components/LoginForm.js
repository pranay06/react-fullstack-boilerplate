import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import superagent from 'superagent';
import {Redirect} from 'react-router-dom';

export default class LoginForm extends React.Component {
	constructor() {
		super();
		this.state = {
			username: "",
			password: ""
		}
	}

	handleUsernameChanged(event) {
		this.setState({
			username: event.target.value
		});
	}

	handlePasswordChanged(event) {
		this.setState({
			password: event.target.value
		})
	}
	isAuthenticated() {
		const token = localStorage.getItem('token');
		return token && token.length >10;
		
	}
	submitForm(event) {
		event.preventDefault();
		superagent
			.post('auth/v1')
			.send({	username: this.state.username, password: this.state.password})
			.end((err, res) => {
				if(err) {
					this.setState({
							errorMessage: "Authentication failed"
						});
					return;
				}
				// console.log('res.body: ', res.body.token);
				localStorage.setItem('token', res.body.token);
				this.setState();
			})
	}

	render() {   
		const isAuthenticated = this.isAuthenticated();
		
		return (
			<div>
				{isAuthenticated ? <Redirect to={{pathname: '/app'}} /> : (
				<form onSubmit={this.submitForm.bind(this)}>
					<TextField
						floatingLabelText = "Username"
						value = {this.state.username}
						onChange={this.handleUsernameChanged.bind(this)} />
					<TextField 
						floatingLabelText = "Password"
						value = {this.state.password}
						type="password"
						onChange={this.handlePasswordChanged.bind(this)} />
					<RaisedButton
						type="submit"
						label="Submit"
						/>
				</form>)}
			</div>
		);
	}
}

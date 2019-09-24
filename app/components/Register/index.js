import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LeagueContext } from '../Root'
import styles from '../Login/Login.scss';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

class RegisterWithContext extends Component {

  constructor() {
    super();
    this.state = {
      nickname: '',
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { register } = this.props
    const { firstName, lastName, nickname, email, password } = this.state;
    register(firstName, lastName, nickname, email, password)
  }

  render() {
    const { firstName, lastName, nickname, email, password } = this.state;
    const { registerError, registerLoading } = this.props;

    return (
      <div>
        <form onSubmit={this.onSubmit}>

          <TextField
            error={ registerError && registerError.field === 'firstName'}
            name="firstName"
            label="first name"
            className={styles.textField}
            value={firstName}
            onChange={this.onChange}
            margin="normal"
            helperText={ registerError && registerError.field === 'firstName' ? registerError.msg : '' }
            required
          />

          <TextField
            error={ registerError && registerError.field === 'lastName'}
            name="lastName"
            label="lastName"
            className={styles.textField}
            value={lastName}
            onChange={this.onChange}
            margin="normal"
            helperText={ registerError && registerError.field === 'lastName' ? registerError.msg : '' }
            required
          />

          <TextField
            error={ registerError && registerError.field === 'nickname'}
            name="nickname"
            label="nickname"
            className={styles.textField}
            value={nickname}
            onChange={this.onChange}
            margin="normal"
            helperText={ registerError && registerError.field === 'nickname' ? registerError.msg : '' }
            required
          />

          <TextField
            error={ registerError && registerError.field === 'email'}
            name="email"
            label="email"
            className={styles.textField}
            value={email}
            onChange={this.onChange}
            margin="normal"
            helperText={ registerError && registerError.field === 'email' ? registerError.msg : '' }
            required
          />

          <TextField
            error={ registerError && registerError.field === 'password'}
            name="password"
            label="password"
            className={styles.textField}
            value={password}
            onChange={this.onChange}
            margin="normal"
            helperText={ registerError && registerError.field === 'password' ? registerError.msg : '' }
            required
          />

          <Button disabled={ registerLoading } type="submit" variant="contained" color="primary">Register</Button>
          { registerLoading && <CircularProgress className={styles.loader} /> }
        </form>
      </div>
    );
  }
}

class Register extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <RegisterWithContext {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default Register;
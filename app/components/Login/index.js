import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import styles from './Login.scss';
import { LeagueContext } from '../Root'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

class LoginWithContext extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      touched: false
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    state.touched = true
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { login } = this.props
    const { email, password } = this.state;
    this.setState({touched:false});
    login(email, password)
  }

  render() {
    const { email, password, touched } = this.state;
    const { loginError, loginLoading } = this.props;

    console.log(loginLoading)

    return (
      <div>
        <form onSubmit={this.onSubmit}>

          <TextField
            error={ !touched && loginError && loginError.field === 'email'}
            name="email"
            label="email"
            className={styles.textField}
            value={email}
            onChange={this.onChange}
            margin="normal"
            helperText={ !touched && loginError && loginError.field === 'email' ? loginError.msg : '' }
            required
          />

          <TextField
            error={ !touched && loginError && loginError.field === 'password'}
            name="password"
            label="password"
            className={styles.textField}
            value={password}
            onChange={this.onChange}
            margin="normal"
            helperText={ !touched && loginError && loginError.field === 'password' ? loginError.msg : '' }
            required
          />

          <Button disabled={ loginLoading } type="submit" variant="contained" color="primary">Login</Button>
          { loginLoading && <CircularProgress className={styles.loader} /> }
       </form>
      </div>
    );
  }
}

class Login extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <LoginWithContext {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default Login;
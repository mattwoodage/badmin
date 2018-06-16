import React, { Component } from 'react'
import Root from '../../Root'

import { LeagueContext } from '../../Root'
import Typography from '@material-ui/core/Typography';

import Login from '../../Login'
import Register from '../../Register'
import Panel from '../../Panel'



class Page extends Component {

  renderLogIn () {
    const { isLoggedIn, nickname, logout } = this.props;
    if (!isLoggedIn) {
      return (
        <Panel>
          <Typography variant="display2" gutterBottom>Log In</Typography>
          <Login />
        </Panel>
      ) 
    }
  }

  renderForgotPassword () {
    return (
      <Panel low>
        <Typography variant="display2" gutterBottom>Forgotten Password?</Typography>
        <Register />
      </Panel>
    )
  }

  renderRegister () {
    return (
      <Panel high>
        <Typography variant="display2" gutterBottom>Register</Typography>
        <Register />
      </Panel>
    )
  }

  

  render () {
    return (
      <div>
        {this.renderLogIn()}
        {this.renderForgotPassword()}
        {this.renderRegister()}
      </div>
    )
  }
}

class LoginPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default LoginPage




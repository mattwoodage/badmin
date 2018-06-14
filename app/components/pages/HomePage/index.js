import React, { Component } from 'react'
import Root from '../../Root'

import { LeagueContext } from '../../Root'
import Typography from '@material-ui/core/Typography';

import Login from '../../Login'
import Register from '../../Register'


class Page extends Component {

  renderLogIn () {
    const { isLoggedIn, username, logout } = this.props;
    if (!isLoggedIn) {
      return (
        <div>
          <h1>Login</h1>
          <Login />
        </div>
      ) 
    } else {
      return (
        <div>
          <h1>Logged in as {username}</h1>
          <button onClick={logout}>Log Out</button>
        </div>
      )
    }
      
  }

  render () {
  
    console.log('render page......')
    return (
      <div>
        <Typography variant="display3" gutterBottom>HOMEPAGE</Typography>

        <ul>
          <li>{this.props.league ? this.props.league.name : 'x'}</li>
        </ul>
        {this.renderLogIn()}
        <hr />
        <h1>Register</h1>
        <Register />
      </div>
    )
  }
}

class HomePage extends Component {
  render () {
    console.log('render homepage')
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default HomePage




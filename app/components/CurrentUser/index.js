import React, { Component } from 'react'

import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';

import {withRouter} from 'react-router-dom'

class CurrentUser extends Component {
  
  doLogin = () => {
    this.props.history.push('./login')
  }

  render () {


    const { isLoggedIn, nickname, doLogOut } = this.props

    if (isLoggedIn) {
      return (
        <div>
          <Button color="primary">
            <PersonIcon />&nbsp;
            {nickname}
          </Button>
          <br/>
          <Button onClick={doLogOut} color="secondary">
            <LockIcon />&nbsp;
            Log out
          </Button>
        </div>  
      )
    }

    return (
      <div>
        <Button onClick={this.doLogin} variant="contained" color="primary">
          <LockIcon />&nbsp;
          Log In 
        </Button>
      </div>
    )
  }
}

export default withRouter(CurrentUser)

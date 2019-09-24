import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { LeagueContext } from '../../Root'

class Page extends Component {

  constructor () {
    super()
    this.state = {
      active: false,
      log: [new Date()]
    }
  }

  log = (msg) => {
    console.log(msg)
    const newLog = this.state.log
    newLog.push(msg)
    this.setState({
      log: newLog
    })
  }

  updateTables = () => {
    this.log('UPDATE TABLES')
  }

  start = () => {
    this.log('starting....')
    this.setState({active: true})
    this.updateTables()
  }

  sendMail = () => {

    alert('use nodemailer and gmail')
  }



  render () {
    const log = this.state.log.join('-----')

    return (
      <div>
        <h1>ADMIN {this.state.active}</h1>

        <NavLink className='button' to='./seasons'>SEASONS</NavLink>
        
      </div>
    )
  }
}


class AdminPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default AdminPage



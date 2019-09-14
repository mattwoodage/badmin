import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { LeagueContext } from '../../Root'
import Panel from '../../Panel'

const materialStyles = theme => ({
  paper: {
    padding: 30,
    color: theme.palette.text.secondary
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

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

  render () {
    const log = this.state.log.join('-----')
    return (
      <Panel>
        <div>
          <h1>ADMIN {this.state.active}</h1>
          <a href='#' onClick={this.start}>{this.state.active ? 'STARTED...' : 'START'}</a>
          <textarea cols="150" rows="200">
          {log}
          </textarea>
        </div>
      </Panel>
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

export default withStyles(materialStyles)(AdminPage)



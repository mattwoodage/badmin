import React, { Component } from 'react'
import Match from '../../Match'
import Day from '../../Day'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'
import Notification from '../../Notification'

import styles from './Match.scss'


import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

import Typography from '@material-ui/core/Typography';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

class Page extends Component {

  state = {
    loaded: false,
    error: false,
    match: undefined
  }

  initialise () {
    console.log('init')
    const { season, match } = this.props
    if (this.state.loaded || !season) return

    const matchID = match.params.match

    DB.get(`/api/${season.period}/match/${matchID}`)
      .then(response => {
        if (response.match) {
          this.setState({
            match: response.match,
            loaded: true
          })
        }
        else {
          this.setState({
            error: true,
            loaded: true
          })
        }
        this.props.stopLoad()
      })

      
  }


  render () {
    this.initialise()

    console.log(this.state.match)

    if (this.state.error) return <Panel><Notification text='Match not found' /></Panel>

    if (!this.state.match) return <Panel>Loading...</Panel>

    return (
      <Panel>
        <Typography variant="display1" gutterBottom>{this.state.match.division.labelLocal}</Typography>
        <Typography variant="display2" gutterBottom>{this.state.match.label}</Typography>
        <div>{this.state.match.venue.name}</div>
        <div>{this.state.match.startAt}</div>
        
      </Panel>
    )
  }
}

class MatchPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default MatchPage


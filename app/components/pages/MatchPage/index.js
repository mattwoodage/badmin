import React, { Component } from 'react'
import Match from '../../Match'
import Day from '../../Day'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'
import Notification from '../../Notification'
import MatchCard from '../../MatchCard'


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
    match: undefined,
    cards: []
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
            cards: response.cards,
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


  renderCards () {
    const cards = this.state.cards
    return Object.keys(cards).map(key => {
      return this.renderScoreCard(cards[key])
    })
  }

  renderScoreCard (card) {
    return (
      <div>
        <MatchCard match={this.state.match} card={card}/>
        <br /><br />
      </div>
    )
  }

  

  render () {
    this.initialise()

    console.log(this.state.match)
    console.log(this.state.cards)
    if (this.state.error) return <Panel><Notification text='Match not found' /></Panel>

    if (!this.state.match) return <Panel>Loading...</Panel>

    return (
      <Panel>
        <Typography variant="display1" gutterBottom>{this.state.match.division.labelLocal}</Typography>
        <Typography variant="display2" gutterBottom>{this.state.match.label}</Typography>
        <div>{this.state.match.venue.name}</div>
        <div>{this.state.match.startAt}</div>
        {this.renderCards()}
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


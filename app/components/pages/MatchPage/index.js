import React, { Component } from 'react'
import Match from '../../Match'
import Day from '../../Day'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'
import Notification from '../../Notification'
import MatchCard from '../../MatchCard'
import Breadcrumb from '../../Breadcrumb'

import styles from './Match.scss'

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

class Page extends Component {

  state = {
    loaded: false,
    error: false,
    match: undefined,
    cards: {},
    members: []
  }

  initialise () {
    console.log('init')
    const { season, match } = this.props
    if (this.state.loaded || !season) return

    const matchID = match.params.match

    DB.get(`/api/${season.period}/match/${matchID}`)
      .then(response => {
        if (response.match) {

          DB.get(`/api/${season.period}/members/${response.match.homeTeam.club}/${response.match.awayTeam.club}`)
            .then(members => {
              this.setState({
                match: response.match,
                cards: response.cards,
                loaded: true,
                members: members
              })
              this.props.stopLoad()
            })

        }
        else {
          this.setState({
            error: true,
            loaded: true
          })
          this.props.stopLoad()
        }
      })
  }

  renderCards () {
    const { cards } = this.state
    
    cards['new'] = {
      enteredBy: {
        email: 'current user'
      },
      homePlayers: [],
      awayPlayers: [],
      scores: []
    }

    return Object.keys(cards).map(key => {
      return this.renderScoreCard(cards[key])
    })
  }

  renderScoreCard (card) {
    const { match, members } = this.state
    return (
      <div>
        <MatchCard match={match} card={card} members={members}/>
        <br /><br />
      </div>
    )
  }

  render () {
    this.initialise()

    if (this.state.error) return <div><Notification text='Match not found' /></div>

    if (!this.state.match) return <div>Loading...</div>

    return (
      <div>
        <Breadcrumb list={
          [
            {lbl:'Calendar', url:'../calendar'},
            {lbl:this.state.match.label}
          ]
        } />

        {this.renderCards()}
      </div>
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


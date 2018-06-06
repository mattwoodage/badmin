import React, { Component } from 'react'
import Match from '../../Match'
import Day from '../../Day'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

class Page extends Component {

  constructor () {
    console.log('MATCHES CONSTRUCTOR')
    super()
    this.state = {}
  }

  componentDidMount () {
    console.log('MATCHES DID MOUNT')
    console.log(this.props)

    this.initialise()
  }

  initialise () {

    DB.get(`/api/league/${this.props.league.short}/${this.props.season.period}/matches`)
      .then(response => {
        this.setState({
          matches: response.matches
        })
      })

  }

  renderCalendar () {

    const moment = extendMoment(Moment)

    let startDate = moment(`1 Sep ${this.props.season.startYear}`)

    const weekday = Number(startDate.format('d'))
    startDate.add(-weekday + 1, 'days')

    const endDate = startDate.clone().add(40, 'weeks')

    const range = moment.range(startDate, endDate)

    return Array.from(range.by('days', { excludeEnd: true })).map(day => {
      return <Day day={day} matches={this.matchesOnDay(day)} />
    })
  }

  matchesOnDay (day) {
    if (!this.state.matches) return
    return this.state.matches.filter(m => {
      return day.isSame(m.startAt, 'day')
    })
  }

  renderList () {
    return this.state.matches && this.state.matches.map(match => {
      return (<Match match={match} />)
    })
  }

  render () {
    return (
      <div>
        <h1>{this.props.layout === 'CALENDAR' ? 'CALENDAR' : 'MATCHES'}</h1>
        <ul>
        {this.props.layout === 'CALENDAR' ? this.renderCalendar() : this.renderList()}
        </ul>
      </div>
    )
  }
}

class MatchesPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default MatchesPage

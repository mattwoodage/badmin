import React, { Component } from 'react'
import Match from '../../Match'
import Day from '../../Day'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'

import styles from './Matches.scss'


import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

import Typography from '@material-ui/core/Typography';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

class Page extends Component {

  state = {
    loaded: false
  }

  initialise () {
    const { league, season } = this.props
    if (this.state.loaded || !league || !season) return

    DB.get(`/api/${season.period}/matches`)
      .then(response => {
        this.setState({
          matches: response.matches,
          loaded: true
        })
        this.props.stopLoad()
      })
  }

  renderMonth (date) {
    const { classes } = this.props;
    return (
      <Grid item xs={12}>
        <div>
          <Typography variant="display1">
            {date.format("MMMM YYYY")}
          </Typography>
        </div>
      </Grid>
    )
  }

  renderCalendar () {

    if (!this.props.season) return

    const moment = extendMoment(Moment)

    let startDate = moment(`1 Sep ${this.props.season.startYear}`)

    const weekday = Number(startDate.format('d'))
    startDate.add(-weekday + 1, 'days')

    const endDate = startDate.clone().add(40, 'weeks')

    const range = moment.range(startDate, endDate)

    let calendar = []
    let lastMonth = -1
    Array.from(range.by('days', { excludeEnd: true })).map(date => {
      let thisMonth = date.month()
      let dayOfWeek = Number(date.format("d"))
      if (dayOfWeek === 1 && thisMonth !== lastMonth) {
        calendar.push(this.renderMonth(date))
        lastMonth = thisMonth
      }
      
      calendar.push(<Day dayOfWeek={dayOfWeek} key={date} date={date} matches={this.matchesOnDay(date)} />)
    })

    return calendar
  }

  matchesOnDay (day) {
    if (!this.state.matches) return
    return this.state.matches.filter(m => {
      return day.isSame(m.startAt, 'day')
    })
  }

  renderList () {

    const { classes } = this.props;

    return (
      <List>
      {
        this.state.matches && this.state.matches.map(match => {
          return (
            <Match key={match.key} match={match} />
          )
        })
      }
      </List>
    )
  }

  render () {
    this.initialise()

    const { classes } = this.props;

    return (
      <Panel>

        <Typography variant="display3" gutterBottom>{this.props.layout === 'CALENDAR' ? 'CALENDAR' : 'MATCHES'}</Typography>

        <Grid className={styles.calendar} container spacing={8}>
        {this.props.layout === 'CALENDAR' ? this.renderCalendar() : this.renderList()}
        </Grid>
      </Panel>
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


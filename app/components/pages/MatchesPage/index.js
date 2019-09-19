import React, { Component } from 'react'
import Match from '../../Match'
import Day from '../../Day'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'

import styles from './Matches.scss'

import Button from '@material-ui/core/Button';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

class Page extends Component {

  state = {
    loaded: false,
    calendar: '',
    current: null
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.gotoHash, false);
  }

  componentWillUnmount() {
      window.removeEventListener("hashchange", this.gotoHash, false);
  }

  initialise () {
    const { league, season } = this.props

    console.log('init', this.state.loaded)

    if (this.state.loaded || !league || !season) return

    this.moment = extendMoment(Moment)

    this.startDate = this.moment(`1 Sep ${season.startYear}`)
    this.endDate = this.startDate.clone().add(40, 'weeks')
    DB.get(`/api/${season.period}/matches`)
      .then(response => {
        this.setState({
          matches: response.matches,
          loaded: true
        })
        console.log(response.matches)
        this.props.stopLoad()
        this.gotoHash()
      })
  
  }

  renderCalendar () {

    const { season } = this.props;

    if (!season || !this.state.current) return

    const currentMonth = this.state.current.month()

    const monthStart = this.moment(`1 ${this.state.current.format("MMMM YYYY")}`)
    const monthEnd = monthStart.clone().add(1, 'month').add(-1, 'day')

    const firstDayOfMonth = monthStart.clone().format('D')
    const lastDayOfMonth = monthEnd.clone().format('D')

    let weekday = Number(monthStart.format('d'))

    if (weekday === 0) weekday = 7
    monthStart.add(-weekday + 1, 'days')

    weekday = Number(monthEnd.format('d'))

    if (weekday !== 0) monthEnd.add(7-weekday, 'days')
    const range = this.moment.range(monthStart, monthEnd)

    console.log(firstDayOfMonth, lastDayOfMonth)

    return Array.from(range.by('days', { excludeEnd: false })).map(date => {
      let thisMonth = date.month()
      let dayOfWeek = Number(date.format("d"))
      let thisDate = date.format('D')
      let mthDiff = thisMonth - currentMonth
      let first = thisDate === firstDayOfMonth
      let last = thisDate === lastDayOfMonth
      let firstWeek = mthDiff===0 && thisDate - firstDayOfMonth < 7
      let lastWeek = mthDiff===0 && lastDayOfMonth - thisDate < 7

      let fromToday = this.moment().isSame(date, 'day')
 
      return (<Day today={fromToday} firstWeek={firstWeek} lastWeek={lastWeek} firstDayOfMonth={first} lastDayOfMonth={last} before={mthDiff === -1} after={mthDiff === 1} dayOfWeek={dayOfWeek} key={date} date={date} matches={this.matchesOnDay(date)} />)
    })
  }

  matchesOnDay (day) {
    if (!this.state.matches) return
    return this.state.matches.filter(m => {
      return day.isSame(m.startAt, 'day')
    })
  }

  gotoHash = () => {
    const { season } = this.props;
    if (!season) return false

    let defaultMonth = document.location.hash.substr(1)
    let defaultDate = this.moment()
    
    if (defaultMonth !== '') {
      defaultDate = this.moment(`1 ${defaultMonth} ${season.startYear}`)
      if (defaultDate < this.startDate) defaultDate.add(1, 'year')
    } 
    this.gotoDate(defaultDate)
  }

  gotoDate (date) {
    let mth = date.format("MMMM")
    document.location = '#' + mth.toLowerCase()
    this.setState({
      current: date
    })
  }

  renderMenu () {
    if (!this.startDate || !this.state.current) return

    const range = this.moment.range(this.startDate, this.endDate)

    let currentMth = this.state.current.format("MMMM")

    return Array.from(range.by('months', { excludeEnd: true })).map(date => {
      const mth = date.format("MMMM")
      const mthLbl = date.format("MMM")
      let props = { color: 'primary' }
      if (currentMth === mth) {
        props.color = 'secondary'
        props.variant = 'contained'
      }

      return (
        <Button className='monthLink' onClick={() => {this.gotoDate(date)}} size="small" {...props}>{mthLbl}</Button>
      )
    })
  }

  renderList () {
    return (
      <div>
      {
        this.state.matches && this.state.matches.map(match => {
          return (
            <Match key={match.key} match={match} />
          )
        })
      }
      </div>
    )
  }

  render () {
    this.initialise()

    
    return (
      <div>
        <h1>{this.props.layout === 'CALENDAR' ? 'CALENDAR' : 'MATCHES'}</h1>

        <div className='menu'>{this.renderMenu()}</div>

        <h2>{this.state.current && this.state.current.format("MMMM YYYY").toUpperCase()}</h2>
        <div class='calendar'>
          {this.props.layout === 'CALENDAR' ? this.renderCalendar() : this.renderList()}
        </div>
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


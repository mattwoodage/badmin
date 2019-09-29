import React, { Component } from 'react'

import Match from '../Match'
import { format } from 'date-fns'

import styles from './Day.scss'

class Day extends Component {

  renderMatches () {
    if (!this.props.matches) return ''
    return this.props.matches.map(match => {
      return (<Match cal key={match.key} match={match} />)
    })
  }

  render () {
    const { date, dayOfWeek, classes, before, after, firstDayOfMonth, lastDayOfMonth, firstWeek, lastWeek, today } = this.props;

    let cls = ['day', 'day' + dayOfWeek]

    if (before) cls.push('before')
    if (after) cls.push('after')

    if (firstDayOfMonth) cls.push('firstDayOfMonth')
    if (lastDayOfMonth) cls.push('lastDayOfMonth')

    if (firstWeek) cls.push('firstWeek')
    if (lastWeek) cls.push('lastWeek')
    if (today) cls.push('today') 

    const showMth = date.date() === 1 || (before && dayOfWeek === 1)
    const fmt = showMth ? 'EEE d MMM' : 'EEE d'

    return (
      <div className={cls.join(' ')}>
        {format(new Date(this.props.date),fmt)}
        {this.renderMatches()}
      </div>
    )
  }
}

export default Day

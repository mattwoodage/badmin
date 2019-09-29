import React, { Component } from 'react'

import Hidden from '@material-ui/core/Hidden';
import ImageIcon from '@material-ui/icons/Image';
import { NavLink } from 'react-router-dom'

import styles from './Match.scss';

class Match extends Component {

  startTime () {
    const { match, cal } = this.props
    let startAt = String(new Date(this.props.match.startAt)).split(' ')
    if (cal) {
      startAt = startAt[4].split(":")
      startAt.pop()
    }
    else {
      startAt.pop()
      startAt.pop()
    }
    return (
      <div className='time'>
        {startAt.join(':')}
      </div>
    )
  }

  render () {

    const { match, classes } = this.props
    let lbl = match.label.toUpperCase()
    lbl = lbl.split(' VS ')
    let footer = <div className='venue' >{match.venue.name}</div>
    if (match.scoreCard && match.scoreCard.status === 1) {
      const { homePts, homeRubbers, awayPts, awayRubbers } = match.scoreCard
      
      lbl = <span>{lbl[0]}<br />{homeRubbers} : {awayRubbers}<br />{lbl[1]}</span>
      footer = null
      
    }
    else {
      lbl = lbl.join(' vs ')
    }

    const cls = 'match ' + match.division.category.toLowerCase() + 'Match'
    return (
      <NavLink className={cls} to={`./match/${match.homeTeam}/${match.awayTeam}/${match._id}`} >

        <span className='division'>
          {match.division.labelLocal}
        </span>
        {this.startTime()}

        <div className='label'>{lbl}</div>
        {footer}
      </NavLink>
    )
  }
}

export default Match

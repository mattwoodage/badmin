import React, { Component } from 'react'
import Moment from 'react-moment'


import Avatar from '@material-ui/core/Avatar';

import Hidden from '@material-ui/core/Hidden';
import ImageIcon from '@material-ui/icons/Image';
import { NavLink } from 'react-router-dom'

import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import pink from '@material-ui/core/colors/pink';

import FolderIcon from '@material-ui/icons/Folder';

import styles from './Match.scss';

Moment.globalFormat = 'D MMM YYYY HH:mm'

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
    lbl = lbl.split(' VS ').join(' vs ')

    const cls = 'match ' + match.division.category.toLowerCase() + 'Match'
    return (
      <NavLink className={cls} to={`./match/${match._id}`} >

        <span className='division'>
          {match.division.labelLocal}
        </span>
        {this.startTime()}

        <div className='label'>{lbl}</div>
        <div className='venue' >{match.venue.name}</div>
      </NavLink>
    )
  }
}

export default Match

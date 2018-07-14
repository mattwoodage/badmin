import React, { Component } from 'react'
import Moment from 'react-moment'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import ImageIcon from '@material-ui/icons/Image';
import { NavLink } from 'react-router-dom'

import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import pink from '@material-ui/core/colors/pink';

import FolderIcon from '@material-ui/icons/Folder';

import matchStyles from './Match.scss';

Moment.globalFormat = 'D MMM YYYY HH:mm'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
};

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
      <div className={matchStyles.time}>
        {startAt.join(':')}
      </div>
    )
  }

  render () {

    const { match, classes } = this.props
    let cls = matchStyles.ladiesMatch
    if (match.division.labelLocal.toUpperCase().indexOf('MIXED')>-1) cls = matchStyles.mixedMatch
    if (match.division.labelLocal.toUpperCase().indexOf('MENS')>-1) cls = matchStyles.mensMatch

    return (
      <div className={cls}>
        <NavLink to={`./match/${match._id}`} >
          <span>
            <span className={matchStyles.div}>
              {match.division.labelLocal}
            </span>
            {this.startTime()}
          </span>

          <span className={matchStyles.content} >
            <b>{match.label}</b>
            
          </span>
          <span className={matchStyles.venue} >{match.venue.name}</span>
        </NavLink>
      </div>
    )
  }
}

export default  withStyles(styles)(Match)

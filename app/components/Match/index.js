import React, { Component } from 'react'
import Moment from 'react-moment'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import ImageIcon from '@material-ui/icons/Image';

import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import pink from '@material-ui/core/colors/pink';

import FolderIcon from '@material-ui/icons/Folder';

Moment.globalFormat = 'D MMM YYYY HH:mm'

const styles = {
  avatar: {
    margin: 10,
  },
  mensAvatar: {
    margin: 0,
    color: '#fff',
    backgroundColor: lightBlue[200],
  },
  mixedAvatar: {
    margin: 0,
    color: '#fff',
    backgroundColor: lightGreen[300],
  },
  ladiesAvatar: {
    margin: 0,
    color: '#fff',
    backgroundColor: pink[200],
  },
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
      <div>
        <b>{match.venue.name}:</b> 
        {startAt.join(' ')}
      </div>
    )
  }

  renderIcon () {
    const { match, classes } = this.props
    let cls = classes.ladiesAvatar
    if (match.division.labelLocal.toUpperCase().indexOf('MIXED')>-1) cls = classes.mixedAvatar
    if (match.division.labelLocal.toUpperCase().indexOf('MENS')>-1) cls = classes.mensAvatar
    return (
      <Avatar className={cls}>
        {match.division.position}
      </Avatar>
    ) 
  }

  render () {
    const { match } = this.props
    return (
      <ListItem>
        {this.renderIcon()}
        <ListItemText secondary={this.startTime()} >
          <b>{match.label}</b>
        </ListItemText>
      </ListItem>
    )
  }
}

export default  withStyles(styles)(Match)

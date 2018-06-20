import React, { Component } from 'react'
import Moment from 'react-moment'
import Match from '../Match'

import styles from './Day.scss'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';



class Day extends Component {

  renderMatches () {
    if (!this.props.matches) return ''
    return this.props.matches.map(match => {
      return (<Match cal key={match.key} match={match} />)
    })
  }

  render () {
    const { classes } = this.props;

    const cls = styles.day + ' ' + styles['day' + this.props.dayOfWeek]

    const fmt = this.props.date.date() === 1 ? 'ddd DD MMM' : 'ddd DD'

    return (

      <Grid className={cls} item xs={12}>

        <Typography variant="title">
          <Moment format={fmt}>{this.props.date}</Moment>
        </Typography>
        <List className={styles.list}>
          {this.renderMatches()}
        </List>

      </Grid>
    )
  }
}

export default Day

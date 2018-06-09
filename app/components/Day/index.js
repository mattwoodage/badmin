import React, { Component } from 'react'
import Moment from 'react-moment'
import Match from '../Match'

import overrides from './Day.scss'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';


const styles = theme => ({
  list: {
    padding: 2
  }
});

class Day extends Component {

  renderMatches () {
    if (!this.props.matches) return ''
    return this.props.matches.map(match => {
      return (<Match cal key={match.key} match={match} />)
    })
  }

  render () {
    const { classes } = this.props;
    return (

      <Grid className={overrides.day} item xs={12} sm={2}>
        <div>
          <Typography variant="title">
            <Moment format="DD">{this.props.date}</Moment>
          </Typography>
          <List className={overrides.list}>
            {this.renderMatches()}
          </List>
        </div>
      </Grid>
    )
  }
}

export default withStyles(styles)(Day)

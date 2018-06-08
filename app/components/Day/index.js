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
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

class Day extends Component {

  renderMatches () {
    if (!this.props.matches) return ''
    return this.props.matches.map(match => {
      return (<Match key={match.key} match={match} />)
    })
  }

  render () {
    const { classes } = this.props;
    return (

      <Grid className={overrides.day} item xs={12} sm={2}>
        <Paper className={classes.paper}>
          <Typography variant="title">
            <Moment format="dd">{this.props.day}</Moment>
          </Typography>
          <Typography variant="subheading">
            <Moment format="DD MMM">{this.props.day}</Moment>
          </Typography>
          <List>
            {this.renderMatches()}
          </List>
        </Paper>
      </Grid>
    )
  }
}

export default withStyles(styles)(Day)

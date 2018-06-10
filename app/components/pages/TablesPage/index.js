import React, { Component } from 'react'

import Division from '../../Division'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

class Page extends Component {

  state = {
    loaded: false
  }

  initialise () {
    const { league, season } = this.props
    if (this.state.loaded || !league || !season) return

    DB.get(`/api/${season.period}/divisions`)
      .then(response => {
        this.setState({
          divisions: response.divisions,
          loaded: true
        })
      })
  }

  renderTables () {
    const { classes } = this.props;
    return (
      <List>
      {
        this.state.divisions && this.state.divisions.map(division => {
          return (
            <Division key={division.key} division={division} />
          )
        })
      }
      </List>
    )
  }

  render () {
    const { classes } = this.props;
    this.initialise()
    return (
      <div>
        <Typography variant="display3" gutterBottom>TABLES</Typography>
        {this.renderTables()}
      </div>
    )
  }
}

class TablesPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default withStyles()(TablesPage)


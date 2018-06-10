import React, { Component } from 'react'

import DivisionGrid from '../../DivisionGrid'
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
      .then(divisionsResponse => {
        DB.get(`/api/${season.period}/matches`)
          .then(matchesResponse => {
            this.setState({
              divisions: divisionsResponse.divisions,
              matches: matchesResponse.matches,
              loaded: true
            })
          })
      })
  }

  matchesInDivision (division) {
    return this.state.matches.filter(m => {
      return m.division._id === division._id
    })
  }

  renderGrids () {
    const { classes } = this.props;

    return (
      <List>
      {
        this.state.divisions && this.state.divisions.map(division => {
          return (
            <DivisionGrid key={division.key} matches={this.matchesInDivision(division)} division={division} />
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
        <Typography variant="display3" gutterBottom>GRIDS</Typography>
        {this.renderGrids()}
      </div>
    )
  }
}

class GridsPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default withStyles()(GridsPage)


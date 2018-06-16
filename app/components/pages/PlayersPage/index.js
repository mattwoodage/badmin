import React, { Component } from 'react'

import Player from '../../Player'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'

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

    DB.get(`/api/${season.period}/players`)
      .then(response => {
        this.setState({
          players: response.players,
          loaded: true
        })
      })
  }

  renderList () {
    const { classes } = this.props;
    return (
      <List>
      {
        this.state.players && this.state.players.map(player => {
          return (
            <Player key={player.key} player={player} />
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
      <Panel>
        <Typography variant="display3" gutterBottom>PLAYERS</Typography>
        <Grid container spacing={8}>
        {this.renderList()}
        </Grid>
      </Panel>
    )
  }
}

class PlayersPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default withStyles()(PlayersPage)


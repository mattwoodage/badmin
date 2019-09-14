import React, { Component } from 'react'
import Club from '../../Club'

import { withStyles } from '@material-ui/core/styles';

import { NavLink } from 'react-router-dom'

import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';
import Panel from '../../Panel'
import Notification from '../../Notification'
import Breadcrumb from '../../Breadcrumb'

import ClubForm from '../../ClubForm'
import TeamForm from '../../TeamForm'

import Button from '@material-ui/core/Button';

import DateTimePicker from 'material-ui-pickers/DateTimePicker';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@material-ui/core/Typography';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'


const materialStyles = theme => ({
  paper: {
    padding: 30,
    color: theme.palette.text.secondary
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

class Page extends Component {

  state = {
    loaded: false,
    error: false,
    venues: [],
    club: {},
    teams: []
  }

  componentDidMount () {
    console.log('init')
    const { season, match } = this.props

    console.log(this.state.loaded,this.props)

    if (this.state.loaded || !season) return
    this.moment = extendMoment(Moment)

    const clubID = match.params.club

    DB.get(`/api/${season.period}/venues`)
      .then(response => {
        if (response.venues) {
          this.setState({
            venues: response.venues
          })
        }
      })

    DB.get(`/api/${season.period}/club/${clubID}`)
      .then(response => {
        if (response.club) {
          this.setState({
            club: response.club,
            teams: response.teams,
            loaded: true
          })
        }
        else {
          this.setState({
            error: true,
            loaded: true
          })
        }
        this.props.stopLoad()
      })
  }

  render () {

    console.log('render....', this.state.loaded, this.state.error)

    const { club, venues } = this.state;
    const { classes, season } = this.props

    if (this.state.error) return <Panel><Notification text='Club not found' /></Panel>

    if (!this.state.loaded) return <Panel>Loading...</Panel>

    

    return (
      <Panel>
        
        <Breadcrumb>
          <NavLink to={'../clubs'} >Clubs</NavLink>
          <b>{club.name}</b>
        </Breadcrumb>

        <Paper className={classes.paper}>
          <ClubForm season={season} club={club} venues={venues} />
        </Paper>

        <h1>teams this season</h1>

        {this.state.teams.map(team => (
          <Paper className={classes.paper}>
            <TeamForm season={season} team={team} />
          </Paper>
        ))}
      </Panel>
    )
  }
}

class ClubPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default withStyles(materialStyles)(ClubPage)


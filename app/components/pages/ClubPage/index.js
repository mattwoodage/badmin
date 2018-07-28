import React, { Component } from 'react'
import Club from '../../Club'

import { withStyles } from '@material-ui/core/styles';


import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';
import Panel from '../../Panel'
import Notification from '../../Notification'

import styles from './Club.scss'

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
    submitting: false,
    status: 0
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const { season } = this.props

    const _this = this

    this.setState({ submitting: true, status: 0 });

    fetch(`/api/${season.period}/club`,
    {
        method: "POST",
        body: JSON.stringify( this.state.club ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })
    .then(function(res) {
      _this.setState({ submitting: false, status: 1 });
    })
    .catch(function(err) {
      _this.setState({ submitting: false, status: -1 });
    })

    return false
  }

  handleDateChange = (field, date) => {
    console.log(field, date)
    this.state.club[field] = date.toDate()
    this.setState({ club: this.state.club });
  }

  handleChange = (field, event) => {
    console.log(field, event)
    this.state.club[field] = event.target.value
    this.setState({ club: this.state.club });
  }

  initialise () {
    console.log('init')
    const { season, match } = this.props
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
    this.initialise()

    const { selectedDate } = this.state;
    const { classes } = this.props

    if (this.state.error) return <Panel><Notification text='Club not found' /></Panel>

    if (!this.state.loaded) return <Panel>Loading...</Panel>

    console.log(':::::',this.state.club.name)
    return (
      <Panel>
        
        <Typography variant="display1" gutterBottom>{this.state.club.name}</Typography>


        <Paper className={classes.paper}>

          <form onSubmit={this.handleSubmit}>
          
            <Grid container spacing={8}>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="Club Name"
                  onChange={(evt) => this.handleChange('name', evt)}
                  value={this.state.club.name}
                  margin="normal"
                  fullWidth
                />

                <TextField
                  id="textarea"
                  label="Message"
                  multiline
                  onChange={(evt) => this.handleChange('message', evt)}
                  value={this.state.club.message}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="Short"
                  onChange={(evt) => this.handleChange('short', evt)}
                  value={this.state.club.short}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Email"
                  onChange={(evt) => this.handleChange('email', evt)}
                  value={this.state.club.email}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Website"
                  onChange={(evt) => this.handleChange('website', evt)}
                  value={this.state.club.website}
                  margin="normal"
                  fullWidth
                />
              </Grid>




              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Club Night Venue"
                  value={this.state.club.clubnightVenue}
                  onChange={(evt) => this.handleChange('clubnightVenue', evt)}
                  margin="normal"
                  fullWidth
                  SelectProps={{
                    native: true
                  }}
                >
                  <option key='-1' value=''></option>
                  {this.state.venues.map(venue => (
                    <option key={venue._id} value={venue._id}>
                      {venue.name}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  autoOk
                  value={this.state.club.clubnightStartAt}
                  onChange={(date) => this.handleDateChange('clubnightStartAt', date)}
                  label="Club Night Date/Time"
                  margin="normal"
                  fullWidth
                />
              </Grid>


              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Alternative Club Night Venue"
                  value={this.state.club.clubnightAltVenue}
                  onChange={(evt) => this.handleChange('clubnightAltVenue', evt)}
                  margin="normal"
                  fullWidth
                  SelectProps={{
                    native: true
                  }}
                >
                  <option key='-1' value=''></option>
                  {this.state.venues.map(venue => (
                    <option key={venue._id} value={venue._id}>
                      {venue.name}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  autoOk
                  value={this.state.club.clubnightAltStartAt}
                  onChange={(date) => this.handleDateChange('clubnightAltStartAt', date)}
                  label="Club Night Alternative Date/Time"
                  margin="normal"
                  fullWidth
                />
              </Grid>



              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Match Night Venue"
                  value={this.state.club.matchVenue}
                  onChange={(evt) => this.handleChange('matchVenue', evt)}
                  margin="normal"
                  SelectProps={{
                    native: true
                  }}
                  fullWidth
                >
                  <option key='-1' value=''></option>
                  {this.state.venues.map(venue => (
                    <option key={venue._id} value={venue._id}>
                      {venue.name}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  autoOk
                  value={this.state.club.matchStartAt}
                  onChange={(date) => this.handleDateChange('matchStartAt', date)}
                  label="Match Night Date/Time"
                  margin="normal"
                  fullWidth
                />
              </Grid>


              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Alternative Match Night Venue"
                  value={this.state.club.matchAltVenue}
                  onChange={(evt) => this.handleChange('matchAltVenue', evt)}
                  margin="normal"
                  SelectProps={{
                    native: true
                  }}
                  fullWidth
                >
                  <option key='-1' value=''></option>
                  {this.state.venues.map(venue => (
                    <option key={venue._id} selected={this.state.club.matchAltVenue === venue._id} value={venue._id}>
                      {venue.name}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  autoOk
                  value={this.state.club.matchnightAltStartAt}
                  onChange={(date) => this.handleDateChange('matchnightAltStartAt', date)}
                  label="Match Night Alternative Date/Time"
                  margin="normal"
                  fullWidth
                />
              </Grid>

            </Grid>


            <Button disabled={ this.state.submitting } type="submit" variant="contained" color="primary">Save</Button>
            { this.state.submitting && <CircularProgress /> }

          </form>
        </Paper>

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


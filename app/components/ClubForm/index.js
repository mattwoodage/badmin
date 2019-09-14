import React, { Component } from 'react'
import Club from '../Club'

import { withStyles } from '@material-ui/core/styles';

import { NavLink } from 'react-router-dom'

import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';

import Button from '@material-ui/core/Button';

import DateTimePicker from 'material-ui-pickers/DateTimePicker';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@material-ui/core/Typography';

import DB from '../../helpers/DB'

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

class ClubForm extends Component {

  static getDerivedStateFromProps(props, state) {
    return {
      club: props.club,
      submitting: false,
      status: 0
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const { season, club } = this.props

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
    console.error('THIS IS WRONG')
    this.state.club[field] = event.target.value
    this.setState({ club: this.state.club });
  }



  render () {

    const { club, submitting } = this.state
    const { venues } = this.props

    console.log(':::::',club.name)
    console.log(venues)


    return (
      <form onSubmit={this.handleSubmit}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              label="Club Name"
              onChange={(evt) => this.handleChange('name', evt)}
              value={club.name}
              margin="normal"
              fullWidth
            />

            <TextField
              id="textarea"
              label="Message"
              multiline
              onChange={(evt) => this.handleChange('message', evt)}
              value={club.message}
              margin="normal"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              label="Short"
              onChange={(evt) => this.handleChange('short', evt)}
              value={club.short}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Email"
              onChange={(evt) => this.handleChange('email', evt)}
              value={club.email}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Website"
              onChange={(evt) => this.handleChange('website', evt)}
              value={club.website}
              margin="normal"
              fullWidth
            />
          </Grid>




          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Club Night Venue"
              value={club.clubnightVenue}
              onChange={(evt) => this.handleChange('clubnightVenue', evt)}
              margin="normal"
              fullWidth
              SelectProps={{
                native: true
              }}
            >
              <option key='-1' value=''></option>
              {venues.map(venue => (
                <option key={venue._id} value={venue._id}>
                  {venue.name}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              autoOk
              value={club.clubnightStartAt}
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
              value={club.clubnightAltVenue}
              onChange={(evt) => this.handleChange('clubnightAltVenue', evt)}
              margin="normal"
              fullWidth
              SelectProps={{
                native: true
              }}
            >
              <option key='-1' value=''></option>
              {venues.map(venue => (
                <option key={venue._id} value={venue._id}>
                  {venue.name}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              autoOk
              value={club.clubnightAltStartAt}
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
              value={club.matchVenue}
              onChange={(evt) => this.handleChange('matchVenue', evt)}
              margin="normal"
              SelectProps={{
                native: true
              }}
              fullWidth
            >
              <option key='-1' value=''></option>
              {venues.map(venue => (
                <option key={venue._id} value={venue._id}>
                  {venue.name}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              autoOk
              value={club.matchStartAt}
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
              value={club.matchAltVenue}
              onChange={(evt) => this.handleChange('matchAltVenue', evt)}
              margin="normal"
              SelectProps={{
                native: true
              }}
              fullWidth
            >
              <option key='-1' value=''></option>
              {venues.map(venue => (
                <option key={venue._id} selected={club.matchAltVenue === venue._id} value={venue._id}>
                  {venue.name}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              autoOk
              value={club.matchnightAltStartAt}
              onChange={(date) => this.handleDateChange('matchnightAltStartAt', date)}
              label="Match Night Alternative Date/Time"
              margin="normal"
              fullWidth
            />
          </Grid>
        </Grid>

        <Button disabled={ submitting } type="submit" variant="contained" color="primary">Save</Button>
        { submitting && <CircularProgress /> }

      </form>
        
    )
  }
}

export default withStyles(materialStyles)(ClubForm)


import React, { Component } from 'react'
import Club from '../Club'

import { NavLink } from 'react-router-dom'

import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';

import { Container, Row, Col } from 'react-grid-system';

//import DateTimePicker from 'material-ui-pickers/DateTimePicker';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import DB from '../../helpers/DB'


class ClubForm extends Component {

  constructor () {
    super()
    this.state = {
      club: {},
      submitting: false,
      status: 0
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      club: props.club || {},
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

    return (
      <form onSubmit={this.handleSubmit}>
        <Container>
          <Row>
            <Col md={6}>
              <TextField
                required
                label="Club Name"
                onChange={(evt) => this.handleChange('name', evt)}
                value={club.name}
                margin="normal"
                fullWidth
              />
            </Col>
            <Col md={6}>
              <TextField
                id="textarea"
                label="Message"
                multiline
                onChange={(evt) => this.handleChange('message', evt)}
                value={club.message}
                margin="normal"
                fullWidth
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <TextField
                required
                label="Short"
                onChange={(evt) => this.handleChange('short', evt)}
                value={club.short}
                margin="normal"
                fullWidth
              />
            </Col>
            <Col md={6}>
              <TextField
                label="Email"
                onChange={(evt) => this.handleChange('email', evt)}
                value={club.email}
                margin="normal"
                fullWidth
              />
            </Col>
            <Col md={6}>
              <TextField
                label="Website"
                onChange={(evt) => this.handleChange('website', evt)}
                value={club.website}
                margin="normal"
                fullWidth
              />
            </Col>
          </Row>




          <Row>
            <Col>
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
            </Col>
            <Col>
              <TextField
                autoOk
                value={club.clubnightStartAt}
                onChange={(date) => this.handleDateChange('clubnightStartAt', date)}
                label="Club Night Date/Time"
                margin="normal"
                fullWidth
              />
            </Col>
          </Row>


          <Row>
            <Col>
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
            </Col>
            <Col>
              <TextField
                autoOk
                value={club.clubnightAltStartAt}
                onChange={(date) => this.handleDateChange('clubnightAltStartAt', date)}
                label="Club Night Alternative Date/Time"
                margin="normal"
                fullWidth
              />
            </Col>
          </Row>



          <Row>
            <Col>
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
            </Col>
            <Col>
              <TextField
                autoOk
                value={club.matchStartAt}
                onChange={(date) => this.handleDateChange('matchStartAt', date)}
                label="Match Night Date/Time"
                margin="normal"
                fullWidth
              />
            </Col>
          </Row>

          <Row>
            <Col>
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
            </Col>
          
            <Col>
            <TextField
              autoOk
              value={club.matchAltStartAt}
              onChange={(date) => this.handleDateChange('matchAltStartAt', date)}
              label="Match Alternative Date/Time"
              margin="normal"
              fullWidth
            />
            </Col>
          </Row>
        </Container>

        <div className='right'>
          <button className='button' disabled={ submitting } type="submit" >Save</button>
        </div>

      </form>
        
    )
  }
}

export default ClubForm


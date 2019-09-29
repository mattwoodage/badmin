import React, { useState, useContext } from 'react'
import Club from '../Club'

import { NavLink } from 'react-router-dom'

import DatePicker from "react-datepicker";

import { LeagueContext } from '../Root'


import to from 'await-to-js'

import { Container, Row, Col } from 'react-grid-system';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import DB from '../../helpers/DB'


function ClubForm({originalClub, venues}) {

  const leagueContext = useContext(LeagueContext)
  const { season } = leagueContext

  const [club, setClub] = useState(originalClub)
  const [error, setError] = useState({})
  const [saving, setSaving] = useState(false)

  const defaultDate = new Date().toString()

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    setSaving(true)
    const [ err, response ] = await to(
      fetch(`/api/${season.period}/club`,
      {
        method: "POST",
        body: JSON.stringify( club ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    )
    setSaving(false)
    if (err) return setError(err)

    const json = await response.json()
    return setClub(json.club)
  }

  const handleDateChange = (field, val) => {
    const newClub = Object.assign({}, club)
    newClub[field] = val
    setClub(newClub)
  }

  const handleChange = (field, event) => {
    const newClub = Object.assign({}, club)
    newClub[field] = event.target.value
    setClub(newClub)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md={6}>
            <TextField
              required
              label="Club Name"
              onChange={(evt) => handleChange('name', evt)}
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
              onChange={(evt) => handleChange('message', evt)}
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
              onChange={(evt) => handleChange('short', evt)}
              value={club.short}
              margin="normal"
              fullWidth
            />
          </Col>
          <Col md={6}>
            <TextField
              label="Email"
              onChange={(evt) => handleChange('email', evt)}
              value={club.email}
              margin="normal"
              fullWidth
            />
          </Col>
          <Col md={6}>
            <TextField
              label="Website"
              onChange={(evt) => handleChange('website', evt)}
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
              onChange={(evt) => handleChange('clubnightVenue', evt)}
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

            <DatePicker
              selected={new Date(club.clubnightStartAt || defaultDate)}
              onChange={date => handleDateChange('clubnightStartAt', date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              timeCaption="time"
              dateFormat="MMMM d, yyyy HH:mm"
            />

          </Col>
        </Row>
        <Row>
          <Col>
            <TextField
              select
              label="Alternative Club Night Venue"
              value={club.clubnightAltVenue}
              onChange={(evt) => handleChange('clubnightAltVenue', evt)}
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
            <DatePicker
              selected={new Date(club.clubnightAltStartAt || defaultDate)}
              onChange={date => handleDateChange('clubnightAltStartAt', date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              timeCaption="time"
              dateFormat="MMMM d, yyyy HH:mm"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TextField
              select
              label="Match Night Venue"
              value={club.matchVenue}
              onChange={(evt) => handleChange('matchVenue', evt)}
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
            <DatePicker
              selected={new Date(club.matchStartAt || defaultDate)}
              onChange={date => handleDateChange('matchStartAt', date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              timeCaption="time"
              dateFormat="MMMM d, yyyy HH:mm"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TextField
              select
              label="Alternative Match Night Venue"
              value={club.matchAltVenue}
              onChange={(evt) => handleChange('matchAltVenue', evt)}
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
          <DatePicker
              selected={new Date(club.matchAltStartAt || defaultDate)}
              onChange={date => handleDateChange('matchAltStartAt', date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              timeCaption="time"
              dateFormat="MMMM d, yyyy HH:mm"
            />
          </Col>
        </Row>
      </Container>

      <div className='right'>
        <button className='button' disabled={ saving } type="submit" >Save</button>
      </div>

    </form>
  )
}

export default ClubForm


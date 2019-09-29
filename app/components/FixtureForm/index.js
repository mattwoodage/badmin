import React, { useState, useContext } from 'react'

import Panel from '../Panel'

import DivisionBlob from '../DivisionBlob'

import to from 'await-to-js'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { NavLink } from 'react-router-dom'

import { format } from 'date-fns'

import { LeagueContext } from '../Root'

import TextField from '@material-ui/core/TextField';

import { Container, Row, Col } from 'react-grid-system';
// import { setConfiguration } from 'react-grid-system';
// setConfiguration({ gutterWidth: 5 });

import DB from '../../helpers/DB'

function FixtureForm({venues, existingMatch, division, homeTeam, awayTeam}) {

  // move this somewhere else
  let defaultVenue = {}
  let homeClub = {}
  venues.forEach(v => {
    const ids = v.clubs.forEach(c => {
      if (c._id === homeTeam.club) {
        defaultVenue = v
        homeClub = c
      }
    })
  })

  const leagueContext = useContext(LeagueContext)
  const { season } = leagueContext

  let defaultStartAt = new Date()

  if (homeClub.matchStartAt) {
    defaultStartAt = new Date(`1 Sep ${season.startYear} ${format(new Date(homeClub.matchStartAt), 'HH:mm')}`)
  }
  else {
    defaultStartAt = new Date(`1 Sep ${season.startYear} 20:00`)
  }

  const defaultMatch = existingMatch || {
    label: homeTeam.labelClub.toUpperCase() + ' v ' + awayTeam.labelClub.toUpperCase(),
    division: division._id,
    homeTeam: homeTeam._id,
    awayTeam: awayTeam._id,
    startAt: defaultStartAt,
    numCourts: 1,
    venue: defaultVenue._id
  }

  const [match, setMatch] = useState(defaultMatch)
  const [error, setError] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    
    setSaving(true)

    const [ err, response ] = await to(
      fetch(`/api/${season.period}/match`,
      {
        method: "POST",
        body: JSON.stringify( match ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    )
    setSaving(false)
    if (err) return setError(err)
    const json = await response.json()
    return setMatch(json.match)
  }

  const handleDateChange = (field, val) => {
    const newMatch = Object.assign({}, match)
    newMatch[field] = val
    setMatch(newMatch)
  }

  const handleChange = (field, event) => {
    const newMatch = Object.assign({}, match)
    newMatch[field] = event.target.value
    setMatch(newMatch)
  }

  return (
    <Panel high marginBottom>
      <h2><DivisionBlob division={division} /> {match.label}</h2>
      <form onSubmit={(evt) => handleSubmit(evt)}>
        <Container>
          <Row>
            <Col md={5}>
              <TextField
                select
                label="Number of courts at start"
                value={match.numCourts}
                onChange={(evt) => handleChange('numCourts', evt)}
                margin="normal"
                fullWidth
                SelectProps={{
                  native: true
                }}
              >
                <option key='0'></option>
                <option key='1' value={1}>1</option>
                <option key='2' value={2}>2</option>
                <option key='3' value={3}>3</option>
              </TextField>
            </Col>
            <Col md={7}>
              <TextField
                select
                label="Venue"
                value={match.venue}
                onChange={(evt) => handleChange('venue', evt)}
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
          </Row>
          <Row>
            <Col md={12}>

              <TextField
                autoOk
                value={format(new Date(match.startAt), 'EEE d MMM yyyy HH:mm')}
                label="Date / time"
                margin="normal"
                fullWidth
              />

              <DatePicker
                selected={new Date(match.startAt)}
                onChange={date => handleDateChange('startAt', date)}
                showTimeSelect
                inline
                minDate={new Date("1 Sep " + season.startYear)}
                maxDate={new Date("1 Jun " + (season.startYear+1))}
                timeFormat="HH:mm"
                timeIntervals={5}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </Col>
          </Row>

        </Container>
        <div className='right'>
          <button className='button' disabled={ saving } type="submit" >{ existingMatch ? 'SAVE' : 'CREATE' }</button>
        </div>
      </form>
    </Panel>
  )

}

export default FixtureForm


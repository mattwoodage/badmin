import React, { useState, useContext } from 'react'
import Club from '../Club'
import Panel from '../Panel'

import { NavLink } from 'react-router-dom'

import TextField from '@material-ui/core/TextField';

import { Container, Row, Col } from 'react-grid-system';
import to from 'await-to-js'
import DB from '../../helpers/DB'


function TeamForm({originalTeam}) {

  const leagueContext = useContext(LeagueContext)
  const { season } = leagueContext

  const [team, setTeam] = useState(originalTeam)
  const [error, setError] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    setSaving(true)
    const [ err, response ] = await to(
      fetch(`/api/${season.period}/team`,
      {
        method: "POST",
        body: JSON.stringify( team ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    )
    setSaving(false)
    if (err) return setError(err)

    const json = await response.json()
    return setTeam(json.team)
  }

  const handleChange = (field, event) => {
    const newTeam = Object.assign({}, team)
    newTeam[field] = event.target.value
    setTeam(newTeam)
  }

  
  const btnLabel = team._id ? 'Save changes' : 'Create new' 
  const panelProps = team._id ? {high:true} : {create:true}

  return (
    <Panel {...panelProps} marginBottom>
      <form onSubmit={handleSubmit}>
        <Container>
          <Row>
            <Col md={6}>
              <TextField
                select
                label="Division"
                value={team.division}
                onChange={(evt) => handleChange('division', evt)}
                margin="normal"
                fullWidth
                SelectProps={{
                  native: true
                }}
              >
                <option key='-1' value=''></option>
                {divisions.map(division => (
                  <option key={division._id} value={division._id}>
                    {division.labelLocal}
                  </option>
                ))}
              </TextField>
            </Col>
            <Col md={6}>
              <TextField
                label="Prefix"
                onChange={(evt) => handleChange('prefix', evt)}
                value={team.prefix}
                margin="normal"
                fullWidth
              />
            </Col>
          </Row>

        </Container>

        <div className='right'>
          <button className='button' disabled={ submitting } type="submit" >{btnLabel}</button>
        </div>

      </form>
    </Panel>
  )
}

export default TeamForm


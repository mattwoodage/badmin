import React, { Component } from 'react'
import Club from '../Club'
import Panel from '../Panel'
import to from 'await-to-js'

import { NavLink } from 'react-router-dom'

import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import { Container, Row, Col } from 'react-grid-system';

import DB from '../../helpers/DB'

class SeasonForm extends Component {

  constructor (props) {
    super()
    this.state = {
      season: props.season,
      submitting: false,
      status: 0
    }
  }

  handleSubmit = async (evt) => {
    evt.preventDefault()
    const { season } = this.state

    this.setState({ submitting: true, status: 0 });

    const [ err, response ] = await to(
      fetch('/api/season',
      {
        method: "POST",
        body: JSON.stringify( season ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    )

    const json = await response.json()

    if (err) return this.setState({ submitting: false, status: -1 });
    else return this.setState({ season: json.season, submitting: false, status: 1 });

  }

  handleChange = (field, event) => {
    const newSeason = this.state.season
    newSeason[field] = event.target.value
    this.setState({ season: newSeason });
  }

  render () {

    const { season, submitting } = this.state

    let btnLabel = season._id ? 'Save changes' : 'Create new' 
    if (submitting) btnLabel = 'Saving...'

    const props = season._id ? {high:true} : {create:true}

    return (
      <Panel {...props} marginBottom>
        <form onSubmit={this.handleSubmit}>
          <h1>{season.period}</h1>
          <Container>
            <Row>
              <Col md={6}>
                <TextField
                  label="Start Year"
                  onChange={(evt) => this.handleChange('startYear', evt)}
                  value={season.startYear}
                  margin="normal"
                  fullWidth
                />
              </Col>
              <Col md={6}>
                <TextField
                  select
                  label="Current?"
                  value={season.current}
                  onChange={(evt) => this.handleChange('current', evt)}
                  margin="normal"
                  fullWidth
                  SelectProps={{
                    native: true
                  }}
                > 
                  <option key='0' ></option>
                  <option key='1' value={true}>Yes</option>
                  <option key='2' value={false}>No</option>
                </TextField>
              </Col>
            </Row>

          </Container>

          <div class='right'>
            <a class='button' href={`../${season.period}/divisions`}>VIEW DIVISIONS</a>
            &nbsp;&nbsp;&nbsp;
            <button className='button' disabled={ submitting } type="submit" >{btnLabel}</button>
          </div>

        </form>
      </Panel>
    )
  }
}

export default SeasonForm


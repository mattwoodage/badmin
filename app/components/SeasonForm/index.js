import React, { Component } from 'react'
import Club from '../Club'
import Panel from '../Panel'

import { NavLink } from 'react-router-dom'

import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';

import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import { Container, Row, Col } from 'react-grid-system';

import DB from '../../helpers/DB'

class SeasonForm extends Component {

  constructor () {
    super()
    this.state = {
      season: {},
      submitting: false,
      status: 0
    }
  }

  static getDerivedStateFromProps(props, state) {

    const seasonForState = props.season

    return {
      season: seasonForState,
      submitting: false,
      status: 0
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const { season } = this.props

    const _this = this

    this.setState({ submitting: true, status: 0 });

    fetch(`/api/season`,
    {
        method: "POST",
        body: JSON.stringify( this.state.season ),
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

  handleChange = (field, event) => {
    console.log(field, event)
    const newSeason = this.state.season
    newSeason[field] = event.target.value
    this.setState({ season: newSeason });
  }

  render () {

    const { season, submitting } = this.state

    const btnLabel = season._id ? 'Save changes' : 'Create new' 
    
    const props = season._id ? {high:true} : {create:true}

    return (
      <Panel {...props} marginBottom>
        <form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col md={4}>
                <TextField
                  label="Period"
                  onChange={(evt) => this.handleChange('period', evt)}
                  value={season.period}
                  margin="normal"
                  fullWidth
                />
              </Col>
              <Col md={4}>
                <TextField
                  label="Start Year"
                  onChange={(evt) => this.handleChange('startYear', evt)}
                  value={season.startYear}
                  margin="normal"
                  fullWidth
                />
              </Col>
              <Col md={4}>
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
                  <option key='1' value={true}>Yes</option>
                  <option key='2' value={false}>No</option>
                </TextField>
              </Col>
            </Row>

          </Container>

          <Button disabled={ submitting } type="submit" variant="contained" color="primary">{btnLabel}</Button>

          <a class='button' href={`../${season.period}/divisions`}>DIVISIONS</a>
        </form>
      </Panel>
    )
  }
}

export default SeasonForm


import React, { Component } from 'react'
import Club from '../Club'
import Panel from '../Panel'

import { NavLink } from 'react-router-dom'

import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';

import TextField from '@material-ui/core/TextField';

import { Container, Row, Col } from 'react-grid-system';

import DB from '../../helpers/DB'

class TeamForm extends Component {

  constructor () {
    super()
    this.state = {
      team: {},
      submitting: false,
      status: 0
    }
  }

  static getDerivedStateFromProps(props, state) {

    const teamForState = props.team
    //teamForState.division = teamForState.division._id
    return {
      team: teamForState,
      submitting: false,
      status: 0
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const _this = this

    this.setState({ submitting: true, status: 0 });

    fetch(`/api/team`,
    {
        method: "POST",
        body: JSON.stringify( this.state.team ),
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
    this.state.team[field] = date.toDate()
    this.setState({ team: this.state.team });
  }

  handleChange = (field, event) => {
    console.log(field, event)
    console.error('THIS IS WRONG')
    this.state.team[field] = event.target.value
    this.setState({ team: this.state.team });
  }



  render () {

    const { team, submitting } = this.state
    const { divisions } = this.props

    const btnLabel = team._id ? 'Save changes' : 'Create new' 
    
    const props = team._id ? {high:true} : {create:true}

    return (
      <Panel {...props} marginBottom>
        <form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col md={6}>
                <TextField
                  select
                  label="Division"
                  value={team.division}
                  onChange={(evt) => this.handleChange('division', evt)}
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
                  onChange={(evt) => this.handleChange('prefix', evt)}
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
}

export default TeamForm


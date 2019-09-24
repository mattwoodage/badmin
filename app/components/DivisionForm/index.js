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

class DivisionForm extends Component {

  constructor () {
    super()
    this.state = {
      division: {},
      submitting: false,
      status: 0
    }
  }

  static getDerivedStateFromProps(props, state) {

    let divisionForState = props.division
    return {
      division: divisionForState,
      submitting: false,
      status: 0
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    const { division } = this.state

    const _this = this

    this.setState({ submitting: true, status: 0 });

    fetch(`/api/division`,
    {
        method: "POST",
        body: JSON.stringify( division ),
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
    const newDivision = this.state.division
    newDivision[field] = event.target.value
    this.setState({ division: newDivision });
  }

  render () {

    const { division, submitting } = this.state

    const btnLabel = division._id ? 'Save changes' : 'Create new' 
    
    const props = division._id ? {high:true} : {create:true}

    return (
      <Panel {...props} marginBottom>
        <h2>{division.labelLocal}</h2>
        <form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col md={4}>
                <TextField
                  select
                  label="Category"
                  value={division.category}
                  onChange={(evt) => this.handleChange('category', evt)}
                  margin="normal"
                  fullWidth
                  SelectProps={{
                    native: true
                  }}
                >
                  <option key='1' value='Ladies'>Ladies</option>
                  <option key='2' value='Mens'>Mens</option>
                  <option key='3' value='Mixed'>Mixed</option>
                </TextField>
              </Col>
              <Col md={4}>
                <TextField
                  label="Position"
                  onChange={(evt) => this.handleChange('position', evt)}
                  value={division.position}
                  margin="normal"
                  fullWidth
                />
              </Col>
              <Col md={4}>
                <TextField
                  label="Alias"
                  onChange={(evt) => this.handleChange('alias', evt)}
                  value={division.alias}
                  margin="normal"
                  fullWidth
                />
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <TextField
                  select
                  label="Males"
                  value={division.males}
                  onChange={(evt) => this.handleChange('males', evt)}
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
              <Col md={4}>
                <TextField
                  select
                  label="Females"
                  value={division.females}
                  onChange={(evt) => this.handleChange('females', evt)}
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
              <Col md={4}>
                <TextField
                  label="category short"
                  onChange={(evt) => this.handleChange('categoryShort', evt)}
                  value={division.categoryShort}
                  margin="normal"
                  fullWidth
                />
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <TextField
                  
                  label="players per team"
                  value={division.numPlayers}
                  onChange={(evt) => this.handleChange('numPlayers', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  
                  label="players per side"
                  value={division.numPerSide}
                  onChange={(evt) => this.handleChange('numPerSide', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  label="number of rubbers"
                  onChange={(evt) => this.handleChange('numRubbers', evt)}
                  value={division.numRubbers}
                  margin="normal"
                  fullWidth
                />
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <TextField
                  
                  label="numGamesPerRubber"
                  value={division.numGamesPerRubber}
                  onChange={(evt) => this.handleChange('numGamesPerRubber', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  
                  label="number of matches"
                  value={division.numMatches}
                  onChange={(evt) => this.handleChange('numMatches', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  select
                  label="Can Draw?"
                  value={division.canDraw}
                  onChange={(evt) => this.handleChange('canDraw', evt)}
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

            <Row>
              <Col md={4}>
                <TextField
                  
                  label="points for a full team"
                  value={division.ptsFullTeam}
                  onChange={(evt) => this.handleChange('ptsFullTeam', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  
                  label="points to win by 2 rubbers"
                  value={division.ptsWinBy2}
                  onChange={(evt) => this.handleChange('ptsWinBy2', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  
                  label="points to win by 1 rubber"
                  value={division.ptsWinBy1}
                  onChange={(evt) => this.handleChange('ptsWinBy1', evt)}
                  margin="normal"
                  fullWidth
                />
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <TextField
                  
                  label="points for a draw"
                  value={division.ptsDraw}
                  onChange={(evt) => this.handleChange('ptsDraw', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  
                  label="points to lose by 2 rubbers"
                  value={division.ptsLoseBy2}
                  onChange={(evt) => this.handleChange('ptsLoseBy2', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
              <Col md={4}>
                <TextField
                  label="points to lose by 1 rubber"
                  value={division.ptsLoseBy1}
                  onChange={(evt) => this.handleChange('ptsLoseBy1', evt)}
                  margin="normal"
                  fullWidth
                />
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <TextField
                  
                  label="Order of Play"
                  value={division.orderOfPlay}
                  onChange={(evt) => this.handleChange('orderOfPlay', evt)}
                  margin="normal"
                  fullWidth
                  
                />
              </Col>
            </Row>
          </Container>

          <Button disabled={ submitting } type="submit" variant="contained" color="primary">{btnLabel}</Button>

        </form>
      </Panel>
    )
  }
}

export default DivisionForm


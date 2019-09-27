import React, { Component } from 'react'

import { NavLink } from 'react-router-dom'

import Moment from 'react-moment'
import { Container, Row, Col } from 'react-grid-system';

import TeamBlob from '../TeamBlob'
import Panel from '../Panel'

import styles from './Club.scss'

class Club extends Component {
  
  clubTeams = () => {
    const { club } = this.props
    const teams = club.teams.sort((a,b) => {
      return (a.labelDivision > b.labelDivision ? 1 : -1)
    })
    return teams.map(team => {
      return <TeamBlob key={team.key} club={club} team={team} />
    })
  }

  render () {

    const { club, onSelect } = this.props

    return (
      <Panel high marginBottom>
        <Container className='club'>
          <Row>
            <Col md={9}>
              <h1>{club.name}</h1>
            </Col>

            <Col md={3}>
              <NavLink onClick={onSelect} className='button' to={`./club/${club._id}`} >EDIT
              </NavLink>
              <NavLink onClick={onSelect} className='button' to={`./club/${club._id}/members`} >MEMBERS
              </NavLink>
            </Col>
          </Row>

            {club.clubnightVenue &&
              (<Row>
                <Col md={3}>
                  club nights:
                </Col>
                <Col md={9}>
                  {club.clubnightVenue.name}
                  {club.clubnightStartAt && <Moment format=" dddd[s] [from] HH:mm">{club.clubnightStartAt}</Moment>}
                </Col>
              </Row>
              )
            }

            {club.clubnightAltVenue &&
              (<Row>
                <Col md={3}>
                </Col>
                <Col md={9}>
                  {club.clubnightAltVenue.name}
                  {club.clubnightAltStartAt && <Moment format=" dddd[s] [from] HH:mm">{club.clubnightAltStartAt}</Moment>}
                </Col>
               </Row>
              )
            }

            {club.matchVenue &&
              (<Row>
                <Col md={3}>
                  match nights:
                </Col>
                <Col md={9}>
                  {club.matchVenue.name}
                  {club.matchStartAt && <Moment format=" dddd[s] [from] HH:mm">{club.matchStartAt}</Moment>}
                </Col>
              </Row>
              )
            }

            {club.matchAltVenue &&
              (<Row>
                <Col md={3}>
                </Col>
                <Col md={9}>
                  {club.matchAltVenue.name}
                  {club.matchAltStartAt && <Moment format=" dddd[s] [from] HH:mm">{club.matchAltStartAt}</Moment>}
                </Col>
               </Row>
              )
            }
            <Row>
              <Col md={3}>
                teams this season:
              </Col>
              <Col md={9}>
                {this.clubTeams()}
              </Col>
            </Row>
        </Container> 
      </Panel>
    )
  }
}

export default Club

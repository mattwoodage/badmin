import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import Club from '../../Club'

import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';

import { Container, Row, Col } from 'react-grid-system';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'


class Page extends Component {

  state = {
    loaded: false
  }

  initialise () {
    const { league, season } = this.props
    if (this.state.loaded || !league || !season) return

    this.props.startLoad()

    DB.get(`/api/${season.period}/clubs`)
      .then(response => {
        this.setState({
          clubs: response.clubs,
          loaded: true
        })
        this.props.stopLoad()
      })
  }

  componentDidMount () {
    this.initialise()
  }

  renderList () {
    return (
      <div>
      {
        this.state.clubs && this.state.clubs.map(club => {
          return (
            <Club key={club.key} club={club} />
          )
        })
      }
      </div>
    )
  }

  render () {
    return (
      <div>
        <h1>CLUBS</h1>
        <NavLink to="./club/new">CREATE NEW CLUB</NavLink>
        {this.renderList()}
      </div>
    )
  }
}

class ClubsPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default ClubsPage


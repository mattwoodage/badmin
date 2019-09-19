import React, { Component } from 'react'

import DivisionGrid from '../../DivisionGrid'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

class Page extends Component {

  state = {
    loaded: false,
    loading: false
  }

  initialise () {

    const { league, season } = this.props
    if (!league || !season) return

    this.setState({
      loading: true
    })

    DB.get(`/api/${season.period}/divisions`)
      .then(divisionsResponse => {
        DB.get(`/api/${season.period}/matches`)
          .then(matchesResponse => {
            this.setState({
              divisions: divisionsResponse.divisions,
              matches: matchesResponse.matches,
              loaded: true
            })
          })
      })
  }

  matchesInDivision (division) {
    return this.state.matches.filter(m => {
      return m.division._id === division._id
    })
  }

  renderGrids () {
    return (
      <div>
      {
        this.state.divisions && this.state.divisions.map(division => {
          return (
            <DivisionGrid key={division.key} matches={this.matchesInDivision(division)} division={division} />
          )
        })
      }
      </div>
    )
  }

  componentDidMount () {
    if (!this.state.loading) this.initialise()
  }

  componentDidUpdate () {
    if (!this.state.loading) this.initialise()
  }

  render () {
    return (
      <div>
        <h1>GRIDS</h1>
        {this.renderGrids()}
      </div>
    )
  }
}

class GridsPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default GridsPage


import React, { Component } from 'react'

import Player from '../../Player'

import Panel from '../../Panel'
import Breadcrumb from '../../Breadcrumb'
import { NavLink } from 'react-router-dom'


import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'


class Page extends Component {

  state = {
    loaded: false
  }

  initialise () {
    const { league, season } = this.props
    if (this.state.loaded || !league || !season) return

    DB.get(`/api/${season.period}/players`)
      .then(response => {
        this.setState({
          players: response.players,
          loaded: true
        })
      })
  }

  renderList () {
    const { classes } = this.props;
    return (
      <List>
      {
        this.state.players && this.state.players.map(player => {
          return (
            <Player key={player.key} player={player} />
          )
        })
      }
      </List>
    )
  }

  render () {
    const { classes, club } = this.props;
    this.initialise()
    return (
      <div>

        <Breadcrumb list={
          [
            {lbl:'CLUBS', url:'../../clubs'},
            {lbl:club.name.toUpperCase(), url: `../../club/${club._id}`},
            {lbl:'MEMBERS'}
          ]
        } />

      </div>
    )
  }
}

class MembersPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default MembersPage


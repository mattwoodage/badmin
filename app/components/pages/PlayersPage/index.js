import React, { Component } from 'react'


import PlayerSearch from '../../PlayerSearch'


import { LeagueContext } from '../../Root'


class Page extends Component {

  render () {
    return (
      <div>
        <h1>PLAYERS</h1>
        <PlayerSearch league={this.props.league} season={this.props.season} />
      </div>
    )
  }
}

class PlayersPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default PlayersPage


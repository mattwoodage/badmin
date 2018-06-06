import React, { Component } from 'react'
import Root from '../../Root'

class PlayersPage extends Component {

  render () {

    return (
      <Root league={this.props.league} season={this.props.season} >
        <div>
          <h1>PLAYERS</h1>

        </div>
      </Root>
    )
  }
}

export default PlayersPage

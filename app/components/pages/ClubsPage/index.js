import React, { Component } from 'react'
import Root from '../../Root'
import Club from '../../Club'

class ClubsPage extends Component {

  renderClubs () {

    return this.props.clubs.map(club => {
      return (<Club club={club} />)
    })
  }

  render () {
    return (
      <Root league={this.props.league} season={this.props.season} >
        <div>
          <h1>CLUBS</h1>
          { this.renderClubs() }
        </div>
      </Root>
    )
  }
}

export default ClubsPage

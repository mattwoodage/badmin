import React, { Component } from 'react'
import Root from '../../Root'
import Division from '../../Division'

class TablesPage extends Component {

  teamsInDivision (division) {
    return this.props.teams.filter(t => {
      return String(t.division) === String(division._id)
    })
  }

  renderDivisions () {
    return this.props.divisions.map(division => {
      const teams = this.teamsInDivision(division)
      console.log('===============', teams.length)
      return (<Division division={division} teams={teams} />)
    })
  }

  render () {
    return (
      <Root league={this.props.league} season={this.props.season} >
        <h1>TABLES</h1>
        <div>
          { this.renderDivisions() }
        </div>
      </Root>
    )
  }
}

export default TablesPage

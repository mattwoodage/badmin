import React, { Component } from 'react'

import styles from './Division.scss'

class Division extends Component {

  renderTeams () {
    return this.props.teams.map(team => {
      return (<div key={team._id}>{team.labelLocal}</div>)
    })
  }

  render () {
    return (
      <div>
        <h1>{this.props.division.labelLocal}</h1>

        { this.renderTeams() }
        <hr />
      </div>
    )
  }
}

export default Division

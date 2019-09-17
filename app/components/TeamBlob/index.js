import React, { Component } from 'react'
import styles from './TeamBlob.scss'

class TeamBlob extends Component {
  
  render () {

    const { club, team } = this.props

    return (
      <div className={`teamBlob bg-${team.division.category}`}>
        <b>{team.division.position}</b>
        <span>{team.labelDivision}</span>
      </div>
    )
  }
}

export default TeamBlob

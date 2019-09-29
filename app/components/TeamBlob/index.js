import React, { Component } from 'react'
import styles from './TeamBlob.scss'

function TeamBlob({team}) {
  return (
    <div className={`teamBlob bg-${team.division.category}`}>
      <b>{team.division.position}</b>
      <span>{team.labelDivision}</span>
    </div>
  )
}

export default TeamBlob

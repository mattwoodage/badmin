import React, { Component } from 'react'

import styles from './Club.scss'

class Club extends Component {
  render () {
    console.log('club:', this.props.club)
    return (
      <ul>
        <li>
          <h3>{this.props.club.name}</h3>
          <p>{this.props.club.website}</p>
          <hr />
        </li>
      </ul>
    )
  }
}

export default Club

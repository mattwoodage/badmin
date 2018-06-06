import React, { Component } from 'react'
import Moment from 'react-moment'

import styles from './Match.scss'

Moment.globalFormat = 'D MMM YYYY HH:mm'

class Match extends Component {
  render () {
    console.log('match:', this.props.match)
    return (
      <ul>
        <li>
          <h3>{this.props.match.label}</h3>
          <p><Moment parse="YYYY-MM-DD HH:mm">
             {this.props.match.startAt}
            </Moment>
          </p>
        </li>
      </ul>
    )
  }
}

export default Match

import React, { Component } from 'react'
import Moment from 'react-moment'
import Match from '../Match'
import styles from './Day.scss'

class Day extends Component {

  renderMatches () {
    if (!this.props.matches) return 'x'
    return this.props.matches.map(match => {
      return (<Match match={match} />)
    })
  }

  render () {
    console.log('day:')
    console.log(this.props.matches)
    console.log('-----')
    return (
      <li className={styles.outer}>
        <h3>
          <Moment format="dd">{this.props.day}</Moment>
        </h3>
        <p>
          <Moment format="DD MMM">{this.props.day}</Moment>
        </p>
        <div>
        {this.renderMatches()}
        </div>
      </li>
    )
  }
}

export default Day

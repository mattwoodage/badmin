import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './Footer.scss'

class Footer extends Component {
  render () {
    return (
      <div className={styles.outer}>
        &copy; {this.props.league}
      </div>
    )
  }
}

export default Footer

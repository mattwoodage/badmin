import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './Footer.scss'


class Footer extends Component {
  render () {

    return (
      <div className='footer'>
        <h2>
          &copy; {this.props.league && this.props.league.name}
        </h2>
      </div>
    )
  }
}

export default Footer

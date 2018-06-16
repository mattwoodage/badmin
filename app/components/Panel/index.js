import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './Panel.scss'

class Panel extends Component {
  render () {

    const { high, low } = this.props;
    let cls = styles.default

    if (high) cls = styles.high
    if (low) cls = styles.low

    return (
      <div className={cls}>
        {this.props.children}
      </div>
    )
  }
}

export default Panel

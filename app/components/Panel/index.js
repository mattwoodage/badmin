import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './Panel.scss'

class Panel extends Component {
  render () {

    const { high, low, create, marginBottom } = this.props;
    let cls = 'default'

    if (high) cls = 'high'
    if (low) cls = 'low'
    if (create) cls = 'create'

    if (marginBottom) cls += ' marginBottom'

    return (
      <div className={cls}>
        {this.props.children}
      </div>
    )
  }
}

export default Panel

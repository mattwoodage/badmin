import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './Footer.scss'
import Typography from '@material-ui/core/Typography';


class Footer extends Component {
  render () {

    return (
      <div className={styles.footer}>
        <Typography variant="title">
          &copy; {this.props.league && this.props.league.name}
        </Typography>
      </div>
    )
  }
}

export default Footer

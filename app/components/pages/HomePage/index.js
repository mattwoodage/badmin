import React, { Component } from 'react'
import Root from '../../Root'

import { LeagueContext } from '../../Root'
import Typography from '@material-ui/core/Typography';

class Page extends Component {

  render () {
    console.log('render page......')
    return (
      <div>
        <Typography variant="display3" gutterBottom>HOMEPAGE</Typography>

        <ul>
          <li>{this.props.league ? this.props.league.name : 'x'}</li>
        </ul>
      </div>
    )
  }
}

class HomePage extends Component {
  render () {
    console.log('render homepage')
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default HomePage




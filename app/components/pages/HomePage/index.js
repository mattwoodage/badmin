import React, { Component } from 'react'
import Root from '../../Root'

import { LeagueContext } from '../../Root'
import Typography from '@material-ui/core/Typography';
import Panel from '../../Panel'

class Page extends Component {

  render () {
  
    console.log('render page......')
    return (
      <Panel>
        <Typography variant="display3" gutterBottom>{this.props.league ? this.props.league.name : ''}</Typography>
      </Panel>
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




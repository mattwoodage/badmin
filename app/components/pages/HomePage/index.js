import React, { Component } from 'react'
import Root from '../../Root'

import { LeagueContext } from '../../Root'

class Page extends Component {

  componentDidMount () {
    console.log('page props', this.props)
  }

  render () {
    
    return (
      <div>
        <h1>HOMEPAGE</h1>
        <ul>
          <li>{this.props.league.name}</li>
        </ul>
      </div>
    )
  }
}

class HomePage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default HomePage




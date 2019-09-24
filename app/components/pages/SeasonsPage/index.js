import React, { Component } from 'react'

import { LeagueContext } from '../../Root'
import SeasonForm from '../../SeasonForm'

class Page extends Component {

  constructor () {
    super()
    this.state = {
      loaded: false,
      seasonsArray: []
    }
  }

  componentDidMount () {
    this.initialise()
  }

  componentDidUpdate () {
    this.initialise()
  }

  initialise () {
    const { seasons } = this.props;
    if (seasons && seasons.length && !this.state.loaded) {
      let seasonsArray = seasons.slice(0)
      seasonsArray.push({})
      this.setState({
        loaded: true,
        seasonsArray: seasonsArray
      })
    }
  }

  render () {
    return (
      <div>
        <h1>SEASONS</h1>
      
        {this.state.seasonsArray.map((s) => {
        return <SeasonForm season={s} />
        })}

      </div>
    )
  }
}


class SeasonPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default SeasonPage



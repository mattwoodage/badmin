import React, { Component } from 'react'

import { LeagueContext } from '../../Root'

import DB from '../../../helpers/DB'

import DivisionForm from '../../DivisionForm'
import Breadcrumb from '../../Breadcrumb'


class Page extends Component {

  constructor () {
    super()
    this.state = {
      loaded: false,
      divisions: []
    }
  }

  componentDidMount () {
    if (!this.state.loaded && this.props.season) this.initialise()
  }

  componentDidUpdate () {
    if (!this.state.loaded && this.props.season) this.initialise()
  }

  initialise () {
    const { season } = this.props
    
    DB.get(`/api/${season.period}/divisions`)
      .then(response => {
        if (response.divisions) {
          this.setState({
            loaded: true,
            divisions: response.divisions
          })
        }
      })
  }

  render () {
    const { season } = this.props

    if (!this.state.loaded) return <h1>loading...</h1>

    return (
      <div>
        <Breadcrumb list={
          [
            {lbl:'SEASONS', url:'./seasons'},
            {lbl:season.period}
          ]
        } />
      
        {this.state.divisions.map((d) => {
        return <DivisionForm division={d} />
        })}

      </div>
    )
  }
}


class DivisionPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default DivisionPage



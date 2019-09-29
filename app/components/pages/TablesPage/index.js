import React, { Component } from 'react'

import DivisionTable from '../../DivisionTable'

import Panel from '../../Panel'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'


class Page extends Component {

  state = {
    loaded: false
  }

  initialise () {
    const { league, season } = this.props
    if (this.state.loaded || !league || !season) return

    DB.get(`/api/${season.period}/divisions`)
      .then(response => {
        this.setState({
          divisions: response.divisions,
          loaded: true
        })
      })
  }

  renderTables () {
    const { classes } = this.props;
    return (
      <List>
      {
        this.state.divisions && this.state.divisions.map(division => {
          return (
            <DivisionTable key={division.key} division={division} />
          )
        })
      }
      </List>
    )
  }

  render () {
    const { classes } = this.props;
    this.initialise()
    return (
      <div>
        <h1>TABLES</h1>
        {this.renderTables()}
      </div>
    )
  }
}

class TablesPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default TablesPage


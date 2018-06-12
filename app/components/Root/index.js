import React, { Component } from 'react'
import Menu from '../Menu'
import Footer from '../Footer'
import DB from '../../helpers/DB'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import styles from './Root.scss'

export const LeagueContext = React.createContext()

const drawerWidth = 240;

// const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

class Root extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    const host = document.location.hostname
    const leagueShort = host.split('.')[0].toUpperCase()
    const seasonPeriod = document.location.pathname.split('/')[1]
    this.initialise(leagueShort, seasonPeriod)
  }

  initialise (leagueShort, seasonPeriod) {
    if (seasonPeriod.length === 0) seasonPeriod='x'
    DB.get(`/api/${seasonPeriod}/seasons`)
      .then(response => {
        this.setState({
          league: response.league,
          season: response.season
        })
      })
  }

  render () {

    

    console.log('.......', styles)

    const context = {
      league: this.state.league,
      season: this.state.season
    }

    return (
      <LeagueContext.Provider value={context}>
        <div className='root'>
          
          <Menu league={this.state.league} season={this.state.season} />
          
          <div className='content'>
            {this.props.children}
          </div>
        </div>
      </LeagueContext.Provider>
    )
  }
}

export default Root


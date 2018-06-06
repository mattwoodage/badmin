import React, { Component } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import DB from '../../helpers/DB'

import styles from './Root.scss'

export const LeagueContext = React.createContext()

import HomePage from '../pages/HomePage'

class Root extends Component {
  constructor () {
    console.log('ROOT CONSTRUCTOR')
    super()
    this.state = {}
  }

  componentDidMount () {
    console.log('ROOT DID MOUNT')
    console.log('>>>xxx',this)
    const host = document.location.hostname
    const leagueShort = host.split('.')[0].toUpperCase()
    const seasonPeriod = document.location.pathname.split('/')[1]
    this.initialise(leagueShort, seasonPeriod)
  }

  initialise (leagueShort, seasonPeriod) {
    DB.get(`/api/league/${leagueShort}/${seasonPeriod}`)
      .then(response => {
        this.setState({
          league: response.league,
          season: response.season
        })
      })
  }

  renderPage () {
    if (!this.state.league) {
      return (
        <div>
          <Header {...this.props} league='' season='' />
          <div className={styles.page} >
            <h1>League not recognised</h1>
            <h2>Please check the URL</h2>
          </div>
          <Footer />
        </div>
      )
    }

    if (this.state.league && !this.state.season) {
      return (
        <div>
          <Header {...this.props} league={this.state.league.name} season='' />
          <div className={styles.page} >
            <h1>Season not recognised</h1>
            <h2>Please check the URL</h2>
          </div>
          <Footer />
        </div>
      )
    }

    console.log('root state = ', this.state)
    return (
      <div>
        <Header {...this.props} league={this.state.league.name} season={this.state.season.period} />
        <div className={styles.page}>
          {this.props.children}
        </div>
        <Footer league={this.state.league.name} />
      </div>
    )
  }

  render () {

    const context = {
      league: this.state.league,
      season: this.state.season
    }
    return (
      <LeagueContext.Provider value={context}>
        <div className={styles.outer}>
          <div className={styles.inner}>
            {this.renderPage()}
          </div>
        </div>
      </LeagueContext.Provider>
    )
  }
}

export default Root

import React, { Component } from 'react'
import Menu from '../Menu'
import Footer from '../Footer'
import DB from '../../helpers/DB'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import styles from './Root.css'

export const LeagueContext = React.createContext()

const drawerWidth = 240;

// const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

class Root extends Component {
  constructor () {
    super()
    this.state = {
      isLoggedIn: false,
      username: ''
    }
  }

  componentDidMount () {
    const host = document.location.hostname
    const leagueShort = host.split('.')[0].toUpperCase()
    const seasonPeriod = document.location.pathname.split('/')[1]
    this.initialise(leagueShort, seasonPeriod)
    this.checkLogin()
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

  checkLogin = () => {
    console.log('check login...')
    const token = localStorage.getItem('jwtToken')
    const username = localStorage.getItem('username')
    console.log(token, username)
    if (token && username) {
      this.doLogIn(username)
    }
  }

  doLogIn = (username) => {
    console.log('do log in')
    this.setState({
      username: username,
      isLoggedIn: true
    })
    console.log(this.state)
  }

  doLogOut = () => {
    this.setState({
      isLoggedIn: false
    })
  }

  render () {
    const context = {
      league: this.state.league,
      season: this.state.season,
      login: (username, password) => {
        axios.post('/api/auth/login', { username, password })
          .then((result) => {
            console.log('a')
            localStorage.setItem('jwtToken', result.data.token);
            console.log('b')
            localStorage.setItem('username', username);
            console.log('c')
            axios.defaults.headers.common['Authorization'] = result.data.token;
            console.log('d')
            this.doLogIn(username)
            console.log('e')
          })
          .catch((error) => {
            if(error.response.status === 401) {
              this.doLogOut()
            }
          });
      },
      logout: () => {
        console.log('xxxxx')
        localStorage.removeItem('jwtToken');
        this.doLogOut()
      },
      isLoggedIn: this.state.isLoggedIn,
      username: this.state.username,
      user: {}
    }

    return (
      <LeagueContext.Provider value={context}>
        <div className={styles.outer}>
          <div className={styles.inner}>
            
            <Menu isLoggedIn={this.state.isLoggedIn} league={this.state.league} season={this.state.season} />
            
            <div className={styles.content}>
              {this.props.children}
            </div>

            <Footer league={this.state.league} />
          </div>
        </div>
      </LeagueContext.Provider>
    )
  }
}

export default Root


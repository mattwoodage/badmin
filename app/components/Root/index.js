import React, { Component } from 'react'
import Menu from '../Menu'
import Footer from '../Footer'

import DB from '../../helpers/DB'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {Helmet} from "react-helmet";
import styles from './Root.scss'
import regeneratorRuntime from "regenerator-runtime";
import "typeface-open-sans"
import "typeface-open-sans-condensed"

import "core-js";

export const LeagueContext = React.createContext()

const drawerWidth = 240;

// const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

class Root extends Component {
  constructor () {
    super()
    this.state = {
      isLoggedIn: false,
      nickname: '',
      loginError: {},
      loading: false,
      loginLoading: false,
      registerLoading: false
    }

    this.context = {}
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
          season: response.season,
          seasons: response.seasons
        })
      })
  }

  getContext () {
    return {
      league: this.state.league,
      club: this.state.club,
      season: this.state.season,
      seasons: this.state.seasons,
      startLoad: () => {
        console.log('-- start load --')
        this.setState({
          loading: true
        })
      },
      stopLoad: () => {
        console.log('-- stop load --')
        this.setState({
          loading: false
        })
      },
      login: (email, password) => {
        this.setState({
          loginLoading: true
        })
        axios.post('/api/auth/login', { email, password })
          .then((result) => {
            const nickname = result.data.nickname
            localStorage.setItem('jwtToken', result.data.token);
            localStorage.setItem('nickname', nickname);
            axios.defaults.headers.common['Authorization'] = result.data.token;
            this.doLogIn(nickname)
          })
          .catch((error) => {
            console.log('error = ', error.response)
            if(error.response.status === 401) {
              this.setState({
                loginError: error.response.data,
                loginLoading: false
              })
            }

          });
      },
      register: (firstName, lastName, nickname, email, password) => {
        this.setState({
          registerLoading: true
        })
        axios.post('/api/auth/register', { firstName, lastName, nickname, email, password })
          .then((result) => {
            this.doRegister(email)
          })
          .catch((error) => {
            console.log('error = ', error.response)
            if(error.response.status === 401) {
              this.setState({
                registerError: error.response.data,
                registerLoading: false
              })
            }

          });
      },
      selectClub: (club) => {
        this.setState({
          club: club
        })
      },
      isLoggedIn: this.state.isLoggedIn,
      nickname: this.state.nickname,
      loginError: this.state.loginError,
      loading: this.state.loading,
      loginLoading: this.state.loginLoading,
      registerError: this.state.registerError,
      registerLoading: this.state.registerLoading,
      user: {}
    }

  }

  checkLogin = () => {
    console.log('check login...')
    const token = localStorage.getItem('jwtToken')
    const nickname = localStorage.getItem('nickname')
    console.log(token, nickname)
    if (token && nickname) {
      this.doLogIn(nickname)
    }
  }

  doLogIn = (nickname) => {
    console.log('do log in')
    this.setState({
      nickname: nickname,
      isLoggedIn: true,
      loginLoading: false
    })
  }

  doLogOut = () => {
    localStorage.removeItem('jwtToken');    
    this.setState({
      isLoggedIn: false,
      loginError: {}
    })
  }

  doRegister = (email) => {
    console.log('do register')
    this.setState({
      email: email,
      registerLoading: false
    })
  }

  render () {
    return (
      <LeagueContext.Provider value={this.getContext()}>
        {
          this.state.league && 
          <Helmet>
            <title>{this.state.league.name}</title>
          </Helmet>
        }
        <div className='outer'>
          <div className='inner'>
            
            <Menu loading={this.state.loading} isLoggedIn={this.state.isLoggedIn} doLogOut={this.doLogOut} nickname={this.state.nickname} league={this.state.league} season={this.state.season} seasons={this.state.seasons} />
            
            <div className='content'>
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


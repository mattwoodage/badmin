import React, { Component } from 'react'
import Club from '../../Club'

import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';
import Panel from '../../Panel'
import Notification from '../../Notification'
import Breadcrumb from '../../Breadcrumb'

import ClubForm from '../../ClubForm'
import TeamForm from '../../TeamForm'

import Button from '@material-ui/core/Button';

import DateTimePicker from 'material-ui-pickers/DateTimePicker';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

class Page extends Component {

  state = {
    loaded: false,
    error: false,
    venues: [],
    divisions: [],
    club: {},
    teams: []
  }

  componentDidMount () {
    console.log('init')
    const { season, match } = this.props

    if (this.state.loaded || !season) return
    this.moment = extendMoment(Moment)

    const clubID = match.params.club

    DB.get(`/api/${season.period}/venues`)
      .then(response => {
        if (response.venues) {
          this.setState({
            venues: response.venues
          })
        }
      })

    DB.get(`/api/${season.period}/divisions`)
      .then(response => {
        if (response.divisions) {
          this.setState({
            divisions: response.divisions,
          })
        }
      })


    if (clubID !== 'new') {
      DB.get(`/api/${season.period}/club/${clubID}`)
        .then(response => {
          if (response.club) {

            let teamsArray = response.teams
            teamsArray.push({club: response.club._id})
            this.setState({
              club: response.club,
              teams: teamsArray,
              loaded: true
            })
          }
          else {
            this.setState({
              error: true,
              loaded: true
            })
          }
          this.props.stopLoad()
        })
    } else {
      this.setState({
        loaded: true
      })
    }
  }

  render () {

    const { club, venues, teams, divisions } = this.state;
    const { classes, season } = this.props

    if (this.state.error) return <Panel><Notification text='Club not found' /></Panel>

    if (!this.state.loaded) return <Panel>Loading...</Panel>

    return (
      <div>

        <Breadcrumb list={
          [
            {lbl:'Clubs', url:'../clubs'},
            {lbl:club.name || 'NEW CLUB'}
          ]
        } />
          
        <Panel high marginBottom>  
          <ClubForm season={season} club={club} venues={venues} />
        </Panel>

        <h1>Teams this season</h1>
        

        {teams.map(team => (
          <TeamForm team={team} divisions={divisions}  />
        ))}
      </div>
    )
  }
}

class ClubPage extends Component {
  render () {
    return (
      <LeagueContext.Consumer>
        {props => <Page {...this.props} {...props} />}
      </LeagueContext.Consumer>
    )
  }
}

export default ClubPage


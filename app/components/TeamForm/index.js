import React, { Component } from 'react'
import Club from '../Club'

import { withStyles } from '@material-ui/core/styles';

import { NavLink } from 'react-router-dom'

import ReactMoment from 'react-moment'
import Moment from 'moment'

import { extendMoment } from 'moment-range';

import Button from '@material-ui/core/Button';

import DateTimePicker from 'material-ui-pickers/DateTimePicker';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@material-ui/core/Typography';

import DB from '../../helpers/DB'

const materialStyles = theme => ({
  paper: {
    padding: 30,
    color: theme.palette.text.secondary
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

class TeamForm extends Component {

  static getDerivedStateFromProps(props, state) {

    const teamForState = props.team
    //teamForState.division = teamForState.division._id
    return {
      team: teamForState,
      submitting: false,
      status: 0
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const { season } = this.props

    const _this = this
    console.log('------', this.state.team)

    this.setState({ submitting: true, status: 0 });

    fetch(`/api/${season.period}/team`,
    {
        method: "POST",
        body: JSON.stringify( this.state.team ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })
    .then(function(res) {
      _this.setState({ submitting: false, status: 1 });
    })
    .catch(function(err) {
      _this.setState({ submitting: false, status: -1 });
    })

    return false
  }

  handleDateChange = (field, date) => {
    console.log(field, date)
    this.state.team[field] = date.toDate()
    this.setState({ team: this.state.team });
  }

  handleChange = (field, event) => {
    console.log(field, event)
    console.error('THIS IS WRONG')
    this.state.team[field] = event.target.value
    this.setState({ team: this.state.team });
  }



  render () {

    const { team, submitting } = this.state
    

    const venues = []
    console.log(':::TEAM::',team)
    


    return (
      <form onSubmit={this.handleSubmit}>
        <h2>{team.division.labelLocal}</h2>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>

            <TextField
              required 
              label="Team labelLocal"
              onChange={(evt) => this.handleChange('labelLoal', evt)}
              value={team.labelLocal}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Team Label"
              onChange={(evt) => this.handleChange('label', evt)}
              value={team.label}
              margin="normal"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Prefix"
              onChange={(evt) => this.handleChange('prefix', evt)}
              value={team.prefix}
              margin="normal"
              fullWidth
            />
          </Grid>

        </Grid>

        <Button disabled={ submitting } type="submit" variant="contained" color="primary">Save</Button>
        { submitting && <CircularProgress /> }

      </form>
        
    )
  }
}

export default withStyles(materialStyles)(TeamForm)


import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom'

import overrides from './DivisionGrid.scss'

import Moment from 'react-moment'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import pink from '@material-ui/core/colors/pink';


const styles = theme => ({
  // paper: {
  //   padding: 0,
  //   color: theme.palette.text.secondary
  // },
  // row: {
  //   '&:nth-of-type(odd)': {
  //     backgroundColor: theme.palette.background.default,
  //   },
  // },
  
});

class DivisionGrid extends Component {

  renderTeams () {
    const { classes, division } = this.props;

    const divClass = division.labelLocal.split(' ')[0]

    const tableClass = overrides['table' + divClass]
    const cellClass = overrides['cell' + divClass]

    //teams alphabetical
    console.log(division.teams.map(a => a.labelLocal))
    division.teams = division.teams.sort(function(a, b){return a.labelLocal>b.labelLocal ? 1 : -1});
    console.log(division.teams.map(a => a.labelLocal))
    return (
      <Table className={tableClass}>
        <TableHead>
          <TableRow>
            <TableCell  className={cellClass}>
              <Typography variant="title">{division.labelLocal}</Typography>
            </TableCell>
            <TableCell  className={cellClass} colspan={division.teams.length} >
              <Typography className={classes[divClass]}>AWAY TEAM</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow >
            <TableCell className={cellClass}>HOME TEAM</TableCell>
            {
              division.teams.map(team => {
                return (<TableCell className={cellClass} key={team._id}>{team.labelLocal}</TableCell>)
              })
            }
          </TableRow>
          {
            division.teams.map((homeTeam, h) => {
              return (
                <TableRow className={classes.row}>
                  <TableCell className={cellClass} key={homeTeam._id}>{homeTeam.labelLocal}</TableCell>
                  {
                    division.teams.map((awayTeam, a) => {
                      const cls = (h === a) ? {className: cellClass} : {}
                      const match = this.getMatch(homeTeam, awayTeam)
        
                      return (
                        <TableCell {...cls} key={awayTeam._id}>
                        {match ? this.displayMatch(match) : ''}
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }

  getMatch (home, away) {
    if (home._id === away.id) return
    const { matches } = this.props;
    return matches.find((match) => {
      if (match.homeTeam === home._id && match.awayTeam === away._id) {
        return match
      }
    })
  }

  displayMatch (match) {
    if (match.scoreCard) {
      return (
        <span>
          <NavLink to={`./match/${match._id}`} >
            {match.scoreCard.homeRubbers} - {match.scoreCard.awayRubbers}
          </NavLink>
        </span>
      )
    }

    return (
      <span>
        <NavLink to={`./match/${match._id}`} >
          <Moment format="Do MMM">{match.startAt}</Moment>
          <Moment className={overrides.time} format="HH:mm">{match.startAt}</Moment>
        </NavLink>
      </span>
    )
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <div>
          
          { this.renderTeams() }
        </div>
        <br /><br />
      </div>
    )
  }
}

export default withStyles(styles)(DivisionGrid)

import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
  paper: {
    padding: 0,
    color: theme.palette.text.secondary
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  ladies: {
    color: '#ffffff',
    backgroundColor: pink[200]
  },
  mens: {
    color: '#ffffff',
    backgroundColor: lightBlue[200]
  },
  mixed: {
    color: '#ffffff',
    backgroundColor: lightGreen[300]
  }
});

class DivisionGrid extends Component {

  renderTeams () {
    const { classes, division } = this.props;

    const divClass = division.labelLocal.split(' ')[0].toLowerCase()
    console.log('////', divClass)
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes[divClass]}>
            <TableCell >
              <Typography className={classes[divClass]} variant="title">{division.labelLocal}</Typography>
            </TableCell>
            <TableCell colspan={division.teams.length} >
              <Typography className={classes[divClass]}>AWAY TEAM</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className={classes[divClass]}>HOME TEAM</TableCell>
            {
              division.teams.map(team => {
                return (<TableCell key={team._id}>{team.labelLocal}</TableCell>)
              })
            }
          </TableRow>
          {
            division.teams.map((homeTeam, h) => {
              return (
                <TableRow className={classes.row}>
                  <TableCell className={overrides.team} key={homeTeam._id}>{homeTeam.labelLocal}</TableCell>
                  {
                    division.teams.map((awayTeam, a) => {
                      const cls = (h === a) ? {className: classes[divClass]} : {}
                      const match = this.getMatch(homeTeam, awayTeam)
                      console.log("::::", match)
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
    return <Moment format="Do MMM">{match.startAt}</Moment>
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.paper}>
          
          { this.renderTeams() }
        </Paper>
        <br /><br />
      </div>
    )
  }
}

export default withStyles(styles)(DivisionGrid)

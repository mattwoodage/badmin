import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  },
  table: {
    border: '1'
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

class Division extends Component {

  renderTeams () {
    const { classes, division } = this.props;
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="title">{division.labelLocal}</Typography>
            </TableCell>
            {
              division.teams.map(team => {
                return (<TableCell key={team._id}>{team.labelLocal}</TableCell>)
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            division.teams.map(team => {
              return (
                <TableRow className={classes.row}>
                  <TableCell key={team._id}>{team.labelLocal}</TableCell>
                  {
                    division.teams.map(team2 => {
                      return (
                        <TableCell key={team2._id}>
                        x
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

  render () {
    const { classes } = this.props;
    console.log('----', this.props.division)
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

export default withStyles(styles)(Division)

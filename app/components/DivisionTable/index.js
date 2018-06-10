import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import overrides from './DivisionTable.scss'


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  paper: {
    padding: 0,
    color: theme.palette.text.secondary
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

class DivisionTable extends Component {
  renderTeams () {
    const { classes, division } = this.props;
    return (
      <Table className={classes.table}>
        
        <TableHead>
          <TableRow className={overrides.tableHead}>
            <TableCell>
              <Typography variant="title">{division.labelLocal}</Typography>
            </TableCell>
            <TableCell colSpan={4}>Matches</TableCell>
            <TableCell colSpan={2}>Rubbers</TableCell>
            <TableCell colSpan={2}>Games</TableCell>
            <TableCell colSpan={2}>Points</TableCell>
            <TableCell>PTS</TableCell>
          </TableRow>
        </TableHead>

        <TableHead>
          <TableRow className={overrides.tableSubHead}>
            <TableCell></TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Full</TableCell>
            <TableCell>Won</TableCell>
            <TableCell>Lost</TableCell>
            <TableCell>Won</TableCell>
            <TableCell>Lost</TableCell>
            <TableCell>Won</TableCell>
            <TableCell>Lost</TableCell>
            <TableCell>Won</TableCell>
            <TableCell>Lost</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            division.teams.map(team => {
              return (
                <TableRow className={overrides.tableBody} className={classes.row}>
                  <TableCell className={overrides.team} key={team._id}>{team.labelLocal}</TableCell>
                  
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>

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

export default withStyles(styles)(DivisionTable)

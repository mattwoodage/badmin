import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';

import overrides from './DivisionTable.scss'

class DivisionTable extends Component {
  renderTeams () {
    const { classes, division } = this.props;

    division.teams.sort(function(a, b){return b.pts-a.pts});

    const cellClass = 'bg-' + division.category
    const tblClass = 'table-' + division.category

    return (
      <table className={tblClass}>
        
        <thead>
          <tr className={cellClass}>
            <td>
              <h3>{division.labelLocal}</h3>
            </td>
            <td colSpan={5}>Matches</td>
            <td colSpan={3}>Rubbers</td>
            <td colSpan={2}>Games</td>
            <td colSpan={2}>Points</td>
            <td>PTS</td>
          </tr>
        </thead>

        <thead>
          <tr className={cellClass}>
            <td></td>
            <td>Total</td>
            <td>Full</td>
            <td>Won</td>
            <td>Drawn</td>
            <td>Lost</td>
            <td>Won</td>
            <td>Drawn</td>
            <td>Lost</td>
            <td>Won</td>
            <td>Lost</td>
            <td>Won</td>
            <td>Lost</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {
            division.teams.map(team => {
              return (
                <tr  key={team._id}>
                  <td className={cellClass} >{team.labelClub}</td>
                  <td>{team.matchesTotal}</td>
                  <td>{team.matchesFull}</td>
                  <td>{team.matchesWon}</td>
                  <td>{team.matchesDrawn}</td>
                  <td>{team.matchesLost}</td>
                  <td>{team.rubbersWon}</td>
                  <td>{team.rubbersDrawn}</td>
                  <td>{team.rubbersLost}</td>
                  <td>{team.gamesWon}</td>
                  <td>{team.gamesLost}</td>
                  <td>{team.pointsWon}</td>
                  <td>{team.pointsLost}</td>
                  <td>{team.pts}</td>

                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }

  render () {
    const { classes } = this.props;
    return (
      <div>
        { this.renderTeams() }
        <br /><br />
      </div>
    )
  }
}

export default DivisionTable

import React, { Component } from 'react'


import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { NavLink } from 'react-router-dom'

import styles from './DivisionGrid.scss'

import Moment from 'react-moment'


class DivisionGrid extends Component {

  renderTeams () {
    const { division } = this.props;

    //teams alphabetical
    division.teams = division.teams.sort(function(a, b){return a.labelClub>b.labelClub ? 1 : -1});

    const cellClass = 'bg-' + division.category
    const tblClass = 'table-' + division.category

    return (
      <table className={`marginBottom ${tblClass}`}>
        <thead>
          <tr className={cellClass}>
            <td>
              <h2>{division.labelLocal}</h2>
            </td>
            <td colspan={division.teams.length} >
              <h3>AWAY TEAM</h3>
            </td>
          </tr>
          <tr className={`sub ${cellClass}`}>
            <td>HOME TEAM</td>
            {
              division.teams.map(team => {
                return (<td className='awayTeam' key={team._id}>{team.labelClubShort}</td>)
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            division.teams.map((homeTeam, h) => {
              return (
                <tr>
                  <td className={`homeTeam`} key={homeTeam._id}>{homeTeam.labelClub}</td>
                  {
                    division.teams.map((awayTeam, a) => {
                      const cls = (h === a) ? {className: 'gap'} : {}
                      const match = this.getMatch(homeTeam, awayTeam)
        
                      return (
                        <td {...cls} key={awayTeam._id}>
                        {match ? this.displayMatch(match) : this.displayNew()}
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
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

    const cls = match.division.category.toLowerCase() + 'Match'

    if (match.scoreCard && match.scoreCard.status === 1) {
      return (
        <NavLink className={`button fixture ${cls}`} to={`./match/${match._id}`} >
          {match.scoreCard.homeRubbers} - {match.scoreCard.awayRubbers}
        </NavLink>
      )
    }

    return (
      <NavLink className={`button fixture ${cls}`} to={`./match/${match._id}`} >
        <Moment format="Do MMM">{match.startAt}</Moment>
      </NavLink>
    )
  }

  displayNew() {
    return (
      <a href='#' class='button'>CREATE</a>
    )
  }

  render () {
    return (
      <div>
        { this.renderTeams() }
      </div>
    )
  }
}

export default DivisionGrid

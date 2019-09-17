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
              <h3>{division.labelLocal}</h3>
            </td>
            <td colspan={division.teams.length} >
              <h3>AWAY TEAM</h3>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className={cellClass}>
            <td>HOME TEAM</td>
            {
              division.teams.map(team => {
                return (<td key={team._id}>{team.labelClub}</td>)
              })
            }
          </tr>
          {
            division.teams.map((homeTeam, h) => {
              return (
                <tr>
                  <td className={cellClass} key={homeTeam._id}>{homeTeam.labelClub}</td>
                  {
                    division.teams.map((awayTeam, a) => {
                      const cls = (h === a) ? {className: cellClass} : {}
                      const match = this.getMatch(homeTeam, awayTeam)
        
                      return (
                        <td {...cls} key={awayTeam._id}>
                        {match ? this.displayMatch(match) : ''}
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
          <Moment className='time' format="HH:mm">{match.startAt}</Moment>
        </NavLink>
      </span>
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

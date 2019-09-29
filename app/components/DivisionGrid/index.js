import React, { useContext } from 'react'


import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { NavLink } from 'react-router-dom'

import styles from './DivisionGrid.scss'
import { LeagueContext } from '../Root'
import { format } from 'date-fns'


function DivisionGrid({division, matches}) {

  const leagueContext = useContext(LeagueContext);

  const getMatch = (home, away) => {
    if (home._id === away._id) return
    return matches.find((match) => {
      if (match.homeTeam === home._id && match.awayTeam === away._id) {
        return match
      }
    })
  }

  const displayMatch = (match) => {

    const cls = match.division.category.toLowerCase() + 'Match'

    if (match.scoreCard && match.scoreCard.status === 1) {
      return (
        <NavLink className={`button fixture ${cls}`} to={`./match/${match.homeTeam}/${match.awayTeam}/${match._id}`} >
          {match.scoreCard.homeRubbers} - {match.scoreCard.awayRubbers}
        </NavLink>
      )
    }

    return (
      <NavLink className={`button fixture ${cls}`} to={`./match/${match.homeTeam}/${match.awayTeam}/${match._id}`} >
        {format(new Date(match.startAt), 'do MMM')}
      </NavLink>
    )
  }

  const displayNew = (home,away) => {
    return (
      <NavLink className='button' to={`./match/${home._id}/${away._id}/new`} >ADD</NavLink>
    )
  }

  //teams alphabetical
  division.teams = division.teams.sort(function(a, b){return a.labelClub>b.labelClub ? 1 : -1});

  const tblClass = 'table-' + division.category


  return (
    <div>
      <table className={`marginBottom ${tblClass}`}>
        <thead>
          <tr>
            <td colSpan='2' rowSpan='2' className='category r-divide b-divide'>
              <h2 className='t-s b-s'>{division.labelLocal.toUpperCase()}</h2>
            </td>
            <td className='category' colspan={division.teams.length} >
              <h3>AWAY TEAM</h3>
            </td>
          </tr>
          <tr>
            {
              division.teams.map(team => {
                return (<td className='category awayTeam' key={team._id}>{team.labelClubShort}</td>)
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            division.teams.map((homeTeam, h) => {
              return (
                <tr>
                  {(h===0) && (<td rowSpan={division.teams.length} className='category homeTeamLabel'><h3>HOME TEAM</h3></td>)}
                  <td className='category homeTeam r-divide' key={homeTeam._id}>{homeTeam.labelClub}</td>
                  {
                    division.teams.map((awayTeam, a) => {
                      const gap = (h === a)

                      const cls = gap ? {className: 'striped'} : {}
                      const match = getMatch(homeTeam, awayTeam)
        
                      return (
                        <td {...cls} key={awayTeam._id}>
                        {match && displayMatch(match)}
                        {!gap && !match && displayNew(homeTeam, awayTeam)}
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
    </div>
  )

}

export default DivisionGrid

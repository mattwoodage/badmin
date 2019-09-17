import React, { Component } from 'react'
import Moment from 'react-moment'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import Hidden from '@material-ui/core/Hidden';
import ImageIcon from '@material-ui/icons/Image';
import { NavLink } from 'react-router-dom'

import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import pink from '@material-ui/core/colors/pink';

import FolderIcon from '@material-ui/icons/Folder';

import matchStyles from './MatchCard.scss';

Moment.globalFormat = 'D MMM YYYY HH:mm'



class MatchCard extends Component {
  

  startTime () {
    const { match, cal } = this.props
    let startAt = String(new Date(this.props.match.startAt)).split(' ')
    if (cal) {
      startAt = startAt[4].split(":")
      startAt.pop()
    }
    else {
      startAt.pop()
      startAt.pop()
    }
    return (
      <div className={matchStyles.time}>
        {startAt.join(':')}
      </div>
    )
  }

  renderRubber (card, rubber, oop) {
    const gamesPerRubber = this.props.match.division.numGamesPerRubber
    const scores = card.scores.filter(score => score.rubberNum === rubber)
    const games = Array.from(Array(gamesPerRubber).keys())
    console.log(gamesPerRubber)
    console.log(games)

    const home = scores[0]
    const away = scores[1]

    return (
      <div>
        <div>
          <span>{home.players.map(p => { return p.name }).join(' & ') }</span>
          <span> v </span>
          <span>{away.players.map(p => { return p.name }).join(' & ') }</span>
        </div>
        {
        games.map((idx) => {
          const gameScores = scores.filter(score => score.gameNum === idx+1)
          if (gameScores.length) return this.renderGame(gameScores)
        })
      }
      </div>
    )
  }

  renderGame (scores) {
    const homeScore = scores[0]
    const awayScore = scores[1]
    return (
      <span><span>{homeScore.points}</span>:<span>{awayScore.points}</span> </span>
    )
  }

  render () {

    const { match, classes, card } = this.props
    let cls = matchStyles.ladiesCard
    if (match.division.labelLocal.toUpperCase().indexOf('MIXED')>-1) cls = matchStyles.mixedCard
    if (match.division.labelLocal.toUpperCase().indexOf('MENS')>-1) cls = matchStyles.mensCard

    return (
      <div className={cls}>
        entered by: {card.enteredBy.email}

          <span>
            <span className={matchStyles.div}>
     
            </span>
            {this.startTime()}
            <br />
            {
              match.division.orderOfPlay.map((oop, rubber) => {
                return this.renderRubber(card, rubber+1, oop)
              })
            }
          </span>


      </div>
    )
  }
}

export default  MatchCard

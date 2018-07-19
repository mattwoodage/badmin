import React, { Component } from 'react'
import Moment from 'react-moment'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import ImageIcon from '@material-ui/icons/Image';
import { NavLink } from 'react-router-dom'

import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import pink from '@material-ui/core/colors/pink';

import FolderIcon from '@material-ui/icons/Folder';

import matchStyles from './MatchCard.scss';

Moment.globalFormat = 'D MMM YYYY HH:mm'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
};

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

  renderRubbers (scores) {
    return scores.map(score => {
      return (
        <div>
          {"Rubber " + score.rubberNum + ", Game " + score.gameNum + " = PTS " + score.points + " " + (score.isHomeTeam ? 'H' : 'A')}
          <div>
            {score.players.map(plyr => {
              return (plyr.name)
            })}
          </div>
        </div>
        )
    })
  }

  renderRubber (card, rubber, oop) {
    
    const scores = card.scores.filter(score => score.rubberNum === rubber)
    return (
      <div>{oop} = {rubber}
      {JSON.stringify(scores)}

      </div>
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


          {this.renderRubbers(card.scores)}


      </div>
    )
  }
}

export default  withStyles(styles)(MatchCard)

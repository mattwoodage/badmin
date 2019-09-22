import React, { Component } from 'react'
import Moment from 'react-moment'

import ImageIcon from '@material-ui/icons/Image';
import { NavLink } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system';

Moment.globalFormat = 'D MMM YYYY HH:mm'

import styles from './MatchCard.scss';

class MatchCard extends Component {

  constructor(props) {
    super(props)
    this.form = React.createRef()
  }

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
      <div className='time'>
        {startAt.join(':')}
      </div>
    )
  }

  renderRubber (card, rubber, oop) {

    const { match } = this.props

    const gamesPerRubber = match.division.numGamesPerRubber
    const scores = card.scores.filter(score => score.rubberNum === rubber)
    const games = Array.from(Array(gamesPerRubber).keys())

    let displayOop = oop.split('')
    displayOop = `H ${oop[0]}+${oop[1]} v ${oop[2]}+${oop[3]} A`

    console.log('-----------------------')
    console.log(rubber)
    console.log(scores)

    const gameCols = []
    let homeGames = 0
    let awayGames = 0
    for (let i = 1; i <= gamesPerRubber; i++) {

      const gameScore = scores.filter(s => s.gameNum === i)

      console.log('GAME SCORE = ', gameScore)

      if (gameScore.length !== 0) {
        if (gameScore[0].win) homeGames += 1
        if (gameScore[1].win) awayGames += 1
        gameCols.push (
          <React.Fragment>
            <td><input name={`H-${rubber}-${i}`} class='score' type='text' value={gameScore[0].points} /></td>
            <td><input name={`A-${rubber}-${i}`} class='score' type='text' value={gameScore[1].points} /></td>
          </React.Fragment>
        )
      }
      else {
        gameCols.push (
          <React.Fragment>
            <td><input name={`H-${rubber}-${i}`} class='score' type='text' value='' /></td>
            <td><input name={`A-${rubber}-${i}`} class='score' type='text' value='' /></td>
          </React.Fragment>
        )
      }
    }

    let rubberWinner = 'Draw'
    if (homeGames > awayGames) rubberWinner = match.homeTeam.labelClubShort
    else if (homeGames < awayGames) rubberWinner = match.awayTeam.labelClubShort

    gameCols.push (
      <React.Fragment>
        <td>{homeGames}</td>
        <td>{awayGames}</td>
        <td>{rubberWinner}</td>
      </React.Fragment>
    )


    return (
      <tr>
        <td>{displayOop}</td>
        {gameCols}
      </tr>
    )
  }

  renderGame (scores) {
    const homeScore = scores[0]
    const awayScore = scores[1]
    return (
      <span>{homeScore.points}:{awayScore.points} </span>
    )
  }

  renderPlayers() {
    const { match, members, card } = this.props
    const playerPos = match.division.numPlayers
    const playerGender = match.division.genders.split('')

    const rows = []

    for (let i = 0; i < playerPos; i++) {
      const gender = playerGender[i] === 'F' ? 'Lady' : 'Man'
      rows.push(
        <Row>
          <Col md={2}>{`${gender} ${i+1}`}</Col>
          <Col md={4}>{this.renderPlayerList(i, true, card.homePlayers[i])}</Col>
          <Col md={4}>{this.renderPlayerList(i, false, card.awayPlayers[i])}</Col>
          <Col md={2}></Col>
        </Row>
      )
    }
    return rows
  }

  renderPlayerList(pos, isHome, selectedPlayer) {
    const { match, members, card } = this.props
    const playerGender = match.division.genders.split('')[pos]

    let list = isHome ? members.home : members.away
    if (playerGender!=='O') list = list.filter(m => m.player.gender === playerGender)

    const currentSelection = selectedPlayer ? (
      <option>{selectedPlayer.name}</option>
    ) : ''

    return (
      <select name={`P-${pos+1}`}>
        {currentSelection}
        <option disabled></option>
        <option>NO PLAYER PRESENT</option>
        <option disabled></option>
        {
          list.map(member => {
            if (!member.active) return
            return (
              <option>{member.player.name}</option>
            )
          })
        }
      </select>  
    )
  }

  validate = (e) => {
    e.preventDefault()
    const frm = this.form.current
    const data = {}
    
    Object.keys(frm).map(o => {
      const obj = frm[o]
      data[obj.name] = obj.value
      
    })

    console.log(data)

   // for(let i=0; i<this.form.elements.length; i++){
   // var alertText = ""
   // alertText += "Element Type: " + this.form.elements[i].type + "\n"

   //    if(this.form.elements[i].type == "text" || this.form.elements[i].type == "textarea" || this.form.elements[i].type == "button"){
   //    alertText += "Element Value: " + this.form.elements[i].value + "\n"
   //    }
   //    else if(this.form.elements[i].type == "checkbox"){
   //    alertText += "Element Checked? " + this.form.elements[i].checked + "\n"
   //    }
   //    else if(this.form.elements[i].type == "select-one"){
   //    alertText += "Selected Option's Text: " + this.form.elements[i].options[this.form.elements[i].selectedIndex].text + "\n"
   //    }
   // alert(alertText)
   // }

    
  }


  render () {

    console.log('render match card')
    
    const { match, classes, card } = this.props
    let cls = 'ladiesCard'
    if (match.division.labelLocal.toUpperCase().indexOf('MIXED')>-1) cls = 'mixedCard'
    if (match.division.labelLocal.toUpperCase().indexOf('MENS')>-1) cls = 'mensCard'

    const gamesPerRubber = match.division.numGamesPerRubber

    const gameCols = []
    const gameHeaders = []
    for (let i = 1; i <= gamesPerRubber; i++) {
      gameCols.push (
        <React.Fragment>
          <td>{match.homeTeam.labelClubShort}</td>
          <td>{match.awayTeam.labelClubShort}</td>
        </React.Fragment>
      )
      gameHeaders.push (
        <td colspan='2'>{`Game ${i}`}</td>
      )
    }

    return (
      <Container fluid>
        <Row>
          <Col md={9}>
            <div className={cls}>
              <form ref={this.form}>
                
                <div class='match-header'>
                  <Container>
                   <Row>
                     <Col md={4}><h2>{match.division.labelLocal}</h2></Col>
                     <Col md={4}>{this.startTime()} {match.venue.name}</Col>
                     <Col md={4}>entered by: {card.enteredBy.email}</Col>
                   </Row>
                  </Container>
                </div>

                <div class='match-page'>
                  <Container>
                    <Row>
                      <Col md={2}></Col>
                      <Col md={4} className='bold'>HOME</Col>
                      <Col md={4} className='bold'>AWAY</Col>
                      <Col md={2}></Col>
                    </Row>
                    <Row>
                      <Col md={2}><h2>Players</h2></Col>
                      <Col md={4}><h2>{match.homeTeam.labelClub}</h2></Col>
                      <Col md={4}><h2>{match.awayTeam.labelClub}</h2></Col>
                      <Col md={2}>x</Col>
                    </Row>
                    {this.renderPlayers()}
                  </Container>
                  <table className='scores'>
                    <tr className='labels'>
                      <td>Order of</td>
                      {gameHeaders}
                      <td>Home</td>
                      <td>Away</td>
                      <td></td>
                    </tr>
                    <tr className='labels'>
                      <td>Play</td>
                      {gameCols}
                      <td>Games</td>
                      <td>Games</td>
                      <td>Winner</td>
                    </tr>
                  {
                    match.division.orderOfPlay.map((oop, rubber) => {
                      return this.renderRubber(card, rubber+1, oop)
                    })
                  }
                  </table>
                  <a href='#' className='button' onClick={(e) => this.validate(e)}>SAVE</a>
                </div>

              </form>
            </div>
          </Col>
          <Col md={3}>
            CCCCCCCCCCCCCC
          </Col>
        </Row>
      </Container>

    )
  }
}

export default  MatchCard

import React, { Component } from 'react'
import Moment from 'react-moment'

import ImageIcon from '@material-ui/icons/Image';
import { NavLink } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system';

import Icon from '@mdi/react'
import { mdiTrophy, mdiAutorenew, mdiCheckDecagram, mdiCloseBox } from '@mdi/js'

Moment.globalFormat = 'D MMM YYYY HH:mm'

import styles from './MatchCard.scss';

class MatchCard extends Component {

  constructor(props) {
    super(props)
    this.form = React.createRef()

    this.state = {
      match: {}
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      match: props.match || {}
    }
  }

  renderRubber (card, rubber, oop) {

    const { match } = this.state

    const gamesPerRubber = match.division.numGamesPerRubber
    const scores = card.scores.filter(score => score.rubberNum === rubber)
    const games = Array.from(Array(gamesPerRubber).keys())

    let displayOop = oop.split('')
    displayOop = `${oop[0]}+${oop[1]} v ${oop[2]}+${oop[3]}`

    const gameCols = []
    let homeGames = 0
    let awayGames = 0
    for (let i = 1; i <= gamesPerRubber; i++) {

      const gameScore = scores.filter(s => s.gameNum === i)

      let homePoints = 0
      let awayPoints = 0

      if (gameScore.length !== 0) {
        if (gameScore[0].win) homeGames += 1
        if (gameScore[1].win) awayGames += 1
        homePoints = gameScore[0].points
        awayPoints = gameScore[1].points
      }

      gameCols.push (
        <React.Fragment>
          <td>
            <input
              name={`H-${rubber}-${i}`} 
              className='score'
              type='text'
              value={homePoints}
              onChange={(evt) => this.handleChange(evt)}
            />
          </td>
          <td className='line'>
            <input
              name={`A-${rubber}-${i}`}
              className='score'
              type='text'
              value={awayPoints} 
              onChange={(evt) => this.handleChange(evt)}
            />
          </td>
        </React.Fragment>
      )

    }

    let homeRubbers = 0
    let awayRubbers = 0
    if (homeGames > awayGames) homeRubbers = 1
    else if (homeGames < awayGames) awayRubbers = 1
    else {
      homeRubbers = 0.5
      awayRubbers = 0.5
    }

    gameCols.push (
      <React.Fragment>
        <td>{homeGames}</td>
        <td className='line'>{awayGames}</td>
        <td>{homeRubbers}</td>
        <td>{awayRubbers}</td>
      </React.Fragment>
    )


    return (
      <tr>
        <td className='line'><b>{rubber}.</b> {displayOop}</td>
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
      //const gender = playerGender[i] === 'F' ? 'Lady' : 'Man'
      rows.push(
        <Row className='match-player'>
          <Col md={2} className='label right'>{`PLAYER ${i+1}`}</Col>
          <Col md={4}>{this.renderPlayerList(i, true, card.homePlayers[i])}</Col>
          <Col md={4}>{this.renderPlayerList(i, false, card.awayPlayers[i])}</Col>
          <Col md={2}></Col>
        </Row>
      )
    }
    return rows
  }

  renderPlayerList(pos, isHome, selectedPlayer) {
    const { members, card } = this.props
    const { match } = this.state
    const playerGender = match.division.genders.split('')[pos]

    let list = isHome ? members.home : members.away
    if (playerGender!=='O') list = list.filter(m => m.player.gender === playerGender)

    list.sort((a,b) => a.player.lastName > b.player.lastName ? 1 : -1)
  
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
              <option key={member.player._id}>{member.player.name}</option>
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
  }

  handleChange = (field, event) => {
    console.log(field, event)
    console.error('THIS IS WRONG')
    this.state.club[field] = event.target.value
    this.setState({ club: this.state.club });
  }


  renderSubmitted () {
    const { card } = this.props
    if (card._id) {
      return (
        <div className='card-result'>
          <b>RESULT SUBMITTED</b><br/>
          by: {card.enteredBy.firstName + ' ' + card.enteredBy.lastName}<br/>
          on: <Moment format="ddd DD MMM HH:mm">{card.enteredAt}</Moment>
        </div>
      )
    }
    return null
  }

  renderConfirmed () {
    const { card } = this.props
    if (card._id) {
      return (
        <div className='card-result'>
          <If condition={ card.status === 0 }>
            <Icon path={mdiAutorenew}
                  title="Pending"
                  size={2}
                  color="orange"
                  spin
                  />
            <h1>AWAITING CONFIRMATION</h1>
          </If>
          <If condition={ card.status === 1 }>
            <Icon path={mdiCheckDecagram}
                  title="Confirmed"
                  size={2}
                  color="green"
                  />
            <h1>CONFIRMED</h1>
            by: {card.confirmedBy.firstName + ' ' + card.enteredBy.lastName}<br/>
            on: <Moment format="ddd DD MMM HH:mm">{card.confirmedAt}</Moment>
          </If>
          <If condition={ card.status === -1 }>
            <Icon path={mdiCloseBox}
                title="Rejected"
                size={2}
                color="red"
                />
            <h1>REJECTED</h1>
          </If>
        </div>
      )
    }
    return null
  }

  renderPoints (num) {
    return (
      <span>awarded <b>{num}</b> point{num !== 1 && 's'}</span>
    )
  }

  renderWinner () {
    const { card } = this.props
    const { match } = this.state

    if (card._id) {
      return (
        <Choose>
          <When condition={ card.winner === 2 }>
            <div className='card-result'>
              <h3>MATCH DRAWN</h3>
              <h2>{match.homeTeam.labelClub}</h2>
              {this.renderPoints(card.homePts)}
              
              <h2>{match.awayTeam.labelClub}</h2>
              {this.renderPoints(card.awayPts)}
            </div>
          </When>
          <Otherwise>
            <div className='card-result'>
              <h3>WINNER</h3>
              <Icon path={mdiTrophy}
                title="Winner"
                size={2}
                color="gold"
                />
              <If condition={ card.winner === 1 }>
                <h2>{match.homeTeam.labelClub}</h2>
                {this.renderPoints(card.homePts)}
              </If>
              <If condition={ card.winner === 3 }>
                <h2>{match.awayTeam.labelClub}</h2>
                {this.renderPoints(card.awayPts)}
              </If>
            </div>
            <div className='card-result'>
              <If condition={ card.winner === 1 }>
                <h2>{match.awayTeam.labelClub}</h2>
                {this.renderPoints(card.awayPts)}
              </If>
              <If condition={ card.winner === 3 }>
                <h2>{match.homeTeam.labelClub}</h2>
                {this.renderPoints(card.homePts)}
              </If>
            </div>

          </Otherwise>
        </Choose>
      )
    }
    return null
  }

  render () {
    console.log('render match card')

    const { card } = this.props
    const { match } = this.state

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
          <td className='line'>{match.awayTeam.labelClubShort}</td>
        </React.Fragment>
      )
      gameHeaders.push (
        <td colSpan='2' className='line'>{`Game ${i}`}</td>
      )
    }

    return (
      <Container fluid>
        <Row>
          <Col md={9}>
            <div className={cls}>
              <form ref={this.form}>
                
                <div className='match-header'>
                  <Container>
                   <Row>
                     <Col md={4}><h2>{match.division.category}</h2><b>DIVISION {match.division.position}</b></Col>
                     <Col md={4}></Col>
                     <Col md={4}></Col>
                   </Row>
                  </Container>
                </div>

                <div className='match-page'>
                  <Container>
                    <Row>
                      <Col md={2}></Col>
                      <Col md={4}>HOME</Col>
                      <Col md={4}>AWAY</Col>
                      <Col md={2}></Col>
                    </Row>
                    <Row>
                      <Col md={2}></Col>
                      <Col md={4}><h2>{match.homeTeam.labelClub}</h2></Col>
                      <Col md={4}><h2>{match.awayTeam.labelClub}</h2></Col>
                      <Col md={2}></Col>
                    </Row>
                    {this.renderPlayers()}
                  </Container>
                  <table className='scores'>
                    <tbody>
                    <tr className='labels'>
                      <td className='line'>Order of</td>
                      {gameHeaders}
                      <td colSpan={2} >Games</td>
                      <td colSpan={2} >Rubbers</td>
                    </tr>
                    <tr className='labels'>
                      <td className='line'>Play</td>
                      {gameCols}
                      <td>{match.homeTeam.labelClubShort}</td>
                      <td className='line'>{match.awayTeam.labelClubShort}</td>
                      <td>{match.homeTeam.labelClubShort}</td>
                      <td>{match.awayTeam.labelClubShort}</td>
                    </tr>
                  {
                    match.division.orderOfPlay.map((oop, rubber) => {
                      return this.renderRubber(card, rubber+1, oop)
                    })
                  }
                  <tr className='totals'>
                    <td colSpan={1 + gamesPerRubber*2} className='line'></td>
                    <td>{card.homeGames}</td>
                    <td className='line'>{card.awayGames}</td>
                    <td><b>{card.homeRubbers}</b></td>
                    <td><b>{card.awayRubbers}</b></td>
                  </tr>
                  </tbody>
                  </table>
                  
                </div>

                <div className='match-footer'>
                  <span className='match-footer-left'>MESSAGE GOES HERE</span>
                  <span className='match-footer-right'><a href='#' className='button' onClick={(e) => this.validate(e)}>SAVE</a></span>
                </div>

              </form>
            </div>
          </Col>
          <Col md={3}>
            {this.renderWinner()}
            {this.renderSubmitted()}
            {this.renderConfirmed()}
          </Col>
        </Row>
      </Container>

    )
  }
}

export default  MatchCard

import React, { useState, useContext, useEffect } from 'react'
import Match from '../../Match'
import Day from '../../Day'

import Panel from '../../Panel'
import Notification from '../../Notification'
import MatchCard from '../../MatchCard'
import Breadcrumb from '../../Breadcrumb'
import FixtureForm from '../../FixtureForm'

import styles from './Match.scss'

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'
import to from 'await-to-js'

function useData(params) {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [venues, setVenues] = useState([])
  const [match, setMatch] = useState(undefined)
  const [cards, setCards] = useState([])
  const [members, setMembers] = useState([])
  const [division, setDivision] = useState({})
  const [homeTeam, setHomeTeam] = useState({})
  const [awayTeam, setAwayTeam] = useState({})

  const leagueContext = useContext(LeagueContext);

  useEffect(() => {

    async function initialise() {

      const matchID = params.match
      const isNew = matchID.toUpperCase() === 'NEW'

      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      const [ venueErr, venueResponse ] = await to(DB.get(`/api/${season.period}/venues`))

      setVenues(venueResponse.venues)

      const [ fixtureErr, fixtureResponse ] = await to(DB.get(`/api/${season.period}/fixture/${params.homeTeam}/${params.awayTeam}`))

      setDivision(fixtureResponse.home.division)
      setHomeTeam(fixtureResponse.home)
      setAwayTeam(fixtureResponse.away)

      if (!isNew) {
        const [ matchErr, matchResponse ] = await to(DB.get(`/api/${season.period}/match/${matchID}`))

        setMatch(matchResponse.match)
        setCards(matchResponse.cards)

        if (matchResponse.match) {
          const [ membersErr, membersResponse ] = await to(DB.get(`/api/${season.period}/members/${matchResponse.match.homeTeam.club}/${matchResponse.match.awayTeam.club}`))
          setMembers(membersResponse)
        }
      }

      setLoaded(true)
      leagueContext.stopLoad()
    }
    if (!loading) initialise()
  });

  return [match, venues, cards, members, division, homeTeam, awayTeam, loaded]
}


function MatchPage(props) {
  const params = props.match.params
  
  const [match, venues, cards, members, division, homeTeam, awayTeam, loaded] = useData(params)


  const renderCards = () => {
    cards['new'] = {
      enteredBy: {
        email: 'current user'
      },
      homePlayers: [],
      awayPlayers: [],
      scores: []
    }

    return Object.keys(cards).map(key => {
      return renderScoreCard(cards[key])
    })
  }

  const renderScoreCard = (card) => {
    return (
      <div>
        <MatchCard match={match} card={card} members={members}/>
        <br /><br />
      </div>
    )
  }

  const renderForm = () => {
    return (
      <FixtureForm existingMatch={match} venues={venues} division={division} homeTeam={homeTeam} awayTeam={awayTeam} />
    )
  }

  if (!loaded) return <div>Loading...</div>

  return (
    <div>
      <Breadcrumb list={
        [
          {lbl:'CALENDAR', url:'../../../calendar'},
          {lbl: match && match.label || 'NEW'}
        ]
      } />
      {renderForm()}
      {(!!match) && renderCards()}
    </div>
  )

}

export default MatchPage


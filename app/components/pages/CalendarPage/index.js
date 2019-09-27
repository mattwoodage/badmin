import React, { useState, useEffect, useContext } from 'react'
import Match from '../../Match'
import Day from '../../Day'
import ReactMoment from 'react-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import Panel from '../../Panel'

import styles from './Matches.scss'

import Button from '@material-ui/core/Button';

import { LeagueContext } from '../../Root'
import DB from '../../../helpers/DB'

function useData() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [matches, setMatches] = useState([])

  const leagueContext = useContext(LeagueContext);

  useEffect(() => {
    
    async function initialise() {

      const { season } = leagueContext
      if (!season) return

      setLoading(true)
      leagueContext.startLoad()

      const response = await DB.get(`/api/${season.period}/matches`)
      
      setMatches(response.matches)
      setLoaded(true)
      leagueContext.stopLoad()

    }
    if (!loading) initialise()
  });

  return [matches, loaded]
}

function CalendarPage() {

  const leagueContext = useContext(LeagueContext);
  const { season } = leagueContext

  if (!season) return (<div>loading...</div>)

  const moment = extendMoment(Moment)

  const startDate = moment(`1 Sep ${season.startYear}`)
  const endDate = startDate.clone().add(40, 'weeks')

  const [current, setCurrent] = useState(startDate)

  const [matches, loaded] = useData()

  

  

  
  

  const renderCalendar = () => {

    const currentMonth = current.month()

    const monthStart = moment(`1 ${current.format("MMMM YYYY")}`)
    const monthEnd = monthStart.clone().add(1, 'month').add(-1, 'day')

    const firstDayOfMonth = monthStart.clone().format('D')
    const lastDayOfMonth = monthEnd.clone().format('D')

    let weekday = Number(monthStart.format('d'))

    if (weekday === 0) weekday = 7
    monthStart.add(-weekday + 1, 'days')

    weekday = Number(monthEnd.format('d'))

    if (weekday !== 0) monthEnd.add(7-weekday, 'days')
    const range = moment.range(monthStart, monthEnd)

    console.log(firstDayOfMonth, lastDayOfMonth)

    return Array.from(range.by('days', { excludeEnd: false })).map(date => {
      let thisMonth = date.month()
      let dayOfWeek = Number(date.format("d"))
      let thisDate = date.format('D')
      let mthDiff = thisMonth - currentMonth
      let first = thisDate === firstDayOfMonth
      let last = thisDate === lastDayOfMonth
      let firstWeek = mthDiff===0 && thisDate - firstDayOfMonth < 7
      let lastWeek = mthDiff===0 && lastDayOfMonth - thisDate < 7

      let fromToday = moment().isSame(date, 'day')
   
      return (<Day today={fromToday} firstWeek={firstWeek} lastWeek={lastWeek} firstDayOfMonth={first} lastDayOfMonth={last} before={mthDiff === -1} after={mthDiff === 1} dayOfWeek={dayOfWeek} key={date} date={date} matches={matchesOnDay(date)} />)
    })
  }

  const matchesOnDay = (day) => {
    if (!matches) return
    return matches.filter(m => {
      return day.isSame(m.startAt, 'day')
    })
  }

  const gotoDate = (date) => {
    let mth = date.format("MMMM")
    setCurrent(date)
  }

  const renderMenu = () => {
    if (!startDate || !current) return

    const range = moment.range(startDate, endDate)

    let currentMth = current.format("MMMM")

    return Array.from(range.by('months', { excludeEnd: true })).map(date => {
      const mth = date.format("MMMM")
      const mthLbl = date.format("MMM")
      let cls = 'buttonOff'
      if (currentMth === mth) {
        cls = ''
      }

      return (
        <button className={`button monthLink ${cls}`} onClick={() => {gotoDate(date)}}>{mthLbl}</button>
      )
    })
  }


  return (
    <div>
      <h1>CALENDAR</h1>

      <div className='menu'>{renderMenu()}</div>

      <h2>{current && current.format("MMMM YYYY").toUpperCase()}</h2>
      <div class='calendar'>
        {renderCalendar()}
      </div>
    </div>
  )

}


export default CalendarPage


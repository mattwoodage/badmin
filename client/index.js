import React from 'react';
import {render} from 'react-dom';
import { Switch, Route, browserHistory } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Root from '../app/components/Root'


import HomePage from '../app/components/pages/HomePage'
import MatchesPage from '../app/components/pages/MatchesPage'
import CalendarPage from '../app/components/pages/CalendarPage'
import ClubsPage from '../app/components/pages/ClubsPage'
import PlayersPage from '../app/components/pages/PlayersPage'
import TablesPage from '../app/components/pages/TablesPage'



function onRouterUpdate () {
  console.log('router updated!')
}

render((
  <BrowserRouter history={browserHistory} onUpdate={onRouterUpdate}>
    <Root>
      <Route path='/:season/home' component={HomePage} />
      <Route path='/:season/calendar' component={CalendarPage} />
      <Route path='/:season/matches' component={MatchesPage} />
      <Route path='/:season/clubs' component={ClubsPage} />
      <Route path='/:season/players' component={PlayersPage} />
      <Route path='/:season/tables' component={TablesPage} />
    </Root>
  </BrowserRouter>
), document.getElementById('app'));
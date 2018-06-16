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
import GridsPage from '../app/components/pages/GridsPage'
import LoginPage from '../app/components/pages/LoginPage'



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
      <Route path='/:season/grids' component={GridsPage} />
      <Route path='/:season/login' component={LoginPage} />
    </Root>
  </BrowserRouter>
), document.getElementById('app'));
import React from 'react';
import {render} from 'react-dom';
import { Switch, Route } from 'react-router'
import browserHistory from 'history/createBrowserHistory'
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
import MatchPage from '../app/components/pages/MatchPage'
import ClubPage from '../app/components/pages/ClubPage'
import MembersPage from '../app/components/pages/MembersPage'
import AdminPage from '../app/components/pages/AdminPage'
import SeasonsPage from '../app/components/pages/SeasonsPage'
import DivisionsPage from '../app/components/pages/DivisionsPage'


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
      <Route path='/:season/match/:match' component={MatchPage} />
      <Route exact path='/:season/club/:club' component={ClubPage} />
      <Route exact path='/:season/club/:club/members' component={MembersPage} />
      <Route exact path='/:season/grids' component={GridsPage} />

      <Route exact path='/:season/login' component={LoginPage} />
      <Route exact path='/:season/admin' component={AdminPage} />
      <Route exact path='/:season/seasons' component={SeasonsPage} />
      <Route exact path='/:season/divisions' component={DivisionsPage} />
    </Root>
  </BrowserRouter>
), document.getElementById('app'));
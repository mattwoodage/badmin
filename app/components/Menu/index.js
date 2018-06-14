import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import yellow from '@material-ui/core/colors/yellow';
import grey from '@material-ui/core/colors/grey';

import MenuIcon from '@material-ui/icons/Menu';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import styles from './Menu.css'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Save from '@material-ui/icons/Save';
import HomeIcon from '@material-ui/icons/Home';
import CalendarIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import TableIcon from '@material-ui/icons/ViewList';
import GridIcon from '@material-ui/icons/ViewModule';
import ResultsIcon from '@material-ui/icons/VerifiedUser';
import SettingsIcon from '@material-ui/icons/Settings';

import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';

import Logo from '../../images/hwba_logo.png';

const drawerWidth = 240;


const classes = theme => ({
  palette: {
    primary: {
      light: '#00FF00',
      main: '#FF0000',
      dark: '#0000FF',
      contrastText: '#000',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  fullList: {
    width: 'auto',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    height: '100%',
    width: '200px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  }
});

class Menu extends Component {

  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  drawerOnOpen = () => {
    console.log('opened')
  }

  drawerOnClose = () => {
    console.log('closed')
    this.setState({ open: false });
  }

  render () {

    const { classes, theme, league, season, isLoggedIn } = this.props;

    const leagueName = league ? league.name : 'League Not Found'
    const path = season ? season.period : '2017-18'

    return (
      <div>
        <div className={styles.header}>
          <div className={styles.menuButtonContainer}>
            <IconButton
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={styles.menuButton}>
              <MenuIcon />
            </IconButton>
          </div>
          <img width="270" src={Logo} />
          { isLoggedIn ? '[LOGGED IN]' : '[x]' }
        </div>

      <SwipeableDrawer

        open={this.state.open}
        onOpen={this.drawerOnOpen}
        onClose={this.drawerOnClose}

      >
        <div className={styles.list}>
          <div className={styles.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <NavLink activeClassName='current' to={`/${path}/home`} >
              <ListItem button>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Homepage" />
              </ListItem>
            </NavLink>
            <NavLink activeClassName='current' to={`/${path}/calendar`} >
              <ListItem button>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText primary="Calendar" />
              </ListItem>
            </NavLink>
            <NavLink activeClassName='current' to={`/${path}/matches`} >
              <ListItem button>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Matches" />
              </ListItem> 
            </NavLink>
            <NavLink activeClassName='current' to={`/${path}/results`} >
              <ListItem button>
                <ListItemIcon>
                  <ResultsIcon />
                </ListItemIcon>
                <ListItemText primary="Results" />
              </ListItem> 
            </NavLink>
            <NavLink activeClassName='current' to={`/${path}/tables`} >
              <ListItem button>
                <ListItemIcon>
                  <TableIcon />
                </ListItemIcon>
                <ListItemText primary="Tables" />
              </ListItem> 
            </NavLink>
            <NavLink activeClassName='current' to={`/${path}/grids`} >
              <ListItem button>
                <ListItemIcon>
                  <GridIcon />
                </ListItemIcon>
                <ListItemText primary="Grids" />
              </ListItem> 
            </NavLink>
            <NavLink activeClassName='current' to={`/${path}/clubs`} >
              <ListItem button>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Clubs" />
              </ListItem> 
            </NavLink>
            <NavLink activeClassName='current' to={`/${path}/players`} >
              <ListItem button>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Players" />
              </ListItem> 
            </NavLink>

          </List>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </div>
      </SwipeableDrawer>
    </div>



    )
  }
}

export default Menu


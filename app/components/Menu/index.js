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

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Save from '@material-ui/icons/Save';
import HomeIcon from '@material-ui/icons/Home';
import CalendarIcon from '@material-ui/icons/DateRange';
import EventIcon from '@material-ui/icons/Event';
import TableIcon from '@material-ui/icons/ViewList';
import ResultsIcon from '@material-ui/icons/VerifiedUser';
import SettingsIcon from '@material-ui/icons/Settings';

const drawerWidth = 240;


const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
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
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: yellow['A700']
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
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
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
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
  }

  render () {

    const { classes, theme, league, season } = this.props;

    console.log('SEASON = ', season)

    const leagueName = league ? league.name : 'League Not Found'
    const path = season ? season.period : '2017-18'

    return (
      <div>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color='inherit'
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color='inherit' noWrap>
              {leagueName}
              <b>
              {' : ' + path}
              </b>
            </Typography>
          </Toolbar>
        </AppBar>

      <SwipeableDrawer
        variant="permanent"
        classes={{
          paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
        }}
        open={this.state.open}
        onOpen={this.drawerOnOpen}
        onClose={this.drawerOnClose}

      >
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
              <ListItem button>
                <ListItemIcon>
                  <TableIcon />
                </ListItemIcon>
                <ListItemText primary="Players" />
              </ListItem> 
              <ListItem button>
                <ListItemIcon>
                  <TableIcon />
                </ListItemIcon>
                <ListItemText primary="Clubs" />
              </ListItem> 
              <ListItem button>
                <ListItemIcon>
                  <TableIcon />
                </ListItemIcon>
                <ListItemText primary="Venues" />
              </ListItem> 
               <ListItem button>
                <ListItemIcon>
                  <TableIcon />
                </ListItemIcon>
                <ListItemText primary="Rules" />
              </ListItem> 
            </List>
            <Divider />
              <ListItem button>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>

              <ul>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/home`} >Home</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/calendar`} >Calendar</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/matches`} >Matches</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/tables`} >Tables</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/clubs`} >Clubs</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/players`} >Players</NavLink></li>
          <li><NavLink activeClassName='current' to={`/${this.props.season}/admin`} >[ ADMIN ]</NavLink></li>
        </ul>

          </SwipeableDrawer>
      </div>



    )
  }
}

export default withStyles(styles, { withTheme: true })(Menu)


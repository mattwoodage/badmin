import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import classNames from 'classnames';

import CurrentUser from '../CurrentUser'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Loader from '../Loader'

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
import SettingsIcon from '@material-ui/icons/Settings';
import LockIcon from '@material-ui/icons/Lock';

import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';

import LogoHWBA from '../../images/hwba_logo.png';
import LogoRBA from '../../images/rba_logo.png';
import LogoWMBL from '../../images/wmbl_logo.png';

const drawerWidth = 240;

const logos = {
  hwba: LogoHWBA,
  rba: LogoRBA,
  wmbl: LogoWMBL 
}

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


const pages = [
  {
    name: 'Home',
    icon: <HomeIcon />
  },
  {
    name: 'Calendar',
    icon: <CalendarIcon />
  },
  {
    name: 'Matches',
    icon: <EventIcon />
  },
  {
    name: 'Grids',
    icon: <GridIcon />
  },
  {
    name: 'Tables',
    icon: <TableIcon />
  },
  {
    name: 'Clubs',
    icon: <PeopleIcon />
  },
  {
    name: 'Players',
    icon: <PersonIcon />
  },
  {
    name: 'Settings',
    icon: <SettingsIcon />
  },
  {
    name: 'Login',
    icon: <LockIcon />
  }
]

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

  path = () => {
    const { season } = this.props;
    return season ? season.period : '2017-18'
  }

  renderHorizontalMenu = () => {
    return pages.map(p => {
      return (
        <li>
          <NavLink className={styles.horizItem} activeClassName={styles.horizCurrent} to={`/${this.path()}/${p.name.toLowerCase()}`} >
            {p.name.toLowerCase()}
          </NavLink>
        </li>
      )
    })
  }

  renderVerticalMenu = () => {
    return pages.map(p => {
      return (
        <ListItem component={NavLink} activeClassName={styles.vertCurrent} to={`/${this.path()}/${p.name.toLowerCase()}`} button>

            <ListItemIcon>
              {p.icon}
            </ListItemIcon>
            <ListItemText primary={p.name} />

        </ListItem>
      )
    })
  }

  selectSeason = (e) => {
    document.location = '/' + e.target.value
  }

  renderSeasons = () => {
    const { season, seasons } = this.props;
    if (!seasons) return
    return (
      <select className={styles.selectSeason} onChange={this.selectSeason}>
        { seasons.map((s) => {
          return <option selected={(season.period === s)}>{s}</option>
          })
        }
      </select>
    )
  }

  render () {
    const { classes, season, theme, league, isLoggedIn, nickname, doLogOut } = this.props;
    const leagueName = league ? league.name : 'League Not Found'
    let headerStyles = styles.header

    if (season && season.current) headerStyles += ' ' + styles.current

    return (
      <div>
        <div className={headerStyles}>
          <div className={styles.menuButtonContainer}>
            <IconButton
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={styles.menuButton}>
              <MenuIcon />
            </IconButton>
          </div>
          { league && <img width="270" src={logos[league.short.toLowerCase()]} /> }
          <div className={styles.currentUser} >
            <CurrentUser doLogOut={doLogOut} isLoggedIn={isLoggedIn} nickname={nickname} />
          </div>
          <ul className={styles.horizList}>
            {this.renderHorizontalMenu()}
          </ul>

          <Loader loading={this.props.loading} />

          {this.renderSeasons()}
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
              {this.renderVerticalMenu()}
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    )
  }
}

export default Menu


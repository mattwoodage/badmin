import React, { Component } from 'react'
import Menu from '../Menu'
import Footer from '../Footer'
import DB from '../../helpers/DB'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';


export const LeagueContext = React.createContext()

const drawerWidth = 240;

// const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const styles = theme => ({
  root: {
    flexGrow: 1,
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
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#fafafa',
    borderLeft: '1px solid #ccc',
    padding: theme.spacing.unit * 3,
  },
});

class Root extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    const host = document.location.hostname
    const leagueShort = host.split('.')[0].toUpperCase()
    const seasonPeriod = document.location.pathname.split('/')[1]
    this.initialise(leagueShort, seasonPeriod)
  }

  initialise (leagueShort, seasonPeriod) {
    if (seasonPeriod.length === 0) seasonPeriod='x'
    DB.get(`/api/${seasonPeriod}/seasons`)
      .then(response => {
        this.setState({
          league: response.league,
          season: response.season
        })
      })
  }

  render () {

    const { classes, theme } = this.props;

    const context = {
      league: this.state.league,
      season: this.state.season
    }

    return (
      <LeagueContext.Provider value={context}>
        <div className={classes.root}>
          
          <Menu league={this.state.league} season={this.state.season} />
          
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {this.props.children}
          </main>
        </div>
        
      </LeagueContext.Provider>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Root)


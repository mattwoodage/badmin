import React, { Component } from 'react'
import Player from '../Player'
import Panel from '../Panel'
import DB from '../../helpers/DB'
import styles from './PlayerSearch.scss'


class PlayerSearch extends Component {

  state = {
    players: [],
    loaded: false,
    loading: false,
    search : '',
    searchLetter: ''
  }

  initialise () {
    const { league, season } = this.props
    if (!league || !season) return

    this.setState({
      loading: true
    })

    DB.get(`/api/${season.period}/players`)
      .then(response => {
        this.setState({
          players: response.players,
          loaded: true
        })
      })
  }

  renderList () {
    const { players, search, searchLetter} = this.state
    
    let total = players

    if (search !== '') total = players.filter(p => p.name.toUpperCase().includes(search))
    if (searchLetter !== '') total = total.filter(p => p.lastName.slice(0,1).toUpperCase() === searchLetter || p.firstName.slice(0,1).toUpperCase() === searchLetter)
    
    const filtered = total.slice(0,30)

    let title = 'SHOWING ' + filtered.length + ' OF ' + total.length + ' PLAYERS'
    if (searchLetter!=='') title += ' starting with \'' + searchLetter + '\''
    if (search!=='') title += ' containing \'' + search + '\''

    return (
      <div>
        <h2>{title}</h2>
        <div>
        {
          filtered.map(player => {
            return (
              <Player key={player.key} player={player} />
            )
          })
        }
        </div>
      </div>
    )
  }

  componentDidMount () {
    if (!this.state.loading) this.initialise()
  }

  componentDidUpdate () {
    if (!this.state.loading) this.initialise()
  }

  handleChange = (e) => {
    this.setState({search: e.target.value.toUpperCase()});
  }

  selectLetter = (l, e) => {
    e.preventDefault()
    const newLetter = this.state.searchLetter === l ? '' : l
    this.setState({searchLetter: newLetter});
  }

  render () {
    const { search, searchLetter } = this.state
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    return (
      <form>
        <div className='letters'>
        {
          letters.split('').map(l => {
            let cls = 'button'
            if (l !== searchLetter) cls += ' buttonOff'
            return (
            <a href='#' className={cls} onClick={(e) => this.selectLetter(l, e)}>{l}</a>
            )
          })
        }
        </div>
        <input type="text" onChange={this.handleChange} />
        <hr />
        
        {this.renderList()}

      </form>
    )
  }
}

export default PlayerSearch


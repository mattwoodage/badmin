import React, { Component } from 'react'

import Player from '../Player'

import Panel from '../Panel'

import DB from '../../helpers/DB'


class PlayerSearch extends Component {

  state = {
    players: [],
    loaded: false,
    loading: false,
    search : '',
    surname: ''
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
    const { players, search, surname} = this.state

    let total = players

    if (search.length > 1) total = players.filter(p => p.name.toUpperCase().includes(search))
    if (surname !== '') total = total.filter(p => p.lastName.slice(0,1).toUpperCase() === surname)
    
    const filtered = total.slice(0,30)

    return (
      <div>
      {total.length} matches
      {
        filtered.map(player => {
          return (
            <Player key={player.key} player={player} />
          )
        })
      }
      {filtered.length < total.length ? 'plus ' + (total.length-filtered.length) + ' more' : ''}
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

  selectLetter = (l) => {
    this.setState({surname: l});
  }

  render () {
    const { search, surname } = this.state
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let title = 'PLAYERS'
    if (search.length>1) title += ' containing \'' + search + '\''
    return (
      <form>
        <h2>{title}</h2>
        {
          letters.split('').map(l => (
            <a href='#' className='button' onClick={() => this.selectLetter(l)}>{l}</a>
          ))
        }
        <input type="text" onChange={this.handleChange} />
        <hr />
        {this.renderList()}

      </form>
    )
  }
}

export default PlayerSearch


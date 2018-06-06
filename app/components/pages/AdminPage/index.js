import React, { Component } from 'react'
import Root from '../../Root'
import Club from '../../Club'

class AdminPage extends Component {

  constructor () {
    super()
    this.state = {
      active: false
    }
  }

  start = () => {
    console.log('starting....')
    this.setState({active: true})

    this.textarea.value = 'starting'
  }

  render () {
    return (
      <Root league={this.props.league} season={this.props.season} >
        <div>
          <h1>ADMIN {this.state.active}</h1>
          <a href='#' onClick={this.start}>{this.state.active ? 'STARTED...' : 'START'}</a>
          <textarea ref={(node) => { this.textarea = node }} />
        </div>
      </Root>
    )
  }
}

export default AdminPage

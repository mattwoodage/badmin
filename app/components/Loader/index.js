import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Loader.scss';

class Loader extends Component {

  
  render() {

    if (!this.props.loading) return null

    return (
      <div className="loading animated fadeIn">
        <div className="bg" style={{ opacity:0.3 }}></div>
      </div>
    );

  }
}

export default Loader;
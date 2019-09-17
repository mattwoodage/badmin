import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Loader.scss';

class Loader extends Component {

  
  render() {

    const style = this.props.loading ? { opacity:0.3 } : {}

    return (
      <div className="loading animated fadeIn">
        <div className="bg" style={style}></div>
      </div>
    );

  }
}

export default Loader;
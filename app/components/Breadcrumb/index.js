import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Breadcrumb.scss';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { NavLink } from 'react-router-dom'

class Breadcrumb extends Component {
  render() {
    
    return (
      <div className='breadcrumb'>
        {
          this.props.list.map(item => {
            if (!item.url) return (
              <h1>{item.lbl}</h1>
            )
            return (
              <NavLink to={item.url}>
                <h1>
                  {item.lbl}
                  <ChevronRightIcon />
                </h1>
              </NavLink>
            )
          })
        }
      </div>
    );
  }
}

export default Breadcrumb;
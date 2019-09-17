import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Breadcrumb.scss';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

class Breadcrumb extends Component {
  render() {
    
    return (
      <div className={styles.breadcrumb}>
        {
          React.Children.map(this.props.children, (x,i) => {
            if (i === this.props.children.length-1) return x
            return (
              <h1>
                {x}
                <ChevronRightIcon />
              </h1>
            )
          })
        }
      </div>
    );
  }
}

export default Breadcrumb;
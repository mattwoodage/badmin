import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Notification.scss';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';


class Notification extends Component {
  render() {
    let cls = styles.notification
    if (this.props.type) cls += ' ' + styles[this.props.type]
    return (
      <div className={cls}>
        <WarningIcon />
        <Typography variant="title">{this.props.text}</Typography>
      </div>
    );
  }
}

export default Notification;
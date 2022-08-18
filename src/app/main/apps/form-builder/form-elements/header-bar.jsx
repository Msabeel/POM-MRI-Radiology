/**
  * <HeaderBar />
  */

import React from 'react';
import Grip from '../multi-column/grip';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';


export default class HeaderBar extends React.Component {
  render() {
    return (
      <div className="toolbar-header">
        <span className="badge badge-secondary">{this.props.data.text}</span>
        <div className="toolbar-header-buttons flex">
          { this.props.data.element !== 'LineBreak' &&
            <div className="btn is-isolated" onClick={this.props.editModeOn.bind(this.props.parent, this.props.data)}>
              <IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20" color="inherit">
                <Icon>edit</Icon>
              </IconButton>
            </div>
          }
          <div className="btn is-isolated" onClick={this.props.onDestroy.bind(this, this.props.data)}>
            <IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20" color="inherit">
                <Icon>delete</Icon>
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

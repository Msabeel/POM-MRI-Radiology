/**
  * <ToolbarItem />
  */

import React from 'react';
import ID from './UUID';

const cardSource = {
  beginDrag(props) {
    return {
      id: ID.uuid(),
      index: -1,
      data: props.data,
      onCreate: props.onCreate,
    };
  },
};

class PlaceholderItem extends React.Component {
  render() {
    const { data, onClick, handleDragStart } = this.props;

    function dragStart(event, data) {
      event.dataTransfer.setData("text/plain", "[" + data.name + "]");
    }
    
    function dragging(event) {
      console.log("The p element is being dragged");
    }

    return (
        <li onClick={onClick} onDragStart={(e) => dragStart(e, data)} onDrag={dragging} draggable="true"><i className={data.icon}></i>{data.name}</li>
    );
  }
}

export default PlaceholderItem;

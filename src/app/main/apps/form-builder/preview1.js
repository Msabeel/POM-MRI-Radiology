/**
  * <Preview />
  */

 import React, { useEffect, useRef, useState } from 'react';
 import { useDispatch, useSelector } from 'react-redux';
 import update from 'immutability-helper';
 import store from './store/store';
 import FormElementsEdit from './form-elements-edit';
 import SortableFormElements from './sortable-form-elements';
 import './form-builder.css';
import { openEditDialog } from './store/formBuilderSlice';
import EditDialog from './EditDialog';

 const { PlaceHolder } = SortableFormElements;
 
function Preview (props) {
    const { onLoad, onPost } = props;
    const [state, setState]=useState({
		data: props.data || [],
        answer_data: {},
        seq: 0
  	});
    const dispatch = useDispatch();
    store.setExternalHandler(onLoad, onPost);
    
    const editForm = useRef(null);

    // this.editForm = React.createRef();
    // const onUpdate = _onChange.bind(this);
    // store.subscribe(state => _onChange(state.data));

    useEffect(() => {
        const { data, url, saveUrl } = props;
        store.subscribe(state => _onChange(state.data));
        store.dispatch('load', { loadUrl: url, saveUrl, data: data || [] });
        document.addEventListener('mousedown', editModeOff);
    }, [props.data]);

        
//    componentWillUnmount() {
//      document.removeEventListener('mousedown', this.editModeOff);
//    }
 
   function editModeOff (e) {
     if (editForm.current && !editForm.current.contains(e.target)) {
       manualEditModeOff();
     }
   }
 
   function manualEditModeOff () {
     const { editElement } = props;
     if (editElement && editElement.dirty) {
       editElement.dirty = false;
       updateElement(editElement);
     }
     props.manualEditModeOff();
   }
 
   function _setValue(text) {
     return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
   }
 
   function updateElement(element) {
     let data = [...state.data];
     let found = false;
 
     for (let i = 0, len = data.length; i < len; i++) {
       if (element.id === data[i].id) {
         data[i] = element;
         found = true;
         break;
       }
     }
 
     if (found) {
        const seq = state.seq > 100000 ? 0 : state.seq + 1;
        setState({...state, seq, data });  
        store.dispatch('updateOrder', data);
        props.updateElementData(data);
     }
   }
 
   function _onChange(data) {
     const answer_data = {};
 
     data.forEach((item) => {
       if (item && item.readOnly && props.variables[item.variableKey]) {
         answer_data[item.field_name] = props.variables[item.variableKey];
       }
     });
 
     setState({
        ...state,
       data,
       answer_data,
     });
     props.updateElementData(data);
   }
 
   function _onDestroy(item) {
     if (item.childItems) {
       item.childItems.forEach(x => {
         const child = getDataById(x);
         if (child) {
           store.dispatch('delete', child);
         }
       });
     }
     store.dispatch('delete', item);
     props.deleteElementData(item);
   }
 
   function getDataById(id) {
     const { data } = state;
     return data.find(x => x && x.id === id);
   }
 
   function swapChildren(data, item, child, col) {
     if (child.col !== undefined && item.id !== child.parentId) {
       return false;
     }
     if (!(child.col !== undefined && child.col !== col && item.childItems[col])) {
       // No child was assigned yet in both source and target.
       return false;
     }
     const oldId = item.childItems[col];
     const oldItem = getDataById(oldId);
     const oldCol = child.col;
     // eslint-disable-next-line no-param-reassign
     item.childItems[oldCol] = oldId; oldItem.col = oldCol;
     // eslint-disable-next-line no-param-reassign
     item.childItems[col] = child.id; child.col = col;
     store.dispatch('updateOrder', data);
     return true;
   }
 
   function setAsChild(item, child, col) {
     const { data } = state;
     if (swapChildren(data, item, child, col)) {
       return;
     }
     const oldParent = getDataById(child.parentId);
     const oldCol = child.col;
     // eslint-disable-next-line no-param-reassign
     item.childItems[col] = child.id; child.col = col;
     // eslint-disable-next-line no-param-reassign
     child.parentId = item.id;
     // eslint-disable-next-line no-param-reassign
     child.parentIndex = data.indexOf(item);
     if (oldParent) {
       oldParent.childItems[oldCol] = null;
     }
     const list = data.filter(x => x && x.parentId === item.id);
     const toRemove = list.filter(x => item.childItems.indexOf(x.id) === -1);
     let newData = data;
     if (toRemove.length) {
       // console.log('toRemove', toRemove);
       newData = data.filter(x => toRemove.indexOf(x) === -1);
     }
     if (!getDataById(child.id)) {
       newData.push(child);
     }
     store.dispatch('updateOrder', newData);
   }
 
   function removeChild(item, col) {
     const { data } = state;
     const oldId = item.childItems[col];
     const oldItem = getDataById(oldId);
     if (oldItem) {
       const newData = data.filter(x => x !== oldItem);
       // eslint-disable-next-line no-param-reassign
       item.childItems[col] = null;
       // delete oldItem.parentId;
       const seq = state.seq > 100000 ? 0 : state.seq + 1;
       store.dispatch('updateOrder', newData);
       setState({ ...state, seq, data: newData });
     }
   }
 
   function restoreCard(item, id) {
     const { data } = state;
     const parent = getDataById(item.data.parentId);
     const oldItem = getDataById(id);
     if (parent && oldItem) {
       const newIndex = data.indexOf(oldItem);
       const newData = [...data]; // data.filter(x => x !== oldItem);
       // eslint-disable-next-line no-param-reassign
       parent.childItems[oldItem.col] = null;
       delete oldItem.parentId;
       // eslint-disable-next-line no-param-reassign
       delete item.setAsChild;
       // eslint-disable-next-line no-param-reassign
       delete item.parentIndex;
       // eslint-disable-next-line no-param-reassign
       item.index = newIndex;
       const seq = state.seq > 100000 ? 0 : state.seq + 1;
       store.dispatch('updateOrder', newData);
       setState({ ...state, seq, data: newData });
     }
   }
 
   function insertCard(item, hoverIndex, id) {
     const { data } = state;
     if (id) {
       restoreCard(item, id);
     } else {
       data.splice(hoverIndex, 0, item);
       saveData(item, hoverIndex, hoverIndex);
     }
   }
 
   function moveCard(dragIndex, hoverIndex) {
     const { data } = state;
     const dragCard = data[dragIndex];
     saveData(dragCard, dragIndex, hoverIndex);
   }
 
   // eslint-disable-next-line no-unused-vars
   function cardPlaceHolder(dragIndex, hoverIndex) {
     // Dummy
   }
 
   function saveData(dragCard, dragIndex, hoverIndex) {
     const newData = update(state, {
       data: {
         $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
       },
     });
     setState({ ...state, ...newData });
     store.dispatch('updateOrder', newData.data);
    }
 
   function getElement(item, index) {
     if (item.custom) {
       if (!item.component || typeof item.component !== 'function') {
         // eslint-disable-next-line no-param-reassign
         item.component = props.registry.get(item.key);
       }
     }
     const SortableFormElement = SortableFormElements[item.element];
 
     if (SortableFormElement === null) {
       return null;
     }
     return <SortableFormElement id={item.id} seq={state.seq} index={index} moveCard={moveCard} insertCard={insertCard} mutable={false} parent={props.parent} editModeOn={props.editModeOn} isDraggable={true} key={item.id} sortData={item.id} data={item} getDataById={getDataById} setAsChild={setAsChild} removeChild={removeChild} _onDestroy={_onDestroy} />;
   }
 
    let classes = props.className;
    if (props.editMode) { 
        // classes += ' is-editing'; 
        // dispatch(openEditDialog());
    }
    const data = state.data.filter(x => !!x && !x.parentId);
    const items = data.map((item, index) => getElement(item, index));
    return (
        <div className={classes}>
            {props.editElement !== null &&
			          <EditDialog 
                  ref={editForm} 
                  showCorrectColumn={props.showCorrectColumn} 
                  files={props.files} 
                  editMode={props.editMode}
                  manualEditModeOff={manualEditModeOff} 
                  preview={this} 
                  element={props.editElement} 
                  data={state.data} 
                  updateElement={updateElement} />
            }
            {/* <div className="edit-form" ref={editForm}>
            {props.editElement !== null &&
                <FormElementsEdit showCorrectColumn={props.showCorrectColumn} files={props.files} manualEditModeOff={manualEditModeOff} preview={this} element={props.editElement} updateElement={updateElement} />
            }
            </div> */}
            <div className="Sortable">{items}</div>
            <PlaceHolder id="form-place-holder" show={items.length === 0} index={items.length} moveCard={cardPlaceHolder} insertCard={insertCard} />
        </div>
    );
 }
 Preview.defaultProps = {
   showCorrectColumn: false, files: [], editMode: false, editElement: null, className: 'w-3/4 react-form-builder-preview float-left',
 };
 
 export default Preview;
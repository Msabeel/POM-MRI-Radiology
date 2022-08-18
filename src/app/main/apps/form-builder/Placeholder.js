/**
  * <Toolbar />
  */

 import React from 'react';
 import PlaceholderItem from './placeholder-draggable-item';
 import ID from './UUID';
 import store from './store/store';
 import './form-builder.css';
import PlaceHolder from './form-place-holder';

 function isDefaultItem(item) {
   const keys = Object.keys(item);
   return keys.filter(x => x !== 'element' && x !== 'key').length === 0;
 }
 
 function buildItems(items, defaultItems) {
   if (!items) {
     return defaultItems;
   }
   return items.map(x => {
     let found;
     if (isDefaultItem(x)) {
       found = defaultItems.find(y => (x.element || x.key) === (y.element || y.key));
     }
     return found || x;
   });
 }
 
 export default class Placeholder extends React.Component {
   constructor(props) {
     super(props);
 
     const items = buildItems(props.items, this._defaultItems());
     this.state = {
       items,
     };
     store.subscribe(state => this.setState({ store: state }));
   }
 
   static _defaultItemOptions(element) {
     switch (element) {
       case 'Dropdown':
         return [
           { value: 'place_holder_option_1', text: 'Place holder option 1', key: `dropdown_option_${ID.uuid()}` },
           { value: 'place_holder_option_2', text: 'Place holder option 2', key: `dropdown_option_${ID.uuid()}` },
           { value: 'place_holder_option_3', text: 'Place holder option 3', key: `dropdown_option_${ID.uuid()}` },
         ];
       case 'Tags':
         return [
           { value: 'place_holder_tag_1', text: 'Place holder tag 1', key: `tags_option_${ID.uuid()}` },
           { value: 'place_holder_tag_2', text: 'Place holder tag 2', key: `tags_option_${ID.uuid()}` },
           { value: 'place_holder_tag_3', text: 'Place holder tag 3', key: `tags_option_${ID.uuid()}` },
         ];
       case 'Checkboxes':
         return [
           { value: 'place_holder_option_1', text: 'Place holder option 1', key: `checkboxes_option_${ID.uuid()}` },
           { value: 'place_holder_option_2', text: 'Place holder option 2', key: `checkboxes_option_${ID.uuid()}` },
           { value: 'place_holder_option_3', text: 'Place holder option 3', key: `checkboxes_option_${ID.uuid()}` },
         ];
       case 'RadioButtons':
         return [
           { value: 'place_holder_option_1', text: 'Place holder option 1', key: `radiobuttons_option_${ID.uuid()}` },
           { value: 'place_holder_option_2', text: 'Place holder option 2', key: `radiobuttons_option_${ID.uuid()}` },
         ];
       default:
         return [];
     }
   }
 
   _defaultItems() {
     return [
       {
         key: 'Header',
         name: 'Header Text',
         icon: 'fas fa-heading',
         static: true,
         content: 'Placeholder Text...',
       },
       {
        key: 'Paragraph',
        name: 'Paragraph',
        static: true,
        icon: 'fas fa-paragraph',
        content: 'Placeholder Text...',
       },
       {
         key: 'RadioButtons',
         canHaveAnswer: true,
         name: 'Radio Buttons',
         icon: 'far fa-dot-circle',
         label: 'Placeholder Label',
         field_name: 'radiobuttons_',
         options: [],
       },
       {
        key: 'Checkboxes',
        canHaveAnswer: true,
        name: 'Checkboxes',
        icon: 'far fa-check-square',
        label: 'Placeholder Label',
        field_name: 'checkboxes_',
        options: [],
      },
      {
        key: 'DatePicker',
        canDefaultToday: true,
        canReadOnly: true,
        dateFormat: 'MM/dd/yyyy',
        timeFormat: 'hh:mm aa',
        showTimeSelect: false,
        showTimeSelectOnly: false,
        name: 'Date',
        icon: 'far fa-calendar-alt',
        label: 'Placeholder Label',
        field_name: 'date_picker_',
      },
      {
        key: 'Signature',
        canReadOnly: true,
        name: 'Signature',
        icon: 'fas fa-pen-square',
        label: 'Signature',
        field_name: 'signature_',
      },
     ];
   }
 
   render() {
     return (
       <>
       <div className="react-form-builder-toolbar float-right overflow-y-auto" style={{ position:'absolute', right:'0', maxHeight: '100%', backgroundColor: '#f6f7f9' }}>
         <h4>{this.props.placeHolderName}</h4>
         <ul>
           {
             this.props.placeHolders.map((item) => (<PlaceholderItem data={item} key={item.id} handleDragStart={this.props.handleDragStart} />))
           }
         </ul> 
       </div>
       
      </>
     );
   }
 }
 
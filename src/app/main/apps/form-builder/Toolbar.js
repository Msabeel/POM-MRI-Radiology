/**
  * <Toolbar />
  */

 import React from 'react';
 import ToolbarItem from './toolbar-draggable-item';
 import ID from './UUID';
 import store from './store/store';
 import Card from '@material-ui/core/Card';
 import CardContent from '@material-ui/core/CardContent';
 import Button from '@material-ui/core/Button';
 import CircularProgress from '@material-ui/core/CircularProgress';
 import Icon from '@material-ui/core/Icon';
 import IconButton from '@material-ui/core/IconButton';
 import { Link } from 'react-router-dom';
 import AppBar from '@material-ui/core/AppBar';
 import Toolbar1 from '@material-ui/core/Toolbar';
 import Typography from '@material-ui/core/Typography';
 import './form-builder.css';

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
 
 export default class Toolbar extends React.Component {
   constructor(props) {
     super(props);
 
     const items = buildItems(props.items, this._defaultItems());
     this.state = {
       items,
     };
     store.subscribe(state => this.setState({ store: state }));
     this.create = this.create.bind(this);
   }
 
   static _defaultItemOptions(element) {
     switch (element) {
       case 'Dropdown':
         return [
           { value: 'place_holder_option_1', option: 'Place holder option 1', id: `dropdown_option_${ID.uuid()}` },
           { value: 'place_holder_option_2', option: 'Place holder option 2', id: `dropdown_option_${ID.uuid()}` },
           { value: 'place_holder_option_3', option: 'Place holder option 3', id: `dropdown_option_${ID.uuid()}` },
         ];
       case 'Tags':
         return [
           { value: 'place_holder_tag_1', option: 'Place holder tag 1', id: `tags_option_${ID.uuid()}` },
           { value: 'place_holder_tag_2', option: 'Place holder tag 2', id: `tags_option_${ID.uuid()}` },
           { value: 'place_holder_tag_3', option: 'Place holder tag 3', id: `tags_option_${ID.uuid()}` },
         ];
       case 'Checkboxes':
         return [
           { value: 'place_holder_option_1', option: 'Place holder option 1', id: `checkboxes_option_${ID.uuid()}` },
           { value: 'place_holder_option_2', option: 'Place holder option 2', id: `checkboxes_option_${ID.uuid()}` },
           { value: 'place_holder_option_3', option: 'Place holder option 3', id: `checkboxes_option_${ID.uuid()}` },
         ];
       case 'RadioButtons':
         return [
           { value: 'place_holder_option_1', option: 'Place holder option 1', id: `radiobuttons_option_${ID.uuid()}` },
           { value: 'place_holder_option_2', option: 'Place holder option 2', id: `radiobuttons_option_${ID.uuid()}` },
         ];
       default:
         return [];
     }
   }
 
   _defaultItems() {
     return [
      //  {
      //    key: 'Tab',
      //    name: 'Tab',
      //    icon: 'fas fa-table',
      //    static: true,
      //    question: 'Tab Name',
      //    field_name: 'tab_',
      //  },
      {
        key: 'GroupRow',
        canHaveAnswer: false,
        name: 'Group Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'group_col_row_',
      },
       {
        key: 'CompanyLogo',
        name: 'Company Logo',
        icon: 'fas fa-image',
        static: true,
        question: 'Company Logo',
        position: 'center'
      },
      {
        key: 'Header',
        name: 'Header Text',
        icon: 'fas fa-heading',
        static: true,
        question: 'Placeholder Text...',
        position: 'left'
      },
      {
        key: 'Label',
        name: 'Label Text',
        icon: 'fas fa-font',
        static: true,
        question: 'Placeholder Text...',
        position: 'left'
      },
       {
        key: 'Paragraph',
        name: 'Paragraph',
        static: true,
        icon: 'fas fa-paragraph',
        question: 'Placeholder Text...',
       },
       {
        key: 'TwoColumnRow',
        canHaveAnswer: false,
        name: 'Two Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'two_col_row_',
      },
      {
        key: 'ThreeColumnRow',
        canHaveAnswer: false,
        name: 'Three Column Row',
        label: '',
        icon: 'fas fa-columns',
        field_name: 'three_col_row_',
      },
       {
        key: 'TextInput',
        canHaveAnswer: true,
        name: 'Text Input',
        label: 'Placeholder Label',
        icon: 'fas fa-font',
        field_name: 'text_input_',
        position: 'left'
      },
       {
         key: 'RadioButtons',
         canHaveAnswer: true,
         name: 'Radio Buttons',
         icon: 'far fa-dot-circle',
         label: 'Placeholder Label',
         field_name: 'radiobuttons_',
         options: [],
         position: 'left'
      },
       {
        key: 'Checkboxes',
        canHaveAnswer: true,
        name: 'Checkboxes',
        icon: 'far fa-check-square',
        label: 'Placeholder Label',
        field_name: 'checkboxes_',
        position: 'left',
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
        key: 'TimePicker',
        canDefaultToday: true,
        canReadOnly: true,
        dateFormat: 'MM/dd/yyyy',
        timeFormat: 'hh:mm aa',
        showTimeSelect: false,
        showTimeSelectOnly: false,
        name: 'Time',
        icon: 'far fa-calendar-alt',
        label: 'Placeholder Label',
        field_name: 'time_picker_',
      },
      {
        key: 'Signature',
        // canReadOnly: true,
        static: true,
        name: 'Signature',
        icon: 'fas fa-pen-square',
        label: 'Signature',
        // field_name: 'signature_',
        position: 'left'
      },
     ];
   }
 
   create(item) {
     const elementOptions = {
       id: ID.uuid(),
       element: item.element || item.key,
       text: item.name,
       static: item.static,
       is_required: false,
       position: item.position,
       showDescription: item.showDescription,
     };
 
     if (this.props.showDescription === true && !item.static) {
       elementOptions.showDescription = true;
     }
 
     if (item.type === 'custom') {
       elementOptions.key = item.key;
       elementOptions.custom = true;
       elementOptions.forwardRef = item.forwardRef;
       elementOptions.props = item.props;
       elementOptions.component = item.component || null;
       elementOptions.custom_options = item.custom_options || [];
     }
 
     if (item.static) {
       elementOptions.bold = false;
       elementOptions.italic = false;
     }
     
     if(item.key === 'CompanyLogo') {
        const IndexSettings =  JSON.parse(localStorage.getItem('Index_Details'));
        elementOptions.question = IndexSettings.logopath;
     }

     if (item.canHaveAnswer) { elementOptions.canHaveAnswer = item.canHaveAnswer; }
 
     if (item.canReadOnly) { elementOptions.readOnly = false; }
 
     if (item.canDefaultToday) { elementOptions.defaultToday = false; }
 
     if (item.questions) { elementOptions.questions = item.questions; }
 
     if (item.href) { elementOptions.href = item.href; }
 
     elementOptions.canHavePageBreakBefore = item.canHavePageBreakBefore !== false;
     elementOptions.canHaveAlternateForm = item.canHaveAlternateForm !== false;
     elementOptions.canHaveDisplayHorizontal = item.canHaveDisplayHorizontal !== false;
     if (elementOptions.canHaveDisplayHorizontal) {
       elementOptions.inline = item.inline;
     }
     elementOptions.canHaveOptionCorrect = item.canHaveOptionCorrect !== false;
     elementOptions.canHaveOptionValue = item.canHaveOptionValue !== false;
     elementOptions.canPopulateFromApi = item.canPopulateFromApi !== false;
 
     if (item.class_name) {
       elementOptions.class_name = item.class_name;
     }
 
     if (item.key === 'Image') {
       elementOptions.src = item.src;
     }
 
     if (item.key === 'DatePicker') {
       elementOptions.dateFormat = item.dateFormat;
       elementOptions.timeFormat = item.timeFormat;
       elementOptions.showTimeSelect = item.showTimeSelect;
       elementOptions.showTimeSelectOnly = item.showTimeSelectOnly;
     }
 
     if (item.key === 'Download') {
       elementOptions._href = item._href;
       elementOptions.file_path = item.file_path;
     }
 
     if (item.key === 'Range') {
       elementOptions.step = item.step;
       elementOptions.default_value = item.default_value;
       elementOptions.min_value = item.min_value;
       elementOptions.max_value = item.max_value;
       elementOptions.min_label = item.min_label;
       elementOptions.max_label = item.max_label;
     }
 
     if (item.defaultValue) { elementOptions.defaultValue = item.defaultValue; }
 
     if (item.field_name) { elementOptions.field_name = item.field_name + ID.uuid(); }
 
     if (item.label) { elementOptions.label = item.label; }
 
     if (item.options) {
       if (item.options.length > 0) {
         elementOptions.options = item.options;
       } else {
         elementOptions.options = Toolbar._defaultItemOptions(elementOptions.element);
       }
     }
 
     return elementOptions;
   }
 
   _onClick(item) {
     // ElementActions.createElement(this.create(item));
     store.dispatch('create', this.create(item));
   }

   handleSubmit = (event) => {
      this.props.handleSave();
   }
 
   handleFormEdit = (event) => {
    this.props.handleFormEdit();
   }

   handlePrev = (event) => {
      this.props.handlePreview();
  }

   render() {
     const { formData, loading } = this.props;
     return (
       <div className="w-1/4 react-form-builder-toolbar float-right">
         <Card className="w-full mb-16 rounded-8">
           <AppBar position="static" elevation={0}>
            <Toolbar1 className="px-8">
              <Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
                Save Form
              </Typography>
              {formData.name && 
              <Typography className="mx-4 font-bold" paragraph={false}>
                  {formData.name}
                  <IconButton disableRipple className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={this.handleFormEdit}>
										<Icon>edit</Icon>
									</IconButton>
              </Typography>}
            </Toolbar1>
          </AppBar>
          <CardContent className="p-0">
              {/* <div className="flex">
                <Typography className="font-medium italic" paragraph={false}>
                  Form Name:
                </Typography>
                <Typography className="mx-4 font-bold" paragraph={false}>
                  {formData.name}
                </Typography>
              </div> */}
							<div className="flex justify-evenly pt-24">
								<Button
									variant="contained"
									style={{ float: 'right'}}
									// className={classes.selectedButton}
									color="primary"
									type="submit"
									onClick={this.handleSubmit}
									// disabled={!canBeSubmitted()}
									disabled={loading}
								>
									Save Form
									{loading && <CircularProgress className="ml-10" size={18}/>}
								</Button>
                <Button
									variant="contained"
									style={{ float: 'right'}}
									color="primary"
									type="submit"
									onClick={this.handlePrev}
								>
									Preview
								</Button>
                {/* <Link style={{ textDecoration: "none" }} to={`/apps/formBuilder/all`}>
                  <Button
                    variant="contained"
                    style={{ float: 'right'}}
                    color="primary"
                    type="submit"
                  >
                    Back
                  </Button>
								</Link> */}
              </div>
            </CardContent>
        </Card>
         <h4>Toolbox</h4>
         <ul>
           {
             this.state.items.map((item) => (<ToolbarItem data={item} key={item.key} onClick={(e) => this._onClick(item)} onCreate={this.create} />))
           }
         </ul>
       </div>
     );
   }
 }
 
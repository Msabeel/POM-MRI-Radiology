/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker } from '@material-ui/pickers'

export default function Searchbar(props) {

  let inputRef;
  const [selectedOption, setValue] = React.useState(null);
  const [datePicker, setDatePicker] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const defaultProps = {
    getOptionLabel: (option) => (option.title)? option.title + ': ' : '',
    getOptionDisabled:(option) => option.value === '',
    renderOption: (option) => option.title
  };

  const onChange = (event, value) => {

    console.log(value);
    if(value) {
      if(value.hasOwnProperty('title')) {
        setValue(value);
        setSearchValue(value.title + ': ');
        if(value.type === 'date') {
          setDatePicker(true);
        }else if(value.type === 'dropdown') {
          allFilters = [];
          value.children.forEach( item => {
            allFilters.push({ 
              ...item,
              title: value.title + ': ' + item.title
            });

          });

        } else if(value.hasOwnProperty('isFinal')) {
          if(value.hasOwnProperty('showTitle')) {
            value.title = value.showTitle;
          }
          props.setFilterOption({ ...value });
          setValue(null);
          setSearchValue('');
          allFilters = [...defaultFilter];
        }
      }
    }
  }

  const onInputChange = (event, value, reason) => {
    if(reason === 'input') {
      
      let correctValue = event.target.value;
      if(selectedOption) {
        if(selectedOption.type === 'phone_number') {
          correctValue = correctValue.toString().replace(selectedOption.title + ':', "").trim();

          if(!Number.isInteger(Number.parseInt(correctValue))) {
            return;
          }
          if(correctValue.length > 10) {
            return;
          }

        }
      }
      setSearchValue(value);
    } else if(reason === 'clear') {
      setSearchValue('');
      allFilters = [...defaultFilter];
    } else if(reason === 'reset') {
      if(event) {
        
        if (event.keyCode === 13 && event.target.value) {
          if(selectedOption === null) {
            if(event.target.value.length > 2){
              props.setFilterOption({ title: 'keyword', value: 'keyword', match: event.target.value, type:'string' });
              setValue(null);
              setSearchValue('');
            }
            
            return;
          }
          let match = event.target.value.replace(selectedOption.title + ': ', "");
          
          if(match.length > 2) {
            props.setFilterOption({
              ...selectedOption,
              match: match
            });
            
            setValue(null);
            setSearchValue('');

          }
        }
      }
    }
  }

  const dateSelected = (date) => {
    setDatePicker(false);
    props.setFilterOption({
      ...selectedOption,
      match: date.format('MM-DD-YYYY')
    });
    setValue(null);
    setSearchValue('');
  }

  return (
    <div style={{ width: '100%' }}>
      <Autocomplete
        {...defaultProps}
        options={allFilters}
        id="select-on-focus"
        className="search-box"
        freeSolo
        autoFocus
        selectOnFocus
        inputValue={searchValue}
        onChange={onChange}
        onInputChange={onInputChange} 
        renderInput={(params) => <TextField {...params} margin="normal"  placeholder="Search for anything"  inputRef={input => { inputRef = input; }} />}
      />
      <KeyboardDatePicker
        style={{ display: 'none' }}
        margin="normal"
        id="date-picker-dialog"
        label="Date picker dialog"
        format="MM/dd/yyyy"
        onChange={dateSelected}
        onClose={() => setDatePicker(false)}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        open={datePicker}
        />
    </div>
  );
}

const defaultFilter = [
  { title: 'Attributes', value: '', match: '', type:'string' },
  { title: 'First Name', value: 'fname', match: '', type:'string' },
  { title: 'Last Name', value: 'lname', match: '', type:'string' },
  { title: 'Email', value: 'email', match: '', type:'string' },
  { title: 'Phone Number', value: 'mobile', match: '', type:'phone_number' },
  { title: 'Date of Birth', value: 'dob', match: '', type:'date' },
  { title: 'Patient ID', value: 'patient_id', match: '', type:'string' },
  { title: 'Access Number', value: 'access_no', match: '', type:'string' },
  { title: 'Scheduling Date', value: 'scheduling_date', match: '', type:'date' },
  { 
    title: 'Insurance Type', value: 'insurance_type', match: '', type:'dropdown', 
    children: [
      {
        title: "Self Pay",
        value: "insurance_type",
        match: 'self_pay1',
        type: 'string',
        isFinal: true,
        showTitle: 'Insurance Type',
        showMatch: "Self Pay"
      },
      {
        value: "insurance_type",
        title: "Auto Insurance",
        match: "auto_accident1",
        type: 'string',
        isFinal: true,
        showTitle: 'Insurance Type',
        showMatch: "Auto Insurance"
      },
      {
        match: "company_accident1",
        title: "Workers Comp",
        value: "insurance_type",
        type: 'string',
        isFinal: true,
        showTitle: 'Insurance Type',
        showMatch: "Workers Comp"
      },
      {
        match: "lop_accident1",
        title: "LOP",
        value: "insurance_type",
        type: 'string',
        isFinal: true,
        showTitle: 'Insurance Type',
        showMatch: "LOP"
      },
      {
        match: "primary_insurance",
        title: "Primary Insurance",
        value: "insurance_type",
        type: 'string',
        isFinal: true,
        showTitle: 'Insurance Type',
        showMatch: "Primary Insurance"
      }
    ]
  },
  { 
    title: 'Status', value: 'status', match: '', type:'dropdown', 
    children: [
      {
        title: "Pickup",
        value: "status",
        match: 'pickup',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Pickup"
      },
      {
        title: "drop",
        value: "status",
        match: 'drop',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Drop"
      },
      {
        title: "incoming order",
        value: "status",
        match: 'incoming order',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "incoming order"
      },
      {
        title: "cancel exam",
        value: "status",
        match: 'cancel exam',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "cancel exam"
      },
      {
        title: "Quick order",
        value: "status",
        match: 'quick order',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Quick order"
      },
      {
        title: "Approved",
        value: "status",
        match: 'approved',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Approved"
      },
      {
        title: "Scheduled",
        value: "status",
        match: 'scheduled',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Scheduled"
      },
      {
        title: "Pre scheduled",
        value: "status",
        match: 'pre scheduled',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Pre scheduled"
      },
      {
        title: "Examstart",
        value: "status",
        match: 'examstart',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Examstart"
      },
      {
        title: "Checkin",
        value: "status",
        match: 'checkin',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Checkin"
      },
      {
        title: "Study from technician",
        value: "status",
        match: "study from technician",
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Study from technician"
      },
      {
        title: "Rad non dicom accunts",
        value: "status",
        match: 'rad non dicom accunts',
        type: 'string',
        isFinal: true,
        showTitle: "Status",
        showMatch: "Rad non dicom accunts"
      },
      {
        title: "Rad reports on hold",
        value: "status",
        match: 'rad reports on hold',
        type: 'string',
        isFinal: true,
        showTitle: 'Status',
        showMatch: "Rad reports on hold"
      }
    ]
  }
];

let allFilters = [...defaultFilter];
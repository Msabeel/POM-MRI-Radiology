/* eslint-disable no-use-before-define */
import React, { useRef, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker } from '@material-ui/pickers'

const filterOptions = createFilterOptions({
  limit: 100,
});

export default function Searchbar(props) {
  let inputRef;
  const [defaultFilter, setDefaultFilter] = React.useState(JSON.parse(JSON.stringify(props.defaultOptions)));
  const [allFilters, setAllFilters] = React.useState(JSON.parse(JSON.stringify(props.defaultOptions)));
  const [selectedOption, setValue] = React.useState(null);
  const [datePicker, setDatePicker] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const defaultProps = {
    getOptionLabel: (option) => (option.title) ? option.title + ': ' : '',
    getOptionDisabled: (option) => option.value === '',
    renderOption: (option) => option.title
  };

  useEffect(() => {
    setDefaultFilter(JSON.parse(JSON.stringify(props.defaultOptions)))
    setAllFilters(JSON.parse(JSON.stringify(props.defaultOptions)))
  },[props.defaultOptions])
  
  const onChange = (event, value) => {

    if (value) {
      if (value.hasOwnProperty('title')) {
        setValue(value);
        setSearchValue(value.title + ': ');
        if (value.type === 'date') {
          setDatePicker(true);
        } else if (value.type === 'dropdown') {
          let all_filters = [];
          value.children.forEach(item => {
            all_filters.push({
              ...item,
              title: value.title + ': ' + item.title
            });
            setAllFilters(all_filters)
          });

        } else if (value.type === 'dropdown_dynamic') {
          setAllFilters(value.children)
        } else if (value.hasOwnProperty('isFinal')) {
          if (value.hasOwnProperty('showTitle')) {
            value.title = value.showTitle;
          }
          props.setFilterOption({ ...value });
          setAllFilters(defaultFilter)
          setValue(null);
          setSearchValue('');
        }
      }
    }
  }
  const checkFilerTitle = (title) => {

    var index = defaultFilter.findIndex((value) => {
      
      let f_title = value.title+':'
      return f_title === title;
    })
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  }

  const checkTitle = (title) => {

    var index = defaultFilter.findIndex((value) => {
      return value.title === title;
    })
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  }
  const onInputChange = (event, value, reason) => {
    if (reason === 'input') {
      if (checkFilerTitle(value)) {
        setSearchValue('');
        setValue(null);
        setAllFilters(defaultFilter)
      } else {
        let correctValue = event.target.value;
        if (selectedOption) {
          if (selectedOption.type === 'phone_number') {
            correctValue = correctValue.toString().replace(selectedOption.title + ':', "").trim();

            if (!Number.isInteger(Number.parseInt(correctValue))) {
              return;
            }
            if (correctValue.length > 10) {
              return;
            }

          }
        }
        setSearchValue(value);
      }

    } else if (reason === 'clear') {
      setAllFilters(defaultFilter)
      setSearchValue('');
    } else if (reason === 'reset') {
      if (event) {
        if (event.keyCode === 13 && event.target.value) {
          let name = value.trim();
          name = name.replace(':', "");
          let isFilterTitle = checkTitle(name);
          if (isFilterTitle) {
            setValue(null);
            setSearchValue('');
            return;
          } else {
            if (selectedOption === null) {

              if (event.target.value.length > 2) {
                props.setFilterOption({ title: 'keyword', value: 'keyword', match: event.target.value, type: 'string' });
                setValue(null);
                setSearchValue('');
              }

              return;
            }
            let match = event.target.value.replace(selectedOption.title + ': ', "");

            if (match.length > 2) {
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
        value={searchValue}
        {...defaultProps}
        options={allFilters}
        id="select-on-focus"
        className="search-box"
        freeSolo
        autoFocus
        // selectOnFocus
        filterOptions={filterOptions}
        inputValue={searchValue}
        onChange={onChange}
        onInputChange={onInputChange}
        renderInput={(params) => <TextField {...params} margin="normal" placeholder="Search for anything" inputRef={input => { inputRef = input; }} />}
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


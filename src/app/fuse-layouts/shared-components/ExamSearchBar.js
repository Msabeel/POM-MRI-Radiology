/* eslint-disable no-use-before-define */
import React, {useEffect, usState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {KeyboardDatePicker} from '@material-ui/pickers'
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {ThemeProvider} from '@material-ui/core/styles';
import FuseAnimate from '@fuse/core/FuseAnimate';
import {selectMainTheme} from 'app/store/fuse/settingsSlice';
import {useDispatch, useSelector} from 'react-redux';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import moment from 'moment';
import {resetFilterOption, setContactsSearchText, removeFilterOptions} from '../../main/apps/profile/store/ProfileSlice';
export default function Searchbar(props) {

    let inputRef;
    const dispatch = useDispatch();
    const [selectedOption, setValue] = React.useState(null);
    const [datePicker, setDatePicker] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const mainTheme = useSelector(selectMainTheme);
    const [whereOperator, setWhereOperator] = React.useState('AND');
    const filterOptions = useSelector(({profilePageApp}) => profilePageApp.profile.filterOptions)
    const defaultProps = {
        getOptionLabel: (option) => (option.title) ? option.title + ': ' : '',
        getOptionDisabled: (option) => option.value === '',
        renderOption: (option) => option.title
    };


    useEffect(() => {
        var fields = [];
        filterOptions.map((value, key) => {
            let row = {filedname: value.value, value: value.match, operator: ''};
            if (filterOptions.length > 1 && key == 0) {
                row.operator = ''
            }
            if (filterOptions.length > 1 && key > 0) {
                row.operator = whereOperator
            }
            if (value.type === 'date') {
                row.value = moment(row.value).format('YYYY-MM-DD')
            }

            fields.push(row);
        })
        let params = {fields: fields};
        dispatch(setContactsSearchText(params));
    }, [filterOptions, whereOperator]);


    const onChange = (event, value) => {

        if (value) {
            if (value.hasOwnProperty('title')) {
                setValue(value);
                setSearchValue(value.title + ': ');
                if (value.type === 'date') {
                    setDatePicker(true);
                } else if (value.type === 'dropdown') {
                    allFilters = [];
                    value.children.forEach(item => {
                        allFilters.push({
                            ...item,
                            title: value.title + ': ' + item.title
                        });

                    });

                } else if (value.hasOwnProperty('isFinal')) {
                    if (value.hasOwnProperty('showTitle')) {
                        value.title = value.showTitle;
                    }
                    props.setFilterOption({...value});
                    setValue(null);
                    setSearchValue('');
                    allFilters = [...defaultFilter];
                }
            }
        }
    }

    const onInputChange = (event, value, reason) => {
        if (reason === 'input') {

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
        } else if (reason === 'clear') {
            setSearchValue('');
            allFilters = [...defaultFilter];
        } else if (reason === 'reset') {
            if (event) {

                if (event.keyCode === 13 && event.target.value) {
                    if (selectedOption === null) {
                        if (event.target.value.length > 2) {
                            props.setFilterOption({title: 'keyword', value: 'keyword', match: event.target.value, type: 'string'});
                            setValue(null);
                            setSearchValue('');
                        }

                        return;
                    }
                    let match = event.target.value.replace(selectedOption.title + ': ', "");

                    // if (match.length > 2) {
                    props.setFilterOption({
                        ...selectedOption,
                        match: match
                    });

                    setValue(null);
                    setSearchValue('');

                    // }
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


    const removeFilterOption = (index) => {
        dispatch(removeFilterOptions(index));
    }
    return (
        <div style={{width: props.width ? props.width : '40%',marginTop:props.width?10:0}}>
            <Grid container>
                <Grid item xs={12}>
                    <ThemeProvider theme={mainTheme}>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Paper
                                className="flex p-4 items-center w-full max-w-512 h-40 px-8 py-4 rounded-8"
                                elevation={1}
                            >
                                <Icon color="action">search</Icon>
                                <div style={{width: '100%', }}>

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
                                        renderInput={(params) => <TextField
                                            style={{height: '100%'}}
                                            {...params}
                                            margin="normal"
                                            placeholder="Search for anything"
                                            inputRef={input => {inputRef = input;}} />}
                                    />
                                    <KeyboardDatePicker
                                        style={{display: 'none'}}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Date picker dialog"
                                        format="yyy/MM/dd"
                                        onChange={dateSelected}
                                        onClose={() => setDatePicker(false)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        open={datePicker}
                                    />
                                </div>
                            </Paper>
                        </FuseAnimate>
                    </ThemeProvider>
                </Grid>
            </Grid>
            {(filterOptions && filterOptions.length === 1) ?
                <Grid item xs={12} className="py-0">
                    <div className="filter-item-container">
                        {filterOptions.map((option, index) => (
                            <div className="filter-item" key={index + '-' + Math.floor(Math.random() * 100)}>
                                {(index > 0) ? <select className="filter-operator" value={whereOperator} onChange={(e) => setWhereOperator(e.target.value)} >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                </select> : null}
                                <Button className="filter-content" variant="outlined">
                                    {(option.value !== 'keyword') ? (<b>{option.title}:</b>) : null}&nbsp; {option.showMatch || option.match}
                                    <span style={{marginLeft: '5px'}} onClick={() => removeFilterOption(index)} >
                                        <ClearIcon />
                                    </span>
                                </Button>
                            </div>
                        ))}
                        {(filterOptions.length > 0) ? <div className="filter-button"><Button className="clear-filter" variant="outlined" onClick={() => dispatch(resetFilterOption(''))}>Clear Filters</Button></div> : null}
                    </div>
                </Grid> : null}

        </div>
    );
}

const defaultFilter = [
    {title: 'Acc#', value: 'Acc', match: 'Acc', type: 'string'},
    {title: 'Modality', value: 'modality', match: '', type: 'string'},
    {title: 'Exam', value: 'exam', match: '', type: 'string'},
    {title: 'Rad', value: 'rad', match: '', type: 'string'},
    {title: 'Ref', value: 'ref', match: '', type: 'string'},
    {title: 'Status', value: 'Status', match: '', type: 'status'},
    {title: 'Scheduling Date', value: 'scheduling_date', match: '', type: 'date'},

    {
        title: 'Status', value: 'status', match: '', type: 'dropdown',
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
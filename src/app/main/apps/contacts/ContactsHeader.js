import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setContactsSearchText, setFilterOptions, removeFilterOptions, clearFilterOptions, selectContacts, openNewContactDialog, getAllCity } from './store/contactsSlice';
import Searchbar from '../referrer/Searchbar';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';

function ContactsHeader(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const addPatient = useSelector(({ contactsApp }) => contactsApp.contacts.addPatient);
	const searchCount = useSelector(({ contactsApp }) => contactsApp.contacts.searchCount);
	const isUpdateSuccess = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog.isUpdateSuccess);
	const isUpdateError = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog.isUpdateError);
	const filterOptions = useSelector(({ contactsApp }) => contactsApp.contacts.filterOptions);
	const mainTheme = useSelector(selectMainTheme);
	const [open, setOpen] = React.useState(false);
	const [openError, setOpenError] = React.useState(false);
	const [whereOperator, setWhereOperator] = React.useState('AND');

	
	
	const [defaultOptions, setDefaultOptions] = React.useState([
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
	  ]);

	// useEffect(() => {
	// 	//setOpen(isUpdateSuccess)
	// 	//setOpenError(isUpdateError)
	// }, [isUpdateSuccess, isUpdateError]);

	const handleClose = (event, reason) => {
		setOpen(false);
	};
	const handleCloseError = (event, reason) => {
		setOpenError(false);
	};	
	
	useEffect(() => {
		async function fetchDialogData() {

			const result = await dispatch(getAllCity());
			if (result.payload.data && result.payload.data.length > 0) {
			}
		}

		// fetchDialogData()
	}, [])

	useEffect(() => {
		var fields = [];
		filterOptions.map((value, key) => {
			let row = { filedname: value.value, value: value.match, operator: '' };
			if(filterOptions.length > 1 && key == 0){
				row.operator = ''
			}
			if(filterOptions.length > 1 && key > 0){
				row.operator = whereOperator
			}
			if(value.type === 'date') {
				row.value = moment(row.value).format('YYYY-MM-DD')
			}

			fields.push(row);
		})
		let params = {fields: fields};
		dispatch(setContactsSearchText(params));

	 }, [filterOptions, whereOperator]);
	
	const initAddPatient = () => {
		dispatch(openNewContactDialog());
	 }

	const handleFilterOption = (value) => {
		dispatch(setFilterOptions(value));
	}

	const removeFilterOption = (index) => {
		dispatch(removeFilterOptions(index));
	}
	
	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-224">
				<Hidden lgUp>
					<IconButton
						onClick={ev => {
							props.pageLayout.current.toggleLeftSidebar();
						}}
						aria-label="open left sidebar"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>

				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">account_box</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-12 hidden sm:flex">
							Patient Lookup
						</Typography>
					</FuseAnimate>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-between px-8 sm:px-12 rs-top-filter">
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<ThemeProvider theme={mainTheme}>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Paper
									className="flex p-4 items-center w-full max-w-512 h-40 px-8 py-4 rounded-8"
									elevation={1}
								>
									<Icon color="action">search</Icon>
									<Searchbar setFilterOption={handleFilterOption} defaultOptions={defaultOptions}/> 
								</Paper>
							</FuseAnimate>
						</ThemeProvider>
					</Grid>
					<Grid container item xs={6} justify="flex-end">
					{
						addPatient?<Button variant="contained" color="secondary" onClick={()=>{initAddPatient()}}>Add Patient</Button>:null
					}
					</Grid>	

					
					{(filterOptions.length > 0) ? 
						<Grid item xs={12} className="py-0">
							<div className="filter-item-container">
								{filterOptions.map((option, index) => (
									<div className="filter-item"  key={index + '-' + Math.floor(Math.random() * 100)}>
									{(index > 0) ? <select className="filter-operator" value={whereOperator} onChange={(e) => setWhereOperator(e.target.value)} >
										<option value="AND">AND</option>
										<option value="OR">OR</option>
									</select> : null }
									<Button className="filter-content" variant="outlined">
									 {(option.value !== 'keyword')? (<b>{option.title}:</b>) : null}&nbsp; {option.showMatch || option.match} 
										<span style={{ marginLeft: '5px' }} onClick={() => removeFilterOption(index)} >
											<ClearIcon />
										</span>
									</Button>
									</div>
								))}
								{(filterOptions.length > 0) ? <div className="filter-button"><Button className="clear-filter" variant="outlined" onClick={() => dispatch(clearFilterOptions(''))}>Clear Filters</Button></div> : null}
							</div>
						</Grid>: null}

				</Grid>
			</div>
			<PermissionSwitch permission="patient_lookup" />
			

			<SnackBarAlert snackOpen={open} onClose={handleClose} text="Patient updated successfully." />	
			<SnackBarAlert snackOpen={openError} onClose={handleCloseError} text="Something went wrong. Please try again." error={true} />

		</div>
	);
}

export default ContactsHeader;
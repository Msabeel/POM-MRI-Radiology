import FuseAnimate from '@fuse/core/FuseAnimate';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import ContactsTable from './ContactsTable';
import {openEditContactDialog, removeContact, setStaredCount, getContacts, selectContacts, searchStart, setStarredPatient, setAddPatient} from './store/contactsSlice';

import Backdrop from '@material-ui/core/Backdrop';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function ContactsList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({contactsApp}) => contactsApp.contacts.searchText);
	const addPatient = useSelector(({contactsApp}) => contactsApp.contacts.addPatient);
	const isSearching = useSelector(({contactsApp}) => contactsApp.contacts.isSearching);
	const staredCount = useSelector(({contactsApp}) => contactsApp.contacts.staredCount);
	const user = useSelector(({contactsApp}) => contactsApp.user);
	const filterOptions = useSelector(({contactsApp}) => contactsApp.contacts.filterOptions);
	const [filteredData, setFilteredData] = useState(null);
	const [tempFilteredData, setTempFilteredData] = useState(null);
	const [isSearchingState, setIsSearching] = useState(false);
	const [whereOperator, setWhereOperator] = React.useState('AND');

	useEffect(() => {

		function searchValue(value, filter) {
			let flag = false;
			if (filter == 'AND') {
				flag = true;
			}
			searchText.fields.map((val, key) => {
				let patient_field_value = '';
				let search_field_value = '';
				if (value[val.filedname]) {
					patient_field_value = value[val.filedname].toLowerCase();
				}
				if (val.value) {
					search_field_value = val.value.toLowerCase()
				}

				if (filter === 'OR') {
					if (val.filedname == 'insurance_type') {
						if (value[val.value] === 'Yes') {
							flag = true;
						}

					} else if (val.filedname == 'dob') {
						if (patient_field_value === moment(search_field_value, 'YYYY-MM-DD').format('MM-DD-YYYY').toString()) {
							flag = true;
						}

					} else {
						if (patient_field_value === search_field_value) {
							flag = true;
						}
					}

				} else {

					if (val.filedname == 'insurance_type') {
						if (value[val.value] !== 'Yes') {
							flag = false;
						}

					} else if (val.filedname == 'dob') {
						if (patient_field_value !== moment(search_field_value, 'YYYY-MM-DD').format('MM-DD-YYYY').toString()) {
							flag = false;
						}

					} else {
						if (patient_field_value !== search_field_value) {
							flag = false;
						}
					}
				}
			})
			return flag;
		}

		let ignore = false;
		
		async function fetchData() {

			const result = await dispatch(getContacts(searchText));
			if (result.payload.data) {
				setTempFilteredData(result.payload.data)
			}

			setIsSearching(false);

			if (result.payload.data.length == 0) {
				dispatch(setAddPatient(true));
			} else if (searchText.length != 0 || searchText != '') {
				dispatch(setAddPatient(false));
			}

		}

		async function localSearch(filter) {
			var result = await tempFilteredData.filter(function (v, i) {
				return searchValue(v, filter)
			})
			// if(result.length < 100){
			// 	fetchData();
			// }else{
			// }
			setFilteredData(result);
			
			setIsSearching(false);

			if (result.length === 0) {
				dispatch(setAddPatient(true));
			} else if (searchText.length != 0 || searchText != '') {
				dispatch(setAddPatient(false));
			}

		}

		if (searchText) {
			setIsSearching(true);
			if (searchText.fields.length > 0) {
				if (filteredData) {
					//check if last filter not in records
					let filters = searchText.fields;
					let last_filter = filters[filters.length - 1];
					if (last_filter.filedname === 'access_no' || last_filter.filedname === 'scheduling_date' || last_filter.filedname === 'status') {
						fetchData();
					} else {
						if (filteredData.length > 100) {
							let filter = 'AND';
							if (searchText.fields.length > 1) {
								filter = searchText.fields[1].operator;
							}

							localSearch(filter);

						} else {
							fetchData();
						}
					}



				} else {
					fetchData();
				}
			} else {
				setTempFilteredData([]);
				setFilteredData([]);
				setIsSearching(false);

			}



		}
		return () => {ignore = true;}
	}, [searchText]);

	useEffect(() => {
		if (contacts) {

			setFilteredData(contacts);

		 
		}
	}, [contacts]);


	async function addRemoveStar(data) {
		setOpen(true);
		var contact = JSON.parse(JSON.stringify(data));
		var contacts = filteredData;

		let params = {id: contact.id};
		if (contact.patient_starred == 0) {
			params.patient_starred = 1
			dispatch(setStaredCount(staredCount + 1));
		} else {
			params.patient_starred = 0
			dispatch(setStaredCount(staredCount - 1));
		}
		await dispatch(setStarredPatient(params));
		var contact_index = contacts.findIndex((value) => {
			return value.id === contact.id;
		})
		if (contact_index >= 0) {
			contact.patient_starred = params.patient_starred;
			contacts[contact_index] = contact;
			setFilteredData([])
			setFilteredData(contacts)
			setOpen(false);
		}
	}


	if (isSearchingState) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}

	if (!filteredData || filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no patient. Please search for it!
				</Typography>
			</div>
		);
	}

	return (
		<div className="makeStyles-content-414 flex flex-col h-full">
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<FuseAnimate animation="transition.slideUpIn" delay={300}>

				<ContactsTable
					data={filteredData}
					onRowClick={(ev, row) => {
						if (row) {

							dispatch(openEditContactDialog(row.original));
						}
					}}
					onStarClick={(ev, row) => {
						addRemoveStar(ev);
					}}
				/>
			</FuseAnimate>
		</div>
	);
}

export default ContactsList;

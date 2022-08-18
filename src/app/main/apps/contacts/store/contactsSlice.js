import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserData } from './userSlice';
import { API_URL } from 'app/config';
import { data } from 'jquery';
let cancelToken;
export const getContacts = createAsyncThunk('contactsApp/contacts/getContacts', async (routeParams, { getState }) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();
		routeParams = routeParams || getState().contactsApp.contacts.routeParams;
		const response = await axios.post(API_URL.PATIENT_SEARCH_WITH_FILTER, routeParams, { cancelToken: cancelToken.token });
		const data = await response.data;
		let res = data;
		if(res.error && res.error != ''){
			return { data: [], routeParams, isSearching: false };
		}else{
			return { data: res, routeParams, isSearching: false };
		}
	}
	catch(e) {
		return { data: [], routeParams, isSearching: true };
	}

});

export const getAllCity = createAsyncThunk('contactsApp/contacts/getAllCity', async (routeParams) => {
	const response = await axios.get(API_URL.GET_ALL_CITY);
	const data =  response.data;
	return { data };
});




export const getPatientById = createAsyncThunk('contactsApp/contacts/getPatientById', async (routeParams) => {
	const response = await axios.post(API_URL.PATIENT_BY_ID, routeParams);
	const data = await response.data.body;
	return { data: JSON.parse(data), routeParams };
});

export const addContact = createAsyncThunk('contactsApp/contacts/addContact',
	async (contact, { dispatch, getState }) => {
	// async (routeParams) => {

		try{
		// const response = await axios.post('/api/contacts-app/add-contact', { contact });
		const response = await axios.post(API_URL.ADD_PATIENT, { contact });
		const data = await response.data || response.error;
		
		dispatch(getContacts());

			return { data, isCreateError: false };
		}
		catch(e){
			
			return { data:"Something Went Wrong!!!", isCreateError: true };
		}

	

		
	}
);

export const updateContact = createAsyncThunk(
	'contactsApp/contacts/updateContact',
	async (contact, { dispatch, getState }) => {
		try{
			dispatch(searchStart({ isSearching: true }));
			const currentUser = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.UPDATE_PATIENT, { ...contact, user_id: currentUser.data.userId });
			const data = await response.data
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);

export const removeContact = createAsyncThunk(
	'contactsApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { contactId });
		const data = await response.data;
		dispatch(getContacts());

		return data;
	}
);

export const removeContacts = createAsyncThunk(
	'contactsApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'contactsApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'contactsApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'contactsApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'contactsApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);
// GET PATIENT DOCUMENT
export const getDocument = createAsyncThunk('contactsApp/contacts/getDocument', async (routeParams, { getState }) => {
	try {
		

		routeParams = routeParams || getState().contactsApp.contacts.routeParams;
		const response = await axios.post(API_URL.TIMELINE, { ...routeParams, "trigger":"patienttimeline" });
		const data = await response;
		return { data: response.data, routeParams, };
	}
	catch(e) {
		return { data: [], routeParams, isSearching: true };
	}

});
export const resetPatientPassword = createAsyncThunk(
	'contactsApp/contacts/resetPatientPassword',
	async (patient_id, { dispatch, getState }) => {
		const currentUser = JSON.parse(localStorage.getItem('USER'));
		const response = await axios.post(API_URL.RESET_PATIENT_PASSWORD, { patient_id, userid: currentUser.data.userId });
		const data =  JSON.parse(response.data.body);
		return { data };
	}
);

/**
 * set recent searched patient
 */
export const setRecentSearchedPatient = createAsyncThunk(
	'contactsApp/contacts/setRecentSearchedPatient',
	async (params, { dispatch, getState }) => {
		const response = await axios.post(API_URL.SET_RECENT_SEARCHED_PATIENT,  params );
		const data =  response.data;
		
		return { data };
	}
);

export const sendPatientAccessMail = createAsyncThunk('contactsApp/contacts/sendPatientAccessMail', async (req) => {
		const currentUser = JSON.parse(localStorage.getItem('USER'));
		const response = await axios.post(API_URL.SEND_PATIENT_PORTAL_ACCESS, { ...req, userid: currentUser.data.userId });
		const data =  response.data;
		return { data };
	}
);

export const addNote = createAsyncThunk(
	'contactsApp/contacts/addNote',
	async (req, { dispatch, getState }) => {
		const currentUser = JSON.parse(localStorage.getItem('USER'));
		const response = await axios.post(API_URL.NOTE_ACTIONS, { ...req, user_id: currentUser.data.userId });
		const data =  response.data;
		return { data };
	}
);


export const removeRecentSearch = createAsyncThunk(
	'contactsApp/contacts/removeRecentSearch',
	async (params, { dispatch, getState }) => {
		const response = await axios.post(API_URL.REMOVE_RECENT_SEARCHED_PATIENT, params);
		const data = await response.data;
		return { data };
	}
);

export const setStarredPatient = createAsyncThunk(
	'contactsApp/contacts/setStarredPatient',
	async (params, { dispatch, getState }) => {
		const response = await axios.post(API_URL.SET_STARRED_PATIENT, params);
		//dispatch(getContacts());
		const data = await response.data;
		return { data };
	}
);

export const getRecentSearchedPatient = createAsyncThunk('contactsApp/contacts/getRecentSearchedPatient', async (routeParams) => {
	const response = await axios.get(API_URL.GET_RECENT_SEARCHED_PATIENT);
	const data =  response.data;
	return { data };
});

export const getStarredPatient = createAsyncThunk('contactsApp/contacts/getStarredPatient', async (routeParams) => {
	const response = await axios.get(API_URL.GET_STARRED_PATIENTS);
	const data =  response.data;
	return { data };
});

export const getRecentAndStarredPatientCount = createAsyncThunk('contactsApp/contacts/getRecentAndStarredPatientCount', async (routeParams) => {
	const response = await axios.get(API_URL.GET_RECENT_AND_STARRED_PATIENT_COUNT);
	const data =  response.data;
	return { data };
});



const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.contactsApp.contacts
);

const contactsSlice = createSlice({
	name: 'contactsApp/contacts',
	initialState: contactsAdapter.getInitialState({
		addPatient: false,
		searchText: '',
		isSearching: false,
		routeParams: {},
		allCity: [],
		contactDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			resetPasswordData: null,
			isPatientAccessMailSent: false,
			isUpdateSuccess: false,
			isUpdateError: false,
			patientAccessResponse: {},
			allCity: [],
		},
		patientAccessDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			resetPasswordData: null,
			isPatientAccessMailSent: false,
			isUpdateSuccess: false,
			isUpdateError: false
		},
		patientAccessPrintDialog: {
			props: {
				open: false
			},
			data: null,
		},
		filterOptions: [],
		searchCount: 0, 
		staredCount: 0
	}),
	reducers: {
		setContactsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
				state.currentView = 'contacts';
			},
			prepare: event => ({ payload: event || '' })
		},
		setAddPatient: {
			reducer: (state, action) => {
				state.addPatient = action.payload;
			}
		},
		searchStart: {
			reducer: (state, action) => {
				state.isSearching = action.payload.isSearching;
			}
		},
		clearSearchText: {
			reducer:(state, action) => {
				state.searchText = '';
				contactsAdapter.setAll(state, []);
				state.isSearching = false;
			}
		},
		
		openNewContactDialog: (state, action) => {
			state.contactDialog = {
				...state.contactDialog,
				type: 'new',
				props: {
					open: true
				},
				data: null,
				resetPasswordData: null
			};
		},
		closeNewContactDialog: (state, action) => {
			state.contactDialog = {
				...state.contactDialog,
				type: 'new',
				props: {
					open: false
				},
				data: null,
				resetPasswordData: null
			};
		},
		openEditContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload,
				resetPasswordData: null,
				allCity: state.allCity
			};
		},
		openPatientAccessDialog: (state, action) => {
			state.patientAccessDialog = {
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditPatientAccessDialog: (state, action) => {
			state.patientAccessDialog = {
				props: {
					open: false
				},
				data: null
			};
		},
		openPatientAccessPrintPage: (state, action) => {
			state.patientAccessPrintDialog = {
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closePatientAccessPrintPage: (state, action) => {
			state.patientAccessPrintDialog = {
				props: {
					open: false
				},
				data: null
			};
		},
		closeEditContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		setSearchCount : {
			reducer: (state, action) => {
				state.searchCount = action.payload || 0;
			},
			prepare: event => ({ payload: event || '' })
		},
		setStaredCount : {
			reducer: (state, action) => {
				state.staredCount = action.payload || 0;
			},
			prepare: event => ({ payload: event || '' })
		},
		setFilterOptions: {
			reducer: (state, action) => {
				state.filterOptions.push(action.payload);
			},
			prepare: event => ({ payload: event || '' })
		},
		clearFilterOptions: {
			reducer: (state, action) => {
				state.filterOptions = [];
				state.addPatient = false;
			},
			prepare: event => ({ payload: event || '' })
		},
		removeFilterOptions: {
			reducer: (state, action) => {
				let options = JSON.parse(JSON.stringify(state.filterOptions));
				options.splice(action.payload, 1);
				state.filterOptions = options;
				state.addPatient = false;
			},
			prepare: event => ({ payload: event || '' })
		},
	},
	extraReducers: {
		//[addContact.fulfilled]: contactsAdapter.addOne,
		[addContact.fulfilled]:(state, action) => {
			//state.isSearching = false
		},
		[getContacts.fulfilled]: (state, action) => {
			
			const { data, routeParams, isSearching } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.isSearching = isSearching;
		},
		[getAllCity.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.allCity = data;
			state.contactDialog.allCity = data;
		},
		[resetPatientPassword.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.contactDialog.resetPasswordData = data;
		},
		[setRecentSearchedPatient.fulfilled]: (state, action) => {
			const { data } = action.payload;
		},
		[updateContact.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.contactDialog.isUpdateSuccess = isUpdateSuccess;
			state.contactDialog.isUpdateError = isUpdateError;
		},
		[sendPatientAccessMail.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.contactDialog.patientAccessResponse = data;
		},
		[setStarredPatient.fulfilled]: (state, action) => {
			const { data } = action.payload;
		},
		[getRecentSearchedPatient.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.recentPatients = data;
		},
		[getStarredPatient.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.searchedPatients = data;
		},
		[getRecentAndStarredPatientCount.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.patientSearchCount = data;
		},
		
	
	}
});

export const {
	setContactsSearchText,
	openNewContactDialog,
	closeNewContactDialog,
	openEditContactDialog,
	openPatientAccessDialog,
	closeEditPatientAccessDialog,
	openPatientAccessPrintPage,
	closePatientAccessPrintPage,
	closeEditContactDialog,
	searchStart,
	clearSearchText,
	setFilterOptions,
	removeFilterOptions,
	clearFilterOptions,
	setStaredCount,
	setSearchCount,
	setAddPatient
} = contactsSlice.actions;

export default contactsSlice.reducer;

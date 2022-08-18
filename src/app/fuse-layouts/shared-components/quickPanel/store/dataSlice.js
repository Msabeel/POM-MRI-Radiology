import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from 'app/config';
import axios from 'axios';

/*
	this api is used to get alerts of patients who are requesting 
	additional access time on their patient portal
*/
export const getRequestAlertsData = createAsyncThunk('quickPanel/data/getRequestAlertsData', async () => {
	//const response = await axios.get(API_URL.GET_REQUEST_ALERTS);
	//const data =  response.data;
	const data =  [];
	return data;
});

export const sendPatientAccessMail = createAsyncThunk('quickPanel/data/sendPatientAccessMail', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.SEND_PATIENT_PORTAL_ACCESS, { ...req, userid: currentUser.data.userId });
	const data =  response.data;
	return { data };
});

export const updateViewedAlert = createAsyncThunk('quickPanel/data/updateViewedAlert', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.UPDATE_VIEW_ALERT, { ...req, userid: currentUser.data.userId });
	const data =  JSON.parse(response.data.body);
	return { data };
});

export const getData = createAsyncThunk('quickPanel/data/getData', async () => {
	const response = await axios.get('/api/quick-panel/data');
	const data = await response.data;
	return data;
});

export const updatePatient = createAsyncThunk(
	'contactsApp/contacts/updateContact',
	async (contact, { dispatch, getState }) => {
		try{
			const response = await axios.post(API_URL.UPDATE_PATIENT, { ...contact, user_id: 0 });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);


export const updateContact = createAsyncThunk('rolesApp/contacts/updateContact', 
    async (contact, { dispatch, getState }) => {
		try{
			const currentUser = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.ADD_PERMISSON, { ...contact, user_id: currentUser.data.userId });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);

export const updateSinglePermission = createAsyncThunk('rolesApp/contacts/updateSinglePermission', 
    async (contact, { dispatch, getState }) => {
		try{
			const currentUser = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.ADD_SINGLE_PERMISSON, { ...contact, user_id: currentUser.data.userId });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);

export const getPermissions = createAsyncThunk('quickPanel/data/getPermissions', async (routeParams, { getState }) => {
    routeParams = routeParams || getState().rolesApp.contacts.routeParams;
    const response = await axios.post(API_URL.GET_PERMISSON_BY_USER_TYPE, {
		"user_type":routeParams.id
	});
    const data = await response.data;
	return data;
});

const dataAdapter = createEntityAdapter({});
export const {
	selectAll: selectContacts, selectById: selectContactsById
} = dataAdapter.getSelectors(state => state.quickPanel.data);

const dataSlice = createSlice({
	name: 'quickPanel/data',
	initialState: dataAdapter.getInitialState({
		patientAccessResponse: {},
		patientAccessDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			resetPasswordData: null,
			isPatientAccessMailSent: false,
			isUpdateSuccess: false,
			isUpdateError: false,
		},
		patientAccessPrintDialog: {
			props: {
				open: false
			},
			data: null,
		},
		permissionData: []
	}),
	reducers: {
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
				data: null,
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
			state.patientAccessResponse = null;
		},
		clearPatientAccessResponse: (state, action) => {
			state.patientAccessResponse = null;
		},
	},
	extraReducers: {
		[getRequestAlertsData.fulfilled]: (state, action) => {
			state.requestAlerts = action.payload;
		},
		[getPermissions.fulfilled]: (state, action) => {
			state.permissionData = action.payload;
		},
		[sendPatientAccessMail.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.patientAccessResponse = data;
		},
		[getData.fulfilled]: (state, action) => action.payload
	}
});

export const {
	openPatientAccessDialog,
	closeEditPatientAccessDialog,
	openPatientAccessPrintPage,
	closePatientAccessPrintPage,
	clearPatientAccessResponse,
} = dataSlice.actions;

export default dataSlice.reducer;

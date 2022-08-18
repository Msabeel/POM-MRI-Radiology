import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from 'app/config';

export const getPatientPortalData = createAsyncThunk('patientPortalApp/getPatientPortalData', async (routeParams) => {
	const response = await axios.post(API_URL.PATIENT_PORTAL_DATA, routeParams);
	const data = response.data;
	return {data};
});

export const generateReports = createAsyncThunk('patientPortalApp/generateReports', async (routeParams) => {
	const params = {"examIDs": ["680533"], "isDownloadReport": true, "isDownloadImage": false, "id": 6};
	const response = await axios.post(API_URL.GENERATE_REPORTS, routeParams);
	const data = response.data.body;
	return {data};
});

export const generateImages = createAsyncThunk('patientPortalApp/generateImages', async (routeParams) => {
	const params = {"id": 195, "examIDs": [678444], "userid": 678444};
	const response = await axios.post(API_URL.GENERATE_IMAGES, routeParams);
	const data = response.data.body ? response.data.body : response.data;
	return {data};
});

export const requestAccess = createAsyncThunk('patientPortalApp/requestAccess', async (routeParams) => {
	const response = await axios.post(API_URL.REQUEST_ACCESS, routeParams);
	const data = response.data.body;
	return {data};
});

const patientPortalAdapter = createEntityAdapter({});
// const initialState = []

const patientPortalSlice = createSlice({
	name: 'patientPortalApp/PatientPortalData',
	initialState: patientPortalAdapter.getInitialState({
		patientDetails: {},
		confirmationDialog: {
			props: {
				open: null
			},
			data: null,
		},
	}),
	reducers: {
		openConfirmationDialog: (state, action) => {
			state.confirmationDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeConfirmationDialog: (state, action) => {
			state.confirmationDialog = {
				props: {
					open: false
				},
				data: action.payload ? action.payload : null
			};
		},
	},
	extraReducers: {
		[getPatientPortalData.fulfilled]: (state, action) => {

			const {data} = action.payload;

			state.patientDetails = data;
		},
	}
})

export const {
	openConfirmationDialog,
	closeConfirmationDialog,
} = patientPortalSlice.actions;

export default patientPortalSlice.reducer
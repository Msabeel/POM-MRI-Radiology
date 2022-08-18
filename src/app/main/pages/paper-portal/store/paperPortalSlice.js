import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';
var CryptoJS = require("crypto-js");

export const getForms = createAsyncThunk('paperPortalApp/paperPortalData/getForms', async (req) => {
	const response = await axios.post(API_URL.GET_QUESTIONS);
	const data =  response.data;
	return { data };
	}
);

export const verifyPaperwork = createAsyncThunk('patientPortalApp/verifyPaperwork', async (routeParams) => {
	const response = await axios.post(API_URL.VERIFY_PAPERWORK, routeParams);
	const data = response.data;
	return { data };
});

export const getAllCity = createAsyncThunk('patientPortalApp/getAllCity', async (routeParams) => {
	const response = await axios.get(API_URL.GET_ALL_CITY);
	const data =  response.data;
	return { data };
});

export const saveSignature = createAsyncThunk('patientPortalApp/saveSignature', async (routeParams) => {
	const response = await axios.post(API_URL.SAVE_SIGNATURE, routeParams);
	const data = response.data;
	return { data };
});

export const savePaperWork = createAsyncThunk('patientPortalApp/savePaperWork', async (routeParams) => {
	const response = await axios.post(API_URL.SAVE_PAPERWORK, routeParams);
	const data = response.data;
	return { data };
});

export const getUploadCred = createAsyncThunk('patientPortalApp/getUploadCred', async (routeParams) => {
	const response = await axios.get(API_URL.UPLOAD_CRED);
	// Decrypt
	var bytes  = CryptoJS.AES.decrypt(response.data.accessKeyId, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainKeyText = bytes.toString(CryptoJS.enc.Utf8);
	
	bytes  = CryptoJS.AES.decrypt(response.data.secretAccessKey, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainSecretText = bytes.toString(CryptoJS.enc.Utf8);
	const data = { bucket: response.data.bucket, plainSecretText, plainKeyText}
	return { data  };
});

const paperPortalAdapter = createEntityAdapter({});
// const initialState = []

const paperPortalSlice = createSlice({
  name: 'paperPortalApp/paperPortalData',
  initialState: paperPortalAdapter.getInitialState({
	forms: [],
	data: [],
	confirmationDialog: {
		props: {
			 open: null
		 },
		 data: null,
		 allCity: [],
		 uploadCred: {},
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
			data: action.payload
		};
	},
  },
  extraReducers: {
    [getForms.fulfilled]: (state, action) => {
		const { data } = action.payload;
		state.forms = data;
	},
	[getAllCity.fulfilled]: (state, action) => {
		const { data } = action.payload;
		state.allCity = data;
	},
	[getUploadCred.fulfilled]: (state, action) => {
		const { data } = action.payload;
		state.uploadCred = data;
	},
	[verifyPaperwork.fulfilled]: (state, action) => {
		const { data, e } = action.payload;
		state.data = data || e;
	},
  }
})

export const {
	openConfirmationDialog,
	closeConfirmationDialog,
} = paperPortalSlice.actions;

export default paperPortalSlice.reducer
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getLocation = createAsyncThunk('login/getLocation', async () => {
	const response = await axios.post(API_URL.INSERT_TOKEN_DB, { "trigger": "homescreen" });
	const data = response.data;
	localStorage.setItem('Index_Details', JSON.stringify(response.data));
	return data;
});

export const getPatientByEmail = createAsyncThunk('login/getPatientByEmail', async (req) => {
	const response = await axios.post(API_URL.GET_PATIENT_BY_EMAIL, req);
	const data = response.data;
	return { data };
});

// const initialState = []
const loginAdapter = createEntityAdapter({});

const loginSlice = createSlice({
  name: 'login/getLocationData',
  initialState: loginAdapter.getInitialState({
	data: {},
	patinetData: {},
	LoginPatientsDialog: {
		props: {
			 open: false
		 },
		 data: null,
		 error: null
	 },
  }),
  reducers: {
	openLoginPatientsDialog: (state, action) => {
		state.LoginPatientsDialog = {
		  props: {
				open: true
			},
			data: action.payload,
			
		};
	},
	closeLoginPatientsDialog: (state, action) => {
		state.LoginPatientsDialog = {
		  props: {
				open: false
			},
			error: action.payload
		};
	},
  },
  extraReducers: {
    [getLocation.fulfilled]: (state, action) => {
		const data = action.payload;
		state.data = data;
	},
	[getPatientByEmail.fulfilled]: (state, action) => {
		const { data } = action.payload;
		state.patinetData = data;
	  }
  }
})

export const {
	openLoginPatientsDialog,
	closeLoginPatientsDialog,
} = loginSlice.actions;

export default loginSlice.reducer
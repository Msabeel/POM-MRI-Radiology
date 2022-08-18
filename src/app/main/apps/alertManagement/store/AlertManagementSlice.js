import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getAlertManagementData = createAsyncThunk(
	'alertManagementApp/getAllAlerts/getAlertManagementData',
	async req => {
		const response = await axios.get(API_URL.AM_GETALERTS);
		const { data } = response;
		return { data, isLoading: false };
	}
);

export const getWidgets = createAsyncThunk('alertManagementApp/getAllAlerts/getWidgets', async () => {
	// const response = await axios.get('/api/project-dashboard-app/widgets');
	const response = await axios.get('https://x5wmutlt70.execute-api.us-east-1.amazonaws.com/Prod/getGraphdata');
	const data1 = await response.data;

	return { data1, isLoading: false };
});

export const deleteAlertManagementData = createAsyncThunk(
	'alertManagementApp/getAllAlerts/deleteAlertManagementData',
	async req => {
		try {
			const currentUser = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.ALERT_ACTIONS, { ...req, user_id: currentUser.data.userId });
			const { data } = response;
			if (data.isDeletedSuccess) {
				return { isDeletedSuccess: true };
			}
			return { isDeletedError: false, deleteId: req.id, message: data.message };
		} catch (e) {
			return { isDeletedError: false, message: 'Something Went Wrong' };
		}
	}
);

export const addAlertManagementData = createAsyncThunk(
	'alertManagementApp/getAllAlerts/addAlertManagementData',
	async req => {
		const currentUser = JSON.parse(localStorage.getItem('USER'));
		const response = await axios.post(API_URL.ALERT_ACTIONS, { ...req, user_id: currentUser.data.userId });
		const { data } = response;
		if (data.isCreatedSuccess) {
			return { isCreatedSuccess: true };
		}
		return { isCreatedError: true };
	}
);

export const editAlertManagementData = createAsyncThunk(
	'alertManagementApp/getAllAlerts/editAlertManagementData',
	async req => {
		const currentUser = JSON.parse(localStorage.getItem('USER'));
		const response = await axios.post(API_URL.ALERT_ACTIONS, { ...req, user_id: currentUser.data.userId });
		const { data } = response;
		if (data.isUpdatedSuccess) {
			return { isUpdateSuccess: true };
		}
		return { isUpdateError: true };
	}
);

export const disableAlertManagementData = createAsyncThunk(
	'alertManagementApp/getAllAlerts/disableAlertManagementData',
	async req => {
		const currentUser = JSON.parse(localStorage.getItem('USER'));
		const response = await axios.post(API_URL.ALERT_ACTIONS, { ...req, user_id: currentUser.data.userId });
		const { data } = response;
		// return { data };

		if (data.isDisabledSuccess) {
			return { isDisabledSuccess: true };
		}
		
		if (!data.isDisabledError) {
			return { isDisabledSuccess: false };
		}
		
		return { isDisabledError: true };
	}
);

const alertManagementSlice = createSlice({
	name: 'alertManagementApp/getAllAlerts',
	initialState: {
		data: [],
		data1: [],
		isLoading: false,
		isCreatedSuccess: false,
		isCreatedError: false,
		isUpdateSuccess: false,
		isUpdateError: false,
		isDeletedSuccess: false,
		isDeletedError: false,
		isDisabledSuccess: false,
		isDisabledError: false,
		deleteId: ''
	},
	reducers: {
		setResponseStatus: (state, action) => {
			state.isUpdateSuccess = false;
			state.isCreatedSuccess = false;
			state.isDeletedSuccess = false;
			state.isDisabledSuccess = false;
		}
	},
	extraReducers: {
		[getAlertManagementData.fulfilled]: (state, action) => {
			const { data, loading } = action.payload;
			state.data = data;
			state.isLoading = loading;
		},
		[getWidgets.fulfilled]: (state, action) => {
			const { data1 } = action.payload;
			state.data1 = data1;
		},
		[deleteAlertManagementData.fulfilled]: (state, action) => {
			const { isDeletedSuccess, isDeletedError } = action.payload;
			state.isDeletedSuccess = isDeletedSuccess;
			state.isDeletedError = isDeletedError;
		},
		[addAlertManagementData.fulfilled]: (state, action) => {
			const { isCreatedSuccess, isCreatedError } = action.payload;
			state.isCreatedSuccess = isCreatedSuccess;
			state.isCreatedError = isCreatedError;
		},
		[editAlertManagementData.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.isUpdateSuccess = isUpdateSuccess;
			state.isUpdateError = isUpdateError;
		},
		[disableAlertManagementData.fulfilled]: (state, action) => {
			// const { data, loading } = action.payload;
			// state.data = data;
			// state.isLoading = loading;
			const { isDisabledSuccess, isDisabledError } = action.payload;
			state.isDisabledSuccess = isDisabledSuccess;
			state.isDisabledError = isDisabledError;
		}
	}
});

export const { setResponseStatus } = alertManagementSlice.actions;
export default alertManagementSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getAssignedAlertData = createAsyncThunk(
	'assignedAlertApp/getAllAssignedAlerts/getAssignedAlertData',
	async req => {
		const response = await axios.get(API_URL.ASSIGNEDALERTSLIST);
		const { data } = response;
		return { data, isLoading: false };
	}
);

const assignedAlertSlice = createSlice({
	name: 'assignedAlertApp/getAllAssignedAlerts',
	initialState: {
		data: [],
		isLoading: false
	},
	reducers: {
		setResponseStatus: (state, action) => {
			state.isLoading = false;
		}
	},
	extraReducers: {
		[getAssignedAlertData.fulfilled]: (state, action) => {
			const { data, loading } = action.payload;
			state.data = data;
			state.isLoading = loading;
		}
	}
});

export const { setResponseStatus } = assignedAlertSlice.actions;

export default assignedAlertSlice.reducer;

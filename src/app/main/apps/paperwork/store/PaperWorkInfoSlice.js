import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';


export const getPaperWorkData = createAsyncThunk('paperWorkInfoApp/getPaperWorkData', async (req) => {
	const response = await axios.post(API_URL.GET_PAPERWORK_QUESTIONS, req);
	const data =  response.data;
	return { data };
	}
);

export const getForms = createAsyncThunk('paperWorkInfoApp/getForms', async (req) => {
	const response = await axios.post(API_URL.GET_QUESTIONS);
	const data =  response.data;
	return { data };
	}
);


const paperWorkInfoAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = paperWorkInfoAdapter.getSelectors(
	state => state.paperWorkInfoApp.contacts
);

const paperWorkInfoSlice = createSlice({
	name: 'paperWorkInfoApp/',
	initialState: paperWorkInfoAdapter.getInitialState({
		paperWorkData: [],
		forms: []
	}),
	reducers: {
		updateNavigationBlocked: (state, action) => {
			state.isNavigationBlocked = action.payload
		},
	},
	extraReducers: {
		[getPaperWorkData.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.paperWorkData = data;
		},
		[getForms.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.forms = data;
		},
	}
});

export const {
	updateNavigationBlocked,
} = paperWorkInfoSlice.actions;

export default paperWorkInfoSlice.reducer;

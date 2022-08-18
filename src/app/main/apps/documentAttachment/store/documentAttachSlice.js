import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from 'app/config';

let cancelToken;

export const getAllDocuments = createAsyncThunk(
	'documementAcctach/getAllDocuments',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));

			const response = await axios.post(API_URL.GETALLDOCUMENTS, {...document});
			const reasonsList = Object.keys(response).reduce((arr, key) => arr.concat(response[key]), []);
			const data = response;
			return {data};
		}
		catch (e) {
			//console.log("document", e);
			return {data: []};
		}
	}
);


export const getTestApi = createAsyncThunk(
	'documementAcctach/getTestApi',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const payload = document.payload;
			const response = await axios.get(document.api);
			const reasonsList = Object.keys(response).reduce((arr, key) => arr.concat(response[key]), []);
			const data = response;
			return {data};
		}
		catch (e) {
			//console.log("document", e);
			return {data: []};
		}
	}
);


export const postTestApi = createAsyncThunk(
	'documementAcctach/getTestApi',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const payload = document.payload;
			const response = await axios.post(document.api, {...payload});
			const reasonsList = Object.keys(response).reduce((arr, key) => arr.concat(response[key]), []);
			const data = response;
			return {data};
		}
		catch (e) {
			//console.log("document", e);
			return {data: []};
		}
	}
);



const documentAttachAdapter = createEntityAdapter({});

export const {selectAll: selectExam, selectById: selectContactsById} = documentAttachAdapter.getSelectors(
	state => state.examApp.exam
);

const documentAttachSlice = createSlice({
	name: 'documementAcctach/exam',
	initialState: documentAttachAdapter.getInitialState({
		searchText: '',
		isSearching: false,
		filterOptions: [],
		confirmationDialog: {
			props: {
				open: false
			},
			data: null,
		},
		storeEditData: {
			data: null
		},
		allDocuments: [],
		getData: null,
		postData: null
	}),
	reducers: {

		openConfirmDialog: (state, action) => {
			state.confirmationDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},

		closeConfirmDialog: (state, action) => {
			state.confirmationDialog = {
				props: {
					open: false
				},
				data: null
			};
		},


	},


	extraReducers: {
		[getAllDocuments.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.getAllDocuments = data;
			// state.searchText = '';
		},

		[postTestApi.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.postData = data;
			// state.searchText = '';
		},
		[getTestApi.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.postData = data;
			// state.searchText = '';
		},


	}
});

export const {
	openConfirmDialog,
	closeConfirmDialog
} = documentAttachSlice.actions;

export default documentAttachSlice.reducer;

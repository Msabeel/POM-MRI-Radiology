import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import { API_URL } from 'app/config';

let cancelToken;
export const getAttorney = createAsyncThunk('attorneyApp/attorney/getAttorney', async (routeParams, { getState }) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();
		routeParams = routeParams || getState().attorneyApp.attorney.routeParams
		const response = routeParams?.fields.length === 0 && await axios.get(API_URL.GET_ATTORNEY, routeParams, { cancelToken: cancelToken.token });
		const res = await response.data || getState().attorneyApp.attorney.searchData
		const searchData = getState().attorneyApp.attorney.entities
		if (res.error && res.error != '') {
			return { data: [], routeParams, isSearching: false };
		} else {
			if (routeParams?.fields.length) {
				let newResponse = []
				if (routeParams.fields[0].filedname !== "keyword") {
					const filterObject = routeParams.fields.reduce((obj, item) => ({ ...obj, [item.name]: item.value }), {})
					if (routeParams.fields[1] && routeParams.fields[1].operator === "OR") {
						newResponse = _.filter(res, item => Object.keys(filterObject).some(key => item[key].toString().toLowerCase().startsWith(filterObject[key].toString().toLowerCase())));
					} else if (routeParams.fields[0].filedname === "id") {
						newResponse = _.filter(res, item => Object.keys(filterObject).every(key => item[key] === filterObject[key]));
					}
					else
						newResponse = _.filter(res, item => Object.keys(filterObject).every(key => item[key].toString().toLowerCase().startsWith(filterObject[key].toString().toLowerCase())));

					return { data: newResponse, searchData: searchData, routeParams, isSearching: false };
				} else {
					return { data: res, searchData: res, routeParams, isSearching: false, err_msg: "Please Select field to search" };
				}
			} else {
				return { data: res, searchData: res, routeParams, isSearching: false };
			}
		}
	}
	catch (e) {
		return { data: [], routeParams, isSearching: true };
	}

});

export const updateAttorney = createAsyncThunk('attorneyApp/attorney/updateAttorney',
	async (attorney, { dispatch, getState }) => {
		try {
			const response = await axios.post(API_URL.UPDATE_ATTORNEY, { ...attorney });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch (e) {
			return { isUpdateError: true };
		}
	}
);

export const deleteAttorney = createAsyncThunk('attorneyApp/attorney/deleteAttorney',
	async (attorney, { dispatch, getState }) => {
		try {
			const response = await axios.post(API_URL.DELETE_ATTORNEY, { ...attorney });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch (e) {
			return { isUpdateError: true };
		}
	}
);

const attorneyAdapter = createEntityAdapter({});

export const { selectAll: selectAttorney, selectById: selectContactsById } = attorneyAdapter.getSelectors(
	state => state.attorneyApp.attorney
);

const attorneySlice = createSlice({
	name: 'attorneyApp/attorney',
	initialState: attorneyAdapter.getInitialState({
		searchText: '',
		isSearching: false,
		filterOptions: [],
		confirmationDialog: {
			props: {
				open: false
			},
			data: null,
		},
		isAttorneyUpdated: false,
		isAttorneyUpdatedError: false,
		isAttorneyDeleted: false,
		isAttorneyDeletedError: false,
		err_msg: '',
		searchData: [],
	}),
	reducers: {
		setAttorneySearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event || '' })
			//prepare: event => ({ payload: event || '' })
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
			},
			prepare: event => ({ payload: event || '' })
		},
		removeFilterOptions: {
			reducer: (state, action) => {
				let options = JSON.parse(JSON.stringify(state.filterOptions));
				options.splice(action.payload, 1);
				state.filterOptions = options;
			},
			prepare: event => ({ payload: event || '' })
		},
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
		removErrorMessage: (state, action) => {
			state.err_msg = "";
		}
	},


	extraReducers: {
		[getAttorney.fulfilled]: (state, action) => {
			const { data, routeParams, isSearching, searchData, err_msg } = action.payload;
			attorneyAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			state.searchData = searchData;
			state.err_msg = err_msg;
			// state.searchText = '';
		},
		[updateAttorney.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.isAttorneyUpdated = isUpdateSuccess;
			state.isAttorneyUpdatedError = isUpdateError;
		},
		[deleteAttorney.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.isAttorneyDeleted = isUpdateSuccess;
			state.isAttorneyDeletedError = isUpdateError;
		},

	}
});

export const {
	setAttorneySearchText,
	setFilterOptions,
	removeFilterOptions,
	clearFilterOptions,
	openEditDialog,
	closeEditDialog,
	openConfirmDialog,
	closeConfirmDialog,
	removErrorMessage
} = attorneySlice.actions;

export default attorneySlice.reducer;

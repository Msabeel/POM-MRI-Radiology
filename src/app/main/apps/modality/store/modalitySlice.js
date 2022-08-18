import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from 'app/config';

let cancelToken;
export const getModality = createAsyncThunk('modalityApp/modality/getModality', async (routeParams, {getState}) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}

		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();
		const response = await axios.get(API_URL.GET_MODALITIES, routeParams, {cancelToken: cancelToken.token});//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token })
		const res = await response.data;

		if (res.error && res.error != '') {
			return {data: [], routeParams, isSearching: false};
		} else {
			return {data: res, routeParams, isSearching: false};
		}
	}
	catch (e) {
		console.log("error", e)
		return {data: [], routeParams, isSearching: true};
	}

});

export const getLocations = createAsyncThunk('modalityApp/modality/getLocation', async (routeParams, {getState}) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}

		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();

		// routeParams = routeParams || getState().modalityApp.modality.routeParams
		const response = await axios.get(API_URL.GET_LOCATION, routeParams, {cancelToken: cancelToken.token});//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token }):

		const res = await response.data;

		if (res.error && res.error != '') {
			return {data: [], routeParams, isSearching: false};
		} else {
			return {data: response.data, routeParams, isSearching: false};
		}
	}
	catch (e) {
		console.log("error", e)
		return {data: [], routeParams, isSearching: true};
	}

});

export const getModalityForDropDown = createAsyncThunk('modalityApp/modality/getModalityForDropDown', async (routeParams, {getState}) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();

		// routeParams = routeParams || getState().modalityApp.modality.routeParams
		const response = await axios.get(API_URL.GET_MODALITY_DROPDOWN, routeParams, {cancelToken: cancelToken.token});//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token }):

		const res = await response.data;

		if (res.error && res.error != '') {
			return {data: [], routeParams, isSearching: false};
		} else {
			return {data: response.data, routeParams, isSearching: false};
		}
	}
	catch (e) {
		console.log("error", e)
		return {data: [], routeParams, isSearching: true};
	}

});

export const updateModality = createAsyncThunk('modalityApp/modality/updateModality',
	async (modality, {dispatch, getState}) => {
		try {
			var requestBody = {
				id: modality.id,
				modality: modality.modality,
				status: modality.status,
				locationid: parseInt(modality.locationid),
				bg_color: modality.bg_color,
				mwl_display_name: modality.mwl_display_name,
				ae_title: modality.ae_title,
				mwl_show: modality.mwl_display_name ? "on" : "off",
				isDeleted: false,
				quantity: parseInt(modality.quantity),
				modalityidforExam: 0,
				noinsurance: 0,
				noGraphModality: 0,
			}
			const response = await axios.post(API_URL.UPDATE_MODALITY, requestBody);
			const data = await response.data;
			return {data, isUpdateSuccess: true};
		}
		catch (e) {
			return {isUpdateError: true};
		}
	}
);
export const createModality = createAsyncThunk('modalityApp/modality/createModality',
	async (modality, {dispatch, getState}) => {
		try {

			var requestBody = {

				modality: modality.modality,
				status: modality.status,
				locationid: parseInt(modality.locationid),
				bg_color: modality.bg_color,
				mwl_display_name: modality.mwl_display_name,
				ae_title: modality.ae_title,
				mwl_show: modality.mwl_display_name ? "on" : "off",
				isDeleted: false,
				quantity: parseInt(modality.quantity),
				modalityidforExam: parseInt(modality.modality_id_exam),
				noinsurance: 0,
				noGraphModality: 0,
			}
			const response = await axios.post(API_URL.CREATE_MODALITY, requestBody);
			const data = await response.data;
			return {data, isCreateSuccess: true};
		}
		catch (e) {
			return {isCreateError: true};
		}
	}
);

export const changeStatusModality = createAsyncThunk('modalityApp/modality/changeStatusModality',
	async (modality, {dispatch, getState}) => {
		try {
			const response = await axios.post(API_URL.CHANGESTATUS, {...modality});
			const data = await response.data;
			return {data, isStatusChange: modality.status == "on" ? "on" : "off"};
		}
		catch (e) {
			return {sStatusError: false};
		}
	}
);
export const deleteModality = createAsyncThunk('modalityApp/modality/deleteModality',
	async (modality, {dispatch, getState}) => {
		try {
			const response = await axios.post(API_URL.DELETE_MODALITY, {...modality});
			const data = await response.data;
			return {data, isModalityDeleted: modality.isDelete};
		}
		catch (e) {
			return {isModalityDeletedError: false};
		}
	}
);

const modalityAdapter = createEntityAdapter({});

export const {selectAll: selectModality, selectById: selectContactsById} = modalityAdapter.getSelectors(
	state => state.modalityApp.modality
);

const modalitySlice = createSlice({
	name: 'modalityApp/modality',
	initialState: modalityAdapter.getInitialState({
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
		isModalityUpdated: null,
		isModalityDeletedError: null,
		isModalityDeleted: null,
		isModalityUpdatedError: null,
		isModalityCreated: false,
		isModalityCreateError: false,
		locations: [],
		modalityForDrop: [],
		isStatusChange: false,
		sStatusError: false
	}),
	reducers: {
		setAttorneySearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({payload: event || ''})
			//prepare: event => ({ payload: event || '' })
		},
		setFilterOptions: {
			reducer: (state, action) => {
				state.filterOptions.push(action.payload);
			},
			prepare: event => ({payload: event || ''})
		},
		clearFilterOptions: {
			reducer: (state, action) => {
				state.filterOptions = [];
			},
			prepare: event => ({payload: event || ''})
		},
		removeFilterOptions: {
			reducer: (state, action) => {
				let options = JSON.parse(JSON.stringify(state.filterOptions));
				options.splice(action.payload, 1);
				state.filterOptions = options;
			},
			prepare: event => ({payload: event || ''})
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
		editData: (state, action) => {

			state.storeEditData = {
				data: action.payload,

			};
		},
		setStatusUpdate: (state, action) => {

			state.isStatusChange = false
		},

		setUpdateStatus: (state, action) => {

			state.isModalityUpdated = null
		},

	},


	extraReducers: {
		[getModality.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			modalityAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			// state.searchText = '';
		},
		[createModality.fulfilled]: (state, action) => {
			const {isCreateSuccess, isCreateError} = action.payload;
			state.isModalityCreated = isCreateSuccess;
			state.isModalityCreateError = isCreateError;
		},
		[updateModality.fulfilled]: (state, action) => {
			const {isUpdateSuccess, isUpdateError} = action.payload;
			state.isModalityUpdated = isUpdateSuccess;
			state.isModalityUpdatedError = isUpdateError;
		},
		[deleteModality.fulfilled]: (state, action) => {
			const {isModalityDeleted, isModalityDeletedError} = action.payload;
			state.isModalityDeleted = isModalityDeleted;
			state.isModalityDeletedError = isModalityDeletedError;
		},
		[getLocations.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.locations = action.payload.data;
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			// state.searchText = '';
		},
		[getModalityForDropDown.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.modalityForDrop = data;
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			// state.searchText = '';
		},
		[changeStatusModality.fulfilled]: (state, action) => {
			const {data, isStatusChange, sStatusError} = action.payload;
			state.isStatusChange = isStatusChange;
			state.sStatusError = sStatusError
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
	closeNewFormDialog,
	openNewFormDialog,
	editData,
	setStatusUpdate,
	setUpdateStatus
} = modalitySlice.actions;

export default modalitySlice.reducer;

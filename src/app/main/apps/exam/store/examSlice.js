import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from 'app/config';

let cancelToken;
export const getExams = createAsyncThunk('examApp/exam/getAllExam', async (routeParams, {getState}) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		var reqBody = {
			ModalityId: 0,
			LocationId: 0,
			CptId: 0,
			exam: "1"
		}
		cancelToken = axios.CancelToken.source();
		const response = await axios.post(API_URL.GET_ALL_EXAMS, reqBody);//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token })

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

export const createExam = createAsyncThunk('examApp/exam/createExam',
	async (exam, {dispatch, getState}) => {
		try {
			if (typeof cancelToken != typeof undefined) {
				cancelToken.cancel("Operation canceled due to new request.");
			}
			//Save the cancel token for the current request
			cancelToken = axios.CancelToken.source();
			const response = await axios.post(API_URL.CREATE_EXAM, exam);//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token })
		
			const data = await response.data;

			return {data, isExamCreated: true};
		}
		catch (e) {
			console.log("error", e)
			return {e, isExamCreatedError: true};
		}

	});




export const updateExam = createAsyncThunk('examApp/exam/updateExam',
	async (exam, {dispatch, getState}) => {
		try {


			let obj = {
				cpt: exam.cpt,
				cpt1: exam.cpt1,
				cpt2: exam.cpt2,
				exam: exam.exam,
				exampreptext: exam.exampreptext,
				id: exam.id,
				laterality: exam.laterality,
				locationId:exam.locationId,
				modalityId: parseInt(exam.modalityId),
				p_instruction: exam.p_instruction,
				price: exam.price,
				selfprice: exam.selfprice,
				timeslot: parseInt(exam.timeslot)
			}
			const response = await axios.post(API_URL.UPDATE_EXAM, obj);
			const data = await response.data;
			return {data, isUpdateSuccess: true};
		}
		catch (e) {
			return {isUpdateError: true};
		}
	}
);
export const getModalityForDropDown = createAsyncThunk('examApp/exam/getModalityForDropDown', async (routeParams, {getState}) => {
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

export const getLocations = createAsyncThunk('examApp/exam/getLocation', async (routeParams, {getState}) => {
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


const examAdapter = createEntityAdapter({});

export const {selectAll: selectExam, selectById: selectContactsById} = examAdapter.getSelectors(
	state => state.examApp.exam
);

const examSlice = createSlice({
	name: 'examApp/exam',
	initialState: examAdapter.getInitialState({
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
		locations: [],
		modalityForDrop: [],
		isExamCreated: null,
		isExamCreatedError: null,
		isUpdateSuccess: null,
		isUpdateError: null,
		isExamDeleted: null
	}),
	reducers: {
		setexamSearchText: {
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

			state.isUpdateSuccess = null
		},

	},


	extraReducers: {
		[getExams.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			examAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			// state.searchText = '';
		},
		[getLocations.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.locations = action.payload.data;
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			// state.searchText = '';
		},
		[createExam.fulfilled]: (state, action) => {
			const {isExamCreated, isExamCreatedError, data} = action.payload;
			state.data = data;
			state.isExamCreated = isExamCreated;
			state.isExamCreatedError = isExamCreatedError;
			// state.searchText = '';
		},
		[updateExam.fulfilled]: (state, action) => {
			const {isUpdateSuccess, isUpdateError, data} = action.payload;
			state.data = data;
			state.isUpdateSuccess = isUpdateSuccess;
			state.isUpdateError = isUpdateError;
			// state.searchText = '';
		},
		[getModalityForDropDown.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.modalityForDrop = data;
			// state.searchText = '';
		},

	}
});

export const {
	setexamSearchText,
	setFilterOptions,
	removeFilterOptions,
	clearFilterOptions,
	openEditDialog,
	closeEditDialog,
	openConfirmDialog,
	closeConfirmDialog,
	closeNewFormDialog,
	openNewFormDialog,
	editData
} = examSlice.actions;

export default examSlice.reducer;

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import { API_URL } from 'app/config';




let cancelToken;

export const getAudit = createAsyncThunk('auditApp/audit/getAudit', async (routeParams, { getState }) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();
		routeParams = routeParams || getState().auditApp.audit.routeParams
		const response = routeParams?.fields.length === 0 && await axios.get(API_URL.GET_ATTORNEY, routeParams, { cancelToken: cancelToken.token });
		const res = await response.data || getState().auditApp.audit.searchData
		const searchData = getState().auditApp.audit.entities
		const auditSlice = '';
		if (res.error && res.error != '') {
			return { data: [], routeParams, isSearching: false };
		} else {
			if (routeParams?.fields.length) {
				let newResponse = []
				if (routeParams.fields[0].filedname !== "keyword") {
					const filterObject = routeParams.fields.reduce((obj, item) => ({ ...obj, [item.name]: item.value }), {})
					if (routeParams.fields[1] && routeParams.fields[1].operator === "OR") {
						newResponse = _.filter(res, item => Object.keys(filterObject).some(key => item[key].toString().toLowerCase().startsWith(filterObject[key].toString().toLowerCase())));
					} else if(routeParams.fields[0].filedname === "id"){
						newResponse = _.filter(res, item => Object.keys(filterObject).every(key => item[key] === filterObject[key]));
					}
					else
						newResponse = _.filter(res, item => Object.keys(filterObject).every(key => item[key].toString().toLowerCase().startsWith(filterObject[key].toString().toLowerCase())));
					
					return { data: newResponse, searchData: searchData, routeParams, isSearching: false };
				} else {
					return { data: res, searchData: res, routeParams, isSearching: false, err_msg: "Please Select field to search" };
				}
			} else {
				return { data: res, searchData: res, routeParams, isSearching: false};
			}
		}
	}
	catch (e) {
		return { data: [], routeParams, isSearching: true };
	}

});

export const searchPatientsDetail = createAsyncThunk('auditApp/audit/searchPatientsDetail',
	async (routeParams, { getState }) => {
		try {
			const response = await axios.post(API_URL.SEARCH_PATIENTS_DETAILS,  routeParams ,{getState});
			const data = await response.data;
			return { data, isSearchDetail: true };
		}
		catch (e) {
			return { isSearchDetail: false };
		}
	}
);

export const getSingleAuditDetails = createAsyncThunk('auditApp/audit/getSingleAuditDetails',
	async (routeParams, { getState }) => {
		try {
			const response = await axios.post(API_URL.GET_SINGLE_AUDIT_DETAILS,  routeParams ,{getState});
			const data = await response.data;
			return { data, isSearchDetail: true };
		}
		catch (e) {
			return { isSearchDetail: false };
		}
	}
);

export const getAuditsForUser = createAsyncThunk('auditApp/audit/getAuditsForUser',
	async (routeParams, { getState }) => {
		try {
			const response = await axios.post(API_URL.GET_AUDITS_FOR_USER,  routeParams ,{getState});
			const data = await response.data;
			return { data, isSearchDetail: true };
		}
		catch (e) {
			
			return { isSearchDetail: false };
		}
	}
);



export const updateAudit = createAsyncThunk('auditApp/audit/updateAudit',
	async (audit, { dispatch, getState }) => {
		try {
			const response = await axios.post(API_URL.UPDATE_ATTORNEY, { ...audit });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch (e) {
			return { isUpdateError: true };
		}
	}
);

export const deleteAudit = createAsyncThunk('auditApp/audit/deleteAudit',
	async (audit, { dispatch, getState }) => {
		try {
			const response = await axios.post(API_URL.DELETE_ATTORNEY, { ...audit });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch (e) {
			return { isUpdateError: true };
		}
	}
);

const auditAdapter = createEntityAdapter({});


export const { selectAll: selectAudit, selectById: selectContactsById } = auditAdapter.getSelectors(
	state => state.auditApp.audit
	);


const auditSlice = createSlice({
	name: 'auditApp/audit',
	initialState: auditAdapter.getInitialState({
		searchText: {fields:[],type:''},
		tableNo:0,
		isSearching: false,
		filterOptions: [],
		auditType:'',
		confirmationDialog: {
			props: {
				open: false
			},
			data: null,
		},
		isAuditUpdated: false,
		isAuditUpdatedError: false,
		isAuditDeleted: false,
		sAuditDeletedError: false,
		err_msg: '',
		searchData: [],
		thirdTableSearchData: [],
		secondTableSearchData:[],
		userAuditsData:[],
		defaultOptions:[{ title: 'First Name', value: 'fname', match: '', type: 'string', name: 'firstname' },
		{ title: 'Last Name', value: 'lname', match: '', type: 'string', name: 'lastname' },
		{ title: 'Access No.', value: 'exam_access_no', match: '', type: 'string', name: 'access' },
		{ title: 'PatientId', value: 'patient_id', match: '', type: 'string', name: 'patient_id' }]
	}),
	reducers: {
		setAuditSearchText: {
			reducer: (state, action) => {
	
				if(action.payload.action=='FIELDS'){
					
					state.searchText = {...state.searchText, fields:action.payload.fields};
				}
				else{
					state.searchText = {...state.searchText, type:action.payload.type};
					
				}
				
			},
			prepare: event => ({ payload: event || '' })
			//prepare: event => ({ payload: event || '' })
		},
		setTableNumber:{
			reducer: (state, action) => {
				state.tableNo = action.payload.tableNo
			}
		},
		setIsSearching:{
			reducer: (state, action) => {
				state.isSearching = action.payload
			}
		},
		setdefaultOptions:{
			reducer: (state, action) => {
				state.defaultOptions = action.payload
			}
		},
		clearData:{
			reducer: (state, action) => {
				
				state.thirdTableSearchData = []
				state.secondTableSearchData = []
				state.userAuditsData = []
			}
		},


		setAuditTypeinState:{
			reducer: (state, action) => {
				state.auditType = action.payload;
				
				
			},
			prepare: event => ({ payload: event || '' })
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
		[getAudit.fulfilled]: (state, action) => {
			const { data, routeParams, isSearching, searchData, err_msg } = action.payload;
			auditAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			state.searchData = searchData;
			state.err_msg = err_msg;
			// state.searchText = '';
		},
		[searchPatientsDetail.fulfilled]: (state, action) => {
			const { data } = action.payload;
			if(state.tableNo==0)
				state.searchData = data;
			else if(state.tableNo==1)
				state.secondTableSearchData = data;

			
			//const { data, routeParams, isSearching, searchData, err_msg } = action.payload;
			//auditAdapter.setAll(state, data);
			//state.routeParams = routeParams;
			//state.isSearching = isSearching;
			//state.searchData = searchData;
			//state.err_msg = err_msg;
			// state.searchText = '';
		},
		[getSingleAuditDetails.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.thirdTableSearchData = data;
			state.isSearching = false

			
			//const { data, routeParams, isSearching, searchData, err_msg } = action.payload;
			//auditAdapter.setAll(state, data);
			//state.routeParams = routeParams;
			//state.isSearching = isSearching;
			//state.searchData = searchData;
			//state.err_msg = err_msg;
			// state.searchText = '';
		},
		[getAuditsForUser.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.userAuditsData = data;
			state.isSearching = false

			
			//const { data, routeParams, isSearching, searchData, err_msg } = action.payload;
			//auditAdapter.setAll(state, data);
			//state.routeParams = routeParams;
			//state.isSearching = isSearching;
			//state.searchData = searchData;
			//state.err_msg = err_msg;
			// state.searchText = '';
		},
		[updateAudit.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.isAuditUpdated = isUpdateSuccess;
			state.isAuditError = isUpdateError;
		},
		[deleteAudit.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.isAuditDeleted = isUpdateSuccess;
			state.isAuditDeletedError = isUpdateError;
		},

	}
});



export const {
	setAuditSearchText,
	setTableNumber,
	setdefaultOptions,
	clearData,
	setIsSearching,
	setFilterOptions,
	removeFilterOptions,
	clearFilterOptions,
	openEditDialog,
	closeEditDialog,
	openConfirmDialog,
	closeConfirmDialog,
	setAuditTypeinState,
	removErrorMessage
} = auditSlice.actions;

export default auditSlice.reducer;

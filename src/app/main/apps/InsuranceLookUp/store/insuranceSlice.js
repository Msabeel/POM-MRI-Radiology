import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import { API_URL } from 'app/config';

let cancelToken;
export const getInsurance = createAsyncThunk('insuranceApp/insurance/getInsurance', async (routeParams, { getState }) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();
		routeParams = routeParams || getState().insuranceApp.insurance.routeParams
		const response = routeParams?.fields.length === 0 && await axios.get(API_URL.GET_ATTORNEY, routeParams, { cancelToken: cancelToken.token });
		const res =  getState().insuranceApp.insurance.searchData ||  await response.data
		const searchData = getState().insuranceApp.insurance.entities
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



export const updateInsurance = createAsyncThunk('insuranceApp/insurance/updateInsurance',
	async (insurance, { dispatch, getState }) => {
		try {
			const response = await axios.post(API_URL.UPDATE_ATTORNEY, { ...insurance });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch (e) {
			return { isUpdateError: true };
		}
	}
);


export const deleteInsurance = createAsyncThunk('insuranceApp/insurance/deleteInsurance',
	async (insurance, { dispatch, getState }) => {
		try {
			const response = await axios.post(API_URL.DELETE_ATTORNEY, { ...insurance });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch (e) {
			return { isUpdateError: true };
		}
	}
);

export const insuranceCompanyTypes = createAsyncThunk('insuranceApp/insurance/insuranceCompanyTypes',
	async (routeParams, { getState }) => {
		try {
			const response = await axios.get(API_URL.INSURANCECOMPANYTYPES,  routeParams ,{getState});
			const data = await response.data || getState().insuranceApp.insurance.insuranceTypes;
			return { data, isCompanyTypesSuccess: true };
		}
		catch (e) {
			return { isCompanyTypesError: true, data: getState().insuranceApp.insurance.insuranceTypes };
		}
	}
);

export const searchingInsuranceCompany = createAsyncThunk('insuranceApp/insurance/searchingInsuranceCompany',
	async (routeParams, { getState }) => {
		try {
			const response = await axios.post(API_URL.SEARCH_INSURANCE_COMPANY,  routeParams ,{getState});
			const data = await response.data;
			return { data, isCompantTypesSuccess: true };
		}
		catch (e) {
			return { isCompanyTypesError: true };
		}
	}
);




const insuranceAdapter = createEntityAdapter({});


export const { selectAll: selectInsurance, selectById: selectContactsById } = insuranceAdapter.getSelectors(
	state => state.insuranceApp.insurance
);

const insuranceSlice = createSlice({
	name: 'insuranceApp/insurance',
	initialState: insuranceAdapter.getInitialState({
		searchText: {fields:[],type:''},
		isSearching: false,
		filterOptions: [],
		insuranceType:'',
		insuranceTypes:[],
		confirmationDialog: {
			props: {
				open: false
			},
			data: null,
		},
		isInsuranceUpdated: false,
		isInsuranceUpdatedError: false,
		isInsuranceDeleted: false,
		isInsuranceDeletedError: false,
		err_msg: '',
		searchData: [],
	}),
	reducers: {
		setInsuranceSearchText: {
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
		setInsuranceTypeinState:{
			reducer: (state, action) => {
				state.insuranceType = action.payload;
				
			},
			prepare: event => ({ payload: event || '' })
		},
		setIsSearching:{
			reducer: (state, action) => {
				state.isSearching = action.payload
			},
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
		[getInsurance.fulfilled]: (state, action) => {
			const { data, routeParams, isSearching, searchData, err_msg } = action.payload;
			insuranceAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.isSearching = isSearching;
		//	state.searchData = searchData;
			state.err_msg = err_msg;
			// state.searchText = '';
		},
		[updateInsurance.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.isInsuranceUpdated = isUpdateSuccess;
			state.isInsuranceUpdatedError = isUpdateError;
		},
		[deleteInsurance.fulfilled]: (state, action) => {
			const { isUpdateSuccess, isUpdateError } = action.payload;
			state.isInsuranceDeleted = isUpdateSuccess;
			state.isInsuranceDeletedError = isUpdateError;
		},

		[insuranceCompanyTypes.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.insuranceTypes = data
			
			//state.isCompanyTypesDeleted = isCompantTypesSuccess;
			//state.isCompanyTypesDeletedError = isCompanyTypesError;
		},

		[searchingInsuranceCompany.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.searchData = data;
			//state.isCompanyTypesDeleted = isCompantTypesSuccess;
			//state.isCompanyTypesDeletedError = isCompanyTypesError;
		},


	}
});

export const {
	setInsuranceSearchText,
	setFilterOptions,
	setIsSearching,
	removeFilterOptions,
	clearFilterOptions,
	openEditDialog,
	closeEditDialog,
	openConfirmDialog,
	closeConfirmDialog,
	removErrorMessage,
	setInsuranceTypeinState
} = insuranceSlice.actions;

export default insuranceSlice.reducer;

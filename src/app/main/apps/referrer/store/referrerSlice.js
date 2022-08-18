import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

let cancelToken;
export const getReferrer = createAsyncThunk('referrerApp/referrer/getReferrer', async (routeParams, { getState }) => {
	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();
		routeParams = routeParams || getState().contactsApp.contacts.routeParams;
		let routeParamsObj = routeParams || getState().contactsApp.contacts.routeParams;
		//let routeParamsObj = JSON.parse(`{"fname": "robert","phone":""}`)
		const response = await axios.post(API_URL.GET_REFERRER_USER, routeParamsObj, { cancelToken: cancelToken.token });
		let res = await response.data;
		if(res.error && res.error != ''){
			return { data: [], routeParams, isSearching: false };
		}else{
			return { data: res, routeParams, isSearching: false };
		}
	}
	catch(e) {
		return { data: [], routeParams, isSearching: true };
	}
});

export const getReferrerCompanyList = createAsyncThunk('referrerApp/referrer/getReferrerCompanyList', async (routeParams) => {
	const response = await axios.get(API_URL.GET_REFERRER_COMPONEY_LIST);
	const data =  response.data;
	return { data };
	
	
});

export const showPassword = createAsyncThunk(
	'referrerApp/referrer/showPassword',
	async (routeParams, { dispatch, getState }) => {
		const response = await axios.post(API_URL.SHOW_PASSWORD, routeParams);
		const data = await response.data;
		//dispatch(getContacts());
		let res = data;
		if(res.error && res.error != ''){
			return { password: '', success: false };
		}else{
			return { password: res.password, success: true };
		}

		return data;
	}
);

const referrerAdapter = createEntityAdapter({});

export const { selectAll: selectReferrer, selectById: selectReferrerById } = referrerAdapter.getSelectors(
	state => state.referrerApp.referrer
);

const referrerSlice = createSlice({
	name: 'referrerApp/referrer',
	initialState: referrerAdapter.getInitialState({
		searchText: '',
		isSearching: false,
		filterOptions: [],
		allCompany:[]
	}),
	reducers: {
		setReferrerSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			//prepare: event => ({ payload: event.target.value || '' })
			prepare: event => ({ payload: event || '' })
		},
		clearSearchText: {
			reducer:(state, action) => {
				state.searchText = '';
				referrerAdapter.setAll(state, []);
				state.isSearching = false;
			}
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
	},


	extraReducers: {
		[getReferrer.fulfilled]: (state, action) => {
			const { data, routeParams, isSearching } = action.payload;
			referrerAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.isSearching = isSearching;
			// state.searchText = '';
		},
		[getReferrerCompanyList.fulfilled]: (state, action) => {
			const { data } = action.payload;
			
			let array = [];
			data.map((val, key) => {
				
				let clinic_name = val.clinic_name
				if(val.address1){
					clinic_name += ' - '+val.address1;
				}
				if(val.address2){
					clinic_name += ', '+val.address2;
				}
				if(val.cityname){
					clinic_name += ', '+val.cityname;
				}
				if(val.statename){
					clinic_name += ', '+val.statename;
				}
				if(val.zip){
					clinic_name += ', '+val.zip;
				}
				if(val.id){
					clinic_name += ' - '+val.id;
				}
				//let clinic_name = val.clinic_name+' - '+val.address1+' , '+val.address2+', '+val.cityname+', '+val.statename+', '+val.zip+' - '+val.id
				let arr = {
					title: 'Clinic Name: '+clinic_name,
					value: "clinic_id",
					match: val.id,
					type: 'string',
					isFinal: true,
					showTitle: 'Clinic Name',
					showMatch: clinic_name
				  }
				  array.push(arr)
			})
			state.allCompany = array;
			
			
		},
		// [showPassword.fulfilled]: (state, action) => {
		// 	const { data } = action.payload;
		// 	state.decreptedPassword = data;
		// },
	}
});

export const {
	setReferrerSearchText,
	setFilterOptions,
	removeFilterOptions,
	clearFilterOptions,
	clearSearchText,
} = referrerSlice.actions;

export default referrerSlice.reducer;

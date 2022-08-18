import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getAllPlaceholder = createAsyncThunk('formBuilderApp/formBuilder/getAllPlaceholder', async (req) => {
	const response = await axios.get(API_URL.GET_ALL_PLACEHOLDER);
	const data =  response.data;
	return { data };
	}
);

export const getForms = createAsyncThunk('formBuilderApp/formBuilder/getForms', async (req) => {
	const response = await axios.post(API_URL.GET_QUESTIONS);
	const data =  response.data;
	return { data };
	}
);

export const getModalities = createAsyncThunk('formBuilderApp/formBuilder/getModalities', async (req) => {
	const response = await axios.get(API_URL.GET_MODALITIES);
	const data =  response.data;
	return { data };
	} 
);

export const getExamList = createAsyncThunk('formBuilderApp/formBuilder/getExamList', async (req) => {
	const response = await axios.post(API_URL.EXAM_MGT, { "trigger":"exambyid" });
	const data =  response.data;
	return { data };
	} 
);

export const getPayerType = createAsyncThunk('formBuilderApp/formBuilder/getPayerType', async (req) => {
	const response = await axios.get(API_URL.GET_PAYER_TYPE);
	const data =  response.data;
	return { data };
	}
);

export const saveFormQuestion = createAsyncThunk('formBuilderApp/formBuilder/saveFomrQuestion', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.SAVE_QUESTION, { ...req, userid: currentUser.data.userId });
	const data =  response.data;
	return { data, isUpdateSuccess: true };
	}
);

export const updateFormQuestion = createAsyncThunk('formBuilderApp/formBuilder/updateFomrQuestion', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.UPDATE_QUESTION, { ...req, userid: currentUser.data.userId });
	const data =  response.data;
	return { data, isUpdateSuccess: true };
	}
);

export const saveFormOrder = createAsyncThunk('formBuilderApp/formBuilder/saveFormOrder', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.SAVE_FORM_ORDER, { ...req, userid: currentUser.data.userId });
	const data =  response.data;
	return { data, isUpdateSuccess: true };
	}
);

const formBuilderAdapter = createEntityAdapter({});

export const { selectAll: selectAttorney, selectById: selectContactsById } = formBuilderAdapter.getSelectors(
	state => state.formBuilderApp.formBuilder
);

const formBuilderSlice = createSlice({
	name: 'formBuilderApp/formBuilder',
	initialState: formBuilderAdapter.getInitialState({
		searchText: '',
		forms: [],
		placeHolders: [],
		modalities: [],
		examList: [],
		payerType: [],
		isSearching: false,
		editDialog: {
			props: {
				open: null
			},
			data: null,
		},
		formDialog: {
            props: {
                open: null
            },
            data: null,
        },
		previewDialog: {
            props: {
                open: null
            },
            data: null,
        },
	}),
	reducers: {
		openEditDialog: (state, action) => {
			state.editDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeEditDialog: (state, action) => {
			state.editDialog = {
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openNewFormDialog: (state, action) => {
			state.formDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: action.payload,
				
			};
		},
		closeNewFormDialog: (state, action) => {
			state.formDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		editNewFormDialog: (state, action) => {
			state.formDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload,
				
			};
		},
		updateNewFormDialog: (state, action) => {
			state.formDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openPreviewDialog: (state, action) => {
			state.previewDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: action.payload,
				
			};
		},
		closePreviewDialog: (state, action) => {
			state.previewDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: action.payload,
			};
		},
	},
	extraReducers: {
		[getAllPlaceholder.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.placeHolders = data;
		},
		[getModalities.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.modalities = data;
		},
		[getExamList.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.examList = data;
		},
		[getPayerType.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.payerType = data;
		},
		[getForms.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.forms = data;
		},
	}
});

export const {
	openEditDialog,
	closeEditDialog,
	openNewFormDialog,
	closeNewFormDialog,
	editNewFormDialog,
	updateNewFormDialog,
	openPreviewDialog,
	closePreviewDialog
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;

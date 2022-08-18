import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';
var CryptoJS = require("crypto-js");
let cancelToken;
export const getDocuments = createAsyncThunk('uploadsDocumentApp/uploadDocument/getDocuments', async (routeParams, {getState}) => {

	try {
		if (typeof cancelToken != typeof undefined) {
			cancelToken.cancel("Operation canceled due to new request.");
		}
		//Save the cancel token for the current request
		cancelToken = axios.CancelToken.source();
		routeParams = routeParams || getState().contactsApp.contacts.routeParams;
		const response = await axios.post(API_URL.TIMELINE, { ...routeParams, "trigger":"finalizedexam" }, {cancelToken: cancelToken.token, });
		console.log("response",response)
		const data = await response.data;
		return {data, routeParams, isSearching: false};
	}
	catch (e) {
		return {data: [], routeParams, isSearching: true};
	}

});

export const getDocumentType = createAsyncThunk('uploadDocumentApp/uploadDocument/getDocumentType', async (routeParams) => {
	const response = await axios.post(API_URL.TIMELINE, { "trigger":"documentlist" });
	const data = response.data;
	return {data};
});

export const getUploadCred = createAsyncThunk('uploadDocumentApp/uploadDocument/getUploadCred', async (routeParams) => {
	const response = await axios.get(API_URL.UPLOAD_CRED);
	// Decrypt
	var bytes  = CryptoJS.AES.decrypt(response.data.accessKeyId, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainKeyText = bytes.toString(CryptoJS.enc.Utf8);
	
	bytes  = CryptoJS.AES.decrypt(response.data.secretAccessKey, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainSecretText = bytes.toString(CryptoJS.enc.Utf8);
	const data = { bucket: response.data.bucket, plainSecretText, plainKeyText}
	return { data  };
});

export const uploadBulkDocument = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/uploadDocument',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.data.forEach((element, i) => {
				document.data[i].user_id = userId.data.userId// add user id in every object
			});
			const response = await axios.post(API_URL.BULK_UPLOAD_DOCUMENT, {...document, user_id: userId.data.userId});
			const data = response.data;
			return {data, isUploaded: true};
		}
		catch (e) {
			return {isUploaded: false};
		}
	}
);

export const uploadBulkDocumentReact = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/uploadBulkDocumentReact',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.data.forEach((element, i) => {
				document.data[i].user_id = userId.data.userId// add user id in every object
			});
			const response = await axios.post(API_URL.TIMELINE, {...document, "trigger":"uploaddocmulti", user_id: userId.data.userId});
			const data = response.data;
			return {data, isUploaded: true};
		}
		catch (e) {
			return {isUploaded: false};
		}
	}
);

export const uploadDocument = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/uploadDocument',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));

			document.user_id = userId.data.userId;
			// document.data.forEach((element, i) => {
			// 	document.data[i].user_id = userId.data.userId// add user id in every object
			// });
			const response = await axios.post(API_URL.UPLOAD_DOCUMENT, {...document, user_id: userId.data.userId});
			const data = response.data;
			return {data, isUploaded: true};
			// var data = []
			// return { data, isUploaded: true }
		}
		catch (e) {
			return {isUploaded: false};
		}
	}
);

export const uploadDocumentReact = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/uploadDocumentReact',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));

			document.user_id = userId.data.userId;
			console.log('document: ', document)
			const response = await axios.post(API_URL.TIMELINE, {...document, "trigger":"uploaddocument", user_id: userId.data.userId});
			const data = response.data;
			return {data, isUploaded: true};
			// var data = []
			// return { data, isUploaded: true }
		}
		catch (e) {
			return {isUploaded: false};
		}
	}
);

const uploadDocumentsAdapter = createEntityAdapter({});

export const {selectAll: selectContacts, selectById: selectContactsById} = uploadDocumentsAdapter.getSelectors(
	state => state.uploadsDocumentApp.contacts
);

const uploadDocumentSlice = createSlice({
	name: 'uploadsDocumentApp/contacts',
	initialState: uploadDocumentsAdapter.getInitialState({
		document: '',
		isSearching: false,
		routeParams: {},
		documentType: [],
		uploadCred: {},
		isUploaded: false,
		examData: [],
		SnaptShotDialog: {
			props: {
				open: false
			},
			data: null,


		},
		previewDialog: {
			props: {
				open: false
			},
			data: null,
		},
	}),
	reducers: {
		setImageData: {
			reducer: (state, action) => {
				state.document = action.payload;
			},
		},

		openSnaptShotDialog: (state, action) => {
			state.SnaptShotDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},

		closeSnapShotDialog: (state, action) => {
			state.SnaptShotDialog = {
				props: {
					open: false
				},

			};
		},
		openPreivewDialog: (state, action) => {
			state.previewDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closePreviewDialog: (state, action) => {
			state.previewDialog = {
				props: {
					open: false
				},

			};
		},
		
	},


	extraReducers: {

		[getDocuments.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			uploadDocumentsAdapter.setAll(state, data);
			state.examData = data;
			state.routeParams = routeParams;
			state.isSearching = isSearching;

		},
		[getDocumentType.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.documentType = data;
		},
		[getUploadCred.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.uploadCred = data;
		},
		[uploadBulkDocumentReact.fulfilled]: (state, action) => {
			const {data, isUploaded} = action.payload;
			state.isUploaded = isUploaded;
		},
	}
});

export const {
	openSnaptShotDialog,
	setImageData,
	closeSnapShotDialog,
	openPreivewDialog,
	closePreviewDialog,
} = uploadDocumentSlice.actions;

export default uploadDocumentSlice.reducer;

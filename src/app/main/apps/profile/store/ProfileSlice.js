import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from 'app/config';
import {useSelector} from 'react-redux'
import {createSelector} from 'reselect'
var CryptoJS = require("crypto-js");
let cancelToken;
export const sendPatientAccessMail = createAsyncThunk('uploadsDocumentApp/profile/sendPatientAccessMail',
	async (req) => {
		const currentUser = JSON.parse(localStorage.getItem('USER'));
		const response = await axios.post(API_URL.SEND_PATIENT_PORTAL_ACCESS, {...req, userid: currentUser.data.userId});
		const data = response.data;
		return {data};
	}
);

export const getIndexDetails = createAsyncThunk('uploadsDocumentApp/profile/getIndexDetails', async (req) => {
	return JSON.parse(localStorage.getItem('Index_Details'));
}
);

export const getVerificationSheetData = createAsyncThunk('uploadsDocumentApp/profile/getVerificationSheetData', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.VERIFICATION_SHEET_DATA, {...req, userid: currentUser.data.userId});
	const data = response.data;
	return {data};
});

export const getTaskAction = createAsyncThunk('uploadsDocumentApp/profile/getTaskAction', async (req) => {
	//const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.GET_TASK_ACTION, {...req});
	const data = JSON.parse(response.data.body);
	return {data};
});

export const completeTask = createAsyncThunk('uploadsDocumentApp/profile/completeTask', async (req, {dispatch}) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.COMPLETE_TASK, {...req, task_completed_userid: currentUser.data.userId});
	const data = JSON.parse(response.data.body);
	dispatch(getTaskAction({key: "get", exam_id: req.exam_id}));
	return {data};
});

export const getAndSaveAlerts = createAsyncThunk('uploadsDocumentApp/profile/getAndSaveAlerts', async (req) => {
	//const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.GET_AND_SAVE_ALERTS, {...req});
	const data = JSON.parse(response.data.body);
	return {data};
}
);

export const getPaymentDetails = createAsyncThunk('uploadsDocumentApp/profile/getPaymentDetails', async (req) => {
	//const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.GET_PAYMENT_DETAIL, {...req});
	const data = JSON.parse(response.data.body);
	return {data};
}
);

export const deletePaymentData = createAsyncThunk('uploadsDocumentApp/profile/deletePaymentData', async (req, {dispatch, getState}) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.DELETE_PAYMENT_DATA, {...req, userid: currentUser.data.userId});
	const data = JSON.parse(response.data.body);
	return {data};
}
);

export const savePaymentData = createAsyncThunk('uploadsDocumentApp/profile/savePaymentData', async (req, {dispatch, getState}) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.SAVE_PAYMENT_DATA, {...req, userid: currentUser.data.userId});
	const data = JSON.parse(response.data.body);
	return {data};
});

const customOnUploadProgress = (progressEvent) => {
	const percentFraction = progressEvent.loaded / progressEvent.total;
	const percent = Math.floor(percentFraction * 100);

	//const percentCompleted = Math.floor((progressEvent.loaded * 100)); 
	//console.log(percent);
	//console.log(percentFraction);
	return percent;
	//{onUploadProgress: customOnUploadProgress}
}

const config = {

	onUploadProgress: progressEvent => {
		//   console.log(
		// 	"Upload Progress" +
		// 	  Math.round((progressEvent.loaded / progressEvent.total) * 100) +
		// 	  "%"
		const percentFraction = progressEvent.loaded / progressEvent.total;
		const percent = Math.floor(percentFraction * 100);


	}
};
export const uploadFinalReport = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/uploadFinalReport',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.user_id = userId.data.userId;

			const response = await axios.post(API_URL.UPLOAD_FINAL_REPORT_REACT, {...document}, config);
			const data = response.data;
			return {data, isFinalReport: true, customOnUploadProgress: customOnUploadProgress};
		}
		catch (e) {
			return {isFinalReportError: true};
		}
	}
);
export const getFinalReport = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/getFinalReport',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.user_id = userId.data.userId;

			const response = await axios.post(API_URL.GET_FINAL_REPORT, {...document});

			const data = response.data;
			return {data, getFinalReport: true};
		}
		catch (e) {
			return {getFinalReportError: true};
		}
	}
);
export const saveTechHold =createAsyncThunk('uploadDocumentApp/uploadDocument/saveTechHold',async (req)=>{
	const response = await axios.post(API_URL.TECH_HOLD,{...req});
    const data =  response.data;
    return { data ,isLoading:false};
});
export const getFaxageCred = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/getFaxageCred',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			// document.user_id = userId.data.userId;

			const response = await axios.get(API_URL.FAXAGECRED);

			const data = response;
			return {data: data};
		}
		catch (e) {
			return {getFinalReportError: true};
		}
	}
);
export const sendFax = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/sendFax',
	async (data, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			// document.user_id = userId.data.userId;
			// console.log("str",)
			const response = await axios.post(API_URL.SEND_FAX, data);
			const data1 = response;
			return {data: data1};
		}
		catch (e) {
			return {isFaxedError: true, data: e};
		}
	}
);

export const addAudit = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/addAudit',
	async (auditData, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			auditData.user_id = userId.data.userId;

			const response = await axios.post(API_URL.ADD_AUDIT, {...auditData});

			const data = response;
			return {data: data};
		}
		catch (e) {
			return {isFaxedError: true, data: e};
		}
	}
);

export const getAuditFax = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/getAuditFax',
	async (data, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			// auditData.user_id = userId.data.userId;
			const response = await axios.post(API_URL.GET_ADUDITFAX, {...data});

			const data1 = response;
			return {data: data1};
		}
		catch (e) {
			return {isFaxedError: true, data: e};
		}
	}
);

export const getUploadCred = createAsyncThunk('uploadDocumentApp/uploadDocument/getUploadCred', async (routeParams) => {
	/* this api is used to get alerts of patients who are requesting additional access time on their patient portal
	const response = await axios.get(API_URL.UPLOAD_CRED);
	// Decrypt
	var bytes = CryptoJS.AES.decrypt(response.data.accessKeyId, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainKeyText = bytes.toString(CryptoJS.enc.Utf8);

	bytes = CryptoJS.AES.decrypt(response.data.secretAccessKey, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainSecretText = bytes.toString(CryptoJS.enc.Utf8);
	const data = {bucket: response.data.bucket, plainSecretText, plainKeyText}
	*/
	return {};
});

export const getAllCity = createAsyncThunk('contactsApp/contacts/getAllCity', async (routeParams) => {
	const response = await axios.get(API_URL.GET_ALL_CITY);
	const data = response.data;
	return {data};
});
export const downloadFax = createAsyncThunk(
	'uploadDocumentApp/uploadDocument/downloadFax',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.user_id = userId.data.userId;

			const response = await axios.post(API_URL.DOAWLOADFAX, {...document}, config);
			const data = response.data;
			return {data, isdoawnloadfax: true, };
		}
		catch (e) {
			return {isdoawnloadfaxError: true};
		}
	}
);

export const getAllDocuments = createAsyncThunk(
	'documementAcctach/getAllDocuments',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));

			const response = await axios.post(API_URL.GETALLDOCUMENTS, {...document});
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);


export const getAllAudit = createAsyncThunk(
	'documementAcctach/getAllAudit',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.GETALLAUDIT, {...document});
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);

export const getAlerts = createAsyncThunk(
	'documementAcctach/getAlerts',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.get(API_URL.GETALERTS);
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const getAlertsByPid = createAsyncThunk(
	'documementAcctach/getAlertsByPid',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.GETALERTBYEXAM, {...document});
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const editExam = createAsyncThunk(
	'documementAcctach/editExam',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.user_id = userId.data.userId;
			const response = await axios.post(API_URL.EDITEXAM, {...document});
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const editFirstStep = createAsyncThunk(
	'documementAcctach/editFirstStep',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.user_id = userId.data.userId;
			const response = await axios.post(API_URL.UPDATE_EXAM_FIRST, {...document});
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const editSecondStep = createAsyncThunk(
	'documementAcctach/editSecondStep',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.user_id = userId.data.userId;
			const response = await axios.post(API_URL.UPDATE_EXAM_SECOND, {...document});
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const addExamTasks = createAsyncThunk(
	'documementAcctach/editSecondStep',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			document.user_id = userId.data.userId;
			const response = await axios.post(API_URL.ADD_EXAM_TASKS, {...document});
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const getTasks = createAsyncThunk(
	'documementAcctach/getTasks',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.get(API_URL.GETTASKS);
			const reasonsList = Object.keys(response).reduce((arr, key) => arr.concat(response[key]), []);
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const getTasksByExam = createAsyncThunk(
	'documementAcctach/getTasksbyExam',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.GETTASKSBYEXAM, {...document});
			const reasonsList = Object.keys(response).reduce((arr, key) => arr.concat(response[key]), []);
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const getRecentsExams = createAsyncThunk(
	'documementAcctach/getRecentsExams',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));

			const response = await axios.post(API_URL.GETRECENTSEXAMS, {...document});
			const reasonsList = Object.keys(response).reduce((arr, key) => arr.concat(response[key]), []);
			const data = response;
			return {data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const getExamDetails = createAsyncThunk(
	'documementAcctach/getExamDetails',
	async (document, {dispatch, getState}) => {
		try {
			const userId = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.GETEXAMDETAILS, {...document});
			// const reasonsList = Object.keys(response).reduce((arr, key) => arr.concat(response[key]), []);
			const data = response;
			return {data: data};
		}
		catch (e) {
			return {data: []};
		}
	}
);
export const getModalityForDropDown = createAsyncThunk(
	'documementAcctach/getModalityForDropDown',
	async (routeParams, {getState}) => {
		try {
			if (typeof cancelToken != typeof undefined) {
				cancelToken.cancel("Operation canceled due to new request.");
			}
			//Save the cancel token for the current request
			cancelToken = axios.CancelToken.source();

			// routeParams = routeParams || getState().modalityApp.modality.routeParamsGET_MODALITIES GET_MODALITY_DROPDOWN
			const response = await axios.get(API_URL.GET_MODALITIES, routeParams, {cancelToken: cancelToken.token});//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token }):

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
export const getExamByModality = createAsyncThunk(
	'documementAcctach/getExamByModality',
	async (routeParams, {getState}) => {
		try {
			if (typeof cancelToken != typeof undefined) {
				cancelToken.cancel("Operation canceled due to new request.");
			}
			//Save the cancel token for the current request
			cancelToken = axios.CancelToken.source();
			// routeParams = routeParams || getState().modalityApp.modality.routeParamsGET_MODALITIES GET_MODALITY_DROPDOWN
			const response = await axios.post(API_URL.GETEXAMBYMODALITY, {...routeParams});//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token }):

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

export const getLocations = createAsyncThunk(
	'documementAcctach/getLocation',
	async (routeParams, {getState}) => {
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
export const getRadiologist = createAsyncThunk(
	'documementAcctach/getRadiologist',
	async (routeParams, {getState}) => {
		try {
			if (typeof cancelToken != typeof undefined) {
				cancelToken.cancel("Operation canceled due to new request.");
			}

			//Save the cancel token for the current request
			cancelToken = axios.CancelToken.source();

			// routeParams = routeParams || getState().modalityApp.modality.routeParams
			const response = await axios.get(API_URL.GETRADIOLOGIST, routeParams, {cancelToken: cancelToken.token});//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token }):

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

export const getRefferers = createAsyncThunk(
	'documementAcctach/getRefferers',
	async (routeParams, {getState}) => {
		try {
			if (typeof cancelToken != typeof undefined) {
				cancelToken.cancel("Operation canceled due to new request.");
			}
			//Save the cancel token for the current request
			cancelToken = axios.CancelToken.source();
			/* we just commented this portion because get reffer api taking 20 to 25 sec to load the
			page we have to add that api in on demand.
			// routeParams = routeParams || getState().modalityApp.modality.routeParams
			//const response = await axios.get(API_URL.GETREFERRER, routeParams, {cancelToken: cancelToken.token});//routeParams?.fields.length ? await axios.post(API_URL.GET_MODALITIES, routeParams, { cancelToken: cancelToken.token }):
			//const res = await response.data;
			*/
			const res = [{address_line1: "706 W BOYNTON BEACH BLVD",
			address_line2: "",
			code: "TALLERIE, PIERRE",
			firstname: null,
			id: 3439,
			lastname: null,
			name: "TALLERIE, PIERRE",
			notes: ""}];

			if (res.error && res.error != '') {
				return {data: [], routeParams, isSearching: false};
			} else {
			//	return {data: response.data, routeParams, isSearching: false};
			return {data: res, routeParams, isSearching: false};
			}
		}
		catch (e) {
			console.log("error", e)
			return {data: [], routeParams, isSearching: true};
		}
	});

const profileAdapter = createEntityAdapter({});

export const {selectAll: selectContacts, selectById: selectContactsById} = profileAdapter.getSelectors(
	state => state.uploadsDocumentApp.profile
);


const profileSlice = createSlice({
	name: 'uploadsDocumentApp/profile',
	initialState: profileAdapter.getInitialState({
		data: [],
        isLoading: false,
		previewDialog: {
			props: {
				open: false
			},
			data: null,
		},
		newOrderDetails: {
			props: {
				open: false
			},
			data: null,
		},
		verificationSheetDialog: {
			props: {
				open: false
			},
			data: null,
			verificationData: null
		},
		patientAccessDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null,
			resetPasswordData: null,
			isPatientAccessMailSent: false,
			isUpdateSuccess: false,
			isUpdateError: false,
			patientAccessResponse: {},

		},
		patientAccessPrintDialog: {
			props: {
				open: false
			},
			data: null,
		},
		modalDialog: {
			props: {
				open: false
			},
			data: null,
			is_form_show: false,
			taskData: null
		},
		isFinalReport: false,
		isFinalReportError: false,
		getFinalReport: false,
		getFinalReportError: false,
		allCity: [],
		uploadCred: null,
		isUploaded: null,
		allDocuments: [],
		allAudit: [],
		selectedExam: [],
		alerts: [],
		tasks: [],
		radiologist: [],
		refferers: [],
		tasksByExam: [],
		alertByExam: [],
		recentExams: [],
		examsforFax: [],
		techHold:null,
		modalties: null,
		locations: null,
		examDetail: null,
		examByModality: null,
		isNavigationBlocked: false,
		editResponse: null,
		filterOptions: [],
		tabs: [],
		selectedExams: [],
		patientInfoArray: [],
		activeTab: '',
		examDetails: {
			props: {
				open: null
			},
			data: null,
		},
		tasksDetails: {
			props: {
				open: null
			},
			data: null,
		},
		alertsDetails: {
			props: {
				open: null
			},
			data: null,
		},
		radiologistDetails: {
			props: {
				open: null
			},
			data: null,
		},
		reffererDetails: {
			props: {
				open: null
			},
			data: null,
		},
		checkBoxes: {
			props: {
				open: null
			},
			data: null,
		},
		confirmDetails: {
			props: {
				open: null
			},
			data: null,
			old_data: null,
		},
		questionDetials: {
			props: {
				open: null
			},
			data: null,
		},
		tabLoading: {
			props: {
				open: null
			},
		},
		verificationData: null,
		searchText: '',
		patientAlertsDetails : {
			props: {
				open: false
			},
			data: null,

		},
	}),
	reducers: {
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
		openVerificationSheetDialog: (state, action) => {
			state.verificationSheetDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeVerificationSheetDialog: (state, action) => {
			state.verificationSheetDialog = {
				props: {
					open: false
				},

			};
		},
		openPatientAccessDialog: (state, action) => {
			state.patientAccessDialog = {
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditPatientAccessDialog: (state, action) => {
			state.patientAccessDialog = {
				props: {
					open: false
				},
				data: null,
			};
		},
		openPatientAccessPrintPage: (state, action) => {
			state.patientAccessPrintDialog = {
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closePatientAccessPrintPage: (state, action) => {
			state.patientAccessPrintDialog = {
				props: {
					open: false
				},
				data: null
			};
			state.patientAccessDialog.patientAccessResponse = null;
		},
		openModalDialog: (state, action) => {

			state.modalDialog = {
				type: action.payload.type,
				title: action.payload.title,
				props: {
					open: true
				},
				data: action.payload,
			};
		},
		closeModalDialog: (state, action) => {
			state.modalDialog = {
				props: {
					open: false
				},
				data: [],
				is_form_show: false
			};
		},
		showCommentForm: (state, action) => {
			state.modalDialog = {
				...state.modalDialog,
				is_form_show: true
			};
		},
		setDocumentUploadStatus: (state, action) => {
			state.isUploaded = action.payload
		},
		setSelectedExam: (state, action) => {
			state.selectedExam = action.payload
		},
		openExamDetailEdit: (state, action) => {
			state.examDetails = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeExamDetailEdit: (state, action) => {
			state.examDetails = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openRadiologistEdit: (state, action) => {
			state.radiologistDetails = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeRadiologistEdit: (state, action) => {
			state.radiologistDetails = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openReffererEdit: (state, action) => {
			state.reffererDetails = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeReffererEdit: (state, action) => {
			state.reffererDetails = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openTasksEdit: (state, action) => {
			state.tasksDetails = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeTasksEdit: (state, action) => {
			state.tasksDetails = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
      
		openAlertsEdit: (state, action) => {
			state.alertsDetails = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeAlertsEdit: (state, action) => {
			state.alertsDetails = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openCheckboxDialog: (state, action) => {
			state.checkBoxes = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeCheckboxDialog: (state, action) => {
			state.checkBoxes = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openQuestionDialog: (state, action) => {
			state.questionDetials = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		openNewOrderDialog: (state, action) => {
			state.newOrderDetails = {
				props: {
					open: true
				},

			};
		},
		closeNewOrderDialog: (state, action) => {
			state.newOrderDetails = {
				props: {
					open: true
				},

			};
		},
		closeQuestionDialog: (state, action) => {
			state.questionDetials = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openConfirmDialog: (state, action) => {
			state.confirmDetails = {
				props: {
					open: true
				},
				data: action.payload.data,
				old_data: action.payload.old_data,
				selectedExam: action.payload.selectedExam

			};
		},
		closeConfirmDialog: (state, action) => {
			state.confirmDetails = {
				props: {
					open: false
				},
				data: action.payload.data,
				old_data: action.payload.old_data,
				selectedExam: action.payload.selectedExam


			};
		},
		openTabLoading: (state, action) => {
			state.tabLoading = {
				props: {
					open: true
				},
			};
		},
		closeTabLoading: (state, action) => {
			state.tabLoading = {
				props: {
					open: false
				},

			};
		},
		setActiveTab: (state, action) => {
			state.activeTab = action.payload
		},
		setTechHold1:(state,action)=>{
			state.techHold=action.payload.access_no
		},
		setTabs: {
			reducer: (state, action) => {
				let index = state.tabs.indexOf(action.payload)
				if (index > -1) {
					let tabs = state.tabs.filter(x => x !== action.payload)
					// state.tabs = tabs
				} else {
					state.tabs.push(action.payload);
				}
			},
			prepare: event => ({payload: event || ''})
		},
		removeTabs: {
			reducer: (state, action) => {
				let options = JSON.parse(JSON.stringify(state.tabs));

				// options.splice(action.payload, 1);
				state.tabs = options.filter(x => x !== action.payload);
			},
			prepare: event => ({payload: event || ''})
		},
		clearTabs: {
			reducer: (state, action) => {
				state.tabs = [];
				state.activeTab = ""
			},
			prepare: event => ({payload: event || ''})
		},
		setExams: {
			reducer: (state, action) => {
				state.selectedExams.push(action.payload);
				// let index = state.selectedExams.indexOf(action.payload);
				// console
				// if (index > -1) {
				// 	let tabs = state.selectedExams.filter(x => x.id !== action.payload.id)
				// 	// state.tabs = tabs
				// } else {
				// 	state.selectedExams.push(action.payload);
				// }
			},
			prepare: event => ({payload: event || ''})
		},
		removeExams: {
			reducer: (state, action) => {
				let options = JSON.parse(JSON.stringify(state.selectedExams));

				// options.splice(action.payload, 1);
				state.tabs = options.filter(x => x !== action.payload);
			},
			prepare: event => ({payload: event || ''})
		},
		setPatientInfo: {
			reducer: (state, action) => {
				state.patientInfoArray.push(action.payload);
				// let index = state.selectedExams.indexOf(action.payload);
				// console
				// if (index > -1) {
				// 	let tabs = state.selectedExams.filter(x => x.id !== action.payload.id)
				// 	// state.tabs = tabs
				// } else {
				// 	state.selectedExams.push(action.payload);
				// }
			},
			prepare: event => ({payload: event || ''})
		},
		removePatientInfo: {
			reducer: (state, action) => {
				// let options = JSON.parse(JSON.stringify(state.patientInfoArray));

				// options.splice(action.payload, 1);
				// state.patientInfoArray = options.filter(x => x !== action.payload);
				state.patientInfoArray = [];
			},
			prepare: event => ({payload: event || ''})
		},
		updateNavigationBlocked: (state, action) => {
			state.isNavigationBlocked = action.payload
		},
		setExamsForFax: (state, action) => {
			state.examsForFax = action.payload
		},
		setFilterOption: {
			reducer: (state, action) => {
				state.filterOptions.push(action.payload);
			},
			prepare: event => ({payload: event || ''})
		},
		resetFilterOption: {
			reducer: (state, action) => {
				state.filterOptions = [];
			},
			prepare: event => ({payload: event || ''})
		},
		setContactsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
				state.currentView = 'exams';
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
		techHoldSuccessMessage: (state, action) => {
			state.techHoldMsgObj = action.payload
		},
		openPatientAlertsDialog: (state, action) => {
			state.patientAlertsDetails = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closePatientAlertsDialog: (state, action) => {
			state.patientAlertsDetails = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
	},
	extraReducers: {
		[sendPatientAccessMail.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.patientAccessDialog.patientAccessResponse = data;
		},
		[getVerificationSheetData.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.verificationData = data;
		},
		[getTaskAction.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.modalDialog.taskData = data;
		},
		[completeTask.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.modalDialog.is_form_show = false
			//state.modalDialog.taskData = data;
		},
		[getAndSaveAlerts.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.modalDialog.taskData = data;
		},
		[getPaymentDetails.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.modalDialog.taskData = data;
		},
		[deletePaymentData.fulfilled]: (state, action) => {
			const {data} = action.payload;
			if (data.insurenceData) {
				state.modalDialog.taskData = data;
			}
		},
		[savePaymentData.fulfilled]: (state, action) => {
			const {data} = action.payload;
			if (data.insurenceData) {
				state.modalDialog.taskData = data;
			}

		},
		[uploadFinalReport.fulfilled]: (state, action) => {
			const {isFinalReport, isFinalReportError, data} = action.payload;

			state.isFinalReport = isFinalReport;
			state.isFinalReportError = isFinalReportError;
		},
		[getFinalReport.fulfilled]: (state, action) => {
			const {getFinalReport, getFinalReportError, data} = action.payload;

			state.getFinalReport = getFinalReport;
			state.getFinalReportError = getFinalReportError;
		},
		[saveTechHold.fulfilled]:(state,action)=>{
			const {data, loading} = action.payload;
            state.data = data;
            state.isLoading = loading;
		},
		[getAllCity.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.allCity = data;
		},
		[getUploadCred.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.uploadCred = data;
		},
		[downloadFax.fulfilled]: (state, action) => {
			const {isdownload, isdownloadError} = action.payload;

			state.isdownload = isdownload;
			state.isdownloadError = isdownloadError;
		},
		[getAllDocuments.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.getAllDocuments = data;
			// state.searchText = '';
		},
		[getAllAudit.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.getAllAudit = data;
			// state.searchText = '';
		},
		[getAlerts.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.alerts = data.data;
			// state.searchText = '';
		},
		[getAlertsByPid.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.alertsByExam = data.data;
			// state.searchText = '';
		},
		[getTasks.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.tasks = data.data;
			// state.searchText = '';
		},
		[getTasksByExam.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.tasksByExam = data.data;
			// state.searchText = '';
		},
		[getModalityForDropDown.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.modalities = data;
			// state.searchText = '';
		},
		[getLocations.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.locations = data;
			// state.searchText = '';
		},
		[getExamByModality.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.examByModality = data.data;
			// state.searchText = '';
		},
		[getRadiologist.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.radiologist = data;
			// state.searchText = '';
		},
		[getRefferers.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.refferers = data;
			// state.searchText = '';
		},
		[getRecentsExams.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.recentExams = data.data;
			// state.searchText = '';
		},
		[getExamDetails.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.examDetail = data.data;
			// state.searchText = '';
		},
		[editExam.fulfilled]: (state, action) => {
			const {data, routeParams, isSearching} = action.payload;
			state.editReponse = data.data;
			// state.searchText = '';
		},
	}
});

export const {
	openPreivewDialog,
	closePreviewDialog,
	openVerificationSheetDialog,
	closeVerificationSheetDialog,
	openPatientAccessDialog,
	closeEditPatientAccessDialog,
	openPatientAccessPrintPage,
	closePatientAccessPrintPage,
	openModalDialog,
	closeModalDialog,
	showCommentForm,
	setDocumentUploadStatus,
	setSelectedExam,
	openExamDetailEdit,
	closeExamDetailEdit,
	updateNavigationBlocked,
	openRadiologistEdit,
	closeRadiologistEdit,
	openReffererEdit,
	closeReffererEdit,
	openTasksEdit,
	closeTasksEdit,
	openAlertsEdit,
	closeAlertsEdit,
	openCheckboxDialog,
	closeCheckboxDialog,
	openConfirmDialog,
	closeConfirmDialog,
	openQuestionDialog,
	closeQuestionDialog,
	setFilterOption,
	resetFilterOption,
	setContactsSearchText,
	removeFilterOptions,
	setExamsForFax,
	openTabLoading,
	closeTabLoading,
	openNewOrderDialog,
	closeNewOrderDialog,
	setTabs,
	removeTabs,
	setActiveTab,
	setExams,
	removeExams,
	setPatientInfo,
	removePatientInfo,
	clearTabs,
	setTechHold1,
	techHoldSuccessMessage,
	openPatientAlertsDialog,
	closePatientAlertsDialog
} = profileSlice.actions;

export default profileSlice.reducer;

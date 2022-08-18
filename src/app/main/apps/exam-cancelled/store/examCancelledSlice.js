import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';
import _ from 'lodash';
var CryptoJS = require("crypto-js");

let cancelToken;
export const getExamCancelReasons = createAsyncThunk('examCancelledApp/examCancelled/getExamCancelReasons', async (routeParams, { getState }) => {

    try {
        if (typeof cancelToken != typeof undefined) {
            cancelToken.cancel("Operation canceled due to new request.");
        }
        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();

        routeParams = routeParams || getState().contactsApp.contacts.routeParams;
        const response = await axios.post(API_URL.TIMELINE, {"trigger":"cancelreason"});//{ exam_access_no: routeParams.exam_id },
        const data = await response.data;
        const reasonsList = Object.keys(data).reduce((arr, key) => arr.concat(data[key]), []);

        return { data, reasonsList: reasonsList, routeParams };
    }
    catch (e) {
        return { data: [], routeParams };
    }

});

export const getSelectedExam = createAsyncThunk('examCancelledApp/examCancelled/getSelectedExam', async (routeParams) => {
    try {
        routeParams = routeParams;
        const response = await axios.post(API_URL.TIMELINE, { patient_id: routeParams.patient_id ,exam_id : routeParams.exam_id, "trigger":"finalizedexam" });
        const data = await response.data;

        if (data.length !== 0) {
            return { data, routeParams, isPatientCardRender: true };
        } else {
            return { data: [], routeParams, isPatientCardRender: false };
        }
    }
    catch (e) {
        return { selectedExamCard: [], routeParams, isPatientCardRender: false };
    }

});

export const examCancelSubmit = createAsyncThunk('examCancelledApp/examCancelled/examCancelSubmit',
    async (examData, { dispatch, getState }) => {
        try {
            const response = await axios.post(API_URL.CANCEL_EXAM_Dot_Net, examData);
            const data = await response.data;
            return { data, isExamCancel: true };
        }
        catch (e) {
            return { data: "", isExamCancel: false };
        }
    }
);

export const examCancelRevert = createAsyncThunk('examCancelledApp/examCancelled/examCancelRevert',
    async (examData, { dispatch, getState }) => {
        try {
            const response = await axios.post(API_URL.CANCEL_EXAM_REVERT, examData);
            const data = await response.data;
            return { data, isExamCancelRevert: true };
        }
        catch (e) {
            return { data: "", isExamCancelRevert: false };
        }
    }
);
export const getUploadCred = createAsyncThunk('uploadDocumentApp/uploadDocument/getUploadCred', async (routeParams) => {
	const response = await axios.get(API_URL.UPLOAD_CRED);
	// Decrypt
	var bytes = CryptoJS.AES.decrypt(response.data.accessKeyId, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainKeyText = bytes.toString(CryptoJS.enc.Utf8);

	bytes = CryptoJS.AES.decrypt(response.data.secretAccessKey, 'b52bbfdb-2263-43d2-9bce-cd66624723cc');
	var plainSecretText = bytes.toString(CryptoJS.enc.Utf8);
	const data = {bucket: response.data.bucket, plainSecretText, plainKeyText}
	return {data};
});


const examCancelledAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = examCancelledAdapter.getSelectors(
    state => state.examCancelledApp.examCancelled
);

const examCancelledSlice = createSlice({
    name: 'examCancelledApp/examCancelled',
    initialState: examCancelledAdapter.getInitialState({
        routeParams: {},
        reasonList: [],
        reasonsList: [],
        selectedExamCard: [],
        cancelExamRevert:"",
        cancelExamSubmit: "",
        isPatientCardRender: false,
        isExamCancel: false,
        isExamCancelRevert:false,
        previewDialog: {
            props: {
                open: false
            },
            data: null,
        },
        uploadCred: {},
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
    },
    extraReducers: {
        [getExamCancelReasons.fulfilled]: (state, action) => {
            const { data, routeParams, reasonsList } = action.payload;
            examCancelledAdapter.setAll(state, data);
            state.routeParams = routeParams;
            // state.reasonsList = reasonsList;
            state.reasonsList = reasonsList;
        },
        [getSelectedExam.fulfilled]: (state, action) => {
            const { routeParams, data, isPatientCardRender } = action.payload;
            state.routeParams = routeParams;
            state.selectedExamCard = data;
            state.isPatientCardRender = isPatientCardRender
        },
        [examCancelSubmit.fulfilled]: (state, action) => {
            const { data, isExamCancel } = action.payload;
            state.cancelExamSubmit = data;
            state.isExamCancel = isExamCancel;
        },
        [examCancelRevert.fulfilled]: (state, action) => {
            const { data, isExamCancelRevert } = action.payload;
            state.cancelExamRevert = data;
            state.isExamCancelRevert = isExamCancelRevert;
        },
        [getUploadCred.fulfilled]: (state, action) => {
			const {data} = action.payload;
			state.uploadCred = data;
		},
    }
});

export const {
    openPreivewDialog,
    closePreviewDialog,
} = examCancelledSlice.actions;

export default examCancelledSlice.reducer;

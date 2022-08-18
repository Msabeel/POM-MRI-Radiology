import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';
import {API_URL} from 'app/config';

let cancelToken;
export const getCancelExamManagementData = createAsyncThunk('cancelExamManagementApp/getCancelExamManagement', async () => {
    try {
        const response = await axios.post(API_URL.TIMELINE, {"trigger":"cancelreason"});
        return {data: response.data, errMsg: '', loading: false};
    } catch (e) {
        return {data: [], errMsg: 'Something Went Wrong !', loading: false};
    }
})

export const createCancelReason = createAsyncThunk('cancelExamManagementApp/createCancelReason',
    async (data) => {
        try {
            if (typeof cancelToken != typeof undefined) {
                cancelToken.cancel("Operation canceled due to new request.");
            }
            //Save the cancel token for the current request
            cancelToken = axios.CancelToken.source();
            const currentUser = JSON.parse(localStorage.getItem('USER'));
            data.user_id = currentUser.data.userId;
            const response = await axios.post(API_URL.CREATECANCELREASON, data);
            return {isCreatedSuccess: true};
        } catch (e) {
            return {isCreatedError: true};
        }
    })



export const editCancelReason = createAsyncThunk('cancelExamManagementApp/editCancelReason',
    async (data) => {
        try {
            if (typeof cancelToken != typeof undefined) {
                cancelToken.cancel("Operation canceled due to new request.");
            }
            //Save the cancel token for the current request
            cancelToken = axios.CancelToken.source();
            const currentUser = JSON.parse(localStorage.getItem('USER'));
            data.user_id = currentUser.data.userId;
            const response = await axios.post(API_URL.EDITCANCELREASON, data, {cancelToken: cancelToken.token, });
            return {isUpdateSuccess: true};
        } catch (e) {
            return {isUpdateError: true};
        }
    })

const CancelExamManagementSlice = createSlice({
    name: 'cancelExamManagementApp/getCancelExamManagement',
    initialState: {
        data: [],
        isLoading: false,
        errMsg: '',
        isCreatedSuccess: false,
        isCreatedError: false,
        isUpdateSuccess: false,
        isUpdateError: false,
    },
    reducers: {
        setResponseStatus: (state, action) => {
            state.isUpdateSuccess = false
            state.isCreatedSuccess = false
        },
    },
    extraReducers: {
        [getCancelExamManagementData.fulfilled]: (state, action) => {
            const {data, loading} = action.payload;
            state.data = data;
            state.isLoading = loading;
        },
        [createCancelReason.fulfilled]: (state, action) => {
            const {isCreatedSuccess, isCreatedError} = action.payload;
            state.isCreatedSuccess = isCreatedSuccess;
            state.isCreatedError = isCreatedError;
        },
        [editCancelReason.fulfilled]: (state, action) => {
            const {isUpdateSuccess, isUpdateError} = action.payload;
            state.isUpdateSuccess = isUpdateSuccess;
            state.isUpdateError = isUpdateError;
        }
    }
});
export const{
    setResponseStatus
} = CancelExamManagementSlice.actions;

export default CancelExamManagementSlice.reducer;
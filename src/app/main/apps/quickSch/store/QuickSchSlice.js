import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';
import {API_URL} from 'app/config';

let cancelToken;
export const getAllModality = createAsyncThunk('getAllModality/getAllModality', async () => {
    try {
        if (typeof cancelToken != typeof undefined) {
            cancelToken.cancel("Operation canceled due to new request.");
        }
        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();

        const response = await axios.get(API_URL.GET_MODALITIES);
        return {data: response.data, errMsg: '', loading: false};
    } catch (e) {
        return {data: [], errMsg: 'Something Went Wrong !', loading: false};
    }
})


const QuickSchSlice = createSlice({
    name: 'QuickSchSlice/QuickSchSlice',
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
        [getAllModality.fulfilled]: (state, action) => {
            const {data, loading} = action.payload;
            state.data = data;
            state.isLoading = loading;
        },
    }
});
export const {
    setResponseStatus
} = QuickSchSlice.actions;

export default QuickSchSlice.reducer;
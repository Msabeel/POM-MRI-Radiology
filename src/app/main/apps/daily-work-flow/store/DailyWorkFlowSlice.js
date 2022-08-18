import {createSlice, createEntityAdapter,createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';
import {API_URL} from 'app/config';


export const getDailyWorkFlowData = createAsyncThunk('taskManagementApp/getAllTasks/getTaskManagementData', async (req) => {
        const response = await axios.get(API_URL.GETTASKS);
        const data =  response.data;
	    return { data ,isLoading:false};
    
})

const dailyWorkFlowSlice = createSlice({
    name: 'dailyWorkFLow/getDailyWorkFlowData',
    initialState:{
        data: [],
        isLoading: false,
    },
    reducers:{
         setResponseStatus: (state, action) => {
           // state.isUpdateSuccess = false
        
        },
    },
    extraReducers: {
        [getDailyWorkFlowData.fulfilled]: (state, action) => {
            const {data, loading} = action.payload;
            state.data = data;
            state.isLoading = loading;
            state.isDisabledEnabled = false;

        },
     
    }
});
export const{
    setResponseStatus
} = dailyWorkFlowSlice.actions;
export default dailyWorkFlowSlice.reducer;
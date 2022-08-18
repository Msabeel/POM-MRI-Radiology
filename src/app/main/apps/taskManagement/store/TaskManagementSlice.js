import {createSlice, createEntityAdapter,createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';
import {API_URL} from 'app/config';


export const getTaskManagementData = createAsyncThunk('taskManagementApp/getAllTasks/getTaskManagementData', async (req) => {
        const response = await axios.get(API_URL.GETTASKS);
        const data =  response.data;
	    return { data ,isLoading:false};
    
})

export const getWidgets = createAsyncThunk('taskManagementApp/getAllTasks/getWidgets', async () => {
	//const response = await axios.get('/api/project-dashboard-app/widgets');
    const response = await axios.get('https://x5wmutlt70.execute-api.us-east-1.amazonaws.com/Prod/getGraphdata');
	const data1 = await response.data;

	return { data1 ,isLoading:false};
});
export const deleteTaskManagementData = createAsyncThunk('taskManagementApp/getAllTasks/deleteTaskManagementData',async (req)=>{
  try{
    const currentUser = JSON.parse(localStorage.getItem('USER'));
    const response = await axios.post(API_URL.TASK_ACTIONS, {...req,user_id: currentUser.data.userId});
    const data = response
    if(data.data.isDeletedSuccess){
     return { isDeletedSuccess:true}
    }
    else{  
        return {isDeletedError:false,deleteId:req.id,message:data.data.message}
    }
}
   catch(e){
    return {isDeletedError:false ,message:"Something Went Wrong"}
   }
})
export const addTaskManagementData = createAsyncThunk('taskManagementApp/getAllTasks/addTaskManagementData',async (req)=>{
    const currentUser = JSON.parse(localStorage.getItem('USER'));
    const response = await axios.post(API_URL.TASK_ACTIONS, {...req,user_id: currentUser.data.userId});
    const data = response.data
    if (data.isCreatedSuccess){
        return  {isCreatedSuccess: true};
    }
    else{
        return {isCreatedError: true};
    }
   
})
export const editTaskManagementData = createAsyncThunk('taskManagementApp/getAllTasks/editTaskManagementData',async (req)=>{
      const currentUser = JSON.parse(localStorage.getItem('USER'));
    const response = await axios.post(API_URL.TASK_ACTIONS, {...req,user_id: currentUser.data.userId});
    const data = response.data
    if (data.isUpdatedSuccess){
        return  {isUpdateSuccess: true};
    }
    else{
        return {isUpdateError: true};
    }
   
})
export const disableTaskManagementData = createAsyncThunk('taskManagementApp/getAllTasks/disableTaskManagementData',async (req)=>{
     const currentUser = JSON.parse(localStorage.getItem('USER'));
    const response = await axios.post(API_URL.TASK_ACTIONS, {...req,user_id: currentUser.data.userId});
    const data = response.data
    return {data};
})
const taskManagementSlice = createSlice({
    name: 'taskManagementApp/getAllTasks',
    initialState:{
        data: [],
        data1:[],
        isLoading: false,
        isCreatedSuccess: false,
        isCreatedError: false,
        isUpdateSuccess: false,
        isUpdateError: false,
        isDeletedSuccess:false,
        isDeletedError:false,
        deleteId:'',
    },
    reducers:{
         setResponseStatus: (state, action) => {
            state.isUpdateSuccess = false
            state.isCreatedSuccess = false
            state.isDeletedSuccess = false
            state.isDisabledEnabled= false
        },
    },
    extraReducers: {
        [getTaskManagementData.fulfilled]: (state, action) => {
            const {data, loading} = action.payload;
            state.data = data;
            state.isLoading = loading;
            state.isDisabledEnabled = false;

        },
        [getWidgets.fulfilled]: (state,action) =>{
            const {data1}=action.payload;
            state.data1=data1
        },
        [deleteTaskManagementData.fulfilled]:(state,action)=>{
            const{isDeletedSuccess,isDeletedError}=action.payload
            state.isDeletedSuccess = isDeletedSuccess;
            state.isDeletedError = isDeletedError;
        },
        [addTaskManagementData.fulfilled]:(state,action)=>{
            const{isCreatedSuccess,isCreatedError}=action.payload
            state.isCreatedSuccess = isCreatedSuccess;
            state.isCreatedError = isCreatedError;
        },
        [editTaskManagementData.fulfilled]:(state,action)=>{
            const{isUpdateSuccess,isUpdateError}=action.payload
            state.isUpdateSuccess = isUpdateSuccess;
            state.isUpdateError = isUpdateError;
        },
        [disableTaskManagementData.fulfilled]:(state,action)=>{
            const{data,loading}=action.payload
            state.isDisabledEnabled = true;
        }
    }
});
export const{
    setResponseStatus
} = taskManagementSlice.actions;
export default taskManagementSlice.reducer;
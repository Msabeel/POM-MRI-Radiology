import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';
import {API_URL} from 'app/config';

export const getOpenTaskData = createAsyncThunk('openTaskApp/getAllOpenTasks/getOpenTaskData', async (req) => {
    const response = await axios.post(API_URL.OPENTASKSLIST,{...req});
    const data =  response.data;
    return { data ,isLoading:false};

})

// export const completeTask =createAsyncThunk('openTaskApp/getAllOpenTasks/completeTask', async (req) =>{
//     const currentUser = JSON.parse(localStorage.getItem('USER'));
//   const response =await axios.post(API_URL.COMPLETE_TASKS,{...req,task_completed_userid: currentUser.data.userId})
//   const data = response.data
//   if (data){
//     return  {TaskCompleted: true};
// }else{
//     return {TaskCompletedError: true};
// }
// })
export const completeMultipleTask= createAsyncThunk('openTaskApp/getAllOpenTasks/completeMultipleTask',async (req)=>{
    const currentUser =JSON.parse(localStorage.getItem('USER'));
    const response = await axios.post(API_URL.COMPLETE_TASKS,{...req,task_completed_userid: currentUser.data.userId})
    const data = response.data
    if (data){
      return  {TaskCompleted: true};
  }else{
      return {TaskCompletedError: true};
  }
})
const openTaskSlice = createSlice({
    name: 'openTaskApp/getAllOpenTasks',
    initialState: {
        data: [],
        isLoading: true,
        TaskCompleted:false,
        TaskCompletedError:false
    },
    reducers:{
        setResponseStatus: (state, action) => {
           state.TaskCompleted=false
           state.isLoading = false
       },
   },
    extraReducers: {
        [getOpenTaskData.fulfilled]: (state, action) => {
            const {data, loading} = action.payload;
            state.data = data;
            state.isLoading = false;
        },
        // [completeTask.fulfilled]:(state,action)=>{
        //     const{TaskCompleted,TaskCompletedError}=action.payload
        //     state.TaskCompleted = TaskCompleted;
        //     state.TaskCompletedError = TaskCompletedError;
        // },  
        [completeMultipleTask.fulfilled]:(state,action)=>{
            const{TaskCompleted,TaskCompletedError}=action.payload
            state.TaskCompleted = TaskCompleted;
            state.TaskCompletedError = TaskCompletedError;
        },
        
    }
});

export const{
    setResponseStatus
} = openTaskSlice.actions;
export default openTaskSlice.reducer;
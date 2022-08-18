import { combineReducers } from "@reduxjs/toolkit";
import TaskManagement from './TaskManagementSlice';
import openTaskSlice from './openTaskSlice'

const reducer = combineReducers({
    TaskManagement,
    openTaskSlice
});

export default reducer;
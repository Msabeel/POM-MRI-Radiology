import { combineReducers } from '@reduxjs/toolkit';
import AlertManagement from './AlertManagementSlice';
import assignedAlertSlice from './assignedAlertSlice';

const reducer = combineReducers({
	AlertManagement,
	assignedAlertSlice
});

export default reducer;

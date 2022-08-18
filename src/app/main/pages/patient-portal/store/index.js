import { combineReducers } from '@reduxjs/toolkit';
import patientPortal from './patientPortalSlice';

const reducer = combineReducers({
	patientPortal
});

export default reducer;

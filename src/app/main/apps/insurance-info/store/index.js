import { combineReducers } from '@reduxjs/toolkit';
import insuranceInfo from './InsuranceInfoSlice';

const reducer = combineReducers({
	insuranceInfo,
	
});

export default reducer;

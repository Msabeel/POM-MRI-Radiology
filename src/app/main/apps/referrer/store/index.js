import { combineReducers } from '@reduxjs/toolkit';
import referrer from './referrerSlice';

const reducer = combineReducers({
	referrer,
	
});

export default reducer;

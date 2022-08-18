import { combineReducers } from '@reduxjs/toolkit';
import attorney from './attorneySlice';

const reducer = combineReducers({
	attorney,
	
});

export default reducer;

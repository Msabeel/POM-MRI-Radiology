import { combineReducers } from '@reduxjs/toolkit';
import profile from './ProfileSlice';

const reducer = combineReducers({
	profile,
});

export default reducer;

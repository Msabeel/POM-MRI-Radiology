import { combineReducers } from '@reduxjs/toolkit';
import examCancelled from './examCancelledSlice';

const reducer = combineReducers({
	examCancelled,
});

export default reducer;

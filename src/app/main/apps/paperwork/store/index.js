import { combineReducers } from '@reduxjs/toolkit';
import paperWorkInfo from './PaperWorkInfoSlice';

const reducer = combineReducers({
	paperWorkInfo,
});

export default reducer;

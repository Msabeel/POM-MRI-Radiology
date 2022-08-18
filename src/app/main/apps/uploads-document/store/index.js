import { combineReducers } from '@reduxjs/toolkit';
import uploadDocument from './uploadDocumentSlice';

const reducer = combineReducers({
	uploadDocument,
	
});

export default reducer;

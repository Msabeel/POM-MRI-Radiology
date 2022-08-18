import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';
import permission from './permissionSlice';

const authReducers = combineReducers({
	user,
	permission,
	login,
	register
});

export default authReducers;

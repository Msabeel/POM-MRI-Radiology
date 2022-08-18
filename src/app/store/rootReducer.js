import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import patientPortalApp from 'app/main/pages/patient-portal/store';
import paperPortalApp from 'app/main/pages/paper-portal/store';
import fuse from './fuse';
import authReducer from '../reducers/authReducer';
const createReducer = asyncReducers =>
	combineReducers({
		auth,
		patientPortalApp,
		paperPortalApp,
		authReducer,
		fuse,
		...asyncReducers
	});

export default createReducer;

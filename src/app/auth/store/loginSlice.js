import { createSlice } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import awsService from 'app/services/awsService';
import { setUserData } from './userSlice';
import { setUserPermission } from './permissionSlice';
import Amplify from 'aws-amplify'

export const submitLogin = ({ email, password }) => async dispatch => {
	return jwtService
		.signInWithEmailAndPassword(email, password)
		.then(user => {
			dispatch(setUserData(user));

			return dispatch(loginSuccess());
		})
		.catch(error => {
			return dispatch(loginError(error));
		});
};

export const submitLoginWithAWS = ({ userName, password }, locationdata) => async dispatch => {
	try {
            if(userName !== "" && locationdata.data) {
				if(locationdata.data.pooldata) {
					const pooldata = locationdata.data.pooldata;
					Amplify.configure({
						Auth: {
						region: 'us-east-1',
						userPoolId: pooldata.UserPoolId, // 'us-east-1_WPpinzhdH',
						userPoolWebClientId: pooldata.UserPoolWebClientId, //'4mvh17hjm2jjr41jlqdi81if1g',
						authenticationFlowType: 'USER_PASSWORD_AUTH'
						}
				  	});
				}
				
                const { user, permissionData } = await awsService.signInWithEmailAndPassword(userName, password);
                dispatch(setUserData(user));
                dispatch(setUserPermission(permissionData));
                return dispatch(loginSuccess());
            }
        }
        catch(e) {
			console.log(e);
			dispatch(loginError(e));
            return { ...e, error: true };
        }
};

export const submitPatientLoginWithAWS = ({ userName, password, patient_id }, locationdata) => async dispatch => {
	try {
            if(userName !== "" && locationdata.data) {
				if(locationdata.data.pooldata) {
					const pooldata = locationdata.data.pooldata;
					Amplify.configure({
						Auth: {
						region: 'us-east-1',
						userPoolId: pooldata.PatientPoolId, //'us-east-1_F4mMuURwI',
						userPoolWebClientId: pooldata.PatientPoolWebClientId, // '3p9i3s7s1pp1isir3gtca4lsit',
						authenticationFlowType: 'USER_PASSWORD_AUTH'
						}
					});
				}
                const { user, permissionData } = await awsService.signInWithEmailAndPassword(userName, password, patient_id);
                dispatch(setUserData(user));
                return dispatch(loginSuccess());
            }
        }
        catch(e) {
			console.log(e);
			dispatch(loginError(e));
            return { ...e, error: true };
        }
};

export const submitLoginWithFireBase = ({ username, password }) => async dispatch => {
	if (!firebaseService.auth) {
		console.warn("Firebase Service didn't initialize, check your configuration");

		return () => false;
	}
	return firebaseService.auth
		.signInWithEmailAndPassword(username, password)
		.then(() => {
			return dispatch(loginSuccess());
		})
		.catch(error => {
			const usernameErrorCodes = [
				'auth/email-already-in-use',
				'auth/invalid-email',
				'auth/operation-not-allowed',
				'auth/user-not-found',
				'auth/user-disabled'
			];
			const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

			const response = {
				username: usernameErrorCodes.includes(error.code) ? error.message : null,
				password: passwordErrorCodes.includes(error.code) ? error.message : null
			};

			if (error.code === 'auth/invalid-api-key') {
				dispatch(showMessage({ message: error.message }));
			}

			return dispatch(loginError(response));
		});
};

const initialState = {
	success: false,
	error: {
		username: null,
		password: null
	}
};

const loginSlice = createSlice({
	name: 'auth/login',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.success = true;
		},
		loginError: (state, action) => {
			state.success = false;
			state.error = action.payload;
		}
	},
	extraReducers: {}
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;

import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Auth } from 'aws-amplify';
import Cookies from 'universal-cookie';
import { CustomSettings, API_URL } from 'app/config';
import history from '@history';

/* eslint-disable camelcase */

class AWSService extends FuseUtils.EventEmitter {
	init() {
		this.setRequestInterceptors();
		this.setInterceptors();
		this.handleAuthentication();
	}
	
	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					} else if(err.response.status === 500) {
						history.push( '/apps/error-message'	);
					}
					throw err;
				});
			}
		);
	};

	setRequestInterceptors = () => {
		axios.interceptors.request.use(
			config => {
				const auth_token = this.getAccessToken();
				const user_type = this.getUserType();
				if (auth_token) {
					config.headers['Authorization'] = auth_token;
					config.headers['user_type'] = user_type;
				}
				config.headers['ris-origin'] = window.location.origin;
				config.headers['Content-Type'] = 'application/json';
				return config;
			},
			err => {
				
				return new Promise((resolve, reject) => {
					
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			// this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = async (userName, password, patient_id) => {
			const thisUser = await Auth.signIn(userName);
			const userD = thisUser.challengeParam && JSON.parse(thisUser.challengeParam.userData);
			if(userD.block === 1) {
				throw { error: 'User is blocked', block: true};
			}
			const permissionData = thisUser.challengeParam && thisUser.challengeParam.permissionData && JSON.parse(thisUser.challengeParam.permissionData);
			const userdata = await Auth.sendCustomChallengeAnswer(thisUser, password, {"patient_id": patient_id});
			const token = await Auth.currentSession();
			const data = {
				fName: 'Test',
				lname: '',
				userId: userD.id,
				userName: userdata.username,
				displayName: userD.displayname ? userD.displayname : userD.fname + ' ' + userD.lname,
				email: userdata.username,
				error: false
			};
			const user = { data, role: userD.usertype === undefined ? [ 'patient' ] : [ 'staff' ] };
			this.setSession(token, user, patient_id, permissionData, user.role[0]);
			await axios.post(API_URL.INSERT_TOKEN_DB, {"UserId": userD.id,"UserType": userD.usertype, "UserName": userdata.username,"Expiry": token.accessToken.payload.exp, "trigger":"token"});
			return { user, permissionData };
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.get('/api/auth/access-token', {
					data: {
						access_token: this.getAccessToken()
					}
				})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = (token, user, patient_id, permissionData, user_type) => {
		const cookies = new Cookies();
		const IndexSettings =  JSON.parse(localStorage.getItem('Index_Details'));
		let CoockieDomain = CustomSettings.CoockieDomain;
		if(IndexSettings && IndexSettings.CoockieDomain && IndexSettings.CoockieDomain !== null) {
			CoockieDomain = IndexSettings.CoockieDomain;
		}
		if (token) {
			// localStorage.setItem('AUTH_TOKEN', JSON.stringify(token));
			localStorage.setItem('USER_TYPE', user_type);
			if(user) {
				localStorage.setItem('USER', JSON.stringify(user));
			}
			if(permissionData) {
				localStorage.setItem('USERPermissions', JSON.stringify(permissionData));
			}
			if(CustomSettings.IsProdDeployment) {
				cookies.set('AUTH_TOKEN', token.accessToken.jwtToken, { path: '/', domain: CoockieDomain });
			}
			else {
				cookies.set('AUTH_TOKEN', token.accessToken.jwtToken, { path: '/' });
			}
			cookies.set('authToken', token.accessToken.jwtToken, { path: '/', domain: CoockieDomain });
			cookies.set('patient_id', patient_id, { path: '/', domain: CoockieDomain });
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		} else {
			// localStorage.removeItem('AUTH_TOKEN');
			localStorage.removeItem('USER_TYPE');
			localStorage.removeItem('USER');
			localStorage.removeItem('USERPermissions');
			cookies.remove('AUTH_TOKEN', { path: '/' });
			cookies.remove('AUTH_TOKEN', { path: '/', domain: CoockieDomain });
			cookies.remove('authToken');
			cookies.remove('patient_id');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		const cookies = new Cookies();
		return cookies.get('AUTH_TOKEN') === undefined ? null : cookies.get('AUTH_TOKEN');
		// return window.localStorage.getItem('AUTH_TOKEN');
	};
	getUserType = () => {
		return window.localStorage.getItem('USER_TYPE');
	};

	getUserDetail = () => {
		const user = window.localStorage.getItem('USER');
		return JSON.parse(user);
	};

	getUserPermission = () => {
		const USERPermissions = window.localStorage.getItem('USERPermissions');
		return JSON.parse(USERPermissions);
	};
}

const instance = new AWSService();

export default instance;

import axios from 'axios';
import { Auth } from 'aws-amplify';
import { AUTH_FAIL, AUTH_START, AUTH_SUCCESS } from '../constants';


const authStart = () => {
    return {
        type: AUTH_START,
        loading: true
    };
};

const authSuccess = (token, user) => {
    return {
        type: AUTH_SUCCESS,
        idToken: token,
        userInfo: user,
        loading: false
    };
};

const authFail = error => {
    return {
        type: AUTH_FAIL,
        error,
        loading: false
    };
};
const auth = user => {
    return async dispatch => {
        try {
        dispatch(authStart());
            if(user.userName !== "") {
                const thisUser = await Auth.signIn(user.userName);
                const userdata = await Auth.sendCustomChallengeAnswer(thisUser, user.password);
                const token = await Auth.currentSession();
                const userInfo = {
                    fName: 'Test',
                    lname: '',
                    // userId: userdata.attributes.sub,
                    userName: userdata.userName,
                    error: false
                };
                localStorage.setItem('AUTH_TOKEN', JSON.stringify(token));
                localStorage.setItem('USER', JSON.stringify(userInfo));
                axios.defaults.headers.common.Authorization = token.idToken.jwtToken;
                dispatch(authSuccess(token.idToken.jwtToken, userInfo));
                return userInfo;
            }
        }
        catch(e) {
            console.log(e);
            return { ...e, error: true };
        }
    };
};
export {
    auth
}

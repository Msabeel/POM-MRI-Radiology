import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import auth0Service from 'app/services/auth0Service';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import awsService from 'app/services/awsService';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';

import { setUserDataFirebase, setUserDataAuth0, setUserData, logoutUser } from './store/userSlice';
import { setUserPermission } from './store/permissionSlice';

class Auth extends Component {
	state = {
		waitAuthCheck: true
	};

	componentDidMount() {
		return Promise.all([
			this.awsCheck()
		]).then(() => {
			this.setState({ waitAuthCheck: false });
		});
	}

	awsCheck = () =>
		new Promise(resolve => {
			awsService.init();
			const user = awsService.getUserDetail();
			const userPermission = awsService.getUserPermission();
			if(user) {
				this.props.setUserData(user);
				this.props.setUserPermission(userPermission);
			}
			resolve();
			return Promise.resolve();
		});

	render() {
		return this.state.waitAuthCheck ? <FuseSplashScreen /> : <>{this.props.children}</>;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout: logoutUser,
			setUserData,
			setUserPermission,
			setUserDataAuth0,
			setUserDataFirebase,
			showMessage,
			hideMessage
		},
		dispatch
	);
}

export default connect(null, mapDispatchToProps)(Auth);

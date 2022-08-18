import React from 'react';
import { authRoles } from 'app/auth';

const ForgotPassword2PageConfig = {
	// settings: {
	// 	layout: {
	// 		config: {}
	// 	}
	// },
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/forgot-password',
			component: React.lazy(() => import('./ForgotPassword2Page'))
		}
	]
};

export default ForgotPassword2PageConfig;

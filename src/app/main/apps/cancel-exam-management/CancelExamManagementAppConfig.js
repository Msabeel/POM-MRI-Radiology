import React from 'react';
import { authRoles } from 'app/auth';
import CancelExamManagementApp from './CancelExamManagementApp';

const CancelExamManagementAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	routes: [
		{	
			exact : true,
			path: '/apps/cancelExamManagement',
			component: React.lazy(() => import('./CancelExamManagementApp'))
		}
	]
};

export default CancelExamManagementAppConfig;

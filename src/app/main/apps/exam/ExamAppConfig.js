import React from 'react';
import { authRoles } from 'app/auth';

const ExamAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	// permission: 'modility_lookup',
	routes: [
		{
			path: '/apps/exam',
			component: React.lazy(() => import('./ExamApp')),
			exact: true
		},
		
	]
};

export default ExamAppConfig;

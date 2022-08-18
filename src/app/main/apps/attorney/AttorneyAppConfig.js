import React from 'react';
import { authRoles } from 'app/auth';

const AttorneyAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	permission: 'attorney_lookup',
	routes: [
		{
			path: '/apps/attorney',
			component: React.lazy(() => import('./AttorneyApp')),
			exact: true
		},
		{
			path: '/apps/attorney/:id',
			component: React.lazy(() => import('./AttorneyEdit'))
		}
	]
};

export default AttorneyAppConfig;

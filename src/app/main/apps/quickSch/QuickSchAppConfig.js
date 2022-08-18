import React from 'react';
import {authRoles} from 'app/auth';

const QuickSchAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	// permission: 'modility_lookup',
	routes: [
		{
			path: '/apps/quicksch',
			component: React.lazy(() => import('./QuickSchApp')),
			exact: true
		},
	]
};

export default QuickSchAppConfig;

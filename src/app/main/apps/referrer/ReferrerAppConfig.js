import React from 'react';
import { authRoles } from 'app/auth';

const ReferrerAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	routes: [
		{
			path: '/apps/referrer',
			component: React.lazy(() => import('./ReferrerApp'))
		}
	]
};

export default ReferrerAppConfig;

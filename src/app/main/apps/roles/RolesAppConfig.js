import React from 'react';
import { Redirect } from 'react-router-dom';

const RolesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/roles/:id',
			component: React.lazy(() => import('./RolesApp'))
		},
		{
			path: '/apps/roles',
			component: () => <Redirect to="/apps/roles/all" />
		}
	]
};

export default RolesAppConfig;

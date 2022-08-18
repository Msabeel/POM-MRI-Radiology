import React from 'react';
import { Redirect } from 'react-router-dom';

const ThemeAlertManagementAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/alertManagement/:id',
			component: React.lazy(() => import('./AlertManagement'))
		},
		{
			path: '/apps/alertManagement',
			component: () => <Redirect to="/apps/alertManagement/assignedAlerts" />
		},
		//{
		//	path: '/apps/alertManagement/all',
		//	component: React.lazy(() => import('./AlertManagement'))
		//}
	]
};

export default ThemeAlertManagementAppConfig;

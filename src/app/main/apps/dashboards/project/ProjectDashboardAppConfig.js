import React from 'react';
import { Redirect } from 'react-router-dom';

const ProjectDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/dashboards/project/:usertype',
			component: React.lazy(() => import('./ProjectDashboardApp'))
		},
		{
			path: '/apps/dashboards/project',
			component: React.lazy(() => import('./ProjectDashboardApp'))
		 }
		//  {
			// 	path:'/apps/dashboards/widget15',
			// 	component: React.lazy(() => import('../../Widget15/Widget15'))
			// }
	]
};

export default ProjectDashboardAppConfig;

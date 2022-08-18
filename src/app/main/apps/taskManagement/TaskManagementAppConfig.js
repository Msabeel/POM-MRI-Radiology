import React from 'react';
import { Redirect } from 'react-router-dom';

const ThemeTaskManagementAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{ 
			path:'/apps/taskMangement/:currentRange',
			component: React.lazy( () => import('./TaskManagement'))

		},
		{
			path: '/apps/taskMangement',
			component: () => <Redirect to="/apps/taskMangement/DFTY" />
		},
		{
			   path:'/apps/taskMangement/:currentRange',
			   component:React.lazy( () => import('./TaskManagement') )
		}
		
	]
};

export default ThemeTaskManagementAppConfig;
import React from 'react';
import { authRoles } from 'app/auth';
import { Redirect } from 'react-router-dom';

const FormBuilderAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	routes: [
		{
			path: '/apps/formBuilder/:id',
			component: React.lazy(() => import('./FormBuilderApp'))
		},
		{
			path: '/apps/formBuilder',
			component: () => <Redirect to="/apps/formBuilder/all" />
		},
		{
			path: '/apps/formBuilder/preview/:prevId',
			component: React.lazy(() => import('./FormBuilderApp'))
		},
		{
			path: '/apps/formBuilder/order',
			component: React.lazy(() => import('./FormBuilderApp'))
		},
		// {
		// 	path: '/apps/formBuilder',
		// 	component: React.lazy(() => import('./FormBuilderApp'))
		// }
	]
};

export default FormBuilderAppConfig;

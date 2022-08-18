import React from 'react';
import { Redirect } from 'react-router-dom';
import { authRoles } from 'app/auth';

const ContactsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	permission: 'patient_lookup',
	routes: [
		{
			path: '/apps/patient/:id',
			component: React.lazy(() => import('./ContactsApp'))
		},
		{
			path: '/apps/patient',
			component: () => <Redirect to="/apps/patient/all" />
		},
		{
			path: '/apps/patient/recent',
			component: () => <Redirect to="/apps/patient/recent" />
		}
		,
		{
			path: '/apps/patient/starred',
			component: () => <Redirect to="/apps/patient/starred" />
		}
	]
};

export default ContactsAppConfig;

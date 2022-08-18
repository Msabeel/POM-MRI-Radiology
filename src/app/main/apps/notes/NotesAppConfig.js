import React from 'react';
import { authRoles } from 'app/auth';

const NotesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.patient,
	routes: [
		{
			path: '/apps/notes/:id?/:labelHandle?/:labelId?',
			component: React.lazy(() => import('./NotesApp'))
		}
	]
};

export default NotesAppConfig;

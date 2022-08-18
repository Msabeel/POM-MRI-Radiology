import React from 'react';
import { authRoles } from 'app/auth';

const ModalityAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	// permission: 'modility_lookup',
	routes: [
		{
			path: '/apps/modality',
			component: React.lazy(() => import('./ModalityApp')),
			exact: true
		},
		
	]
};

export default ModalityAppConfig;

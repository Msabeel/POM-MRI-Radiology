import React from 'react';
import { authRoles } from 'app/auth';

const PaperWorkInfoAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	routes: [
		{
			path: '/apps/paperWorkInfo/:patient_id/:exam_id/:name/:formId',
			component: React.lazy(() => import('./PaperWorkInfoApp'))
		}
	]
};

export default PaperWorkInfoAppConfig;

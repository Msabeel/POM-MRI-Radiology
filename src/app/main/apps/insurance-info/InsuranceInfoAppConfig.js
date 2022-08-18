import React from 'react';
import { authRoles } from 'app/auth';

const InsuranceInfoAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	routes: [
		{
			path: '/apps/insuranceInfo/:patient_id/:exam_id/:name',
			component: React.lazy(() => import('./InsuranceInfoApp'))
		}
	]
};

export default InsuranceInfoAppConfig;

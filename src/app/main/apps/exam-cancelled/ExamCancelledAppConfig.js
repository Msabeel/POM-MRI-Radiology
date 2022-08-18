import React from 'react';
import { authRoles } from 'app/auth';

const ExamCancelledAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	routes: [
		{
			path: '/apps/exam-cancelled/:patient_id/:exam_id/:name',
			component: React.lazy(() => import('./ExamCancelledApp'))
		}
	]
};

export default ExamCancelledAppConfig;

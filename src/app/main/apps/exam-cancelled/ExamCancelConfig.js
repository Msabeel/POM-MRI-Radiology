import React from 'react';
import { authRoles } from 'app/auth';

const ExamCancelConfig = {
	settings: {
		layout: {
			config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: true
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                },
                settingPanel: {
                    display: false
                }
            }
		}
	},
	auth: authRoles.staff,
	routes: [
		{
			path: '/apps/exam-cancel/:patient_id/:exam_id/:name/:from',
			component: React.lazy(() => import('./ExamCancelledApp'))
		},
        {
			path: '/apps/exam-cancel/:patient_id/:exam_id/:name',
			component: React.lazy(() => import('./ExamCancelledApp'))
		}
	]
};

export default ExamCancelConfig;

import React from 'react';
import { Redirect } from 'react-router-dom';
import { authRoles } from 'app/auth';

const FaxPagePageConfig = {
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
		// {
		// 	path: '/apps/upload-document/:id',
		// 	component: React.lazy(() => import('./ContactsApp'))
		// },
		// {
        {
            path: '/apps/fax-page/:patient_id/:exam_id/',
            component: React.lazy(() => import('./FaxPageApp'))
        },
		{
			path: '/apps/fax-file-page/:patient_id/:exam_id',
			component: React.lazy(() => import('./FaxPageApp'))
		}
	]
};

export default FaxPagePageConfig;

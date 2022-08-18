import React from 'react';
import { Redirect } from 'react-router-dom';
import { authRoles } from 'app/auth';

const UploadDocPageConfig = {
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
            path: '/apps/uploads-doc-page/:patient_id/:exam_id/:name/:from',
            component: React.lazy(() => import('./UploadDocumentApp'))
        },
		{
			path: '/apps/uploads-doc-page/:patient_id/:exam_id/:name',
			component: React.lazy(() => import('./UploadDocumentApp'))
		}
	]
};

export default UploadDocPageConfig;

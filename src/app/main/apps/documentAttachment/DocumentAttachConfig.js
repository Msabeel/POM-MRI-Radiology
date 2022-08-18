import React from 'react';
import {authRoles} from 'app/auth';

const DocumentAttachConfig = {
	settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: false
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

	// permission: 'modility_lookup',
	routes: [
		{
			path: '/apps/attachedDocs/:exam_id',//738915
			component: React.lazy(() => import('./DocumentsAttach')),
			exact: true
		},

	]
};

export default DocumentAttachConfig;

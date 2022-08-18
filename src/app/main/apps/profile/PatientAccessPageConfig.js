import React from 'react';

const ProfilePageConfig = {
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
	routes: [
		{
			path: '/apps/patientaccess/:accessid/',
			component: React.lazy(() => import('./PatientAccessPage'))
		}
	]
};

export default ProfilePageConfig;

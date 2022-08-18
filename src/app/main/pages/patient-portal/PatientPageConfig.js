import React from 'react';

const PatientPageConfig = {
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
                    display: true
                },
                settingPanel: {
                    display: false
                }
            }
        }
    },
	routes: [
        {
			path: '/pages/patient-page/:patientId',
			component: React.lazy(() => import('./PatientPortalPage'))
		}
	]
};

export default PatientPageConfig;

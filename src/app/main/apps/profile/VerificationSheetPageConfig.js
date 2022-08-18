import React from 'react';

const VerificationSheetPageConfig = {
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
			path: '/apps/verificationSheet/:id/:examId/',
			component: React.lazy(() => import('./VerificationSheetPage'))
		}
	]
};

export default VerificationSheetPageConfig;

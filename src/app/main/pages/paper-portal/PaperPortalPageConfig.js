import React from 'react';

const ComingSoonPageConfig = {
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
			path: '/pages/paper-portal/:key',
			component: React.lazy(() => import('./PaperPortalPage'))
		},
	]
};

export default ComingSoonPageConfig;

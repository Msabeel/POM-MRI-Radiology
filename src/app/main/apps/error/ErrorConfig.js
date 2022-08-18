import React from 'react';

const ErrorConfig = {
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
            path: '/apps/error-message',
            component: React.lazy(() => import('./ErrorMessage'))
        }
    ]
};

export default ErrorConfig;

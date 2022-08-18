import React from 'react';

const ProfileConfig = {
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
    routes: [
        {
            path: '/apps/profile-page/:id/:name/:tab/:exam_id/:from',
            component: React.lazy(() => import('./ProfilePage'))
        },
        {
            path: '/apps/profile-page/:id/:name/:tab/:exam_id',
            component: React.lazy(() => import('./ProfilePage'))
        },
        {
            path: '/apps/profile-page/:id/:name/:tab/',
            component: React.lazy(() => import('./ProfilePage'))
        }
    ]
};

export default ProfileConfig;

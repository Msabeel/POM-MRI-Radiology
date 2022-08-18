import React from 'react';

const ProfilePageConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/profile/:id/:name/:tab/:exam_id',
			component: React.lazy(() => import('./ProfilePage'))
		},
		{
			path: '/apps/profile/:id/:name/:tab',
			component: React.lazy(() => import('./ProfilePage'))
		}
	]
};

export default ProfilePageConfig;

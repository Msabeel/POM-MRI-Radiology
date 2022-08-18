import React from 'react';
import { Redirect } from 'react-router-dom';

const AcademyAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/view-details/courses/:courseId/:courseHandle?',
			component: React.lazy(() => import('./course/Course'))
		},
		{
			path: '/apps/view-details/courses',
			component: React.lazy(() => import('./courses/Courses'))
		},
		{
			path: '/apps/view-details',
			component: () => <Redirect to="/apps/view-details/courses" />
		}
	]
};

export default AcademyAppConfig;

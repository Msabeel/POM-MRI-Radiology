import React from 'react';
import { Redirect } from 'react-router-dom';

const DailyWorkFlowAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/dailyWorkFlow',
			component: React.lazy(() => import('./DailyWorkFlowDashboard'))
		}
	]
};

export default DailyWorkFlowAppConfig;

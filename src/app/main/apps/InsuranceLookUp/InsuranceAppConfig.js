import React from 'react';


const ThemeInsuranceAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/insurance-lookup',
			component: React.lazy(() => import('./InsuranceLookUpApp'))
		},
		{
			path: '/apps/insurance/:id',
			component: React.lazy(() => import('./InsuranceEdit'))
		}
		

	]
};

export default ThemeInsuranceAppConfig;



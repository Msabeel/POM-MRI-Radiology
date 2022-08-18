import React from 'react';


const ThemeAuditConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		

		{
			path: '/apps/audit',
			component: React.lazy(() => import('./AuditApp'))
		}
		
		

	]
};

export default ThemeAuditConfig;



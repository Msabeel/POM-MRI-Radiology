import React from 'react';

const ThemeSettingAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/setting',

			component: React.lazy(() => import('./SettingApp'))
		}
	]
};

export default ThemeSettingAppConfig;

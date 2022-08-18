import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import ForgotPassword2PageConfig from 'app/main/forgot-password/ForgotPassword2PageConfig';
import pagesConfigs from 'app/main/pages/pagesConfigs';
import React from 'react';
import { Redirect } from 'react-router-dom';

const routeConfigs = [
	...appsConfigs,
	...pagesConfigs,
	LogoutConfig,
	LoginConfig,
	RegisterConfig,
	LogoutConfig,
	ForgotPassword2PageConfig,
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to="/apps/dashboards/project" />
	},
	{
		component: () => <Redirect to="/pages/errors/error-404" />
	}
];

export default routes;

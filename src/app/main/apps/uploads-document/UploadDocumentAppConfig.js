import React from 'react';
import { Redirect } from 'react-router-dom';
import { authRoles } from 'app/auth';

const UploadDocumentAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff,
	routes: [
		// {
		// 	path: '/apps/upload-document/:id',
		// 	component: React.lazy(() => import('./ContactsApp'))
		// },
		// {
	
		{
			path: '/apps/uploads-document/:patient_id/:exam_id/:name',
			component: React.lazy(() => import('./UploadDocumentApp'))
		}
	]
};

export default UploadDocumentAppConfig;

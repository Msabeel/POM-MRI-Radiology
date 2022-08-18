import {authRoles} from 'app/auth';
import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'applications',
		title: 'Applications',
		translate: 'APPLICATIONS',
		type: 'group',
		icon: 'apps',

		children: [
			{
				id: 'dashboards',
				title: 'Dashboards',
				translate: 'DASHBOARDS',
				type: 'collapse',
				icon: 'dashboard',
				isredirect: false,
				isVisible: true,
				children: [
					{
						id: 'project-dashboard',
						title: 'New Dashboard',
						// permission: 'view_dashboard',
						type: 'item',
						url: '/apps/dashboards/project',
						isredirect: false,
						isVisible: true,
					},
					{
						id: 'old-dashboard',
						title: 'Old Dashboard',
						// permission: 'view_dashboard',
						type: 'item',
						// url: '/apps/dashboards/project',
						url: '/home',
						isredirect: true,
						isVisible: true,
					}

				]
			},
			{
				id: 'attorney',
				title: 'Attorney Lookup',
				translate: 'Attorney Lookup',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'attorney_lookup',
				icon: 'account_box',
				url: '/apps/attorney',
				// url: '/home/attorneylookup',
				isredirect: false,
				isVisible: true,
			},
			{
				id: 'Audit Details',
				title: 'Audit Details',
				type: 'item',
				url: '/apps/audit',
				isRedirect: false,
				isVisible: true,
			},

			{
				id: 'cancel-exam-mgt',
				title: 'Cancel Exam Management',
				translate: 'Cancel Exam Management',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'patient_lookup',
				icon: 'account_box',
				url: '/apps/cancelExamManagement',
				isredirect: false,
				isVisible: true,
			},
			{
				id: 'chat',
				title: 'Chat Management',
				translate: 'chat',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'patient_lookup',
				icon: 'account_box',
				url: '/home/adminchat',
				isredirect: true,
				isVisible: true,
			},
			{
				id: 'dailyworkflow',
				title: 'Daily Workflow',
				translate: 'Daily Workflow',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'patient_lookup',
				icon: 'account_box',
				url: '/apps/dailyWorkFlow',
				isredirect: false,
				isVisible: true,
			},
			{
				id: 'fax',
				title: 'Fax Status',
				translate: 'Fax Status',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'patient_lookup',
				icon: 'account_box',
				url: '/home/fax',
				isredirect: true,
				isVisible: true,
			},
			{
				id: 'formBuilder',
				title: 'Form Builder',
				translate: 'Form Builder',
				type: 'item',
				icon: 'account_box',
				url: '/apps/formBuilder',
				isredirect: false,
				isVisible: true,
			},
			
					{
						id: 'Insurance',
						title: 'Insurance Company Lookup',
						type: 'item',
						url: '/apps/insurance-lookup',
						isRedirect: false,
						isVisible: true,
					},
			{
				id: 'pacs',
				title: 'Pacs',
				translate: 'Pacs',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'patient_lookup',
				icon: 'account_box',
				url: '/apps/patient/all',
				isredirect: true,
				isVisible: true,
			},
			{
				id: 'patientCheck',
				title: 'Patient Check in',
				translate: 'Patient Check in',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'patient_lookup',
				icon: 'account_box',
				url: '/home/patientcheckin',
				isredirect: true,
				isVisible: true,
			},
			{
				id: 'patient',
				title: 'Patient Lookup',
				translate: 'Patient Lookup',
				type: 'item',
				auth: authRoles.staff,
				permission: 'patient_lookup',
				icon: 'account_box',
				url: '/apps/patient/all',
				isredirect: false,
				isVisible: true,
			},
			{
				id: 'quickschedule',
				title: 'Quick Schedule',
				translate: 'Quick Schedule',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'patient_lookup',
				icon: 'account_box',
				// url: '/home/quickschedule',
				url: '/apps/quicksch',
				isredirect: false,
				isVisible: true,
			},


			{
				id: 'referrer',
				title: 'Referrer Lookup',
				translate: 'Referrer Lookup',
				type: 'item',
				auth: authRoles.staff,
				// permission: 'referrer_lookup',
				icon: 'account_box',
				url: '/apps/referrer',
				isredirect: false,
				isVisible: true,
			},
			{
				id: 'reportmgt',
				title: 'Report Management',
				translate: 'Report Management',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'referrer_lookup',
				icon: 'account_box',
				url: '/home/report',
				isredirect: true,
				isVisible: true,
			},

			{
				id: 'scheduleExam',
				title: 'Schedule an Exam',
				translate: 'Schedule an Exam',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'referrer_lookup',
				icon: 'account_box',
				url: '/home/scheduleexam',
				isredirect: true,
				isVisible: true,
			},
			{
				id: 'stafChat',
				title: 'Staff Chat',
				translate: 'Staff Chat',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'referrer_lookup',
				icon: 'account_box',
				url: '/home/chat/staffchat',
				isredirect: true,
				isVisible: true,
			},

			{
				id: 'watingRoom',
				title: 'Waiting Room',
				translate: 'Waiting Room',
				type: 'item',
				// auth: authRoles.staff,
				// permission: 'referrer_lookup',
				icon: 'account_box',
				url: '/home/waitingroom/index',
				isredirect: true,
				isVisible: true,
			},

			{
				id: 'notes',
				title: 'Notes',
				translate: 'NOTES',
				auth: authRoles.patient,
				type: 'item',
				icon: 'note',
				url: '/apps/notes',
				isredirect: false,
				isVisible: false

			},
			{
				id: 'mail',
				title: 'Mail',
				translate: 'MAIL',
				type: 'item',
				icon: 'email',
				url: '/apps/mail',
				isredirect: false,
				isVisible: false,
				badge: {
					title: 0,
					bg: '#F44336',
					fg: '#FFFFFF'

				},


			},
			{
				id: 'todo',
				title: 'To-Do',
				translate: 'TODO',
				type: 'item',
				icon: 'check_box',
				url: '/apps/todo',
				isredirect: false,
				isVisible: false,
				badge: {
					title: 0,
					bg: 'rgb(255, 111, 0)',
					fg: '#FFFFFF'
				}
			},
			{
				id: 'file-manager',
				title: 'File Manager',
				translate: 'FILE_MANAGER',
				type: 'item',
				icon: 'folder',
				url: '/apps/file-manager',
				isredirect: false,
				isVisible: false,

			},
			{
				id: 'chat1',
				title: 'Chat',
				translate: 'CHAT',
				type: 'item',
				icon: 'chat',
				url: '/apps/chat',
				isredirect: false,
				isVisible: false,
				badge: {
					title: 0,
					bg: 'rgb(9, 210, 97)',
					fg: '#FFFFFF'
				}
			},
			{
				id: 'scrumboard',
				title: 'Scrumboard',
				translate: 'SCRUMBOARD',
				type: 'item',
				icon: 'assessment',
				url: '/apps/scrumboard',
				isredirect: false,
				isVisible: false,
			},
			{
				id: 'ViewDetails',
				title: 'View Details',
				translate: 'View Details',
				type: 'item',
				icon: 'school',
				url: '/apps/view-details',
				isredirect: false,
				isVisible: false,
			},		
			{
                id: 'setting',
                title: 'Setting',
                translate: 'Setting',
                type: 'collapse',
                icon: 'settings',
                isRedirect: false,
                isVisible: true,
				// url: '/apps/setting',
				
                children: [
									{
                        id:'alert',
                        title:'Alert Management',
                        translate:'Alert Management',
                        type: 'item',
                        icon: 'account_box',
                        url: '/apps/alertManagement',
                        isRedirect: false,
                        isVisible: true,
                    },
					{
						id: 'audit',
						title: 'Audit',
						type: 'item',
						url: '/apps/dashboards/audit',
						isRedirect: false,
						isVisible: false,
					},
					{
						id: 'cancel-exam-mgt',
						title: 'Cancel Exam Management',
						translate: 'Cancel Exam Management',
						type: 'item',
						// auth: authRoles.staff,
						// permission: 'patient_lookup',
						icon: 'account_box',
						url: '/apps/cancelExamManagement',
						isredirect: false,
						isVisible: true,
					},
					{
						id: 'formBuilder',
						title: 'Form Builder',
						translate: 'Form Builder',
						type: 'item',
						icon: 'account_box',
						url: '/apps/formBuilder',
						isredirect: false,
						isVisible: true,
					},	
                    {
                        id: 'roles',
                        title: 'Role Management',
                        translate: 'Role Management',
                        type: 'item',
                        auth: authRoles.staff,
                        // permission: 'roles',
                        icon: 'account_box',
                        url: '/apps/setting',
                        isRedirect: false,
                        isVisible: false,
                    },
                    {
                        id:'task',
                        title:'Task Management',
                        translate:'Task Management',
                        type: 'item',
                        icon: 'account_box',
                        url: '/apps/taskMangement',
                        isRedirect: false,
                        isVisible: true,
                    },
					
					{
						id: 'archive-referrer-report',
						title: 'Archive Referrer Report',
						type: 'item',
						url: '/apps/dashboards/archivereferrerreport'

					},
					{
						id: 'Audit Details',
						title: 'Audit Details',
						type: 'item',
						url: '/apps/audit',
						isRedirect: false,
						isVisible: false,
					},

					{
						id: 'exam',
						title: 'Exam Management',
						type: 'item',
						url: '/apps/exam'
					},
					{
						id: 'fax-status',
						title: 'Fax Status',
						type: 'item',
						url: '/apps/fax'
					},
					{
						id: 'file-management',
						title: 'File Management',
						type: 'item',
						url: '/apps/dashboards/filemanagment'
					},
					{
						id: 'integration',
						title: 'Integration',
						type: 'item',
						url: '/apps/dashboards/inntegration'
					},
					{
						id: 'modality',
						title: 'Modality Management',
						type: 'item',
						url: '/apps/modality'
					},
					{
						id: 'price-management',
						title: 'Price Management',
						type: 'item',
						url: '/apps/dashboards/pricemanagement'
					},
					{
						id: 'reassign-dictation',
						title: 'Reassign Dictation',
						type: 'item',
						url: '/apps/dashboards/reassigndictation'
					},
					{
						title: 'Region Management',
						type: 'item',
						url: '/apps/dashboards/regionmanagement'
					},
					{
						title: 'Site Management',
						type: 'item',
						url: '/apps/dashboards/sitemanagement'
					},
					{
						id: 'site-settings',
						title: 'Site Settings',
						type: 'item',
						url: '/apps/dashboards/sitesettings'
					},
					{
						id: 'standard-report',
						title: 'Standard Report',
						type: 'item',
						url: '/apps/dashboards/standardreport'
					},
					{
						id: 'template-management',
						title: 'Template Management',
						type: 'item',
						url: '/apps/dashboards/templatemanagement'
					},
					{
						id: 'time-management',
						title: 'Time Management',
						type: 'item',
						url: '/apps/dashboards/timemanagement'
					},
					{
						id: 'user-management',
						title: 'User Management',
						type: 'item',
						url: '/apps/dashboards/usermanagement'
					},
				]
			},

		]
	}
];

export default navigationConfig;

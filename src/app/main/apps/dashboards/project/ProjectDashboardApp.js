import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import _ from '@lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core/styles';
import reducer from './store';
import { selectProjects, getProjects } from './store/projectsSlice';
import { Permissions } from 'app/config';
import { getWidgets, selectWidgets, getNoShowGraph } from './store/widgetsSlice';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import Widget4 from './widgets/Widget4';
import Widget5 from './widgets/Widget5';
import Widget6 from './widgets/Widget6';
import Widget7 from './widgets/Widget7';
import Widget12 from './widgets/Widget12';
import Widget13 from './widgets/Widget13';
import Widget14 from './widgets/Widget14';
import Widget15 from './widgets/Widget15';
import Widget16 from './widgets/Widget16';
import Widget17 from './widgets/Widget17';
import Widget18 from './widgets/Widget18';
import WidgetNow from './widgets/WidgetNow';
import WidgetWeather from './widgets/WidgetWeather';
import { getPermissions } from 'app/fuse-layouts/shared-components/quickPanel/store/dataSlice';
import NumOfExamsSchComByModality from './HighChartDashboardComponents/NumOfExamsSchComByModality'
import NumOfPatientComingToEachLocation from './HighChartDashboardComponents/NumOfPatientComingToEachLocation'
import PatientAnalytics from './HighChartDashboardComponents/PatientAnalytics/PatientAnalytics'


const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	},
	selectedProject: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '8px 0 0 0'
	},
	projectMenuButton: {
		background: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: '0 8px 0 0',
		marginLeft: 1
	}
}));

function ProjectDashboardApp(props) {
	const dispatch = useDispatch();
	const isOpen= true;
	const widgets = useSelector(selectWidgets);
	const projects = useSelector(selectProjects);
	const user = useSelector(({ auth }) => auth.user);
	const noShowData = useSelector(({projectDashboardApp}) => projectDashboardApp.widgets.noShow);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [loading, setLoading] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const theme = useTheme();
	const [selectedProject, setSelectedProject] = useState({
		id: 1,
		menuEl: null
	});
	let { usertype } = useParams();
	if(!usertype) {
		usertype = window.localStorage.getItem('usertype');
	}
	useEffect(() => {
		if(usertype) {
			dispatch(getPermissions({ id: usertype }));
		}
	}, [usertype]);

	if(usertype) {
		localStorage.setItem('usertype', usertype);
	}
	
	useEffect(() => {
		// dispatch(getWidgets());
		dispatch(getProjects());
		dispatch(getNoShowGraph({ days: 1}));
	}, [dispatch]);

	useEffect(() => {
		async function getData() {
			setLoading(true);
			await dispatch(getWidgets());
			setLoading(false);
		}
		getData();
	}, [dispatch]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	function handleChangeProject(id) {
		setSelectedProject({
			id,
			menuEl: null
		});
	}

	function handleOpenProjectMenu(event) {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: event.currentTarget
		});
	}

	function handleCloseProjectMenu() {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: null
		});
	}
	// return null;
	if (_.isEmpty(widgets) || _.isEmpty(projects)) {
		return (<FuseLoading delay={loading}/>);
	}

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-160 h-160',
				toolbar: 'min-h-48 h-48',
				rightSidebar: 'w-288',
				content: classes.content
			}}
			header={
				<div className="flex flex-col justify-between flex-1 px-24 pt-24">
					<div className="flex justify-between items-start">
						<Typography className="py-0 sm:py-24" variant="h4">
							Welcome back {user.data.displayName}!
						</Typography>
						<Hidden lgUp>
							<IconButton
								onClick={ev => pageLayout.current.toggleRightSidebar()}
								aria-label="open left sidebar"
								color="inherit"
							>
								<Icon>menu</Icon>
							</IconButton>
						</Hidden>
					</div>
				</div>
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="secondary"
					textColor="secondary"
					variant="scrollable"
					scrollButtons="off"
					className="w-full px-24"
				>
					<Tab className="text-14 font-600 normal-case" label="Home" />
				</Tabs>
			}
			content={
				<div className="p-12">
					{tabValue === 0 && (
						<FuseAnimateGroup
							className="flex flex-wrap"
							enter={{
								animation: 'transition.slideUpBigIn'
							}}
						>
							{FuseUtils.hasButtonPermission(Permissions.pre_schedule_status) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget1 widget={widgets.widget1} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.no_show_exams) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget2 widget={widgets.widget2} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.pending_interpretation) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget3 widget={widgets.widget3} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.tech_hold) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget4 widget={widgets.widget4} />
							</div>}
							{/* {FuseUtils.hasButtonPermission(Permissions.pre_schedule_status) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget15 widget={widgets.widget15} open={isOpen} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.no_show_exams) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget16 widget={widgets.widget16} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.pending_interpretation) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget17 widget={widgets.widget17} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.tech_hold) && 
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget18 widget={widgets.widget4} />
							</div>} */}
							{FuseUtils.hasButtonPermission(Permissions.incoming_orders) && 
							<div className="widget flex w-full sm:w-1/2 p-12">
								<Widget6 widget={widgets.widget6} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.schedule) && 
							<div className="widget flex w-full sm:w-1/2 p-12">
								<Widget7 widget={widgets.widget7} />
							</div>}
							{FuseUtils.hasButtonPermission(Permissions.enterprise_analytics) && 
							<div className="widget flex w-full p-12">
								<Widget5 widget={widgets.widget5} />
							</div>}
							<div className="widget flex w-full p-12">
								<Widget14 widget={noShowData}/>
							</div>
							<div className="widget flex w-full p-6">
							<PatientAnalytics/>
								</div>
								<div className="widget flex w-full p-6">
							<NumOfPatientComingToEachLocation/>
								</div>
						</FuseAnimateGroup>
					)}
					
					
				</div>
			}
			rightSidebarContent={
				<FuseAnimateGroup
					className="w-full"
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					{/*
					<div className="widget w-full p-12">
						<WidgetNow />
					</div>
					
					<div className="widget w-full p-12">
						<WidgetWeather widget={widgets.weatherWidget} />
					</div>
					*/}

					{/*FuseUtils.hasButtonPermission(Permissions.completed_exams) && 
                    <div className="widget w-full p-12">
                        <Widget12 widget={widgets.widget12} />
                    </div>*/}
					<div className="widget w-full p-12">
						<NumOfExamsSchComByModality/>
                    </div>
					{FuseUtils.hasButtonPermission(Permissions.finalized_reports) && 
                    <div className="widget w-full p-12">
                        <Widget13 widget={widgets.widget13} />
                    </div>
					}
				</FuseAnimateGroup>
			}
			ref={pageLayout}
		/>
	);
}

export default withReducer('projectDashboardApp', reducer)(ProjectDashboardApp);

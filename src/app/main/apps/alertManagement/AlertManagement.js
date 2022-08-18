import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React, { useRef, useEffect, useState } from 'react';
import withReducer from 'app/store/withReducer';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import { Block } from '@material-ui/icons';
import reducer from './store';
import AlertManagementTable from './AlertManagementTable';
import AlertManagementHeader from './AlertManagementHeader';
import AlertSidebarContent from './AlertManagementSlidebar';
// import OpenAlertManagementHeader from './openAlerts/OpenAlertHeader';
// import OpenAlertsTable from './openAlerts/openAlertsTables.js';
import AssignedAlertManagementHeader from './assignedAlerts/AssignedAlertHeader';
import AssignedAlertsTable from './assignedAlerts/AssignedAlertsTables';
import Widget15 from '../dashboards/project/widgets/Widget15';
import { getWidgets } from './store/AlertManagementSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	},
	d_inline: {
		display: 'inline-block'
	},
	widgetClass: {
		display: 'block',
		margin: '0 auto',
		height: '100% !important',
		minHeight: '100% !important'
	}
});

function AlertManagementApp(props) {
	const dispatch = useDispatch();
	const [widgets1, SetWidgets] = useState([]);
	const [isLoading, setLoading] = useState(false);
	
	const { id } = useParams();

	useEffect(() => {
		fetchAllWidets();
	}, [dispatch]);

	const fetchAllWidets = async () => {
		setLoading(true);
		const data = await dispatch(getWidgets());
		SetWidgets(data.payload.data1[11]);
		setLoading(data.payload.isLoading);
	};

	function headerView() {
		if (id === 'all') {
			return <AlertManagementHeader pageLayout={pageLayout} />;
		} else if(id == 'assignedAlerts'){
			return <AssignedAlertManagementHeader pageLayout={pageLayout} />;
		} else {
			return <AssignedAlertManagementHeader pageLayout={pageLayout} />;
		}
	}

	function renderView() {
		if (id === 'all') {
			return <AlertManagementTable />;
		} else if(id == 'assignedAlerts'){
			return <AssignedAlertsTable />;
		} else {
			return <AssignedAlertsTable />;
		}
	}

	function Widget() {
		if (isLoading) {
			return (
				<div
					style={{
						marginTop: 300
					}}
				>
					<CircularStatic />
				</div>
			);
		}

		if (id !== 'all') {
			return (
				<div className={classes.widgetClass}>
					{' '}
					<Widget15 widget={widgets1} />
				</div>
			);
		}
	}

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-64 h-64 sm:h-64 sm:min-h-64',
					wrapper: 'min-h-0'
				}}
				contentToolbar={Widget()}
				header={headerView()}
				content={renderView()}
				leftSidebarContent={<AlertSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('AlertManagementApp', reducer)(AlertManagementApp);

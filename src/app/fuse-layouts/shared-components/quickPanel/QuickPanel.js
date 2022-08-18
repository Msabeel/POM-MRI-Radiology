import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import withReducer from 'app/store/withReducer';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import reducer from './store';
import { getData } from './store/dataSlice';
import { toggleQuickPanel } from './store/stateSlice';
import {
	openPatientAccessDialog,
	openPatientAccessPrintPage,
	getRequestAlertsData,
	clearPatientAccessResponse,
	sendPatientAccessMail
} from './store/dataSlice';
import PatientAccessDialog from 'app/fuse-layouts/shared-components/PatientAccessDialog';
import PatientAccessPrintDialog from 'app/fuse-layouts/shared-components/PatientAccessPrintDialog';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';

const useStyles = makeStyles(theme => ({
	root: {
		width: 280
	},
	listItemRow: {
		flexDirection: 'column',
		alignItems: 'flex-start',
	}
}));

function QuickPanel(props) {
	const dispatch = useDispatch();
	const data = useSelector(({ quickPanel }) => quickPanel.data);
	const state = useSelector(({ quickPanel }) => quickPanel.state);
	// const projects = useSelector(selectProjects);
	const classes = useStyles();
	const [checked, setChecked] = useState('notifications');
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);

	const handleToggle = value => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	
	useEffect(() => {
		dispatch(getData());
		/*
		this api is used to get alerts of patients who are requesting additional access time on their patient portal
		*/
		//dispatch(getRequestAlertsData());
	}, [dispatch]);


	useEffect(() => {
		if(data && data.patientAccessResponse) {
			const { patientAccessResponse } = data;
			if(patientAccessResponse.maildata && patientAccessResponse.maildata.length > 0) {
				setOpenPatientAccessMailSent(true);
			}
			if(patientAccessResponse.PrintPage && patientAccessResponse.PrintPage.length > 0) {
				dispatch(openPatientAccessPrintPage(patientAccessResponse.PrintPage));
			}
			// if(patientAccessResponse.maildata || patientAccessResponse.PrintPage){
			// 	dispatch(getRequestAlertsData());
			// 	dispatch(clearPatientAccessResponse());
			// }
		}
	}, [data]);

	const handleClosePatientAccessMailSent = (event, reason) => {
		setOpenPatientAccessMailSent(false);
	};

	async function handlePatientAccess(event, alert) {
		// dispatch(openPatientAccessDialog({id: alert.patient_id}));
		await dispatch(sendPatientAccessMail({ id: alert.patient_id, isRequestedAgain: true }));
	}

	return (
		<Drawer
			classes={{ paper: classes.root }}
			open={state}
			anchor="right"
			onClose={ev => dispatch(toggleQuickPanel())}
		>
			<FuseScrollbars>
				<ListSubheader component="div">Today</ListSubheader>

				<div className="mb-0 py-16 px-24">
					<Typography className="mb-12 text-32" color="textSecondary">
						{moment().format('dddd')}
					</Typography>
					<div className="flex">
						<Typography className="leading-none text-32" color="textSecondary">
							{moment().format('DD')}
						</Typography>
						<Typography className="leading-none text-16" color="textSecondary">
							th
						</Typography>
						<Typography className="leading-none text-32" color="textSecondary">
							{moment().format('MMMM')}
						</Typography>
					</div>
				</div>
				<Divider />
				{/* <List>
					<ListSubheader component="div">Events</ListSubheader>
					{data && data.events && 
						data.events.map(event => (
							<ListItem key={event.id}>
								<ListItemText primary={event.title} secondary={event.detail} />
							</ListItem>
						))}
				</List>
				<Divider />
				<List>
					<ListSubheader component="div">Notes</ListSubheader>
					{data && data.notes && 
						data.notes.map(note => (
							<ListItem key={note.id}>
								<ListItemText primary={note.title} secondary={note.detail} />
							</ListItem>
						))}
				</List>
				<Divider /> */}
				<List>
					<ListSubheader component="div">Alerts</ListSubheader>
					{data && data.requestAlerts && 
						data.requestAlerts.map(alert => (
							<ListItem key={alert.id} className={classes.listItemRow}>
								<ListItemText primary="Patient Requesting Access" secondary={`${alert.tran_patient_detail.fname} ${alert.tran_patient_detail.lname} - ${alert.tran_patient_detail.patient_id}`} />
								<Button
									style={{ float: 'right'}}
									variant="contained"
									color="primary"
									type="button"
									onClick={(event) => handlePatientAccess(event, alert)}
								>
									Give Access
								</Button>
							</ListItem>
						))}
				</List>
				<Divider />
				{/* <List>
					<ListSubheader component="div">Quick Settings</ListSubheader>
					<ListItem>
						<ListItemIcon className="min-w-40">
							<Icon>notifications</Icon>
						</ListItemIcon>
						<ListItemText primary="Notifications" />
						<ListItemSecondaryAction>
							<Switch
								color="primary"
								onChange={handleToggle('notifications')}
								checked={checked.indexOf('notifications') !== -1}
							/>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemIcon className="min-w-40">
							<Icon>cloud</Icon>
						</ListItemIcon>
						<ListItemText primary="Cloud Sync" />
						<ListItemSecondaryAction>
							<Switch
								color="secondary"
								onChange={handleToggle('cloudSync')}
								checked={checked.indexOf('cloudSync') !== -1}
							/>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemIcon className="min-w-40">
							<Icon>brightness_high</Icon>
						</ListItemIcon>
						<ListItemText primary="Retro Thrusters" />
						<ListItemSecondaryAction>
							<Switch
								color="primary"
								onChange={handleToggle('retroThrusters')}
								checked={checked.indexOf('retroThrusters') !== -1}
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</List> */}
			</FuseScrollbars>
			<PatientAccessDialog />
			<PatientAccessPrintDialog />
			<SnackBarAlert snackOpen={openPatientAccessMailSent} onClose={handleClosePatientAccessMailSent} text="Patient portal access mail sent successfully." />
		</Drawer>
	);
}

export default withReducer('quickPanel', reducer)(React.memo(QuickPanel));

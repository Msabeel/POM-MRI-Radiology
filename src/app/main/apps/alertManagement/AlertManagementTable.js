import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Permissions } from 'app/config';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
// import {withStyles} from '@material-ui/core/styles';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import Switch from 'react-switch';
import CreateFormDialog from './CreateAlertForm';
import EditFormDialog from './EditAlertForm';
import {
	getAlertManagementData,
	deleteAlertManagementData,
	disableAlertManagementData,
	setResponseStatus
} from './store/AlertManagementSlice';

//  import Switch from '@material-ui/core/Switch';
import Widget15 from '../dashboards/project/widgets/Widget15';
// import {StyleSheet, Switch, View, Text} from 'react-native'

//  import FuseUtils from '@fuse/utils';
// const useStyle = makeStyles({
// 	button: {
// 		margin: '15px 10px',
// 		width: 120
// 	},
// });

const useStyle = makeStyles(theme => ({
	// button: {
	// 	 		margin: '15px 10px !important',
	// 	 		width: 120
	// 		 },
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: 'calc(100% - 16px)!importat',
		borderRadius: '0 20px 20px 0!important',
		paddingLeft: 24,
		paddingRight: 12,
		'&.active': {
			backgroundColor: theme.palette.secondary.main,
			color: `${theme.palette.secondary.contrastText}!important`,
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			marginRight: 16
		}
	},
	button: {
		color: '#fff !important',
		margin: '10px 0px !important',
		padding: '6px 16px !important',
		borderRadius: '3px !important',
		backgroundColor: '#192d3e !important'
	}
}));

const AlertManagementTable = props => {
	const dispatch = useDispatch();
	// const widgets = useSelector(selectWidgets);

	useEffect(() => {
		fetchAllAlerts();
	}, [dispatch]);

	const storeData = useSelector(({ AlertManagementApp }) => AlertManagementApp.AlertManagement);
	const rowdata = useSelector(({ AlertManagementApp }) => AlertManagementApp.AlertManagement.data);

	const classes = useStyle();

	const customNotify = useCustomNotify();
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	// const [rowdata, rowData] = useState([]);
	const [isLoading, setLoading] = useState(false);

	const [id, setId] = useState('');
	const [alert, setAlert] = useState(null);
	const [open3, SetOpen3] = useState(null);
	const [disableId, setDisableId] = useState(null);
	const [state, setState] = useState([]);
	const [value, setValue] = useState('');

	useEffect(() => {
		if (storeData.isCreatedSuccess === true) {
			fetchAllAlerts();
		}
	}, [storeData.isCreatedSuccess]);

	useEffect(() => {
		if (storeData.isUpdateSuccess === true) {
			fetchAllAlerts();
		}
	}, [storeData.isUpdateSuccess]);

	/* ---------------------------------
	 	fetch all alerts
	----------------------------------- */
	const fetchAllAlerts = async () => {
		setLoading(true);
		const data = await dispatch(getAlertManagementData());
		
		setState(data.payload.data);
		// rowData(data.payload.data)
		setLoading(data.payload.isLoading);
		setOpen(false);
		setOpen2(false);
	};

	/* ---------------------------------
	 	edit alert
	----------------------------------- */
	const editClick = e => {
		setOpen2(true);
		setAlert(e.data);
		setId(e.data);
	};

	/* ---------------------------------
	 	delete alert
	----------------------------------- */
	const deleteAlert = async e => {
		const data = {
			key: 'delete',
			id: e.data.id
		};
		const result = await dispatch(deleteAlertManagementData(data));
		if (result.payload.isDeletedSuccess === true) {
			customNotify('Alert deleted successfully!', 'success');
			fetchAllAlerts();
		} else if (result.payload.message === 'Would you like to disable instead?') {
			SetOpen3(true);
			setDisableId(result.payload.deleteId);
		} else {
			customNotify('Something Went Wrong!', 'error');
		}
	};

	const handleClose = () => {
		SetOpen3(false);
	};

	const editIcon = event => {
		return '<i class="material-icons cursor-pointer" title="Edit Alert">edit</i>';
	};
	const deleteIcon = event => {
		return `<i class="material-icons cursor-pointer" title="Delete Alert">delete</i>`;
	};

	const disableIcon = event => {
		
		return (
			<Switch
				className="react-switch"
				checked={event.data.disabled}
				name={`checked${event.data.id}`}
				aria-labelledby="neat-label"
				onChange={e => handleChange(e, event.data.id)}
				onColor="#e62626"
				offColor="#37bf2a"
				onHandleColor="#f8fff5"
				handleDiameter={30}
				boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
				activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
			/>
		);
	};

    /*
	const disableChange = event => {
		disableAlert({ data: { disable: !event.data.disabled, id: event.data.id } });
	};
	*/

	/* ---------------------------------
	 	disable alert
	----------------------------------- */
	const handleChange = async (e, id) => {
		// e - true for disabled; false for enabled
		const data = {
		  key: 'disable',
		  id: id,
		  disabled: e ? 1 : 0
		};
		
		
		const result = await dispatch(disableAlertManagementData(data))
		
		if (result.payload.isDisabledSuccess === true) {
		  customNotify('alert disabled successfully!', 'success');
		  fetchAllAlerts()
		} else if (result.payload.isDisabledSuccess === false) {
		  customNotify('alert enabled successfully!', 'success');
		  fetchAllAlerts()
		} else {
		  customNotify('something went wrong!', 'error');
		}
		
	};

	const handleDisable = () => {
		disableAlert({ data: { id: disableId, disable: true } });
		SetOpen3(false);
	};

	/* ---------------------------------
	 	disable alert
	----------------------------------- */
	const disableAlert = async obj => {
		const data = {
			key: 'disable',
			id: obj.data.id,
			disabled: obj.data.disable ? 1 : 0
		};
		
		
		let markers = [...state];

		const index = markers.findIndex(item => item.id == obj.data.id);
		markers[index] = { ...markers[index], disabled: obj.data.disable ? 1 : 0 };
		setState(markers);
		markers = [...state];
				
		
		const result = await dispatch(disableAlertManagementData(data));
		
		if (result.payload.isDisabledSuccess === true) {
			customNotify('Alert Disabled successfully!', 'success');
			fetchAllAlerts()
		} else if (result.payload.isDisabledSuccess === false) {
			customNotify('Alert Enabled successfully!', 'success');
			fetchAllAlerts()
		} else {
			customNotify('Something Went Wrong!', 'error');
		}
	};

	const onGridReady = params => {
		params.api.sizeColumnsToFit();
	};

	const admin = true;
	const i = 0;

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

	// Render the UI for your table - Alerts table
	return (
		<div>
			{/* <StyleButton> */}
			<Button
				className={classes.button}
				onClick={() => {
					dispatch(setResponseStatus());
					setOpen(true);
				}}
				color="primary"
			>
				Add new
			</Button>
			{/* </StyleButton> */}
			<div className="flex flex-col min-h-full  overflow-hidden">
				<div
					className="ag-theme-alpine ag-grid-custom"
					style={{ height: '100%', width: '100%', lineHeight: '30px' }}
				>
					<AgGridReact
						onGridReady={onGridReady}
						rowData={rowdata}
						enableBrowserTooltips
						tooltipShowDelay={0}
						pagination
						suppressMoveWhenRowDragging={false}
						paginationPageSize="15"
						// frameworkComponents={{
						// 	disableIcon:disableIcon //please check now ok
						// }}
						className="alerttable"
						rowHeight={38}
					>
						<AgGridColumn width={85} sortable lockPosition tooltipField="ID" field="id" headerName="ID" />
						<AgGridColumn
							width={550}
							lockPosition
							sortable
							tooltipField="alert"
							field="alert"
							headerName="Alert"
						/>
						<AgGridColumn
							width={85}
							lockPosition
							sortable
							tooltipField="patient_alert"
							field="patient_alert"
							headerName="PA"
						/>
						{/*
						<AgGridColumn
							width={550}
							lockPosition
							sortable
							tooltipField="description"
							field="description"
							headerName="Description"
						/>
						*/}
						<AgGridColumn
							width={90}
							lockPosition
							tooltipField="edit"
							field="id"
							cellRenderer={editIcon}
							onCellClicked={editClick}
							headerName="Edit"
						/>
						<AgGridColumn
							width={120}
							lockPosition
							tooltipField="disabled"
							field="disabled"
							tooltipField="status"
							cellRendererFramework={disableIcon}
							headerName="Status"
						/>
						<AgGridColumn
							width={100}
							lockPosition
							tooltipField="delete"
							cellRenderer={deleteIcon}
							onCellClicked={deleteAlert}
							headerName="Del"
						/>
					</AgGridReact>
					<CreateFormDialog
						isOpen={open}
						handleCloseDialog={() => {
							setOpen(false);
						}}
					/>
					<EditFormDialog
						isOpen={open2}
						handleCloseDialog={() => {
							setOpen2(false);
						}}
						editId={id}
						reasonData={alert}
					/>
				</div>
				<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open3}>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							You can not delete a alert that has been assigned to an exam. Would you like to disable
							instead?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => handleClose()} color="primary">
							No
						</Button>
						<Button onClick={() => handleDisable()} color="primary" autoFocus>
							Yes
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</div>
	);
};

AlertManagementTable.propTypes = {
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func,
	onStarClick: PropTypes.func
};

export default AlertManagementTable;

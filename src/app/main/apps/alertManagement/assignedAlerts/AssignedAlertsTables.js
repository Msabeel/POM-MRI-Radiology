import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { useParams } from 'react-router-dom';
// import { getAssignedAlertData, completeMultipleAlert } from '../store/assignedAlertSlice';
import { getAssignedAlertData } from '../store/assignedAlertSlice';
import { getWidgets } from '../store/AlertManagementSlice';
import Widget15 from '../../dashboards/project/widgets/Widget15';

const useStyle = makeStyles(theme => ({
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
	},
	assignedreport: {
		marginTop: '120px'
	}
}));


const AssignedAlertsTable = props => {
	const [widgets1, SetWidgets] = useState([]);
	// const { currentRange } = useParams();

	const dispatch = useDispatch();
	
	useEffect(() => {
		fetchAllWidets();
	}, [dispatch]);
	
	const storeData = useSelector(({ AlertManagementApp }) => AlertManagementApp.assignedAlertSlice);

	/*
	useEffect(() => {
		if (currentRange) {
			fetchAllWidets();
		}
	}, [currentRange]);
	*/

	useEffect(() => {
		if (storeData.AlertCompleted === true) {
			fetchAllAssignedAlerts();
		}
	}, [storeData.AlertCompleted]);

	const classes = useStyle();
	const customeNotify = useCustomNotify();
	const [rowdata, rowData] = useState([]);
	const [row, selectedRowData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	
	// Fetch assigned alerts
	const fetchAllAssignedAlerts = async () => {
		setLoading(true);
		
		const result = await dispatch(getAssignedAlertData());
		
		rowData(result.payload.data);
		setLoading(result.payload.isLoading);
	};

	// Fetch all widges
	const fetchAllWidets = async () => {
		setLoading(true);
		const data = await dispatch(getWidgets());
		SetWidgets(data.payload.data1[11]);
		setLoading(data.payload.isLoading);
		fetchAllAssignedAlerts();
	};
	
	
	const onGridReady = params => {
		params.api.sizeColumnsToFit();
	};
	
	// On selection changed handler
	const onSelectionChanged = params => {
		const selectedRows = params.api.getSelectedNodes();
		const data = selectedRows.map(item => {
			return { alert_id: item.data.alert_id, exam_id: item.data.exam_id, comment: 'test' };
		});
		selectedRowData(data);
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
	
	// Render the UI for your table
	return (
		<div className="alert" className={classes.assignedreport}>
			<div className="flex flex-col overflow-hidden mt-28">
				<div
					className="ag-theme-alpine ag-grid-custom min-h-full "
					style={{ height: '100%', width: '100%', lineHeight: '30px' }}
				>
					<AgGridReact
						defaultColDef={{
							flex: 1,
							minWidth: 100,
							resizable: true
						}}
						onGridReady={onGridReady}
						rowData={rowdata}
						enableBrowserTooltips
						tooltipShowDelay={0}
						pagination
						paginationPageSize="15"
						rowSelection="multiple"
						className="alerttable assignedreport"
						suppressRowClickSelection
						onSelectionChanged={onSelectionChanged}
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
						
						<AgGridColumn
							width={550}
							lockPosition
							sortable
							tooltipField="description"
							field="description"
							headerName="Description"
						/>
						
						<AgGridColumn
							width={85}
							lockPosition
							sortable
							tooltipField="disabled"
							field="disabled"
							headerName="disabled"
						/>
					</AgGridReact>
				</div>
			</div>
			
		</div>
	);
};

AssignedAlertsTable.propTypes = {
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func,
	onStarClick: PropTypes.func
};

export default AssignedAlertsTable;

import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import history from '@history';
import {useSnackbar} from 'notistack';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
import CreateFormDialog from './CreateFormDialog';
import EditFormDialog from './EditFormDialog';
import {setResponseStatus} from './store/CancelExamManagementSlice'
const useStyle = makeStyles({
	button: {
		margin: '15px 10px',
		width: 120
	}
})
const CancelExamManagementTable = ({data}) => {
	const dispatch = useDispatch();
	const classes = useStyle();
	const {enqueueSnackbar} = useSnackbar();
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [id, setId] = useState('');
	const [reasonData, setReasonData] = useState(null);

	const viewDocument = (event) => {
		return `<i class="material-icons cursor-pointer" title="View Attorney Detail">remove_red_eye</i>`;
	};

	const editIcon = event => {
		return '<i class="material-icons cursor-pointer" title="Disable Attorney">edit</i>';
	};
	const onGridReady = (params) => {
		params.api.sizeColumnsToFit();
	}
	const admin = true;

	const editClick = (e) => {
		dispatch(setResponseStatus())
		setOpen2(true);
		setReasonData(e.data)
		setId(e.data);
	}
	const fieldRender = (event) => {
		if (parseInt(event.value) === 1 || event.value=== 'Y') {
			return '<p>Yes</p>'

		} else {
			return '<p>No</p>'

		}
	}

	const i = 0;
	// Render the UI for your table
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
			<Button className={classes.button} variant='contained' onClick={() => {
				dispatch(setResponseStatus())
				setOpen(true)
			}} color='primary'>
				Add new
			</Button>
			<div className="ag-theme-alpine ag-grid-custom" style={{height: '120%', width: '100%', lineHeight: '30px'}}>
				<AgGridReact
					onGridReady={onGridReady}
					rowData={data}
					enableBrowserTooltips={true}
					tooltipShowDelay={0}
					pagination={true}
					paginationPageSize="15"
					rowHeight={38}>
					<AgGridColumn width={75} sortable={true} tooltipField="id" field="id" headerName="S.No"></AgGridColumn>
					<AgGridColumn width={70} field="id" headerName="" cellRenderer={editIcon} onCellClicked={editClick}></AgGridColumn>
					<AgGridColumn width={350} sortable={true} tooltipField="reason" field="reason" headerName="Cancel Reason"></AgGridColumn>
					<AgGridColumn width={350} sortable={true} tooltipField="description" field="description" headerName="Description"></AgGridColumn>
					<AgGridColumn width={350} sortable={true} tooltipField="auto_archive" headerName="Auto Archive" cellRenderer={fieldRender} field="auto_archive"></AgGridColumn>
					<AgGridColumn width={350} sortable={true} tooltipField="chk_incident" headerName="Check Incident" cellRenderer={fieldRender} field="chk_incident"></AgGridColumn>
				</AgGridReact>
				<CreateFormDialog
					isOpen={open}
					handleCloseDialog={() => {setOpen(false)}}
				/>
				<EditFormDialog
					isOpen={open2}
					handleCloseDialog={() => {setOpen2(false)}}
					editId={id}
					reasonData={reasonData}
				/>

			</div>
		</div>
	);
};

CancelExamManagementTable.propTypes = {
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func,
	onStarClick: PropTypes.func
};

export default CancelExamManagementTable;

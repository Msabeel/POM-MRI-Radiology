import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { openConfirmDialog } from './store/attorneySlice';
import ConfirmDialog from './ConfirmDialog';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Permissions } from 'app/config';
import history from '@history';

const EnhancedTable = ({ data}) => {
	const dispatch = useDispatch();

	const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_attorney);

	const viewDocument = (event) => {
		return `<i class="material-icons cursor-pointer" title="View Attorney Detail">remove_red_eye</i>`;
	};

	const deleteIcon = event => {
		return '<i class="material-icons cursor-pointer" title="Disable Attorney">cancel</i>';
	};

	const onDeleteClick = event => {
		dispatch(openConfirmDialog({id:event.data.id, block:1}))
	};

	const onViewClick = async(event) => {
		history.push(`/apps/attorney/${event.data.id}`)
	};
	// Render the UI for your table
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
			<PermissionSwitch permission={Permissions.update_attorney} label="Update Attorney"/>
			<PermissionSwitch permission={Permissions.delete_attorney} label="Delete Attorney"/>
			<div className="ag-theme-alpine ag-grid-custom" style={ { height: '120%', width: '100%', lineHeight: '30px' } }>
				    <AgGridReact rowData={data} enableBrowserTooltips={true} tooltipShowDelay={0} pagination={true} paginationPageSize="15" rowHeight={38}>
					<AgGridColumn width={61} field="id"  onCellClicked={onViewClick} headerName=""  cellRenderer={viewDocument}></AgGridColumn>
					<AgGridColumn width={61} field="id" headerName="" cellRenderer={deleteIcon} onCellClicked={onDeleteClick} hide={!isDeletePermission}></AgGridColumn>
					<AgGridColumn width={245} sortable={true} tooltipField="name" field="name" headerName="Name"></AgGridColumn>
					<AgGridColumn width={150} sortable={true} tooltipField="address1" field="address1" headerName="Address1"></AgGridColumn>
					<AgGridColumn width={120} sortable={true} tooltipField="address2" field="address2" headerName="Address2"></AgGridColumn>
					<AgGridColumn width={100} sortable={true} tooltipField="city" field="city" headerName="City"></AgGridColumn>
					<AgGridColumn width={85}  sortable={true} tooltipField="state" field="state" headerName="State"></AgGridColumn>
					<AgGridColumn width={100} sortable={true} tooltipField="zip" field="zip" headerName="Zip"></AgGridColumn>
					<AgGridColumn width={140} sortable={true} tooltipField="phone" field="phone" headerName="Phone"></AgGridColumn>
					<AgGridColumn width={140} sortable={true} tooltipField="fax" field="fax" headerName="Fax"></AgGridColumn>
					<AgGridColumn width={120} sortable={true} tooltipField="att_email" field="att_email" headerName="Email"></AgGridColumn>
					<AgGridColumn width={100} sortable={true} tooltipField="att_notes" field="att_notes" headerName="Notes"></AgGridColumn>
					<AgGridColumn width={85}  sortable={true} tooltipField="code" field="code" headerName="Code" ></AgGridColumn>				
				</AgGridReact>
				<ConfirmDialog/>
			</div>
		</div>
	);
};

EnhancedTable.propTypes = {
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func,
	onStarClick: PropTypes.func
};

export default EnhancedTable;

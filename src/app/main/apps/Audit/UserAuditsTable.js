import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React from 'react';
import  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { openConfirmDialog } from './store/auditSlice';
import ConfirmDialog from './ConfirmDialog';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Permissions } from 'app/config';
import history from '@history';
import { makeStyles } from '@material-ui/styles';
import { setIsSearching,setTableNumber,searchPatientsDetail, setFilterOptions,getSingleAuditDetails } from './store/auditSlice';
import { useSelector } from 'react-redux';
const useStyle = makeStyles(theme => ({
    lookup: {
        '& .ag-root-wrapper-body': {
            height: '100% !important'
        },
        HideTable: {
            display: 'none'
        }
    }

}));
const UserAuditsTable = ({ data }) => {
    const dispatch = useDispatch();
    const classes = useStyle();
    const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_attorney);

    const searchText = useSelector(({ auditApp }) => auditApp.audit.searchText);
    



    const tableNo = useSelector(({ auditApp }) => auditApp.audit.tableNo);

    const viewDocument = (event) => {
        return `<i class="material-icons cursor-pointer" title="View Audit Detail"  >remove_red_eye</i>  `;
    };

    const deleteIcon = event => {
        return '<i class="material-icons cursor-pointer" title="Disable Audit">cancel</i>';
    };

    const onDeleteClick = event => {
        dispatch(openConfirmDialog({ id: event.data.id, block: 1 }))
    };


   



    // Render the UI for your table
    return (
        <div>
       
            <div className="flex flex-col min-h-full sm:border-1 overflow-hidden my-12">
                <PermissionSwitch permission={Permissions.update_audit} label="Update Audit" />
                <PermissionSwitch permission={Permissions.delete_audit} label="Delete Audit" />
                <div className="ag-theme-alpine ag-grid-custom" style={{ height: '120%', width: '100%', lineHeight: '30px' }}>
                    <AgGridReact className={classes.lookup} rowData={data} enableBrowserTooltips={true} tooltipShowDelay={0} pagination={true} paginationPageSize="15" rowHeight={38}>
                       
                       
                        <AgGridColumn width={300} sortable={true} tooltipField="curr_date_time" field="curr_date_time" headerName="Date"></AgGridColumn>
                        <AgGridColumn width={550} sortable={true} tooltipField="status" field="status" headerName="Action"></AgGridColumn>
                        <AgGridColumn width={150} sortable={true} tooltipField="accession_number" field="accession_number" headerName="Acc#"></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="displayname" field="displayname" headerName="User"></AgGridColumn>
                        <AgGridColumn width={200} sortable={true} tooltipField="modality" field="modality" headerName="Modality"></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="exam" field="exam" headerName="Exam"></AgGridColumn>

                    </AgGridReact>
                    <ConfirmDialog />
                </div>

            </div>


        </div>

    );


};

UserAuditsTable.propTypes = {
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
    onStarClick: PropTypes.func
};

export default UserAuditsTable;

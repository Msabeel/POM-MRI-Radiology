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
const PatientAuditDetailTable = ({ data }) => {
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
    async function openEyeClick(event) {
        
            dispatch(setIsSearching(true))
            dispatch(setTableNumber({tableNo:2}))
            let value = 	{ title: 'Access No.', value: 'exam_access_no', match: event.data.exam_access_no, type: 'string', name: 'access' };
            dispatch(setFilterOptions(value))

           // dispatch(getSingleAuditDetails(searchText))
            

        
     
    }


   



    // Render the UI for your table
    return (
        <div>
       
       <div className="flex flex-col min-h-full sm:border-1 overflow-hidden my-12">
                <PermissionSwitch permission={Permissions.update_audit} label="Update Audit" />
                <PermissionSwitch permission={Permissions.delete_audit} label="Delete Audit" />
                <div className="ag-theme-alpine ag-grid-custom" style={{ height: '120%', width: '100%', lineHeight: '30px' }}>
                    <AgGridReact className={classes.lookup} rowData={data} enableBrowserTooltips={true} tooltipShowDelay={0} pagination={true} paginationPageSize="15" rowHeight={38}>
                        <AgGridColumn width={61} field="id" onCellClicked={openEyeClick} headerName="" cellRenderer={viewDocument}></AgGridColumn>
                        <AgGridColumn width={61} field="id" headerName="" cellRenderer={deleteIcon} onCellClicked={onDeleteClick} hide={!isDeletePermission}></AgGridColumn>
                        <AgGridColumn width={120} sortable={true} tooltipField="patient_id" field="patient_id" headerName="Patient Id"></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="name" field="name" headerName="Name"></AgGridColumn>
                        <AgGridColumn width={120} sortable={true} tooltipField="dob" field="dob" headerName="DOB"></AgGridColumn>
                        <AgGridColumn width={120} sortable={true} tooltipField="exam_access_no" field="exam_access_no" headerName="Access No."></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="rad" field="rad" headerName="Rad"></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="referer" field="referer" headerName="Referrer"></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="modality" field="modality" headerName="Modality"></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="exam" field="exam" headerName="Exam"></AgGridColumn>
                        <AgGridColumn width={300} sortable={true} tooltipField="status" field="status" headerName="Status"></AgGridColumn>
                        <AgGridColumn width={200} sortable={true} tooltipField="city" field="city" headerName="Location"></AgGridColumn>
                    </AgGridReact>
                    <ConfirmDialog />
                </div>

            </div>


        </div>

    );


};

PatientAuditDetailTable.propTypes = {
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
    onStarClick: PropTypes.func
};

export default PatientAuditDetailTable;

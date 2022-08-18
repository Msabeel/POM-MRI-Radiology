import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch ,useSelector} from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { openConfirmDialog } from './store/insuranceSlice';
import ConfirmDialog from './ConfirmDialog';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Permissions } from 'app/config';
import history from '@history';
import {makeStyles} from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import UseUserType from '../../../hooks/UseUserType'

import { ImportantDevices } from '@material-ui/icons';
const useStyle = makeStyles(theme => ({
	lookup: {
        '& .ag-root-wrapper-body':{
			height:'100% !important'
        }
    }
	
}));
	
const EnhancedTable = ({ data}) => {
	
	const classes = useStyle();
	const dispatch = useDispatch();
	const [gridColumnApi, setGridColumnApi] = useState(null);
	const [gridApi, setGridApi] = useState(null);
	const userType = UseUserType();
	const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_attorney);
	const isSearching = useSelector(({ insuranceApp }) => insuranceApp.insurance.isSearching);

	const viewDocument = (event) => {
		return `<i class="material-icons cursor-pointer" title="View Insurance Detail">remove_red_eye</i>`;
	};

	const deleteIcon = event => {
		return '<i class="material-icons cursor-pointer" title="Disable Insurance">cancel</i>';
	};

	const onDeleteClick = event => {
		dispatch(openConfirmDialog({id:event.data.id, block:1}))
	};

	const onViewClick = async(event) => {
		history.push(`/apps/insurance/${event.data.id}`)
	};

	const [dynamicClasses, setDynamicClasses] = React.useState([
		"dynamicClass1", "dynamicClass2"
	])

	const updateInsuranceName = event => {
		//dispatch(openConfirmDialog({id:event.data.id, block:1}))
	};
	const updateInsurancePhone = event => {
		//dispatch(openConfirmDialog({id:event.data.id, block:1}))
	};
	const updateInsuranceAddress = event => {
		//dispatch(openConfirmDialog({id:event.data.id, block:1}))
	};
	const updateInsuranceFax = event => {
		//dispatch(openConfirmDialog({id:event.data.id, block:1}))
	};


	if (isSearching) {
		return (
			<div style={{
				marginTop: 100
			}}>
				<CircularStatic  />
			</div>
		);
	}

	const name_render = (event) => {
        return (
			<>
            <Tooltip title={<h6 style={{padding: 5}}>{"Double click to update name"}</h6>} placement="top">
			{ 
			userType==='admin'?
			<TextField 
			onChange={updateInsuranceName} 
			style={{fontSize: 13, }} 
			id="standard-basic" 
			defaultValue={event.value} 
			label="Name" 
			variant="standard" />
			:<p style={{fontSize: 13, }} >{event.value} </p>
			}
			</Tooltip>

			</>
        );
    }
	const phone_render = (event) => {
        return (
            <Tooltip title={<h6 style={{padding: 5}}>{"Double click to update phone"}</h6>} placement="top">
              { 
			userType==='admin'?
			  <TextField 
			  //disabled={userType==='admin'?false:true} 
			  onChange={updateInsurancePhone} 
			  style={{fontSize: 13, }} 
			  id="standard-basic" 
			  defaultValue={event.value} 
			  label="Phone" 
			  variant="standard" />
			  :<p style={{fontSize: 13, }} >{event.value} </p>
			}
            </Tooltip>
        );
    }
	const address_render = (event) => {
        return (
            <Tooltip title={<h6 style={{padding: 5}}>{"Double click to update address"}</h6>} placement="top">
               { 
				userType==='admin'?

			   <TextField 
			   //disabled={userType.admin?false:true} 
			   onChange={updateInsuranceAddress} 
			   style={{fontSize: 13, }} 
			   id="standard-basic" 
			   defaultValue={event.value} 
			   label="Address" 
			   variant="standard" />
			   :<p style={{fontSize: 13, }} >{event.value} </p>

			}
            </Tooltip>
        );
    }
	const fax_render = (event) => {
        return (
			
            <Tooltip title={<h6 style={{padding: 5}}>{"Double click to update fax"}</h6>} placement="top">
            { 
			 userType==='admin'?
			<TextField 
			//disabled={userType==='admin'?false:true}
			 onChange={updateInsuranceFax} 
			 style={{fontSize: 13, }} 
			 id="standard-basic" 
			 defaultValue={event.value} 
			 label="Fax" 
			 variant="standard" />
			 :<p style={{fontSize: 13, }} >{event.value} </p>

			}
            </Tooltip>
			
        );
    }



	// Render the UI for your table
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden mt-28">
			{/*
			<PermissionSwitch permission={Permissions.update_insurance} label="Update Insurance"/>
			<PermissionSwitch permission={Permissions.delete_insurance} label="Delete Insurance"/>
			*/}
			<div  className="ag-theme-alpine ag-grid-custom" >
				   
					<AgGridReact 
					className={ classes.lookup } 
					rowData={data} 
					enableBrowserTooltips={true} 
					tooltipShowDelay={0} 
					pagination={true} 
					paginationPageSize="15"
					 onRowEditingStarted={(params) => {
                        params.api.refreshCells({
                            columns: ["name"],
                            rowNodes: [params.node],
                            force: true
                        });
                    }}
                    onCellEditingStopped={(params) => {
                        params.api.refreshCells({
                            columns: ["name"],
                            rowNodes: [params.node],
                            force: true
                        });
                    }}
					//rowHeight={38}
 					frameworkComponents={{
						name_render: name_render,
						phone_render: phone_render,
						address_render: address_render,
						fax_render: fax_render,
					}}>
					{/*<AgGridColumn  field="id"  onCellClicked={onViewClick} headerName=""  cellRenderer={viewDocument}></AgGridColumn>*/}
					<AgGridColumn  
					width={250} 
					sortable={true} 
					tooltipField="Double click to update name" 
					field="name" 
					headerName="Name"
					cellRenderer={"name_render"}>
					</AgGridColumn>

					<AgGridColumn  
					width={250} 
					sortable={true} 
					tooltipField="Double click to update phone" 
					field="phone" 
					headerName="Phone"
					cellRenderer={"phone_render"}>
					</AgGridColumn>

					<AgGridColumn  
					width={250} 
					sortable={true} 
					tooltipField="Double click to update address" 
					field="address" 
					headerName="Address"
					cellRenderer={"address_render"}>
					</AgGridColumn>
					{/* <AgGridColumn width={120} sortable={true} tooltipField="address2" field="address2" headerName="Address2"></AgGridColumn>
					<AgGridColumn  sortable={true} tooltipField="city" field="city" headerName="City"></AgGridColumn>
					<AgGridColumn  sortable={true} tooltipField="state" field="state" headerName="State"></AgGridColumn>
					<AgGridColumn  sortable={true} tooltipField="zip" field="zip" headerName="Zip"></AgGridColumn> */}
					
					<AgGridColumn  //sortable={true} 
					width={250} 
					tooltipField="Double click to update fax" 
					field="fax" 
					headerName="Fax"
					cellRenderer={"fax_render"}>
					</AgGridColumn>
					{/* <AgGridColumn width={120} sortable={true} tooltipField="att_email" field="att_email" headerName="Email"></AgGridColumn>
					<AgGridColumn  sortable={true} tooltipField="att_notes" field="att_notes" headerName="Notes"></AgGridColumn>
					<AgGridColumn   sortable={true} tooltipField="code" field="code" headerName="Code" ></AgGridColumn>				 */}
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

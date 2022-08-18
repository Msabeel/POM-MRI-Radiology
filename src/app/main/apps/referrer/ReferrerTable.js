import React, { useState, useEffect } from 'react';
import {Link, useHistory} from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import {  selectReferrer, showPassword } from './store/referrerSlice';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import history from '@history';

const EnhancedTable = ({ data, onViewPasswordClick }) => {
	
	const decreptedPassword = useSelector(({ referrerApp }) => referrerApp.referrer.decreptedPassword);
	const [encPassword, setEncPassword] = useState(null);

	const dispatch = useDispatch();
	
	useEffect(() => {
		setEncPassword(decreptedPassword)
	},[decreptedPassword])

	
	const viewDocument = (event) => {
	  return `<i class="material-icons cursor-pointer" title="View Referrer Details">remove_red_eye</i>`;
	};
	const viewPasswordIcon = (event) => {
		if(event.data.show_password){
			return `<i class="material-icons cursor-pointer" title="Hide Password">lock_open</i>`;
		}else{
			return `<i class="material-icons cursor-pointer" title="Show Password">lock</i>`;
		}
	};
	const renderPassword = (event) => {
		if(event.data.show_password){
			return event.data.decrypt_password;
		}else{
			return event.data.password;
		}
	};
	
	const onPasswordClick = async event => {
		onViewPasswordClick(event)
	};

	// Redirct to patinet profile page
	const onViewClick = event => {
		history.push(`/apps/profile/${event.value}/${event.data.lastname},${event.data.firstname}/1`)
	};

	
	// Render the UI for your table
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
			<div className="ag-theme-alpine" style={ { height: '100%', width: '100%', lineHeight: '30px' } }>
				<AgGridReact immutableData={false} getRowNodeId={(data) => data.id}
					//deltaRowDataMode={true} getRowNodeId={(data) => data.id}
					rowData={data} pagination={true} rowHeight={38}>
					<AgGridColumn width={60} field="id"  onCellClicked={onPasswordClick} headerName=""  cellRenderer={viewPasswordIcon}></AgGridColumn>
					<AgGridColumn width={60} field="id"  onCellClicked={onViewClick} headerName=""  cellRenderer={viewDocument}></AgGridColumn>
					
					<AgGridColumn width={150} sortable={true} field="username" headerName="Username"></AgGridColumn>
					<AgGridColumn sortable={true} field="password" headerName="Password" cellRenderer={renderPassword}></AgGridColumn>
					<AgGridColumn sortable={true} field="lastname" headerName="Lastname"></AgGridColumn>
					<AgGridColumn sortable={true} field="firstname" headerName="Firstname"></AgGridColumn>
					<AgGridColumn sortable={true} field="displayname" headerName="Display Name"></AgGridColumn>
					<AgGridColumn sortable={true} field="email" headerName="Email"></AgGridColumn>
					<AgGridColumn sortable={true} field="phone" headerName="Phone"></AgGridColumn>
					<AgGridColumn sortable={true} field="fax" headerName="Fax"></AgGridColumn>
					
				</AgGridReact>
			</div>
		</div>
	);
};

EnhancedTable.propTypes = {
	data: PropTypes.array.isRequired,
	onViewPasswordClick: PropTypes.func
};

export default EnhancedTable;

import React, { useState } from 'react';
import {Link, useHistory} from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { clearFilterOptions, setSearchCount, setStaredCount, setRecentSearchedPatient } from './store/contactsSlice';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import history from '@history';

const EnhancedTable = ({ data, onRowClick, onStarClick }) => {
	const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
	const dispatch = useDispatch();
	
	const editIcon = event => {
		return '<i class="material-icons" title="Edit Patient">groups</i>';
	};
	const orderExamIcon = event => {
		return '<i class="material-icons" title="Order Exam">assignment_turned_in</i>';
	};
	const viewDocument = (event) => {
	  return `<i class="material-icons cursor-pointer" title="View Patient Detail">remove_red_eye</i>`;
	};

	const onEditClick = event => {
		// dispatch(openEditContactDialog(event.data));
		history.push(`/apps/profile/${event.value}/${event.data.name}/1`)
	};

	
	// Redirct to patinet profile page
	const onViewClick = event => {
		// dispatch(clearFilterOptions(''));
		// dispatch(setSearchCount(0));
		// dispatch(setStaredCount(0));
		dispatch(setRecentSearchedPatient({id: event.value}))
		history.push(`/apps/profile/${event.value}/${event.data.name}/1`)
	};

	/**
	 * Render gender view
	 * @param {*} event 
	 */
	const genderView = event => {
		let gender = '';
		if(event.value === 'M'){
			gender = 'Male';
		}else if(event.value === 'F'){
			gender = 'Female';
		}
		return gender;
	};

	/**
	 * render star icon
	 * @param {} event 
	 */
	const starIcon = (event) => {
		if(event.data.patient_starred){
			return `<i class="material-icons cursor-pointer fill-star" title="Starred">star</i>`;
		}else{
			return `<i class="material-icons cursor-pointer" title="Not starred">star_border</i>`;
		}
	  };

	  const insuranceType = (event) => {
		if(event.data.self_pay1 === 'Yes'){
			return `Self Pay`;
		}else if(event.data.auto_accident1 === 'Yes'){
			return `Auto Insurance`;
		}else if(event.data.company_accident1 === 'Yes'){
			return `Workers Comp`;
		}else if(event.data.lop_accident1 === 'Yes'){
			return `LOP`;
		}
		else if(event.data.primary_insurance === 'Yes'){
			return `Primary Insurance`;
		}
	  };
	  const insuranceCompany = (event) => {
		if(event.data.auto_accident1 === 'Yes'){
			return event.data.insurance_company;
		}else{
			return event.data.insurance_company_name;
		}
	  };

	  
	/**
	 * check uncheck star
	 * @param {*} event 
	 */  
	const updatePatientStar = event => {
		onStarClick(event.data)
	};
	// Render the UI for your table
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
			<div className="ag-theme-alpine" style={ { height: '100%', width: '100%', lineHeight: '30px' } }>
				<AgGridReact rowData={data} pagination={true} rowHeight={38}>
					<AgGridColumn width={60} field="id" headerName="" cellRenderer={orderExamIcon}></AgGridColumn>
					{/* <AgGridColumn width={60} field="id" onCellClicked={onEditClick} headerName="" cellRenderer={editIcon}></AgGridColumn> */}
					
					<AgGridColumn width={60} field="data"  onCellClicked={updatePatientStar} headerName=""  cellRenderer={starIcon}></AgGridColumn>
					<AgGridColumn width={60} field="id"  onCellClicked={onViewClick} headerName=""  cellRenderer={viewDocument}></AgGridColumn>
					<AgGridColumn width={150} sortable={true} field="patient_id" headerName="Patient ID"></AgGridColumn>
					<AgGridColumn sortable={true} field="fname" headerName="First Name"></AgGridColumn>
					<AgGridColumn sortable={true} field="lname" headerName="Last Name"></AgGridColumn>
					<AgGridColumn width={100} field="gender"  headerName="Gender"  cellRenderer={genderView}></AgGridColumn>
					<AgGridColumn width={110} sortable={true} field="dob" headerName="DOB"></AgGridColumn>
					<AgGridColumn width={130} sortable={true} field="mobile" headerName="Mobile"></AgGridColumn>
					<AgGridColumn sortable={true} field="email" headerName="Email"></AgGridColumn>
					<AgGridColumn sortable={true} field="insurance_type" headerName="Insurance Type" cellRenderer={insuranceType}></AgGridColumn>
					<AgGridColumn sortable={true} field="insurance_company" headerName="Insurance Company" cellRenderer={insuranceCompany}></AgGridColumn>
					<AgGridColumn sortable={true} field="address1" headerName="Address"></AgGridColumn>
					<AgGridColumn sortable={true} field="cityname" headerName="City"></AgGridColumn>
					<AgGridColumn sortable={true} field="statename" headerName="State"></AgGridColumn>
					<AgGridColumn sortable={true} field="countryname" headerName="Country"></AgGridColumn>
					<AgGridColumn width={80} sortable={true} field="zip" headerName="Zip"></AgGridColumn>
					
				</AgGridReact>
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

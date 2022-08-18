import React, {useState, useEffect,forwardRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import {useDispatch,useSelector} from 'react-redux';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Permissions } from 'app/config';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
// import {withStyles} from '@material-ui/core/styles';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
 import {getOpenTaskData,completeMultipleTask} from '../store/openTaskSlice'
 import CircularStatic from 'app/fuse-layouts/shared-components/loader';
 //import {getWidgets} from '../store/TaskManagementSlice'
 import { useParams } from 'react-router-dom';


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
	button:{
		color: '#fff !important',
		margin: '10px 0px !important',
		padding: '6px 16px !important',
		borderRadius: '3px !important',
		backgroundColor: '#192d3e !important'
	},
	openreport:{
		marginTop:'120px'
	}
}));
const OpenTasksTable = forwardRef((props, ref) => {

	useImperativeHandle(ref, (value) => ({

		setFilterData(startDate,endDate) {
		
        var resultRowData = rowdata.filter(function (a) {

            	var openTaskDates = new Date(a.scheduling_date) || {};
                return openTaskDates >= new Date(startDate) && openTaskDates <= new Date(endDate)
           
        });
		setRowDataCache(resultRowData)
		props.setCount(resultRowData.length);
		}
	
	  }));

	const dispatch = useDispatch();
	const storeData = useSelector(({TaskManagementApp}) => TaskManagementApp.openTaskSlice)
	const { currentRange } = useParams();

	useEffect(() => {
		if (storeData.TaskCompleted === true) {
			fetchAllOpenTasks()
		}
	}, [storeData.TaskCompleted]);
	useEffect(() => {
		fetchAllOpenTasks();
	}, [currentRange]);

	const classes = useStyle();
	const customeNotify = useCustomNotify();
	const [rowdata, rowData] = useState([]);
	const [rowDataCache, setRowDataCache] = useState([]);
	const [row,selectedRowData] =useState([])
	const [isLoading, setLoading] =useState(false)
	const fetchAllOpenTasks =async () =>{
		setLoading(true)
		let data1={
			type:"DFTY"
		}
		const data= await dispatch(getOpenTaskData(data1))
		rowData(data.payload.data);
		setRowDataCache(data.payload.data);
		props.setCount(data.payload.data.length);
		setLoading(data.payload.isLoading)
		props.setIsOpenTaskDataLoaded(data.payload.isLoading)
	  }
	
	 
	  const completeTask1 =async ()=>{
		const data ={
			data:row
		}
		const data1 =await dispatch(completeMultipleTask(data))
			  if (data1.payload.TaskCompleted===true){
				customeNotify("Task Marked Complete successfully!", 'success')
				fetchAllOpenTasks()
			  }
			  else {
				customeNotify("Something Went Wrong!", 'error')
			  }
	}
	
 	const onGridReady = (params) => {
		params.api.sizeColumnsToFit();
	}
	const onSelectionChanged = (params) =>{
		 var selectedRows = params.api.getSelectedNodes()
		 var data= selectedRows.map(item=>{
			 return {task_id:item.data.task_id,exam_id:item.data.exam_id,comment:"test"}
			 
		 })
		 selectedRowData(data)
	  }

	const admin = true;
	const i = 0;
	if (isLoading) {
		return (
			<div style={{
				marginTop: 300
			}}>
				<CircularStatic />
			</div>
		)
	}
	// Render the UI for your table
	return (
		<div className="task" className={classes.openreport}>
		<div className="flex flex-col overflow-hidden mt-28">
			<div className="ag-theme-alpine ag-grid-custom min-h-full " style={{height: '100%', width: '100%', lineHeight: '30px'}}>
			
				<AgGridReact
				    defaultColDef={{
						flex:1,
						minWidth:100,
						resizable:true,

					}}
					onGridReady={onGridReady}
					rowData={rowDataCache}
					enableBrowserTooltips={true}
					tooltipShowDelay={0}
					pagination={true}
					paginationPageSize="15"
					rowSelection={'multiple'}
					className="tasktable openreport"
					suppressRowClickSelection={true}
					rowSelection='multiple'
					onSelectionChanged= {onSelectionChanged}
					
					rowHeight={38}>   
		            <AgGridColumn width={125} lockPosition={true} headerCheckboxSelection={true} checkboxSelection={true} headerCheckboxSelectionFilteredOnly={true} sortable={true} tooltipField="ID" field="exam_access_no" headerName="Access No"></AgGridColumn>
					<AgGridColumn width={75} lockPosition={true} sortable={true} tooltipField="task" field="pid" headerName="Patient Id"></AgGridColumn>
					<AgGridColumn width={100} lockPosition={true}  tooltipField="Name" field="fullname" headerName="Patient"></AgGridColumn>
					<AgGridColumn width={50} lockPosition={true}   tooltipField="Modality" field="modality"  headerName="Modality"></AgGridColumn>
					<AgGridColumn width={50} lockPosition={true}  tooltipField="Exam"field="exam" headerName="Exam"></AgGridColumn>
                    <AgGridColumn width={75}lockPosition={true}  tooltipField="DOS" field="scheduling_date"  headerName="DOS"></AgGridColumn>
                    {/* <AgGridColumn width={50} tooltipField="disable" cellRenderer={time}   headerName="Time"></AgGridColumn> */}
                    <AgGridColumn width={200}lockPosition={true}  tooltipField="Task" field="task" headerName="Task"></AgGridColumn>
				</AgGridReact>
				
			</div>
			
		</div>
             <Button variant='contained' className={classes.button} color='primary' onClick={()=>{ completeTask1()}}>
				Complete Task
			</Button>
		</div>


	);
});

OpenTasksTable.propTypes = {
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func,
	onStarClick: PropTypes.func
};

export default OpenTasksTable;
		
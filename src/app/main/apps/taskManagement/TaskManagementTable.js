import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import {useDispatch,useSelector} from 'react-redux';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Permissions } from 'app/config';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/styles';
// import {withStyles} from '@material-ui/core/styles';
import CreateFormDialog from './CreateTaskForm'; 
import EditFormDialog from './EditTaskForm';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
 import {getTaskManagementData,deleteTaskManagementData,disableTaskManagementData,setResponseStatus} from './store/TaskManagementSlice'
 import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import ButtonGroup from '@material-ui/core/ButtonGroup';

//  import Switch from '@material-ui/core/Switch';
import Switch from "react-switch";
import Widget15 from '../dashboards/project/widgets/Widget15'
// import {StyleSheet, Switch, View, Text} from 'react-native'  


//  import FuseUtils from '@fuse/utils';
// const useStyle = makeStyles({
// 	button: {
// 		margin: '15px 10px',
// 		width: 120
// 	},
// });

const useStylesNew = makeStyles({
	selectedButton: {
		backgroundColor: 'rgb(76, 175, 80)',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80)',
		  },
	},
});

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
	button:{
		color: '#fff !important',
		margin: '10px 0px !important',
		padding: '6px 16px !important',
		borderRadius: '3px !important',
		backgroundColor: '#192d3e !important'
	},
	successButton: {
		backgroundColor: 'rgb(76, 175, 80)',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80)',
		  },
	},
}));


const TaskManagementTable = (props) => {
	const classesNew = useStylesNew(props);
	const dispatch = useDispatch();
	// const widgets = useSelector(selectWidgets);
	useEffect(()=>{
		fetchAllTasks()
		
	},[dispatch])
	const storeData = useSelector(({TaskManagementApp}) => TaskManagementApp.TaskManagement)
	const rowdata = useSelector(({TaskManagementApp}) => TaskManagementApp.TaskManagement.data)
	const classes = useStyle();
	const customeNotify = useCustomNotify();
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	//const [rowdata, rowData] = useState([]);
	const [isLoading, setLoading] =useState(false)
	const [id, setId] = useState('');
	const [task, setTask] = useState(null);
	const [open3,SetOpen3] =useState(null)
	const [disableId,setDisableId] =useState(null)
	const [state, setState] =useState([]);
	const [value,setValue]=useState('')

	useEffect(() => {
		if (storeData.isCreatedSuccess === true) {
			fetchAllTasks()
		
		}
	}, [storeData.isCreatedSuccess]);

	useEffect(() => {
		if (storeData.isUpdateSuccess === true) {
			fetchAllTasks()
			
		}
	}, [storeData.isUpdateSuccess]);

	useEffect(() => {
		if (storeData.isDisabledEnabled === true) {
			fetchAllTasks()
		}
	}, [storeData.isDisabledEnabled]);

	

      const fetchAllTasks =async () =>{
		setLoading(true)
		const data= await dispatch(getTaskManagementData())
		setState(data.payload.data)
		//rowData(data.payload.data)
		setLoading(data.payload.isLoading)
		setOpen(false)
		setOpen2(false)
	  }
	  
	  const editClick = (e) => {
		setOpen2(true);
		setTask(e.data)
		setId(e.data);
	}
	  const deleteTask =async (e) =>{
       var data={
		   key:"delete",
		   id:e.data.id
	   }
	   const result =await dispatch(deleteTaskManagementData(data))
	   if(result.payload.isDeletedSuccess===true) {
		customeNotify("Task deleted successfully!", 'success')
		fetchAllTasks()
	   }
	   else if(result.payload.message=== "Would you like to disable instead?"){
		SetOpen3(true)
		setDisableId(result.payload.deleteId)
	   }
	   else{
		customeNotify("Something Went Wrong!", 'error')
	   }

	  }

	  const handleClose = () => {
		SetOpen3(false)
	}

		const editIcon = event => {
		return '<i class="material-icons cursor-pointer" title="Edit Task">edit</i>';
		};
		const deleteIcon = (event) => {
		return `<i class="material-icons cursor-pointer" title="View Patient Detail">delete</i>`;
	  };
	  const disableIcon = (event) => {		  

		var classToAdd = { backgroundColor: 'rgb(76, 175, 80)' ,color:'white'};
		const yes = event.data.disabled === 1 ? true : false;
		const no = (yes == true ? false :true);
		return(  
			<>
			<ButtonGroup disableElevation variant="contained">
			<Button
					variant="contained"
					style={yes?classToAdd:{}}
					onClick={()=>disableTask(event,1)}
					disabled={yes}
				>
					Yes
				</Button>
				<Button
					variant="contained"
					style={no?classToAdd:{}}
					onClick={()=>disableTask(event,0)}
					disabled={no}
				>
					No
				</Button>
    		</ButtonGroup>
			</>
			);
			
	  };
	
	  const handleDisable = ()=>{
		
		disableTask({data:{id:disableId,disable:true}})
		SetOpen3(false)
	}
	  const disableTask =async (e,status) =>{

		var data = {
				key:"disable",
				id:e.data.id,
				disable:status,
		}

		/* does not make sense for this code
		let markers = [...state];
		let index = markers.findIndex(item=>item.id==e.data.id)
		markers[index] = {...markers[index], disabled: e.data.disable ? 1 :0 };
		setState(markers);
		markers = [...state];
		does not make sense for this code*/ 

		 const disableTaskresult =await dispatch(disableTaskManagementData(data))
	
		 if(disableTaskresult.payload.data.isDisabledSuccess===true) {
			customeNotify("Task Enabled successfully!", 'success')
		   }
		   else if(disableTaskresult.payload.data.isDisabledSuccess===false){
			customeNotify("Task Disabled successfully!", 'success')
		   }
		   else{
			customeNotify("Something Went Wrong!", 'error')
		   }
	   }
	const onGridReady = (params) => {
		params.api.sizeColumnsToFit();
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
		<div> 
		
			   {/* <StyleButton> */}
			<Button className={classes.button} onClick={() => {
				dispatch(setResponseStatus())
				setOpen(true)
			}} color='primary'>
				Add new
			
			</Button> 
			{/* </StyleButton> */}
		<div className="flex flex-col min-h-full  overflow-hidden">
		
		
			<div className="ag-theme-alpine ag-grid-custom" style={{height: '100%', width: '100%', lineHeight: '30px'}}>
			
				<AgGridReact
					onGridReady={onGridReady}
					rowData={rowdata}
					enableBrowserTooltips={true}
					tooltipShowDelay={0}
					pagination={true}
					suppressMoveWhenRowDragging={false}
					paginationPageSize="15"
					// frameworkComponents={{
					// 	disableIcon:disableIcon //please check now ok
					// }}
					className="tasktable"
					rowHeight={38}>   
		  <AgGridColumn width={75} sortable={true} lockPosition={true} tooltipField="ID" field=	"id" headerName="ID"></AgGridColumn>
					<AgGridColumn width={550} lockPosition={true}  sortable={true} tooltipField="task" field="task" headerName="Task"></AgGridColumn>
					<AgGridColumn width={100} lockPosition={true}  tooltipField="edit" field="id"  cellRenderer={editIcon} onCellClicked={editClick} headerName="Edit"></AgGridColumn>
					<AgGridColumn width={150} lockPosition={true}  tooltipField="Disabled / Enabled" cellRendererFramework={disableIcon}  headerName="Disabled / Enabled"></AgGridColumn>
					<AgGridColumn width={100} lockPosition={true}  tooltipField="delete"  cellRenderer={deleteIcon}  onCellClicked={deleteTask} headerName="Delete"></AgGridColumn>
				</AgGridReact>
                <CreateFormDialog
					isOpen={open}
					handleCloseDialog={() => {setOpen(false)}}
				/>
				 <EditFormDialog
					isOpen={open2}
					handleCloseDialog={() => {setOpen2(false)}}
					editId={id}
					reasonData={task}
				/> 
			
			</div>
			<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open3}>
			<DialogContent>
                    <DialogContentText id="alert-dialog-description">
					You can not delete a task that has been assigned to an exam. Would you like to disable instead?
                    </DialogContentText>
                </DialogContent>
				<DialogActions>
                    <Button onClick={()=>handleClose()} color="primary">
                        No
                    </Button>
                    <Button onClick={()=> handleDisable()} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
	</Dialog>
		</div>
	
		</div>
	);
};

TaskManagementTable.propTypes = {
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func,
	onStarClick: PropTypes.func
};

export default TaskManagementTable;
		
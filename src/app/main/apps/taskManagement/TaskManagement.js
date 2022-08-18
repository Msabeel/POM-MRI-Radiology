import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React, {  useRef } from 'react';
import withReducer from 'app/store/withReducer';
 import reducer from './store';
import TaskManagementTable from './TaskManagementTable';
import TaskManagementHeader from './TaskManagementHeader';
import TaskSidebarContent from './TaskManagementSlidebar'
import { useParams } from 'react-router-dom';
import OpenTaskManagementHeader from './openTasks/OpenTaskHeader';
import OpenTasksTable from './openTasks/openTasksTables.js'
//import Widget15 from '../dashboards/project/widgets/Widget15';
import FilterWidgetTaskManagement from './openTasks/Component/FilterWidgetTaskManagement'
import { useDispatch,useSelector } from 'react-redux';
import {useEffect ,useState} from 'react'
//import {getWidgets} from './store/TaskManagementSlice'
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import { Block } from '@material-ui/icons';
import momentHelpers from '../helper/momentHelper'
const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	},
	d_inline:{
		display:"inline-block"
	},
	widgetClass:{
       display:"block",
	   margin:"0 auto",
	   height:"100% !important",
	   minHeight:"100% !important"
	}
});




function TaskManagementApp(props) {
	
	const storeData = useSelector(({TaskManagementApp}) => TaskManagementApp.openTaskSlice);
	const [isOpenTaskDataLoaded, setIsOpenTaskDataLoaded] =useState(storeData.isLoading)
	const childRef = useRef();
	let { currentRange } = useParams();
	currentRange = currentRange==="all"?"all":"DFTY";
	//const { currentRange }=	"DFTY"; // for client side grid we did not need to get the data from param
	const [count,setCount]=useState(0)

	const [ranges,setRanges]=useState([ 
		{key:'DFTY', value:'This Year'},
		{key:'DT', value:'Today'},
		{key:'DY', value:'Yesterday'},
		{key:'DTW', value:'Tomorrow'},
		{key:'DLS', value:'Last Seven'},
		{key:'DLT', value:'Last Thirty'},
		{key:'DFIQ', value:'First Quarter'},
		{key:'DSQ', value:'Second Quarter'},
		{key:'DTQ', value:'Third Quarter'},
		{key:'DFOQ', value:'Fourth Quarter'},
	])
	
	
	function handleChangeRangeForOpenTask(ev) {
		
        if(ev.target.value == 'DT'){
			
			var {start, end} = momentHelpers.today();
			childRef.current.setFilterData(start, end)
        }
        if(ev.target.value == 'DY'){
			var {start, end} = momentHelpers.yasterday();
			childRef.current.setFilterData(start, end)
        }
        if(ev.target.value == 'DTW'){
			var {start, end} = momentHelpers.tomorrow();
			childRef.current.setFilterData(start, end)
        }
        if(ev.target.value == 'DLS'){
			var {start, end} = momentHelpers.lastSevenDays();
			childRef.current.setFilterData(start, end)
        }
        if(ev.target.value == 'DLT'){
			var {start, end} = momentHelpers.LastThirtyDays();
			childRef.current.setFilterData(start, end);
        }

        if(ev.target.value == 'DFIQ'){
			
			var {start, end} = momentHelpers.getQuarterRange(1);
			childRef.current.setFilterData(start, end);
        }
        if(ev.target.value == 'DSQ'){
			
			var {start, end} = momentHelpers.getQuarterRange(2);
			childRef.current.setFilterData(start, end);
        }
        if(ev.target.value == 'DTQ'){
			
			var {start, end} = momentHelpers.getQuarterRange(3);
			childRef.current.setFilterData(start, end);
        }
        if(ev.target.value == 'DFOQ'){
			
			var {start, end} = momentHelpers.getQuarterRange(4);
			childRef.current.setFilterData(start, end);
        }
        if(ev.target.value == 'DFTY'){
			
			var {start, end} = momentHelpers.getThisYear();
			childRef.current.setFilterData(start, end);
        }
		
	}
	/*
	useEffect(()=>{
		fetchAllWidets()
		
	},[dispatch])
	
	const fetchAllWidets =async () =>{
		setLoading(true)
		const data= await dispatch(getWidgets())
		 SetWidgets(data.payload.data1[11])
		 setLoading(data.payload.isLoading)
	  }
	  */
	function headerView(){
		if (currentRange=='all'){
			return (<TaskManagementHeader pageLayout={pageLayout} />)
		}
		else{
			return (<OpenTaskManagementHeader pageLayout={pageLayout} />)
		}
	}
    function renderView(){
		if(currentRange=='all'){
			return (< TaskManagementTable />)
		}
		else{
			return (<OpenTasksTable ref={childRef} setCount={setCount} setIsOpenTaskDataLoaded={setIsOpenTaskDataLoaded} handleChangeRangeForOpenTask={handleChangeRangeForOpenTask} />)
			
		}
	}
	function Widget(){
		if(currentRange!='all'){
			return ( 
			<div className={classes.widgetClass}> 
			{!isOpenTaskDataLoaded &&
			<FilterWidgetTaskManagement
			 handleChangeRangeForOpenTask={handleChangeRangeForOpenTask} 
			 currentRangeParent={currentRange} 
			 ranges={ranges} 
			 count={count} 
			 {...props}/>
			}
			</div>)
		}
	}
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-64 h-64 sm:h-64 sm:min-h-64',
					wrapper: 'min-h-0'
				}}
				contentToolbar={Widget()}
				header={headerView()}
				content={renderView()}
				leftSidebarContent={<TaskSidebarContent setCount={setCount} currentRangeNew={currentRange}/>}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('TaskManagementApp', reducer)(TaskManagementApp);
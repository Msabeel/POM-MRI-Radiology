import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef,useEffect,useState,forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import reducer from './store';
import {  useSelector } from 'react-redux';
import DailyWorkFLowFilters from './filters/DailyWorkFLowFilters'
import {LocationFilter} from './filters/LocationFilter'
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import dailyWorkFlowHelper from '../helper/dailyWorkFlowHelper'
import dailyWorkFlowData from './mockupdata/dailyWorkFlowData.json'
import {ModalityChildFilter} from './filters/ModalityChildFilter'

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
    content: {
		'& canvas': {
			maxHeight: '100%'
		}
	},
});

function DailyWorkFlowDashboard (props)  {
	console.log(dailyWorkFlowData)
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [locationOptionsDD,setLocationOptionsDD] =useState([]);
	const [modalityChilds,setModalityChilds] =useState([]);

	// need to implement
	const setLocationDD = (modalities) => {
		// need to change when api is updated
		let childModalityID = dailyWorkFlowHelper.getChildModalityIDsFromModalityDD(modalities)
		setLocationOptionsDD(dailyWorkFlowHelper.getLocationDDFromMainObject(dailyWorkFlowData.locations))
		//setLocationOptionsDD(dailyWorkFlowHelper.getLocationsFromModality(null,modalities));
	  }
	
	const setChildModalitiesByModality = (modalities) =>
	{
		let modalityChilds = dailyWorkFlowHelper.getChildsModalityByModality(dailyWorkFlowData.modality_counts,modalities)
		setModalityChilds(modalityChilds)

	}  

	  useEffect(()=>{
		console.log('main locations',locationOptionsDD)
	  },[locationOptionsDD])
	  
	  useEffect(()=>{	
		  console.log("modalityChilds",modalityChilds)
	  },[modalityChilds])


	return (
		<>
			<FusePageSimple
				classes={{
                    header: 'min-h-160 h-160',
                    toolbar: 'min-h-48 h-48',
                    rightSidebar: 'w-288',
                    content: classes.content
                }}
				header={
                    ""
                }
				content={<DailyWorkFLowFilters 
					setChildModalitiesByModality={setChildModalitiesByModality}
					status_list = {dailyWorkFlowData.status_list}
					//setLocationFilterByModalities={setLocationFilterByModalities}
					 />}
				rightSidebarContent={
                	<FuseAnimateGroup
					className="w-full"
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
                    
				>
					<div className="widget w-full p-12">
					
					{
					modalityChilds.length>0 && 
					<ModalityChildFilter
					setLocationDD={setLocationDD} 
					modalityChildsFilter={modalityChilds} />}

 					</div>

 					{
                    	<div className="widget w-full p-12">
						{(modalityChilds.length>0&&locationOptionsDD.length>0) && <LocationFilter locationOptionsDD={locationOptionsDD} />}
 						</div>
 					}

                </FuseAnimateGroup>
               }
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('dailyWorkFlow', reducer)(DailyWorkFlowDashboard);

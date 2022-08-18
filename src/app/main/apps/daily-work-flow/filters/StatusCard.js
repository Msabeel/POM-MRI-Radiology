import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import {makeStyles} from '@material-ui/core/styles';
import commonHelper from '../../helper/commonHelper'
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles({
	rd_splashitemselected: {
		border: '4px solid green'
	}
});


export const StatusCard = ({statusCount,...props}) => {
	const classes = useStyles(props);
    const [status,setStatus]= useState(commonHelper.getStatusWithSelectionForStatus(statusCount))
    const [isCheck, setIsCheck] = useState([]);

    const handleClick = (statusVal,isSelected) => 
    {

        let toggle = isSelected ? false :true;
        setIsCheck([...isCheck, statusVal]);           
        //Find index of specific object using findIndex method.    
        var objIndex = status.findIndex((obj => obj.status == statusVal));  
        // 1. Make a shallow copy of the items
        let items = [...status];
        // 2. Make a shallow copy of the item you want to mutate
        let item = {...items[objIndex]};
        // 3. Replace the property you're intested in
        item.isSelected = toggle;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        items[objIndex] = item;

        setStatus(items)

        if (!isSelected) {
         setIsCheck(isCheck.filter(item => item !== statusVal));
        }
        
      };

      useEffect(() => {
        
    }, [status]);

    
    useEffect(() => {
       // props.getLocationFilterByModalities(isCheck);
      //  props.getChildModalitiesByModality(isCheck)
    }, [isCheck]);

	return (
         
       
        status.map((status) => (
            <div className="widget flex w-full sm:w-1/3 p-16">
            <Card 
            className={`w-full rounded-8 shadow-1 ${isCheck.includes(status.status)?classes.rd_splashitemselected:""}`}
            onClick={()=>handleClick(status.status,status.isSelected)}
            >
			<div className="p-16 pb-0 flex flex-row flex-wrap items-end">
				<div className="">
					<Typography className="h3" color="textSecondary">
                    {status.status}
					</Typography>
					<Typography className="text-56 font-300 leading-none mt-8">{status.total_count}</Typography>
				</div>
                <div className="py-4 text-16 flex flex-row items-center">
					<div className="flex flex-row items-center">
						{status.total_count > 0 && <Icon className="text-green">trending_up</Icon>}
						{status.total_count <= 0 && <Icon className="text-red">trending_down</Icon>}
						<Typography className="mx-4">{status.total_count}%</Typography>
					</div>
					<Typography className="whitespace-no-wrap">of target</Typography>
				</div>
			</div>
            
		</Card>
        </div>
        ))
        
	
            
        
	);
}

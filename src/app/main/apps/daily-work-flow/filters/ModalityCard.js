import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import {makeStyles} from '@material-ui/core/styles';
import commonHelper from '../../helper/commonHelper'

const useStyles = makeStyles({
	rd_splashitemselected: {
		border: '4px solid green'
	}
});


export const ModalityCard = ({modalityCount,...props}) => {


	const classes = useStyles(props);
    const [modality,setModality]= useState(commonHelper.getModalityWithSelection(modalityCount))
    const [isCheck, setIsCheck] = useState([]);

    const handleClick = (modalityVal,isSelected) => {

        let toggle = isSelected ? false :true;
        setIsCheck([...isCheck, modalityVal]);           
        //Find index of specific object using findIndex method.    
        var objIndex = modality.findIndex((obj => obj.modality == modalityVal));  
        // 1. Make a shallow copy of the items
        let items = [...modality];
        // 2. Make a shallow copy of the item you want to mutate
        let item = {...items[objIndex]};
        // 3. Replace the property you're intested in
        item.isSelected = toggle;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        items[objIndex] = item;

        setModality(items)

        if (!isSelected) {
         setIsCheck(isCheck.filter(item => item !== modalityVal));
        }
        
      };

      useEffect(() => {
        
    }, [modality]);

    
    useEffect(() => {
        props.getLocationFilterByModalities(isCheck);
        props.getChildModalitiesByModality(isCheck)
    }, [isCheck]);

	return (
         
       
        modality.map((modality) => (
            
        <div className={`widget flex w-full sm:w-1/2 md:w-1/4 p-12`}>
            <Paper 
                 onClick={()=>handleClick(modality.modality,modality.isSelected)}
                //isChecked={modalityCount.includes(id)}
                className={`w-full rounded-8 shadow-1 ${isCheck.includes(modality.modality)?classes.rd_splashitemselected:""}`}>
                
			<div className="flex items-center justify-between px-4 pt-4">
            <PermissionSwitch permission="pre_schedule_status"/>
			
            </div>
			<div className="text-center pt-12 pb-28">
				<Typography className="text-72 leading-none text-blue">
					{modality.modality}
				</Typography>
			</div>
            {/*
			<div className="flex items-center px-16 h-52 border-t-1">
				<Typography className="text-15 flex w-full" color="textSecondary">
					<span className="truncate items-center">{props.widget.data.extra.label}</span>
				</Typography>
			</div>
            */}
		</Paper>
        </div>
        ))
        
	
            
        
	);
}

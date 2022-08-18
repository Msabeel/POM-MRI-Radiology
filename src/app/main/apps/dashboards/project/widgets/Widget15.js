import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import history from '@history';
// import CreateFormDialog from '../../../Widget15/Widget15';
import { useDispatch } from 'react-redux';

function Widget15(props) {
	const handleClick = (event) => {
		history.push(`/apps/taskMangement/${currentRange}`)
	}
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [currentRange, setCurrentRange] = useState(props.widget.currentRange);

	function handleChangeRange(ev) {
		if(ev.target.value==="Yesterday"){
			setCurrentRange("DY");
			history.push(`/apps/taskMangement/DY`)
		}
		else if (ev.target.value==="Tomorrow") {
			setCurrentRange("DTW");
			history.push(`/apps/taskMangement/DTW`)
		} 
		else if (ev.target.value==="Third Quarter") {
			setCurrentRange("DTQ");
			history.push(`/apps/taskMangement/DTQ`)
		} 
		else if (ev.target.value==="Today") {
			setCurrentRange("DT");
			history.push(`/apps/taskMangement/DT`)
		} 
		else if (ev.target.value==="Second Quarter") {
			setCurrentRange("DSQ");
			history.push(`/apps/taskMangement/DSQ`)
		} 
		else if (ev.target.value==="Last Thirty") {
			setCurrentRange("DLT");
			history.push(`/apps/taskMangement/DLT`)
		} 
		else if (ev.target.value==="Last Seven") {
			setCurrentRange("DLS");
			history.push(`/apps/taskMangement/DLS`)
		} 
		else if (ev.target.value==="Fourth Quarter") {
			setCurrentRange("DFOQ");
			history.push(`/apps/taskMangement/DFOQ`)
		} 
		else if (ev.target.value==="First Quarter") {
			setCurrentRange("DFIQ");
			history.push(`/apps/taskMangement/DFIQ`)
		} 
	}
	return (
		<Paper className="w-full rounded-8 shadow-1">
			<div className="flex items-center justify-between px-4 pt-4">
				{
					props.widget && props.widget.ranges && <Select
						className="px-12"
						native
						//  value={currentRange}
						onChange={handleChangeRange}
						inputProps={{
							name: 'currentRange'
						}}
						disableUnderline
					>
						{Object.keys(props.widget.ranges).map((key, n) => {
							return (
							
								<option key={props.widget.ranges[key]} value={props.widget.ranges[key]}>
									{props.widget.ranges[key]}
									
								</option>
							);
						})}
					</Select>}
					
				<PermissionSwitch permission="pre_schedule_status" />
				<IconButton aria-label="more">
					<Icon>more_vert</Icon>
				</IconButton>
			</div>
			 <div className="text-center pt-12 pb-28">
			 {
			 props.widget && props.widget.ranges&& <Typography className="text-72 leading-none text-blue">

					{props.widget.data.count[currentRange]} </Typography>
}
				{ props.widget && props.widget.ranges&& <Typography className="text-16" color="textSecondary" onClick={ev => {
					handleClick(props);
				}}>
					{props.widget.data.label}
				</Typography> }
			</div>
		

		</Paper>
	);
}

export default React.memo(Widget15);

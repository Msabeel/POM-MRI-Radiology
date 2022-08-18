import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import history from '@history';
import {useDispatch} from 'react-redux';

function Widget18(props) {
	
function handleClick () {
		history.push('/apps/dashboards/widget15')
	}
	    const dispatch = useDispatch();
		const [open, setOpen] = useState(false);
	// const [currentRange, setCurrentRange] = useState(props.widget.currentRange);
	// function handleChangeRange(ev) {
	// 	setCurrentRange(ev.target.value);
	// }
	return (
		<Paper className="w-full rounded-8 shadow-1">
			< div className="flex items-center justify-between px-4 pt-4">
			{ /*	<Select
					className="px-12"
					native
					//  value={10}
					// onChange={handleChangeRange}
					// inputProps={{
					// 	name: 'currentRange'
					// }}
					disableUnderline
				>
					{Object.entries(props.widget.ranges).map(([key, n]) => {
						return (
							<option key={key} value={key}>
								{n}
							</option>
						);
					})}
				</Select>*/}
				<PermissionSwitch permission="pre_schedule_status"/>
				<IconButton aria-label="more">
					<Icon>more_vert</Icon>
				</IconButton>
			</div>
			<div className="text-center pt-12 pb-28">
				<Typography className="text-72 leading-none text-blue">
					{/* {props.widget.data.count[currentRange]} */}
				0</Typography>
				<Typography className="text-16" color="textSecondary">
				test	{/*  {props.widget.data.label}  */}
				</Typography>
			</div>
			<div className="flex items-center px-16 h-52 border-t-1">
				<Typography className="text-15 flex w-full" color="textSecondary">
					<span className="truncate items-center" onClick={() => {
				setOpen(true)
			}}>{props.widget.data.extra.label}</span>
				</Typography>
			</div>
		</Paper>
	);
}

export default React.memo(Widget18);

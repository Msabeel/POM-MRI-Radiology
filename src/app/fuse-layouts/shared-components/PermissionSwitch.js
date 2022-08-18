import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Switch from '@material-ui/core/Switch';
import { updateSinglePermission } from './quickPanel/store/dataSlice';

const PurpleSwitch = withStyles({
	switchBase: {
	  '&$checked': {
		color: green[500],
	  },
	  '&$checked + $track': {
		backgroundColor: green[500],
	  },
	},
	checked: {},
	track: {},
  })(Switch);

function PermissionSwitch(props) {
	let { usertype } = useParams();
	const dispatch = useDispatch();
	const quickPanel = useSelector(({ quickPanel }) => quickPanel.data);
	const [checkedSwitch, setcheckedSwitch] = useState(false);
	let permission = false;
	if(!usertype)
		usertype = window.localStorage.getItem('usertype');
	
	useEffect(() => {
		 if(props.permission && quickPanel.permissionData) {
			permission = quickPanel.permissionData.userTypeHasPermission.some(r => props.permission.indexOf(r.permission_name) >= 0);
			setcheckedSwitch(permission);
		}
	}, [props, quickPanel.permissionData]);
	
	async function handleChange(event) {
		const checked = event.target.checked;
		setcheckedSwitch(checked);
		const permissionFilterd = quickPanel.permissionData.allPermission.find(r => r.permission_name == props.permission);
		if(permissionFilterd) {
			const contact = {
				permission_id: permissionFilterd.id,
				active: checked ? 1 : 0,
				usertype: parseInt(usertype)
			};
			const result = await dispatch(updateSinglePermission(contact));
			if(result.payload.isUpdateSuccess) {
				permission = checked;
			}
		}
	  }

	return (
		usertype ? 
			<div>
			{props.label}
			<PurpleSwitch
				checked={checkedSwitch}
				onChange={handleChange}
				name="checkedA"
				inputProps={{ 'aria-label': 'secondary checkbox' }}
			/></div>: null
	);
}

export default PermissionSwitch;

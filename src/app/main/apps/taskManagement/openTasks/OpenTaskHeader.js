import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


function OpenTaskManagementHeader(props) {

	const dispatch = useDispatch();
	const mainTheme = useSelector(selectMainTheme);
	const [open, setOpen] = useState(false);
	const [openError, setOpenError] = useState(false);

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-512">
				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">home</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-16 hidden sm:flex" >
                          Open Task Management
						</Typography>
					</FuseAnimate>
				</div>
			</div>
		</div>
	);
}

export default OpenTaskManagementHeader;

import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import Button from '@material-ui/core/Button';
import { Link, useParams, useLocation } from 'react-router-dom';

function FormBuilderHeader(props) {
	const dispatch = useDispatch();
	const mainTheme = useSelector(selectMainTheme);
	const [open, setOpen] = React.useState(false);
	const [openError, setOpenError] = React.useState(false);
	const { id } = useParams();
	
	const handleClose = (event, reason) => {
		setOpen(false);
	};
	const handleCloseError = (event, reason) => {
		setOpenError(false);
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="p-12 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
				<div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
				<Hidden lgUp>
					<IconButton
						onClick={ev => {
							props.pageLayout.current.toggleLeftSidebar();
						}}
						aria-label="open left sidebar"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>

					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">account_box</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography  variant="h6" className="mx-16 hidden sm:flex" >
							Form Builder
						</Typography>
					</FuseAnimate>
				</div>
				{id >=0 &&(
				<div className="flex items-center justify-end">
					<Button to={`/apps/formBuilder/all/`} component={Link} className="mx-8 normal-case" variant="contained" color="secondary" aria-label="Follow">
						Back
					</Button>
				</div>)}
			</div>

		</div>
	);
}

export default FormBuilderHeader;

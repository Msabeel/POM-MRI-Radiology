import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openConfirmDialog, openEditRoleDialog } from './store/contactsSlice';
import ContactsTable from './ContactsTable';
import { getPermissions } from './store/contactsSlice';
import history from '@history';
import { useParams } from 'react-router-dom';

function PermissionsList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const user = useSelector(({ rolesApp }) => rolesApp.user);
    
    const contacts = useSelector(({ rolesApp }) => rolesApp.contacts);
	const [isSearchingState, setIsSearching] = useState(false);
	const [openRoleAdded, setOpenRoleAdded] = React.useState(false);
    const [openRoleAddedError, setOpenRoleAddedError] = React.useState(false);
	const [openRoleDeleted, setOpenRoleDeleted] = React.useState(false);
    const [openRoleDeletedError, setOpenRoleDeletedError] = React.useState(false);
	const [openRoleUpdated, setOpenRoleUpdated] = React.useState(false);
    const [openRoleUpdatedError, setOpenRoleUpdatedError] = React.useState(false);

    const onViewClick = event => {
		console.log(event)
		history.push(`/apps/roles/${event.original.id}`)
	};
    
	const onDeleteClick = event => {
		console.log(event)
		dispatch(openConfirmDialog({ usertype: event.original.id }));	
	};

	const columns = React.useMemo(
		() => [
			
			{
				Header: 'Permission Name',
				accessor: 'permission_name',
				className: 'font-bold',
				sortable: true
			},
		
			
			{
				id: 'action',
                Header: 'Action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								onViewClick(row);
							}}
						>
							<Icon>edit</Icon>
						</IconButton>
						<IconButton
							onClick={ev => { 
								ev.stopPropagation();
                            	onDeleteClick(row);
                            }}
						>
							<Icon>delete</Icon>
						</IconButton>
					</div>
				)
			}
		],
		[dispatch, user.starred]
	);

	useEffect(() => {
		async function fetchRoles() {
			setIsSearching(true);
			await dispatch(getPermissions({ id: 1 }));
			setIsSearching(false);
		}
		fetchRoles();
	}, [dispatch]);

	if (isSearchingState || !contacts.permissionlist.allPermission) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}

	if (contacts.permissionlist.allPermission.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no premissions in this system!
				</Typography>
			</div>
		);
	}

	return (
		<div>
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<ContactsTable
					columns={columns}
					data={contacts.permissionlist.allPermission}
					onRowClick={(ev, row) => {
						if (row) {
							dispatch(openEditRoleDialog(row.original));
						}
					}}
				/>
			</FuseAnimate>
			{/* <Snackbar open={openRoleUpdated} autoHideDuration={6000} onClose={handleCloseRoleUpdated}>
				<Alert onClose={handleCloseRoleUpdated} severity="success">
					Role name updated successfully.
				</Alert>
			</Snackbar>
			<Snackbar open={openRoleUpdatedError} autoHideDuration={6000} onClose={handleCloseRoleUpdatedError}>
				<Alert onClose={handleCloseRoleUpdatedError} severity="error">
					Something went wrong while updating Role name.
				</Alert>
			</Snackbar>
			<Snackbar open={openRoleDeleted} autoHideDuration={6000} onClose={handleCloseRoleDeleted}>
				<Alert onClose={handleCloseRoleDeleted} severity="success">
					Role name deleted successfully.
				</Alert>
			</Snackbar>
			<Snackbar open={openRoleDeletedError} autoHideDuration={6000} onClose={handleCloseRoleDeletedError}>
				<Alert onClose={handleCloseRoleDeletedError} severity="error">
					Something went wrong while deleting Role name.
				</Alert>
			</Snackbar>
			<Snackbar open={openRoleAdded} autoHideDuration={6000} onClose={handleCloseRoleAdded}>
				<Alert onClose={handleCloseRoleAdded} severity="success">
					Role name added successfully.
				</Alert>
			</Snackbar>
			<Snackbar open={openRoleAddedError} autoHideDuration={6000} onClose={handleCloseRoleAddedError}>
				<Alert onClose={handleCloseRoleAddedError} severity="error">
					Something went wrong while adding Role name.
				</Alert>
			</Snackbar> */}
		</div>
	);
}

export default PermissionsList;

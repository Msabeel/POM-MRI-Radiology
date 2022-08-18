import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openConfirmDialog, openEditRoleDialog } from './store/contactsSlice';
import ContactsTable from './ContactsTable';
import { getContacts } from './store/contactsSlice';
import history from '@history';
import { useParams } from 'react-router-dom';
import WindowOpener from "./WindowOpener";

function ContactsList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	//const contacts = useSelector(getContacts);
	const searchText = useSelector(({ rolesApp }) => rolesApp.contacts.searchText);
	const user = useSelector(({ rolesApp }) => rolesApp.user);
    const isRoleDeleted = useSelector(({ rolesApp }) => rolesApp.contacts.isRoleDeleted);
    const isRoleDeletedError = useSelector(({ rolesApp }) => rolesApp.contacts.isRoleDeletedError);
    const isRoleUpdated = useSelector(({ rolesApp }) => rolesApp.contacts.isRoleUpdated);
    const isRoleUpdatedError = useSelector(({ rolesApp }) => rolesApp.contacts.isRoleUpdatedError);

    const contacts = useSelector(({ rolesApp }) => rolesApp.contacts);
	const [isSearchingState, setIsSearching] = useState(false);
	const [filteredData, setFilteredData] = useState(null);
    const [openRoleAdded, setOpenRoleAdded] = React.useState(false);
    const [openRoleAddedError, setOpenRoleAddedError] = React.useState(false);
	const [openRoleDeleted, setOpenRoleDeleted] = React.useState(false);
    const [openRoleDeletedError, setOpenRoleDeletedError] = React.useState(false);
	const [openRoleUpdated, setOpenRoleUpdated] = React.useState(false);
    const [openRoleUpdatedError, setOpenRoleUpdatedError] = React.useState(false);

	async function fetchRoles() {
		setIsSearching(true);
		await dispatch(getContacts(routeParams));
		setIsSearching(false);
	}
	
	useEffect(() => {
		if(contacts.isRoleDeleted) {
			setOpenRoleDeleted(true);
			fetchRoles();
		}
	}, [contacts.isRoleDeleted]);
	useEffect(() => {
		if(contacts.isRoleDeletedError) {
			setOpenRoleDeletedError(true);
		}
	}, [contacts.isRoleDeletedError]);
	useEffect(() => {
		if(contacts.isRoleUpdated) {
			setOpenRoleUpdated(true);
			fetchRoles();
		}
	}, [contacts.isRoleUpdated]);
	useEffect(() => {
		if(contacts.isRoleUpdatedError) {
			setOpenRoleUpdatedError(true);
		}
	}, [contacts.isRoleUpdatedError]);
	useEffect(() => {
		if(contacts.isRoleAdded) {
			setOpenRoleAdded(true);
			fetchRoles();
		}
	}, [contacts.isRoleAdded]);
	useEffect(() => {
		if(contacts.isRoleAddedError) {
			setOpenRoleAddedError(true);
		}
	}, [contacts.isRoleAddedError]);

	const handleCloseRoleDeleted = (event, reason) => {
		setOpenRoleDeleted(false);
	};
  
	const handleCloseRoleDeletedError = (event, reason) => {
		setOpenRoleDeletedError(false);
	};

	const handleCloseRoleUpdated = (event, reason) => {
		setOpenRoleUpdated(false);
	};
  
	const handleCloseRoleUpdatedError = (event, reason) => {
		setOpenRoleUpdatedError(false);
	};

	const handleCloseRoleAdded = (event, reason) => {
		setOpenRoleAdded(false);
	};
  
	const handleCloseRoleAddedError = (event, reason) => {
		setOpenRoleAddedError(false);
	};

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
				Header: 'Role Name',
				accessor: 'name',
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
						{/* <WindowOpener 
							name="Cool popup" 
							children="remove_red_eye" 
							opts={`dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, alwaysRaised=${1}, width=${500}, height=${500}`}
							url={`http://localhost:3000/apps/dashboards/project/${row.original.id}`}
							bridge={sonResponse}
						/> */}
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
			await dispatch(getContacts());
			setIsSearching(false);
		}
		fetchRoles();
	}, [dispatch]);

	const sonResponse = (err, res) => {
        localStorage.setItem('usertype', '');
    }

	if (isSearchingState || !contacts.getContacts) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}

	if (contacts.getContacts.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no roles in this system!
				</Typography>
			</div>
		);
	}

	return (
		<div>
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<ContactsTable
					columns={columns}
					data={contacts.getContacts}
					onRowClick={(ev, row) => {
						if (row) {
							dispatch(openEditRoleDialog(row.original));
						}
					}}
				/>
			</FuseAnimate>
			<Snackbar open={openRoleUpdated} autoHideDuration={6000} onClose={handleCloseRoleUpdated}>
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
			</Snackbar>
		</div>
	);
}

export default ContactsList;

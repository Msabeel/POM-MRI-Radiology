import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	// removeContact,
	updateUserType,
	addUserType,
	closeNewRoleDialog,
	closeEditRoleDialog
} from './store/contactsSlice';

const defaultFormState = {
	id: '',
	name: '',
	lastName: '',
	avatar: 'assets/images/avatars/profile.jpg',
	nickname: '',
	company: '',
	jobTitle: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',
	notes: ''
};

function ContactDialog(props) {
	const dispatch = useDispatch();
	const roleDialog = useSelector(({ rolesApp }) => rolesApp.contacts.roleDialog);
	const [loading, setLoading] = useState(false);
	const [userTypes, setUserTypes] = useState([]);
	const { form, handleChange, setForm } = useForm(defaultFormState);
	const contacts = useSelector(({ rolesApp }) => rolesApp.contacts);
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (roleDialog.type === 'edit' && roleDialog.data) {
			setForm({ ...roleDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (roleDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...roleDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [roleDialog.data, roleDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (roleDialog.props.open) {
			initDialog();
		}
	}, [roleDialog.props.open, initDialog]);


	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (contacts.getContacts) {
			setUserTypes(contacts.getContacts);
		}
	}, [contacts.getContacts]);

	function closeComposeDialog() {
		return roleDialog.type === 'edit' ? dispatch(closeEditRoleDialog()) : dispatch(closeNewRoleDialog());
	}

	function canBeSubmitted() {
		return form.name.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (roleDialog.type === 'new') {
			setLoading(true);
			await dispatch(addUserType({ name: form.name, copyusertype: form.userType }));
			setLoading(false);
		} else {
			setLoading(true);
			await dispatch(updateUserType({ ...form, usertype: form.type }));
			setLoading(false);
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...roleDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{roleDialog.type === 'new' ? 'New Role' : 'Edit Role'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					{roleDialog.type === 'new' && (
					<div className="flex mb-24">
						<div className="w-96 pt-20">
							<InputLabel>Copy Role From</InputLabel>
						</div>
						<Select
							id="userType"
							name="userType"
							// label="Copy Role From"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleChange}
							value={form.userType}
							>
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							{userTypes && userTypes.map(item =>
								<MenuItem  value={item.id}>{item.name}</MenuItem >
							)}
						</Select>
					</div>)}
					<div className="flex">
						<div className="w-96 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>

						<TextField
							className="mb-24"
							label="Name"
							autoFocus
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

				</DialogContent>

				{roleDialog.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
								disabled={!canBeSubmitted() || loading}
							>
								Add
								{loading && <CircularProgress className="ml-10" size={18}/>}
							</Button>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
								disabled={!canBeSubmitted() || loading}
							>
								Save
								{loading && <CircularProgress className="ml-10" size={18}/>}
							</Button>
						</div>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default ContactDialog;

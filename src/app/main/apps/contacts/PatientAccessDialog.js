import Checkbox from '@material-ui/core/Checkbox';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {
	closeEditPatientAccessDialog,
	sendPatientAccessMail
} from './store/contactsSlice';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';

const defaultFormState = {
	id: 0,
	fname: '',
	lname: '',
	mname: '',
	nickname: '',
	company: '',
	jobTitle: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',
	notes: ''
};

function PatientAccessDialog(props) {
	const dispatch = useDispatch();
	const patientAccessDialog = useSelector(({ contactsApp }) => contactsApp.contacts.patientAccessDialog);
	const isPatientAccessMailSent = useSelector(({ contactsApp }) => contactsApp.contacts.patientAccessDialog.isPatientAccessMailSent);
	const { form, handleChange, setForm } = useForm(defaultFormState);
    const formRef = useRef(null);
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [resetPassword, handleActionCheckBox] = useState(null);

	useEffect(() => {
		setOpenPatientAccessMailSent(isPatientAccessMailSent)
	}, [isPatientAccessMailSent]);

	const handleClosePatientAccessMailSent = (event, reason) => {
		setOpenPatientAccessMailSent(false);
	};

    const initDialog = useCallback(async () => {
		if (patientAccessDialog.data) { // && form.id === 0) {
			// await dispatch(getPatientById({"id": 250330}));
			setForm({ ...patientAccessDialog.data });
		}
	}, [patientAccessDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (patientAccessDialog.props.open) {
			initDialog();
		}
	}, [patientAccessDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeEditPatientAccessDialog());
	}

	function canBeSubmitted() {
		return form.emailAction || form.faxAction || form.printAction;
	}

	function handleSubmit(event) {
		event.preventDefault();
		const actionType = [];
		if(form.emailAction){
			actionType.push('Email');
		} 
		if(form.faxAction){
			actionType.push('Fax');
		} 
		if(form.printAction){
			actionType.push('PrintPage');
		}
		dispatch(sendPatientAccessMail({ id: form.id, actionType }));
		closeComposeDialog();
	}
	function handleAction(event) {
		const name = event.target.name;
		const str = event.target.checked;
		setForm({ 
			...form,
			[name]: str
		});
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...patientAccessDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Patient Access
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				// className="flex flex-col justify-center"
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<Typography variant="subtitle1" className="mb-16">
						Please select at least one option.
					</Typography>
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<Checkbox
							className="p-0 mr-10"
							checked={form.faxAction}
							tabIndex={-1}
							name="faxAction"
							onChange={handleAction}
							label="Fax"
						/>
						Fax
					</div>
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<Checkbox
							className="p-0 mr-10"
							checked={form.emailAction}
							tabIndex={0}
							name="emailAction"
							onChange={handleAction}
						/>
						Email
					</div>
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<Checkbox
							className="p-0 mr-10"
							checked={form.printAction}
							tabIndex={1}
							name="printAction"
							onChange={handleAction}
						/>
						Print Page
					</div>
					
				</DialogContent>	
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
								disabled={!canBeSubmitted()}
								// disabled={!isFormValid}
							>
								Submit
							</Button>
						</div>
					</DialogActions>
			</Formsy>

			<SnackBarAlert snackOpen={openPatientAccessMailSent} onClose={handleClosePatientAccessMailSent} text="Patient portal access mail sent successfully." />

		</Dialog>
	);
}

export default PatientAccessDialog;

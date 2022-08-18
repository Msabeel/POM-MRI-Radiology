import {
    CheckboxFormsy,
    FuseChipSelectFormsy,
    RadioGroupFormsy,
    SelectFormsy,
    SelectSearchFormsy,
    TextFieldFormsy
} from '@fuse/core/formsy';
import Checkbox from '@material-ui/core/Checkbox';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import FormHelperText from '@material-ui/core/FormHelperText';
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
} from './store/ProfileSlice';
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

const errorColor = {
    color: 'red',
}

function PatientAccessDialog(props) {
	const dispatch = useDispatch();
	const patientAccessDialog = useSelector(({ profilePageApp }) => profilePageApp.profile.patientAccessDialog);
	const isPatientAccessMailSent = useSelector(({ profilePageApp }) => profilePageApp.profile.patientAccessDialog.isPatientAccessMailSent);
	const { form, handleChange, setForm } = useForm(defaultFormState);
    const formRef = useRef(null);
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);
	const [faxNos, setFaxNos] = useState(['']);
	const [emailIds, setEmailIds] = useState(['']);
	const [faxerrorMessage, setfaxerrorMessage] = useState(false);
	const [emailerrorMessage, setemailerrorMessage] = useState(false);

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
		const requsetFaxNos = [], requsetEmailIds = [];
		let isFaxError = false, isEmailError = false;
		for(var i=0; i< faxNos.length; i++){
			if(faxNos[i].length > 0){
				requsetFaxNos.push(faxNos[i]);
			}
		}
		for(var i=0; i< emailIds.length; i++){
			if(emailIds[i].length > 0){
				requsetEmailIds.push(emailIds[i]);
			}
		}
		if(form.faxAction && requsetFaxNos.length === 0){
			isFaxError = true;
		}
		setfaxerrorMessage(isFaxError);
		
		if(form.emailAction && requsetEmailIds.length === 0){
			isEmailError = true;
		}
		setemailerrorMessage(isEmailError);
		
		if(isFaxError || isEmailError){
			return;
		}
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
		dispatch(sendPatientAccessMail({ id: form.id, actionType, emailIds: requsetEmailIds, faxNos: requsetFaxNos }));
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
	
	function handleAddFax() {
		setFaxNos([ ...faxNos, '' ]);
	}

	const handleRemoveFax = (index) => {
		faxNos.splice(index, 1)
		setFaxNos([ ...faxNos ]);
	}

	const handleFaxChange = (event, index) => {
		const value = event.target.value;
		faxNos[index] = value;
	}

	function handleAddEmail() {
		setEmailIds([ ...emailIds, '' ]);
	}

	const handleRemoveEmail = (index) => {
		emailIds.splice(index, 1)
		setEmailIds([ ...emailIds ]);
	}

	const handleEmailChange = (event, index) => {
		const value = event.target.value;
		emailIds[index] = value;
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
						<div className="w-1/4">
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
						<div className="flex flex-col w-3/4">
							{faxNos.map((faxNo,i) =>
								<div className="flex items-center justify-center">
									<div className="w-3/4  mr-8">
										<TextFieldFormsy
											className="mb-12"
											type="text"
											name="FaxNo"
											id="FaxNo"
											value={faxNo}
											onChange={(e) => handleFaxChange(e, i)}
											label="Fax No"
											required
											autoFocus
											variant="outlined"
											fullWidth
										/>
									</div>
									<div className="w-1/4">
										{i < 2 && (
										<IconButton className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0 mr-8" color="inherit" onClick={handleAddFax}>
											<Icon>add_circle</Icon>
										</IconButton>)}
										{i > 0 && (
										<IconButton className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={() => handleRemoveFax(i)}>
											<Icon>remove_circle</Icon>
										</IconButton>)}
									</div>
								</div> 
							)}
						</div>
					</div>
					{Boolean(faxerrorMessage) && <FormHelperText style={errorColor}>Please enter fax number</FormHelperText>}
					<div className="flex">
						<div className="w-1/4">
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
						<div className="flex flex-col w-3/4">
							{emailIds.map((email,i) =>
								<div className="flex items-center justify-center">
									<div className="w-3/4  mr-8">
										<TextFieldFormsy
											className="mb-12"
											type="text"
											name="Email"
											id="Email"
											value={email}
											onChange={(e) => handleEmailChange(e, i)}
											label="Email"
											required
											variant="outlined"
											fullWidth
										/>
									</div>
									<div className="w-1/4">
										{i < 2 && (
										<IconButton className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0 mr-8" color="inherit" onClick={handleAddEmail}>
											<Icon>add_circle</Icon>
										</IconButton>)}
										{i > 0 && (
										<IconButton className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={() => handleRemoveEmail(i)}>
											<Icon>remove_circle</Icon>
										</IconButton>)}
									</div>
								</div> 
							)}
						</div>
					</div>
					{Boolean(emailerrorMessage) && <FormHelperText style={errorColor}>Please enter email</FormHelperText>}
					<div className="flex">
						<div className="w-1/2">
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

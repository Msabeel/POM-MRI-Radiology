import {
    TextFieldFormsy
} from '@fuse/core/formsy';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import  { useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {
	closeEditPatientAccessDialog,
	sendPatientAccessMail
} from './quickPanel/store/dataSlice';
import { useLocation } from 'react-router-dom';

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
	const quickPanel = useSelector(({ quickPanel }) => quickPanel.data);
	// const patientAccessDialog = useSelector(({ projectDashboardApp }) => projectDashboardApp.projects.patientAccessDialog);
	const { form, handleChange, setForm } = useForm(defaultFormState);
    const formRef = useRef(null);
	const [faxNos, setFaxNos] = useState(['']);
	const [emailIds, setEmailIds] = useState(['']);
	const [faxerrorMessage, setfaxerrorMessage] = useState(false);
	const [emailerrorMessage, setemailerrorMessage] = useState(false);
	const [patientAccessDialog, setPatientAccessDialog] = useState({});
	const [request_for, setrequest_for] = useState('patient');
	const [loading, setLoading] = useState(false);
	const { accessid } = useParams()
	const location = useLocation();
	const { pathname } = location;
	const [isDisabledBackDrop, setisDisabledBackDrop] = useState(false);

    const initDialog = useCallback(async () => {
		if (quickPanel && quickPanel.patientAccessDialog) { 
			setForm({ ...quickPanel.patientAccessDialog.data });
		}
	}, [quickPanel, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (quickPanel && quickPanel.patientAccessDialog) {
			setPatientAccessDialog(quickPanel.patientAccessDialog);
			initDialog();
			setFaxNos(['']);
			setEmailIds(['']);
			setfaxerrorMessage(false);
			setemailerrorMessage(false);
		}
	}, [quickPanel, initDialog]);

	useEffect(() => {
		if(pathname && pathname.indexOf('patientaccess')>=0) {
			setisDisabledBackDrop(true);
		}
	}, [pathname]);
	
	function closeComposeDialog() {
		dispatch(closeEditPatientAccessDialog());
	}

	function canBeSubmitted() {
		return form.emailAction || form.faxAction || form.printAction;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
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
		await dispatch(sendPatientAccessMail({ id: form.id, actionType, emailIds: requsetEmailIds, faxNos: requsetFaxNos, request_for }));
		setLoading(false);
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

	function handleRequestFor(event) {
		const value = event.target.value;
		setrequest_for(value);
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
				paper: 'm-24 rounded-8',
				container: accessid ? 'bg-white' : '',
				scrollPaper: 'flex justify-center items-baseline'
			}}
			{...patientAccessDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
			disableBackdropClick={isDisabledBackDrop}
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
				autoComplete="off"
				// className="flex flex-col justify-center"
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<Typography variant="subtitle1" className="mb-16">
						Please select at least one option.
					</Typography>
					<div className="flex mb-12">
						<div className="w-1/4 pt-10">
							Access To
						</div>
						<div className="flex flex-col w-3/4">
							<RadioGroup className="flex-row" aria-label="request_for" name="request_for" value={request_for} onChange={handleRequestFor}>
								<FormControlLabel value="patient" control={<Radio />} label="Patient" />
								<FormControlLabel value="other" control={<Radio />} label="Other Provider" />
							</RadioGroup>
						</div>
					</div>
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
								<div key={Math.random()} className="flex items-center justify-center">
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
								<div key={Math.random()} className="flex items-center justify-center">
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
								disabled={!canBeSubmitted() || loading}
								// disabled={!isFormValid}
							>
								Submit
								{loading && <CircularProgress className="ml-10" size={18}/>}
							</Button>
						</div>
					</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default PatientAccessDialog;

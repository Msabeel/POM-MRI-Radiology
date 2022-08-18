import {
    CheckboxFormsy,
    FuseChipSelectFormsy,
    RadioGroupFormsy,
    SelectFormsy,
	SelectSearchFormsy,
    TextFieldFormsy
} from '@fuse/core/formsy';
import moment from 'moment';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Select from '@material-ui/core/Select';
import { CircularProgress } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {withStyles} from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';

import CircularStatic from 'app/fuse-layouts/shared-components/loader';

import {
	removeContact,
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog,
	resetPatientPassword,
	sendPatientAccessMail,
	openPatientAccessDialog,
	openPatientAccessPrintPage
} from './store/contactsSlice';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';

const defaultFormState = {
	id: 0,
	patient_id: '',
	chart_no: '',
	fname: '',
	lname: '',
	mname: '',
	dob: '',
	gender: '',
	weight: '',
	ssn: '',
	avatar: 'assets/images/avatars/profile.jpg',
	company: '',
	jobTitle: '',
	email: '',
	mobile:'',
	phone: '',
	address1: '',
	address2: '',
	phone_home: '',
	phone_alt: '',
	notes: '',
	zip: '',
	maritial_status: '',
	city: '',
	cityName:'',
	state: '',
	stateName: '',
	country: '',
	countryName: '',
	allergies: '',
	preferred_language: '',
	preferred_contact_mode: '',
	patient_notes: '',
};

const StyledGroupButton = withStyles({
	root: {
		// padding: '10px 10px',
		width: '100%',
	},
})(ToggleButtonGroup);

const StyledToggleButton = withStyles({
	root: {
		lineHeight: '20px',
		letterSpacing: '0.25px',
		color: 'rgba(0, 0, 0, 0.87)',
		padding: '15px 15px',
		textTransform: 'none',
		width: '100%',
		'&$selected': {
			backgroundColor: 'rgb(76, 175, 80)',
			fontWeight: 'bold',
			color: 'black',
			'&:hover': {
				backgroundColor: 'rgb(76, 175, 80)',
			},
		},
	},
	

	selected: {},
})(ToggleButton);
const useStyle = makeStyles(theme => ({
	addpass:{
		float: 'left',
		width: '100%',
		'& .flex': {
			float: 'left',
		    width: '33.33%',
			justifyContent:'center'
		},
	},
	impor:{
		'& label': {
			color: '#ff0000'
		},
	
	},
	colorgreen:{
		'& label': {
			color: 'green'
		}
	}
	
}));
function ContactDialog(props) {
	const classes = useStyle();
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	// const addPatient = useSelector(({ contactsApp }) => contactsApp.contacts.addPatient);
	
	const { form, handleChange, setForm } = useForm(defaultFormState);
	const resetPasswordData = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog.resetPasswordData);
	const patientAccessResponse = useSelector(({ contactsApp }) => contactsApp.contacts.contactDialog.patientAccessResponse);
	const [resetPassword, setResetPassword] = useState(null);
	const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);
	const [loading, setLoading] = useState(false);


	const customeNotify = useCustomNotify();

	// Steps variable
	const [activeStep, setActiveStep] = React.useState(0);

	const steps = [
		'Demographics',
		'Address',
		
	  ];


	// Steps variable




	useEffect(() => {
		if(patientAccessResponse) {
			if(patientAccessResponse.maildata && patientAccessResponse.maildata.length > 0)
				setOpenPatientAccessMailSent(true);
			if(patientAccessResponse.PrintPage && patientAccessResponse.PrintPage.length > 0)
				dispatch(openPatientAccessPrintPage(patientAccessResponse.PrintPage));
		}
	}, [patientAccessResponse]);

	const handleClosePatientAccessMailSent = (event, reason) => {
		setOpenPatientAccessMailSent(false);
	};

	const onPatientAccessClick = event => {
		dispatch(openPatientAccessDialog(form));
	};

    function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
    }
	const initDialog = useCallback(async () => {


		/**
		 * Dialog type: 'edit'
		 */
		if (contactDialog.type === 'edit' && contactDialog.data) { // && form.id === 0) {
			// await dispatch(getPatientById({"id": 250330}));
			setForm({ ...contactDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (contactDialog.type === 'new') {
			let formData = {};
			if (searchText.fields.length && searchText.fields.length > 0) {
				let arr = searchText.fields;
				arr.map((value, key) => {
					switch (value.filedname) {
						case 'fname':
							formData.fname = value.value;
							break;
						case 'lname':
							formData.lname = value.value;
							break;
						case 'email':
							formData.email = value.value;
							break;
						case 'mobile':
							formData.mobile = value.value;
							break;
						case 'dob':
							formData.dob = value.value;
							break;
						case 'patient_id':
							formData.patient_id = value.value;
							break;
						case 'access_no':
							formData.access_no = value.value;
							break;
						default:
							break;
					}
					
				})
			}
			setForm({
				...form,
				...formData
			});
		}
	}, [contactDialog.data, contactDialog.type, searchText, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (contactDialog.props.open) {
			initDialog();
		}
	}, [contactDialog.props.open, initDialog]);

	useEffect(() => {
		setResetPassword(resetPasswordData)
	}, [resetPasswordData]);

	function closeComposeDialog() {
		return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
	}
	function gotoNextStep(){
		
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	}
	function gotoPrevStep(){
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}

	function canBeSubmitted() {
		if (contactDialog.type === 'new') {
			return (isFormValid)
		} else {
			return (form.id > 0 && isFormValid)
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			setLoading(true)
			const contact = {
				...form,
				email: form.email != '' ? form.email:'NOEMAIL@EMAIL.COM',
			}
			let result = await dispatch(addContact(contact));
			
			if(result.isCreateError){
				setActiveStep(0)
				customeNotify(result.payload.data, 'error')
			}
			else{
				customeNotify(result.payload.data, 'success')
				setActiveStep(0)
				closeComposeDialog();
				
			}
			setLoading(false);
			
			
			
			
			
		} else {
			const contact = {
				id: form.id,
				patient_id: form.patient_id,
				fname: form.fname,
				lname: form.lname,
				mname: form.mname,
				email: form.email != '' ? form.email:'NOEMAIL@EMAIL.COM',
				ssn: form.ssn,
				dob: form.dob,
				gender: form.gender,
				weight: form.weight,
				maritial_status: form.maritial_status,
				address1: form.address1,
				address2: form.address2,
				city: form.city,
				state: form.state,
				country: form.country,
				zip: form.zip,
				mobile: form.mobile,
				phone_home: form.phone_home,
				phone_alt: form.phone_alt,
				allergies: form.allergies,
				preferred_language: form.preferred_language,
				preferred_contact_mode: form.preferred_contact_mode,
				chart_no: form.chart_no,
				patient_notes: form.patient_notes
			};

			dispatch(updateContact(contact));
			closeComposeDialog();
		}
		
	}

	function handleRemove() {
		dispatch(removeContact(form.id));
		closeComposeDialog();
	}

	function handleCityChange(event, sel) {
		if(sel && sel.id > 0) {
			const cityObj = contactDialog.allCity.filter(item => item.name == sel.name);
			setForm({ 
				...form,
				city: sel.id,
				cityName: sel.name,
				state: sel.state_id,
				stateName: sel.state_name,
				country: sel.country_id,
				countryName: sel.country_name,
				
			});

		}
	}

	function handleResetPassword(event) {
		dispatch(resetPatientPassword(form.patient_id));
	}

	async function handlePatientAccess() {
		// setLoading(true);
		// await dispatch(sendPatientAccessMail(form.id));
		// setLoading(false);
		dispatch(openPatientAccessDialog(form));
	}

	function handlePreferredLanguage(event, newValue) {
		setForm({ 
			...form, 
			preferred_language: newValue
		});
	}
	function handleMarriedStatus(event, newValue) {
		setForm({ 
			...form,
			maritial_status: newValue
		});
	}
	function handlePreferredContactMode(event, newValue) {
		setForm({ 
			...form,
			preferred_contact_mode: newValue
		});
	}
	function handleGender(event, newValue) {
		setForm({ 
			...form,
			gender: newValue
		});
	}
	function handleEmploymentChange(event, newValue) {
		setForm({ 
			...form, 
			employment: newValue
		});
	}

	function handlePhoneChange(event) {
		const name = event.target.name;
		const str = event.target.value;
		//Filter only numbers from the input
		let cleaned = ('' + str).replace(/\D/g, '');
		
		//Check if the input is of correct length
		let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
	  
		if (match) {
			setForm({ 
				...form, 
				[name]: '(' + match[1] + ')' + match[2] + '-' + match[3]
			});
		};
		return null
	};
	function handleSsnChange(event){
		const name = event.target.name;
		const str = event.target.value;
		//Filter only numbers from the input
		let cleaned = ('' + str).replace(/\D/g, '');
		
		//Check if the input is of correct length
		let match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
	  
		if (match) {
			setForm({ 
				...form, 
				[name]: match[1] +'-' + match[2] + '-' + match[3]
			});
		};
		return null
	};
	

	useEffect(()=>{
		setForm({...defaultFormState});
	}, [])

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...contactDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>

			{(loading) ?
					
						<div style={{
							
							height:'100%',
							width:'100%',
							position: 'absolute',
							top:'50%',
							left:'50%',
							paddingTop:'35%',
							transform:'translate(-50%,-50%)',
							background:'white',
							zIndex:'999'
						
						}}>
							<CircularStatic color="inherit"/>
						</div>
					: null
			}		
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{contactDialog.type === 'new' ? 'New Patient' : 'Edit Patient'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-cclassNameenter justify-center pb-24">
					{/* <Avatar className="w-96 h-96" alt="contact avatar" src={form.avatar} />
					{contactDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{form.name}
						</Typography>
					)} */}
				</div>
			</AppBar>

			
			<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
			</Stepper>
  
			<Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					{ contactDialog.type === 'edit' ? 
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<TextField
							className="mb-24"
							label="Patient ID"
							id="patient_id"
							name="patient_id"
							value={form.patient_id}
							variant="outlined"
							disabled
							fullWidth
						/>
					</div>: null}
					{ (activeStep==0) ? 
					 <div className={ classes.addpass }> 
					<div className="flex">
						
						<TextFieldFormsy
							
							type="text"
							name="lname"
							id="lname"
							value={form.lname||''}
							onChange={handleChange}
							label="Last Name"
							variant="outlined"
							className={ form.lname=='' ?  classes.impor+ " my-16" : classes.colorgreen+" my-16"}
							required
							requiredError='Field is required.'
						/>
					</div>

					<div className="flex">
						
						<TextFieldFormsy
							
							type="text"
							name="fname"
							id="fname"
							value={form.fname}
							onChange={handleChange}
							label="First Name"
							variant="outlined"
							className={ form.fname=='' ?  classes.impor+ " my-16" : classes.colorgreen+" my-16"}
							required
							requiredError='Field is required.'
						/>
					</div> 


					<div className="flex">
						
						<TextField
							className="my-16"
							label="Middle name"
							id="mname"
							name="mname"
							value={form.mname}
							onChange={handleChange}
							variant="outlined"
							
						/>
					</div>

					</div> : null }

				{	contactDialog.type === 'new' ? null : 
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<div className="px-16 mb-24">
							<Button
								variant="contained"
								color="primary"
								type="button"
								onClick={handleResetPassword}
							>
								Reset Password
							</Button>
						</div>
						<div className="px-16 mb-24">
							<Button
								variant="contained"
								color="primary"
								type="button"
								onClick={handlePatientAccess}
							>
								Patient Access
							</Button>
						</div>
					</div>
				}

					{resetPassword && 
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<div className="px-16 mb-24">
							Your password reset successfully.<br />
							New password is - {resetPassword} 
						</div>
					</div>}

					{ (activeStep==0) ? 
					<div className={ classes.addpass }>
					<div className="flex">
						
						<TextFieldFormsy
							className="my-16 "
							type="text"
							name="email"
							label="Email"
							value={form.email}
							onChange={handleChange}
							validations={{
								isEmail: "This is not a valid email"
							}}
							
							variant="outlined"
						/>
					</div>
					<div className="flex">
						
						<TextFieldFormsy
							
							id="dob"
							name="dob"
							label="Date Of Birth"
							type="date"
							style={{width: '66% !important'}}
							value={moment(form.dob).format("YYYY-MM-DD")}
							onChange={handleChange}
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							className={ form.dob=='' ?  classes.impor+ " my-16" : classes.colorgreen+" my-16"}
							required
							requiredError="Field is required."
						/>
					</div>
					<div className="flex">
						
						<TextFieldFormsy
							className="my-16"
							label="Social Security Number"
							id="ssn"
							name="ssn"
							value={form.ssn}
							onChange={handleSsnChange}
							variant="outlined"
							
							validations={{
								//minLength: 9,
								//maxLength: 9,
								matchRegexp: /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/
							}}
							validationErrors={{
								//isNumeric: 'Must be a Digit',
								matchRegexp: 'Please enter valid ssn number',
							//	minLength: "Length is 9 Digits",
							//	maxLength: "Length is 9 Digits",
							}}
						/>
					</div>

					 </div> : null }
					
					{ (activeStep==0) ? 
					<div className={ classes.addpass }>
					<div className="flex">
						
						
						<StyledGroupButton
							value={form.gender}
							className="my-16"
							style={{width: '66%'}}
							id="gender"
							name="gender"
							exclusive
							onChange={handleGender}
							aria-label="text alignment"
							
						>
							<StyledToggleButton value="M" aria-label="left aligned">
								Male
							</StyledToggleButton>
							<StyledToggleButton value="F" aria-label="centered">
								Female
							</StyledToggleButton>
						</StyledGroupButton>

					</div>

					<div className="flex">
						
						<TextFieldFormsy
							
							type="text"
							name="mobile"
							id="mobile"
							value={form.mobile}
							onChange={handlePhoneChange}
							label="Mobile"
							variant="outlined"
							className={ form.mobile=='' ?  classes.impor+ " my-16" : classes.colorgreen+" my-16"}
							required
							requiredError='Field is required'
							validations={{
								matchRegexp: /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/,
							}}
							validationErrors={{
								matchRegexp: 'Please enter valid mobile number',
							}}
						/>
					</div>

					
					
					<div className="flex">
						
						
						<StyledGroupButton
							value={form.maritial_status}
							className="my-16"
							style={{width: '66%'}}
							id="maritial_status"
							name="maritial_status"
							exclusive
							onChange={handleMarriedStatus}
							aria-label="text alignment"
						>
							<StyledToggleButton value="single" aria-label="left aligned">
								Single
							</StyledToggleButton>
							<StyledToggleButton value="married" aria-label="centered">
								Married
							</StyledToggleButton>
						</StyledGroupButton>
					</div> </div> : null }

					{ (activeStep==0) ? 
					<div style={{ textAlign: 'center' }}>
						<Button
								variant="contained"
								color="primary"
								onClick={gotoNextStep}
								type="button"
								className="mt-32"
								
							>
								Next
							</Button>
						</div>
					:null }

					{ (activeStep==1) ? 
					<div className={ classes.addpass }>
					<div className="flex">
						
						<TextField
							className={ form.address1=='' ?  classes.impor+ " my-16" : classes.colorgreen+" my-16"}
							label="Address1"
							id="address1"
							name="address1"
							value={form.address1}
							onChange={handleChange}
							variant="outlined"
							required
							requiredError='Address1 is required'
							
						/>
					</div>
					<div className="flex">
						
						<TextField
							className="my-16"
							label="Address2"
							id="address2"
							name="address2"
							value={form.address2}
							onChange={handleChange}
							variant="outlined"
							
						/>
					</div>
					<div className="flex">
						<SelectSearchFormsy
							name="city"
							className={ form.cityName=='' ?  classes.impor+ " my-16" : classes.colorgreen+" my-16"}
							label="Select City"
							variant="outlined"
							style={{width: '88%',}}
							onChange={handleCityChange}
							value={form.cityName}
							allCity={contactDialog.allCity}
							required
							requiredError='Field is required'
						/>
					</div> </div> : null }

					{ (activeStep==1) ?
					<div className={ classes.addpass }>
					<div className="flex">
						
						<TextField
							className="my-16 "							
							label="State"
							id="state"
							name="state"
							disabled
							value={form.stateName}
							onChange={handleChange}
							variant="outlined"
							
						/>
					</div>
					<div className="flex">
						
						<TextFieldFormsy
						    className={ form.zip=='' ?  classes.impor+ " my-16" : classes.colorgreen+" my-16"}
							label="Zip"
							id="zip"
							name="zip"
							value={form.zip}
							onChange={handleChange}
							variant="outlined"
							
							validations={{
								isNumeric: true,
								isLength: 5,
							}}
							validationErrors={{
								isNumeric: 'Invalid input value',
								isLength: 'Length is 5',
							}}
							required
						/>
					</div>
					<div className="flex">
						
						<TextField
							className="my-16"
							label="Country"
							id="country"
							name="country"
							disabled
							value={form.countryName}
							onChange={handleChange}
							variant="outlined"
							
						/>
					</div>
					 </div> : null }

					{ (activeStep==1) ? 
					<div className={ classes.addpass }>					
					<div className="flex">
				
						<TextField
							className="my-16"
							label="Patient Notes"
							id="patient_notes"
							name="patient_notes"
							value={form.patient_notes}
							onChange={handleChange}
							variant="outlined"
							
							
							
						/>
					</div> 
					<div className="flex">
						
						<TextField
							className="my-16"
							label="Allergies"
							id="allergies"
							name="allergies"
							value={form.allergies}
							onChange={handleChange}
							variant="outlined"
							
						/>
					</div>
					<div className="flex">
						
						<TextFieldFormsy
							className="my-16"
							label="Weight"
							id="weight"
							name="weight"
							value={form.weight}
							onChange={handleChange}
							variant="outlined"
							
						/>
					</div> </div> : null }
					
					
					{form.employment === 'Employed' ? 
					<div>
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<TextField
							className="mb-24"
							label="Company Name"
							id="company_name"
							name="company_name"
							value={form.company_name}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<TextField
							className="mb-24"
							label="Address"
							id="company_address"
							name="company_address"
							value={form.company_address}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex">
						<div className="min-w-68 pt-20" />
						<TextField
							className="mb-24"
							label="Phone"
							id="company_phone"
							name="company_phone"
							value={form.company_phone}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div> </div>: null }
					{ (activeStep==1) ?
					<div  className={classes.addpass}>
					<div className="flex">
						{/* <div className="" style={{width: '66%'}}>
							Preferred Language
						</div> */}
						<br/>
						<StyledGroupButton
							value={form.preferred_language}
							className="my-16"
							style={{width: '66%'}}
							id="preferred_language"
							name="preferred_language"
							exclusive
							onChange={handlePreferredLanguage}
							aria-label="text alignment"
						>
							<StyledToggleButton value="English" aria-label="left aligned">
								English
							</StyledToggleButton>
							<StyledToggleButton value="Spanish" aria-label="centered">
								Spanish
							</StyledToggleButton>
							<StyledToggleButton value="French" aria-label="centered">
								French
							</StyledToggleButton>
						</StyledGroupButton>
					</div>

					<div className="flex">
						{/* <div className="" style={{width: '66%'}} >
							Preferred Contact Mode
						</div> */}
						
						<StyledGroupButton
							value={form.preferred_contact_mode}
							className="my-16"
							style={{width: '66%'}}
							id="preferred_contact_mode"
							name="preferred_contact_mode"
							exclusive
							onChange={handlePreferredContactMode}
							aria-label="text alignment"
						>
							<StyledToggleButton value="Text" aria-label="left aligned">
								Text
							</StyledToggleButton>
							<StyledToggleButton value="Email" aria-label="centered">
								Email
							</StyledToggleButton>
							<StyledToggleButton value="Call" aria-label="centered">
								Call
							</StyledToggleButton>
						</StyledGroupButton>
					</div>
					<div className="flex">
						
						<TextField
							className="my-16"
							label="Billing Code"
							id="chart_no"
							name="chart_no"
							value={form.chart_no}
							onChange={handleChange}
							variant="outlined"
							
						/>
					</div> </div> : null}
					{ (activeStep==1) ? 
					<div style={{ textAlign: 'center' }}>
						<Button
								variant="contained"
								color="primary"
								onClick={gotoPrevStep}
								type="button"
								className="mt-32"
								
							>
								Back
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
								className="mt-32 mx-12"
								disabled={!canBeSubmitted()}
							>
								 Add Patient
							</Button>
						</div>
					:null }
				</DialogContent>

				{contactDialog.type === 'new' ? ( null
					// <DialogActions className="justify-between p-8">
					// 	<div className="px-16">
					// 		<Button
					// 			variant="contained"
					// 			color="primary"
					// 			onClick={handleSubmit}
					// 			type="submit"
					// 			disabled={!canBeSubmitted()}
					// 		>
					// 			Add
					// 		</Button>
					// 	</div>
					// </DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
								disabled={!isFormValid}
							>
								Save
							</Button>
						</div>
						{/* <IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton> */}
					</DialogActions>
				)}
			</Formsy>

			<SnackBarAlert snackOpen={openPatientAccessMailSent} onClose={handleClosePatientAccessMailSent} text="Patient portal access mail sent successfully." />

		</Dialog>
	);
}

export default ContactDialog;

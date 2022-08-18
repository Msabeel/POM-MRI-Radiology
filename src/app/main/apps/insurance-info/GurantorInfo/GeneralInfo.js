import {
	SelectFormsy,
    TextFieldFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import MenuItem from '@material-ui/core/MenuItem';
import {
	closeGIGeneralInfoDialog,
	updateNavigationBlocked,
	openGIContactInfoDialog
} from '../store/InsuranceInfoSlice';

const StyledToggleButton = withStyles({
	root: {
	  lineHeight: '12px',
	  letterSpacing: '0.25px',
	  color: 'rgba(0, 0, 0, 0.87)',
	  padding: '15px 15px',
	  textTransform: 'none',
	  borderColor: 'black',
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
  
  const StyledGroupButton = withStyles({
	root: {
	  padding: '2px 30px',
	  width: '100%',
	},
  })(ToggleButtonGroup);

function GeneralInfo(props) {
	const dispatch = useDispatch();
	const { insuranceData } = props;
	const giGeneralInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.giGeneralInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (giGeneralInfoDialog.data) {
			setForm({ ...giGeneralInfoDialog.data });
		}
	}, [giGeneralInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (giGeneralInfoDialog.props.open) {
			initDialog();
		}
	}, [giGeneralInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeGIGeneralInfoDialog(form));
	}
	
	function handleGender(event, newValue) {
		setForm({ 
			...form,
			gender_p: newValue
		});
	}
	function handleSubmit(event) {
		event.preventDefault();
		closeComposeDialog();
	}

	function handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		form[name] = value;
		setForm({ ...form });
		dispatch(updateNavigationBlocked(true));
	}

	function handleGChange(event) {
		const name = 'gurantor_p';
		const value = event.target.value;
		form[name] = value;
		// setForm({ ...form });
		fillupSelfData(value);
		dispatch(updateNavigationBlocked(true));
	}

	function fillupSelfData(gurantor_p) {
		let formData = {};
		if(gurantor_p === 'Self') {
			formData = {
				...form,
				gurantor_p,
				fname_p: insuranceData.patientdata.fname,
				lname_p: insuranceData.patientdata.lname,
				mname_p: insuranceData.patientdata.mname,
				dob_p: insuranceData.patientdata.dob,
				gender_p: insuranceData.patientdata.gender === 'F' ? 'female': insuranceData.patientdata.gender === 'M' ? 'male' : '',
				ssn_p: insuranceData.patientdata.ssn,
				address1_p: insuranceData.patientdata.address1,
				address2_p: insuranceData.patientdata.address2,
				city_p: insuranceData.patientdata.city,
				city_name: insuranceData.patientdata.city_name,
				state_p: insuranceData.patientdata.state,
				state_name: insuranceData.patientdata.state_name,
				country_p: insuranceData.patientdata.country,
				country_name: insuranceData.patientdata.country_name,
				zip_p: insuranceData.patientdata.zip,
				phone_p: insuranceData.patientdata.phone_home,
				mobile_p: insuranceData.patientdata.mobile,
				email_p: insuranceData.patientdata.email,
			}
		}
		else {
			formData = {
				...form,
				gurantor_p,
				fname_p: '',
				lname_p: '',
				mname_p: '',
				dob_p: '',
				gender_p: '',
				ssn_p: '',
				address1_p: '',
				address2_p: '',
				city_p: '',
				city_name: '',
				state_p: '',
				state_name: '',
				country_p: '',
				country_name: '',
				zip_p: '',
				phone_p: '',
				mobile_p: '',
				email_p: '',
			}
		}
		setForm(formData);
	}

	function handleSubmitNext(event) {
		event.preventDefault();
		closeComposeDialog();
		dispatch(openGIContactInfoDialog(form));
	}
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...giGeneralInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Gurantor Information {'>'} General Information
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex mb-24">
						<SelectFormsy
							name="gurantor_p"
							id="gurantor_p"
							label="Gurantor"
							variant="outlined"
							style={{ width: '100%' }}
							onChange={handleGChange}
							value={form.gurantor_p}
						>
						<MenuItem value=""></MenuItem>
						<MenuItem value="Self">Self</MenuItem>
						<MenuItem value="Spouse">Spouse</MenuItem>
						<MenuItem value="Guardian">Guardian</MenuItem>
						<MenuItem value="Other">Other</MenuItem>
						</SelectFormsy>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="fname_p"
							id="fname_p"
							value={form.fname_p}
							onChange={handleChange}
							label="First Name"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="mname_p"
							id="mname_p"
							value={form.mname_p}
							onChange={handleChange}
							label="Middle Name"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="lname_p"
							id="lname_p"
							value={form.lname_p}
							onChange={handleChange}
							label="Last Name"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							id="dob_p"
							name="dob_p"
							label="Date of Birth"
							type="date"
							value={moment(form.dob_p).format("YYYY-MM-DD")}
							onChange={handleChange}
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							fullWidth
						/>
					</div>
					
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Gender</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.gender_p}
								id="gender_p"
								name="gender_p"
								exclusive
								onChange={handleGender}
								aria-label="gender_p"
								>
								<StyledToggleButton value="male" aria-label="left aligned">
									Male
								</StyledToggleButton>
								<StyledToggleButton value="female" aria-label="centered">
									Female
								</StyledToggleButton>
							</StyledGroupButton>
						</div>
					</div>
				</DialogContent>	
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								className="mr-8"
								type="submit"
								onClick={handleSubmit}
							>
								Close
							</Button>
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmitNext}
							>
								Next
							</Button>
						</div>
					</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default GeneralInfo;

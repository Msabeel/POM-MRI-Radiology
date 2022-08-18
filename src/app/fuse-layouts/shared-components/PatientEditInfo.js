import {
	SelectSearchFormsy,
	TextFieldFormsy
} from '@fuse/core/formsy';
import FuseUtils from '@fuse/utils';
import TextField from '@material-ui/core/TextField';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import React, { useCallback, useEffect, useRef, useState, useDeepCompareEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import { updatePatient } from './quickPanel/store/dataSlice';
import { Permissions } from 'app/config';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';
import { useLocation, Prompt } from 'react-router-dom';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
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

const StyledSnackbar = withStyles({
	root: {
		// position: 'absolute',
		top: 210
	},
})(Snackbar);
const StyledGroupButton = withStyles({
	root: {
		padding: '15px 15px',
		width: '100%',
	},
})(ToggleButtonGroup);

function PatientEditInfo(props) {
	const dispatch = useDispatch();
	const { form, handleChange, setForm } = useForm({});
	const { tab } = useParams()
	const [isFormValid, setIsFormValid] = useState(false);
	const formRef = useRef(null);
	const CustomNotify = useCustomNotify();
	const [snack, setSnack] = React.useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});
	const { vertical, horizontal, open } = snack;
	const [openError, setOpenError] = React.useState(false);
	const [isGeneralInfoEdit, setGeneralInfoEdit] = React.useState(false);
	const [isContactEdit, setContactEdit] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [resetPassword, setResetPassword] = useState(null);
	const [resetPasswordData, setResetPasswordData] = useState(null);
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);
	const data = useSelector(({ quickPanel }) => quickPanel.data);
	const [value, setValue] = React.useState(null);
	const [allCity, setAllCity] = React.useState([]);
	// const CityList = useSelector(({ profilePageApp }) => profilePageApp.profile.allCity);
	const location = useLocation();
	const { pathname } = location;


	useEffect(() => {
		if (props.patientInfo && Object.keys(props.patientInfo).length > 0) {
			setForm({ ...props.patientInfo });
		}
	}, [props.patientInfo]);

	useEffect(() => {
		if (props.patientInfo && Object.keys(props.patientInfo).length > 0) {
			if (props.allCity && props.allCity.length > 0) {
				const city = props.allCity.find(c=> c.id === props.patientInfo.city);
				setForm({ ...props.patientInfo, city_name: city.name, country_name: city.country_name, state_name: city.state_name });
			}
		}
	}, [props.patientInfo, props.allCity]);

	if (props.patientInfo == null) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularStatic />
			</div>
		);
	}

	if (Object.keys(props.patientInfo).length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					User Info not found!
				</Typography>
			</div>
		);
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleGender(event, newValue) {
		setForm({
			...form,
			gender: newValue
		});
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

	function handleGIEdit() {
		setGeneralInfoEdit(true);
	}

	function handleGIEditClose() {
		setGeneralInfoEdit(false);
	}

	function handleCIEditClose() {
		setContactEdit(false);
	}

	function handleCityChange(event, cityObj) {
		if (cityObj && cityObj.id > 0) {
			const statesList = allCity.filter(item => item.name == cityObj.name);
			setForm({
				...form,
				city: cityObj.id,
				city_name: cityObj.name,
				state: cityObj.state_id,
				state_name: cityObj.state_name,
				country: cityObj.country_id,
				country_name: cityObj.country_name,
			});
		}
		else {
			setForm({
				...form,
				city: null,
				city_name: null
			});
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		const contact = {
			id: form.id,
			patient_id: form.patient_id,
			fname: form.fname,
			lname: form.lname,
			mname: form.mname,
			email: form.email,
			ssn: form.ssn,
			dob: form.dob,
			gender: form.gender,
			weight: form.weight,
			Address1: form.Address1,
			address2: form.address2,
			city: form.city,
			state: form.state,
			country: form.country,
			zip: form.zip,
			mobile: form.mobile,
			phone_home: form.phone_home,
			phone_alt: form.phone_alt,
			preferred_language: form.preferred_language,
			preferred_contact_mode: form.preferred_contact_mode,
			chart_no: form.chart_no,
			patient_notes: form.patient_notes
		};
		const result = await dispatch(updatePatient(contact));
		setLoading(false);
		if (result.payload.isUpdateSuccess) {
			CustomNotify("Your Demograpic information has been confirmed.", "success");
			setGeneralInfoEdit(false);
		} else {
			CustomNotify("Something went wrong. Please try again.", "error");
		}
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

	// function handleEditInsuarance(event) {
	//     const acc_number = props.post.acc_number;
	// 	history.push(`/apps/insuranceInfo/${id}/${acc_number}/${name}`)
	// }
	return (
		<>
			<div className="flex flex-col w-full">
				<Formsy
					onValidSubmit={handleSubmit}
					onValid={enableButton}
					onInvalid={disableButton}
					ref={formRef}
					// className="flex flex-col justify-center"
					className="flex flex-col md:overflow-hidden"
				>
					<FuseAnimateGroup
						enter={{
							animation: 'transition.slideUpBigIn'
						}}
					>
						<Card className="w-full mb-16 rounded-8">
							<AppBar position="static" elevation={0}>
								<Toolbar className="px-8">
									<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
										Patient Information: {form.patient_id}
									</Typography>
									{/* {FuseUtils.hasButtonPermission(Permissions.update_patient_dateail) && */}
									<div className='p-8'>
										{!isGeneralInfoEdit &&
											<IconButton disableRipple className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={handleGIEdit}>
												<Icon>edit</Icon>
											</IconButton>}
										{isGeneralInfoEdit &&
											<IconButton disableRipple className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={handleGIEditClose}>
												<Icon>close</Icon>
											</IconButton>}
									</div>
									{/* } */}
								</Toolbar>
							</AppBar>
							{!isGeneralInfoEdit &&
								<CardContent>
									<div className="flex">
										<div className="w-1/2 mb-8">
											<Typography className="font-bold mb-4 text-15">Name</Typography>
											<Typography>{form.lname}, {form.fname}</Typography>
										</div>
										<div className="w-1/2 mb-8">
											<Typography className="font-bold mb-4 text-15">Gender</Typography>
											<Typography>{form.gender}</Typography>
										</div>
									</div>
									<div className="flex">
										<div className="w-1/2 mb-8">
											<Typography className="font-bold mb-4 text-15">Birthday</Typography>
											<Typography>{moment(form.dob).format("MM-DD-YYYY")}</Typography>
										</div>

										<div className="mb-8">
											<Typography className="font-bold mb-4 text-15">Tel.</Typography>
											<div className="flex items-center" key={form.mobile}>
												<Typography>{form.mobile}</Typography>
											</div>
											<div className="flex items-center" key={form.phone_home}>
												<Typography>{form.phone_home}</Typography>
											</div>
											<div className="flex items-center" key={form.phone_alt}>
												<Typography>{form.phone_alt}</Typography>
											</div>
										</div>

										{/* <div className="w-1/2 mb-8">
									<Typography className="font-bold mb-4 text-15">Weight</Typography>
									<Typography>{form.weight}</Typography>
								</div> */}
									</div>
									<div className="flex">
										<div className="w-1/2 mb-8">
											<Typography className="font-bold mb-4 text-15">SSN</Typography>
											<Typography>{form.ssn}</Typography>
										</div>
										{/* 
								<div className="mb-8">
									<Typography className="font-bold mb-4 text-15">Allergies</Typography>
									<Typography>{form.allergies}</Typography>
								</div> */}

										<div className="w-1/2 mb-8">
											<Typography className="font-bold mb-4 text-15">Weight</Typography>
											<Typography>{form.weight}</Typography>
										</div>
									</div>
									
									<div className="mb-8">
										<Typography className="font-bold mb-4 text-15">Emails</Typography>
										<div className="flex items-center" key={form.email}>
											<Typography>{form.email}</Typography>
										</div>
									</div>
									<div className="flex">
										<div className="w-1/2 mb-8">
											<Typography className="font-bold mb-4 text-15">Address</Typography>
											<Typography>{form.address1}</Typography>
											<Typography>{form.address2}</Typography>

										</div>

										<div className="w-1/2 mb-8">
											<Typography className="font-bold mb-4 text-15">Locations</Typography>
											<div className="flex items-center" key={form.country_name}>
												<Typography>{`${form.city_name}, ${form.state_name}, ${form.country_name}`}</Typography>
												<Icon className="text-16 mx-4" color="action">
													location_on
												</Icon>
											</div>
										</div>
									</div>
								</CardContent>}
							{isGeneralInfoEdit &&
								<CardContent>
									<div className="flex">
										<TextFieldFormsy
											className="mb-24 mr-16"
											type="text"
											name="lname"
											id="lname"
											value={form.lname}
											onChange={handleChange}
											label="Last Name"
											required
											autoFocus
											variant="outlined"
											fullWidth
										/>

										<TextFieldFormsy
											className="mb-24"
											type="text"
											name="fname"
											id="fname"
											value={form.fname}
											onChange={handleChange}
											label="First Name"
											required
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<TextField
											className="mb-24 mr-16"
											label="Middle name"
											id="mname"
											name="mname"
											value={form.mname}
											onChange={handleChange}
											variant="outlined"
											fullWidth
										/>

										<TextField
											className="mb-24"
											label="SSN"
											id="ssn"
											name="ssn"
											value={form.ssn}
											onChange={handleChange}
											variant="outlined"
											fullWidth
										/>
									</div>


									<div className="flex">
										<TextFieldFormsy
											className="mb-24 mr-16"
											id="dob"
											name="dob"
											label="Date Of Birth"
											type="date"
											value={moment(form.dob).format("YYYY-MM-DD")}
											onChange={handleChange}
											InputLabelProps={{
												shrink: true
											}}
											variant="outlined"
											fullWidth
											required
										/>

										<TextField
											className="mb-24"
											label="weight"
											id="weight"
											name="weight"
											value={form.weight}
											onChange={handleChange}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<TextFieldFormsy
											className="mb-24 mr-16"
											type="text"
											name="mobile"
											id="mobile"
											value={form.mobile}
											onChange={handlePhoneChange}
											label="Mobile"
											required
											variant="outlined"
											fullWidth
											validations={{
												matchRegexp: /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/,
											}}
											validationErrors={{
												matchRegexp: 'Please enter valid mobile number',
											}}
										/>

										<TextField
											className="mb-24"
											label="Phone(Home)"
											id="phone_home"
											name="phone_home"
											value={form.phone_home}
											onChange={handlePhoneChange}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<div className="min-w-68 pt-20" style={{ width: '10%' }}>
											Gender
										</div>
										<StyledGroupButton
											value={form.gender}
											className="mb-24"
											style={{ width: '40%' }}
											id="gender"
											name="gender"
											exclusive
											onChange={handleGender}
											aria-label="text alignment"
											required
										>
											<StyledToggleButton value="M" aria-label="left aligned">
												Male
											</StyledToggleButton>
											<StyledToggleButton value="F" aria-label="centered">
												Female
											</StyledToggleButton>
										</StyledGroupButton>

										<TextFieldFormsy
											className="mb-24 w-1/2"
											style={{ width: '50%' }}
											type="text"
											name="email"
											label="Email"
											value={form.email}
											onChange={handleChange}
											validations={{
												isEmail: true,
											}}
											validationErrors={{
												isEmail: "This is not a valid email"
											}}
											fullWidth
											variant="outlined"
										/>
									</div>

									<div className="flex">
										<TextField
											className="mb-24 mr-16"
											label="Address1"
											id="address1"
											name="address1"
											value={form.address1}
											onChange={handleChange}
											variant="outlined"
											fullWidth
										/>

										<TextField
											className="mb-24"
											label="Address2"
											id="address2"
											name="address2"
											value={form.address2}
											onChange={handleChange}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<SelectSearchFormsy
											name="city"
											className="mb-24 mr-16"
											label="Select City"
											style={{ width: '100%' }}
											onChange={handleCityChange}
											value={form.city_name || props.patientInfo.city_name}
											allCity={props.allCity}
											required
										/>

										<TextField
											className="mb-24"
											label="State"
											id="state"
											name="state"
											disabled
											value={form.state_name}
											onChange={handleChange}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<TextField
											className="mb-24 mr-16"
											label="Country"
											id="country"
											name="country"
											disabled
											value={form.country_name}
											onChange={handleChange}
											variant="outlined"
											fullWidth
										/>

										<TextFieldFormsy
											className="mb-24"
											label="Zip"
											id="zip"
											name="zip"
											value={form.zip}
											onChange={handleChange}
											variant="outlined"
											fullWidth
											validations={{
												minLength: 5,
											}}
											validationErrors={{
												minLength: 'Min character length is 5',
											}}
											required
										/>
									</div>

									<div className="flex">
										<div className="w-1/2 mb-24">
										</div>
										<div className="w-1/2 mb-24" style={{ float: 'right' }}>
											<Button
												variant="contained"
												className="mb-24 ml-8"
												style={{ float: 'right' }}
												color="primary"
												type="submit"
												onClick={handleSubmit}
												// disabled={!canBeSubmitted()}
												disabled={!isFormValid || loading}
											>
												Save
												{loading && <CircularProgress className="ml-10" size={18} />}
											</Button>
											{/* <Button
									className="mb-24 ml-8"
									style={{ float: 'right'}}
									variant="contained"
									color="primary"
									type="button"
									onClick={handlePatientAccess}
									// disabled={loading}
								>
									Patient Access
								</Button> */}
										</div>
									</div>
								</CardContent>}
						</Card>
					</FuseAnimateGroup>
					{/* <Button
							variant="contained"
							color="primary"
							type="submit"
							onClick={handleSubmit}
							// disabled={!canBeSubmitted()}
							disabled={!isFormValid || loading}
						>
							Save
							{loading && <CircularProgress className="ml-10" size={18}/>}
						</Button> */}
				</Formsy>
			</div>

			<div className="flex flex-col md:w-320">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					{/* <Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Family & friends
								</Typography>
								<Button className="normal-case" color="inherit" size="small">
									See 454 more
								</Button>
							</Toolbar>
						</AppBar>
						<CardContent className="flex flex-wrap p-8">
							{friends.map(friend => (
								<img
									key={friend.id}
									className="w-64 m-4 rounded-4 block"
									src={friend.avatar}
									alt={friend.name}
								/>
							))}
						</CardContent>
					</Card> */}

				</FuseAnimateGroup>

			</div>
		</>
	);
}

export default PatientEditInfo;

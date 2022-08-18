import React,{ useState, useEffect, useCallback , useRef} from 'react';
import { useDispatch } from 'react-redux';
import FuseUtils from '@fuse/utils';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { getInsurance } from './store/insuranceSlice';
import { getAllCity } from '../contacts/store/contactsSlice';
import Formsy from 'formsy-react';
import _ from '@lodash';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { TextFieldFormsy,SelectSearchFormsy } from '@fuse/core/formsy';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useForm } from '@fuse/hooks';
import reducer from './store';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { Permissions } from 'app/config';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Avatar from '@material-ui/core/Avatar';
import { Link, useParams } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import withReducer from 'app/store/withReducer';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';


const useStyles = makeStyles(theme => ({
	layoutHeader: {
		height: 200,
		minHeight: 200,
		[theme.breakpoints.down('md')]: {
			height: 240,
			minHeight: 240
		}
	}
}));

const defaultFormState = {
	id: '',
	code: '',
	name: '',
	address1: '',
	address2: '',
	city: '',
	state: '',
	phone: '',
	zip: '',
	fax: '',
	att_email: '',
	att_notes: '',
	password: '',
	username:'',
};

const AttorneyEdit = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const theme = useTheme();
	const formRef = useRef(null);
	const isUpdatePermission = FuseUtils.hasButtonPermission(Permissions.update_insurance);
	const [loading, setLoading] = useState(false);
	const [fetchingData, setScreenLoading] = useState(false);
	const {form, setForm} = useForm(defaultFormState);
	const [isFormValid, setIsFormValid] = useState(false);
	const [open, setOpen] = useState(false);
	const [openError, setOpenError] = useState(false);
	const [userData,setUserData] = useState(null);
	const { id } = useParams()
	const [allCity, setAllCity] = useState([]);
	const [isGeneralInfoEdit, setGeneralInfoEdit] = useState(false);
    
    const handleFields = (username,password) => {
		const dynamicClass = (username === null || password === null) ? 'mb-24': 'hidden-true'
		const userInfo = {attorneyUserName : username, attorneyPassword : password,dynamicClass}
		setUserData({...userInfo})
	}
	
	const initDialog = useCallback(async () => {
      	const row = [{ filedname: 'id', value: parseInt(id), operator: "", name: "id" }];
		const searchText = {fields: row}
		setScreenLoading(true)
		const result = await dispatch(getInsurance(searchText));
		const formData = result.payload?.data[0]
       	//const CityResult = await dispatch(getAllCity());
		//setAllCity(CityResult.payload.data);
		setForm({...formData});	
		//handleFields(formData.username,formData.password)
		setScreenLoading(false)
	}, [id,setForm]);

	useEffect(() => {
		initDialog();
	}, []);

    function handleGIEdit(){
		setGeneralInfoEdit(true);
	}
	
	function handleGIEditClose(){
		setGeneralInfoEdit(false);
	}

	const handleSubmit = async(event) => {
		event.preventDefault();
		setLoading(true);
		const requestData = {...form}
		if(userData.attorneyUserName || userData.attorneyPassword){
		    delete requestData.username;
			delete requestData.password;
		}
		/* Delete fields which are not availble for edit*/
		delete requestData.code;
		delete requestData.type;
		delete requestData.block;
		// const result = await dispatch(updateAttorney(requestData));
		// setLoading(false);
		// if(result.payload.isUpdateSuccess) {
		// 	setOpen(result.payload.isUpdateSuccess);
		// 	if(form.username || form.password){
		// 		handleFields(form.username,form.password)
		// 	}
		// }
		// else {
		// 	setOpenError(true);
		// }
	}

	function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
	}

    const handleValidation = (name,value) => {
		if(name === 'zip'){
			return value.length <= 20
		} 
		return true
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

	
	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		const isValid = handleValidation(name,value)
		if(isValid){
			form[name] = value;
		    setForm({ ...form });
		}		
	}

	const canBeSubmitted = () => {
		return form.id > 0;
	}

	const handleClose = (event, reason) => {
		setOpen(false);
	};
	const handleCloseError = (event, reason) => {
		setOpenError(false);
	};

	function handleCityChange(event, cityObj) {
		if(cityObj && cityObj.id > 0) {
			setForm({ 
				...form, 
				city: cityObj.name,
				state: cityObj.state_name,
			});
		}
		else {
			setForm({ 
				...form, 
				city: null			
			});
		}
	}

	if (fetchingData) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}
	return (
		<>
		<FusePageSimple
				classes={{
					header: classes.layoutHeader,
					toolbar: 'px-16 sm:px-24'
				}}
				header={
					<div className="flex flex-1 flex-col">
					<div className="">
						<div className="flex items-center justify-start">
							<IconButton to="/apps/insurance-lookup" component={Link}>
								<Icon>{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}</Icon>
							</IconButton>
							<Typography className="flex-1 text-20 mx-16">Back</Typography>
						</div>
					</div>
					<div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
						<div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
							<FuseAnimate animation="transition.expandIn" delay={300}>
								<Avatar className="w-96 h-96" src="assets/images/avatars/profile.jpg" />
							</FuseAnimate>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="md:mx-24" variant="h4" color="inherit">
									{form.name}
								</Typography>
							</FuseAnimate>
						</div>
					</div>	
				</div>
				}
				content={
					<div className="p-16 sm:p-24 md:flex max-w-2xl"> 
						<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
							<Formsy
									onValidSubmit={handleSubmit}
									onValid={enableButton}
									onInvalid={disableButton}
									ref={formRef}
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
														INSURANCE VIEW
														</Typography>
															<div className='p-8'>
																{!isGeneralInfoEdit && isUpdatePermission &&
																<IconButton disableRipple className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={handleGIEdit}>
																	<Icon>edit</Icon>
																</IconButton>}
																{isGeneralInfoEdit && 
																<IconButton disableRipple className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0" color="inherit" onClick={handleGIEditClose}>
																	<Icon>close</Icon>
																</IconButton>}
															</div>
												</Toolbar>
										</AppBar>
										<CardContent>
											{!isGeneralInfoEdit ? 
												<>
													<div className="flex">
														<div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">Attorney Name</Typography>
															<Typography>{form.name}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">Address 1</Typography>
															<Typography>{form.insurance_address1}</Typography>
														</div>
														<div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">Address 2</Typography>
															<Typography>{form.insurance_address2}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">City</Typography>
															<Typography>{form.insurance_city}</Typography>
														</div>
														<div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">State</Typography>
															<Typography>{form.insurance_state}</Typography>
														</div>
													</div>
													<div className="flex">
													<div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">Zip</Typography>
															<Typography>{form.insurance_zip}</Typography>
														</div>
														<div className="mb-8">
															<Typography className="font-bold mb-4 text-15">Phone</Typography>
															<Typography>{form.phone}</Typography>
														</div>
													</div>
													<div className="flex">
													<div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">Fax</Typography>
															<Typography>{form.fax}</Typography>
														</div>
														{/* <div className="mb-8">
															<Typography className="font-bold mb-4 text-15">Attorney Email</Typography>
															<Typography>{form.att_email}</Typography>
														</div> */}
													</div>
													<div className="flex">
													    <div className="w-1/2 mb-8">
															<Typography className="font-bold mb-4 text-15">Notes</Typography>
															<Typography>{form.att_notes}</Typography>
														</div>
														<div className="mb-8">
															<Typography className="font-bold mb-4 text-15">Code</Typography>
															<Typography>{form.code}</Typography>
														</div>
													</div>
												</> :
												<>
													<div className="flex">
     						                                <TextField
															className={"mr-16 " + userData.dynamicClass}
															label="UserName"
															id="username"
															name="username"
															value={form.username}
															onChange={handleChange}
															variant="outlined"
															fullWidth
														/>	
														<TextField
															className={userData.dynamicClass}
															label="Password"
															type='password'
															id="password"
															name="password"
															value={form.password}
															onChange={handleChange}
															variant="outlined"
															fullWidth
														/>
											        </div>
											        <div className="flex">
													    <TextField
															className="mb-24 mr-16"
															label="Name"
															id="name"
															name="name"
															value={form.name}
															onChange={handleChange}
															variant="outlined"
															fullWidth
														/>
														<TextField
															className="mb-24"
															label="Address1"
															id="address1"
															name="address1"
															value={form.address1}
															onChange={handleChange}
															variant="outlined"
															fullWidth
													    />	
											       </div>
										           <div className="flex">
														<TextField
															className="mb-24 mr-16"
															label="Address2"
															id="address2"
															name="address2"
															value={form.address2}
															onChange={handleChange}
															variant="outlined"
															fullWidth
														/>
														<SelectSearchFormsy
															name="city"
															className="mb-24"
															label="Select City"
															style={{ width: '100%' }}
															onChange={handleCityChange}
															value={form.city}
															allCity={allCity}
															required
														/>
										        	</div>
											        <div className="flex">		
														<TextField
															className="mb-24 mr-16"
															label="State"
															id="state"
															name="state"
															value={form.state}
															onChange={handleChange}
															variant="outlined"
															fullWidth
															disabled
														/>
														<TextField
															className="mb-24"
															label="Zip"
															id="zip"
															name="zip"
															value={form.zip}
															onChange={handleChange}
															variant="outlined"
															fullWidth
														/>
													</div>
													<div className="flex">
														<TextFieldFormsy
															className="mb-24 mr-16"
															label="Phone"
															id="phone"
															name="phone"
															value={form.phone}
															onChange={handlePhoneChange}
															variant="outlined"
															fullWidth
															validations={{
																matchRegexp: /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/,
															}}
															validationErrors={{
																matchRegexp: 'Please enter valid mobile number',
															}}
														/>
														<TextFieldFormsy
															className="mb-24"
															label="Fax"
															id="fax"
															name="fax"
															value={form.fax}
															onChange={handlePhoneChange}
															variant="outlined"
															fullWidth
															validations={{
																matchRegexp: /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/,
															}}
															validationErrors={{
																matchRegexp: 'Please enter valid mobile number',
															}}
														/>	
													</div>
													<div className="flex">	
														<TextField
															className="mb-24 mr-16"
															label="Email"
															id="att_notes"
															name="att_email"
															value={form.att_email}
															onChange={handleChange}
															variant="outlined"
															fullWidth
														/>
														<TextField
															className="mb-24"
															label="Notes"
															id="att_notes"
															name="att_notes"
															value={form.att_notes}
															onChange={handleChange}
															variant="outlined"
															fullWidth
														/>
													</div>
												    <div className="flex">
														<Button
															variant="contained"
															color="primary"
															type="submit"
															onClick={handleSubmit}
															className="mb-24 mr-16"
															disabled={!isFormValid || !canBeSubmitted() || loading}
														>
															Save
															{loading && <CircularProgress className="ml-10" size={18}/>}
														</Button>
											    	</div>
												</>
												}
											</CardContent>
											<SnackBarAlert snackOpen={open} onClose={handleClose} text="Attorney updated successfully." />	
											<SnackBarAlert snackOpen={openError} onClose={handleCloseError} text="Something went wrong. Please try again." error={true} />

								    </Card>
								</FuseAnimateGroup>
								
							</Formsy>
						</div>   
					   <div className="flex flex-col md:w-320"></div>			
				</div>
				}
			>
			</FusePageSimple>	
		</>			
	);
};

export default withReducer('attorneyApp', reducer)(AttorneyEdit);

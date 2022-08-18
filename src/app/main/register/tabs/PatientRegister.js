import { TextFieldFormsy } from '@fuse/core/formsy';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormHelperText } from '@material-ui/core';
import Formsy from 'formsy-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitRegister } from 'app/auth/store/registerSlice';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import StepLabel from "@material-ui/core/StepLabel";
import validate from '../RegisterValidation';



// function to get step 
function getSteps() {
	return ['Account info', 'Other Details', 'Finish'];
  }
  
  function getStepContent(step) {
	switch (step) {
	  case 0:
		return 'Step 1: Select campaign settings...';
	  case 1:
		return 'Step 2: What is an ad group anyways?';
	  case 2:
		return 'Step 3: This is the bit I really care about!';
	  default:
		return 'Unknown step';
	}
  }
  const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	review: {
		  display: 'flex',
		  padding: "2% 0",
		  flexDirection: 'row',
		  letterSpacing: '0px',
		  color: '#707070',
		  opacity: 1,
		  fontSize: '16px',
		  justifyContent: 'center',
		  paddingBottom:"9%"
	  },

ul:{
	listStyle: 'none',
	display: 'table'
  },
  
  li:{
	display:' table-row',
	lineHeight:'28px'
  },
  
  b:{
	display: 'table-cell',
	paddingRight: '3em'
  },
  backButton:{
	  marginRight:"8px",
	  marginRight: theme.spacing(1),
  }
	
}));
function PatientRegister(props) {
	
	const classes = useStyles();
	const dispatch = useDispatch();
	const registerForm = useSelector(({ auth }) => auth.register);
	const [acceptTermsConditions, setacceptTermsConditions]=useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	// const formRef = useRef(null);
	// const formRef1 = useRef(null);

	const [activeStep, setActiveStep] = React.useState(0);
	const [completed, setCompleted] = React.useState({});
	const steps = getSteps();
	const [state, setState] = useState({
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
		address:"",
		phone:"",
		pin:"",
		state:"",
	});
	const [errors, setErrors]=useState({}) // store error

	// useEffect(() => {
	// 	if (registerForm.error && (registerForm.error.username || registerForm.error.password || registerForm.error.email)) {
	// 		formRef.current.updateInputsWithError({
	// 			...registerForm.error
	// 		});
	// 		disableButton();
	// 	}
	// }, [registerForm.error]);

	// HANDLE CHANGE FORM INPUT VALUE
	const handleChange = () => (event) => {
	 setState({ ...state, [event.target.name]:(event.target.name=='password'||event.target.name=='passwordConfirm')? event.target.value.trim():event.target.value });// pervent to add empty space in password field
	 setErrors({...errors, [event.target.name]:""})
    };
	
	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}
	// toggle accept and terms condition
	const acceptTC=()=>{
		setacceptTermsConditions(!acceptTermsConditions);
		setErrors({...errors, tc:""})
	}

	function handleSubmit(model) {
		setErrors(validate(state));
	dispatch(submitRegister(model));
	}

  
	const totalSteps = () => {
	  return steps.length;
	};
  
	const completedSteps = () => {
	  return Object.keys(completed).length;
	};
  
	const isLastStep = () => {
	  return activeStep === totalSteps() - 1;
	};
  
	const allStepsCompleted = () => {
	  return completedSteps() === totalSteps();
	};
  
	const handleNext = () => {
	   state.tc=acceptTermsConditions// passing terms and condition value to validate 
	  let error= validate(state, activeStep);
	   setErrors(error)
	  if(Object.keys(error).length>0){
       return
	   }
	   props.sendData(state, activeStep);// pass data to parent component
	  const newActiveStep =
		isLastStep() && !allStepsCompleted()
		  ? // It's the last step, but not all steps have been completed,
			// find the first step that has been completed
			steps.findIndex((step, i) => !(i in completed))
		  : activeStep + 1;
	  setActiveStep(newActiveStep);
	

	};
  
	const handleBack = () => {
	  setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
  
	const handleStep = (step) => () => {
	  setActiveStep(step);
	};
  
	const handleComplete = () => {
	  const newCompleted = completed;
	  newCompleted[activeStep] = true;
	  setCompleted(newCompleted);
	  handleNext();
	};
  


	const forms =[
		<>
		<form
				// onValidSubmit={handleSubmit}
				// onValid={enableButton}
				// onInvalid={disableButton}
				// ref={formRef}
				className="flex flex-col justify-center w-full"
			>
				<TextField
					className="mb-16"
					type="text"
					name="name"
					value={state.name}
					onChange={handleChange()}
					label= "Name"
					helperText={errors.name}
					error={errors.name}
				
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									person
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextField
					className="mb-16"
					type="text"
					name="email"
					label="Email"
					// validations="isEmail"
					value={state.email}
					onChange={handleChange()}
					helperText={errors.email}
					error={errors.email}
					// validationErrors={{
					// 	isEmail: 'Please enter a valid email'
					// }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									email
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextField
					className="mb-16"
					type="password"
					name="password"
					label="Password"
					value={state.password}
					onChange={handleChange()}
					helperText={errors.password}
					error={errors.password}
				
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextField
					className="mb-16"
					type="password"
					name="passwordConfirm"
					label="Password (Confirm)"
					value={state.passwordConfirm}
					onChange={handleChange()}
					helperText={errors.passwordConfirm}
					error={errors.passwordConfirm}
									InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>
				
				
			</form>
			</>,
			<>
			<form
				
				className="flex flex-col justify-center w-full"
			>
				<TextField
					className="mb-16"
					type="text"
					name="address"
					label= "Address"
					value={state.address}
					onChange={handleChange()}
					helperText={errors.address}
					error={errors.address}
				
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									home
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextField
					className="mb-16"
					type="text"
					name="state"
					label="State"
					helperText={errors.state}
					error={errors.state}
					value={state.state}
					onChange={handleChange()}
					
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									email
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextField
					className="mb-16"
					type="text"
					name="phone"
					label="phone"
					value={state.phone}
					helperText={errors.phone}
					error={errors.phone}
					onChange={handleChange()}
					// validations={{
					// 	minLength: 10
					// }}
					// validationErrors={{
					// 	minLength: 'Min character length is 10'

					// }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextField
					className="mb-16"
					type="pin"
					name="pin"
					label="PIN"
					value={state.pin}
					onChange={handleChange()}
					helperText={errors.pin}
					error={errors.pin}
					// validations="isEmail"
					// validationErrors={{
					// 	isEmail: 'Please enter PIN'
					// }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>
				
				<FormControl className="items-center">
					<FormControlLabel 
						classes={{ label: 'text-13 font-600' }}
						control={
							<Checkbox
								name="acceptTermsConditions"
								checked={acceptTermsConditions}
								onChange={acceptTC}
							/>
						}
						label="I read and accept terms and conditions"
					/>
				</FormControl>
				{errors.tc&&<FormHelperText style={{color:"red"}} >{errors.tc}</FormHelperText>}

			</form>
			</>,
			<>
			<div style={{textAlign:"center"}} className={classes.review}>
					<ul className={classes.ul}>
						<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Name</b>: {state.name}</li>
						<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Email</b>: {state.email}</li>
						<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Address</b>: {state.address}</li>
						<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Phone</b>: {state.phone}</li>
						<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>State</b>: {state.state}</li>
						<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>PIN</b>: {state.pin}</li>

					</ul>
				</div>
				</>

	]

	return (
		<div className="w-full">

           <Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
			{activeStep === steps.length ? (
          <div>
          
          </div>
        ) : (
          <div>
			  {forms[activeStep]}
            <div style={{textAlign:"center"}}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
				className={classes.backButton}
				variant="contained"
              >
                BACK
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'SUBMIT' : 'NEXT'}
              </Button>
            </div>
          </div>
        )}
			
		</div>
	);
}

export default PatientRegister;

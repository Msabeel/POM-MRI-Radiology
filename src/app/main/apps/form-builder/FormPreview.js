import Formsy from 'formsy-react';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import _ from '@lodash';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '@fuse/hooks';
import { useParams, Prompt } from 'react-router-dom';
import { Alert, } from '@material-ui/lab';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
	selectedButton: {
		backgroundColor: 'rgb(76, 175, 80)',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80)',
		  },
	},
}));

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

  const NavigationBlocker = (props) => {
	if (props.navigationBlocked) {
	  window.onbeforeunload = () => true
	} else {
	  window.onbeforeunload = null
	}
	return (
	  <Prompt
		when={props.navigationBlocked}
		message="Your data is unsaved. Are you sure you want to leave? "
	  />
	)
  }

function FormPreview(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { prevId } = useParams()
	const routeParams = useParams();
	const formRef = useRef(null);
	const { form, handleChange, setForm } = useForm({});
	const forms = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.forms);
	const [qcounter, setQCounter] = useState(0);
	const [loading, setLoading] = useState(false);
	const [isOpen, setOpen] = useState(false)
	const [isFormValid, setIsFormValid] = useState(false);
	const [openError, setOpenError] = React.useState(false);
	const [paperWorkData, setpaperWorkData] = useState([]);

	useEffect(() => {
		if(forms && forms.length > 0) {
			setpaperWorkData(forms[0]);
		}
    }, [forms]);

	function handleNext(event) {
		const _counter = qcounter + 1;
		setQCounter(_counter);
	}

	function handleBack(event) {
		const _counter = qcounter - 1;
		setQCounter(_counter);
	}

	function handleSelected(event, name) {
		const val = form[name] == "Yes" ? "No" : "Yes";
		if(name == "self_pay1" && val === "Yes") {
			form.primary_insurance = 'No';
			form.auto_accident1 = 'No';
			form.lop_accident1 = 'No';
			form.company_accident1 = 'No';
		}
		else if(name == "primary_insurance" && val === "Yes") {
			form.self_pay1 = 'No';
			form.auto_accident1 = 'No';
			form.lop_accident1 = 'No';
			form.company_accident1 = 'No';
		}
		else if(name == "auto_accident1" && val === "Yes") {
			form.auto_insurance_type = "AUTO";
			form.self_pay1 = 'No';
			form.lop_accident1 = 'No';
			form.company_accident1 = 'No';
			form.primary_insurance = 'No';
		}
		else if(name == "lop_accident1" && val === "Yes") {
			form.primary_insurance = 'No';
			form.self_pay1 = 'No';
			form.auto_accident1 = 'No';
			form.company_accident1 = 'No';
		}
		else if(name == "company_accident1" && val === "Yes") {
			form.primary_insurance = 'No';
			form.self_pay1 = 'No';
			form.auto_accident1 = 'No';
			form.lop_accident1 = 'No';
		}
		setForm({ ...form, [name]: val });
	}

	function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
	}

	

	async function handleSubmit(event) {
		// event.preventDefault();
		setLoading(true);
		setLoading(false);
	}

	const handleClose = (event, reason) => {
		setOpen(false);
	};
	const handleCloseError = (event, reason) => {
		setOpenError(false);
	};

	console.log(paperWorkData);	
	return (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<Formsy
					// onValidSubmit={handleSubmit}
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
									Form Preview
								</Typography>
							</Toolbar>
						</AppBar>
						<CardContent>
						{paperWorkData.tran_form_questions && paperWorkData.tran_form_questions.map((ques, i) => (
							<div className="flex flex-col">
								{i === qcounter && (
								<div>
									<Typography variant="subtitle1" color="inherit" className="flex-1 px-12 mb-24 text-center">
										{ques.questions}
									</Typography>
									{ques.field_type === "RadioButtons" && (
										<div className="flex justify-center w-full mb-48">
											{ques.options && ques.options.map(opt => (
												<Button
													variant="contained"
													color={form.primary_insurance === "Yes" && form.company_accident1 === "No" && form.auto_accident1 === "No" && form.lop_accident1 === "No" ? "primary" : "default"}
													type="submit"
													className={clsx(
														form.primary_insurance === "Yes" && form.company_accident1 === "No" && form.auto_accident1 === "No" && form.lop_accident1 === "No" ? classes.selectedButton: '',
														'mr-10'
													)}
													onClick={(e) => handleSelected(e, 'primary_insurance' )}
												>
													{opt.options}
												</Button>
											))}
										</div>
									)}
									{ques.field_type === "checkbox" && (
										<div className="flex flex-col justify-center w-full mb-48">
											{ques.options && ques.options.map((opt,ind) => (
												<div className="flex">
													<div className="flex w-1/2">
														<Checkbox
															// className="p-10"
															disableRipple
															// checked={manageCheckUncheckExam(exam.exam_id)}
															tabIndex={-1}
															name="selectedOption"
															onChange={(e) => handleSelected(e, opt)}
														/>
														<Typography className="mx-4 pt-10" color="secondary" paragraph={false}>
															{opt.options}
														</Typography>
													</div>
												</div>
											))}
										</div>
									)}
									<div className="flex justify-center w-full mb-24">
										{qcounter > 0 &&
										<Button
											variant="contained"
											style={{ float: 'right'}}
											className={clsx(classes.selectedButton, 'mr-24')}
											color="primary"
											type="submit"
											onClick={handleBack}
										>
											Back
										</Button>}
										<Button
											variant="contained"
											style={{ float: 'right'}}
											className={clsx(classes.selectedButton, 'mr-24')}
											color="primary"
											type="submit"
											onClick={handleNext}
										>
											Next
										</Button>
										<Button
											variant="contained"
											style={{ float: 'right'}}
											className={clsx(classes.selectedButton, 'mr-24')}
											color="primary"
											type="submit"
											onClick={handleNext}
										>
											Skip
										</Button>
									</div>
								</div>
								)}
							</div>
						))}
						</CardContent>
					</Card>
				</FuseAnimateGroup>
				</Formsy>
			</div>
			<div className="flex flex-col md:w-320">
			</div>
		</div>
	);
}

export default FormPreview




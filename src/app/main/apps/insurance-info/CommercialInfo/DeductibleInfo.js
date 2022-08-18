import {
	ISelectSearchFormsy,
	SelectSearchFormsy,
	SelectFormsy,
    TextFieldFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createStyles, makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
	closeDeductibleDialog,
	openReferenceDialog,
	updateNavigationBlocked
} from '../store/InsuranceInfoSlice';
const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
const floatRegExpMessage = 'Please enter number only';

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

function DeductibleInfo(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const deductibleInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.deductibleInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [validationErrors, setValidationErrors] = useState({ });
	const [isFormValid, setIsFormValid] = useState(false);

    const initDialog = useCallback(async () => {
		if (deductibleInfoDialog.data) {
			setForm({ ...deductibleInfoDialog.data });
		}
	}, [deductibleInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (deductibleInfoDialog.props.open) {
			initDialog();
		}
	}, [deductibleInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeDeductibleDialog({ ...form, isFormValid, formName: 'CIDeductible' }));
	}
	
	function handledeDuctable1(event, newValue) {
		setForm({ 
			...form,
			deductable1: newValue
		});
		dispatch(updateNavigationBlocked(true));
	}

	function handleDeductableMeet1(event, newValue) {
		setForm({ 
			...form,
			deductable_meet1: newValue
		});
		dispatch(updateNavigationBlocked(true));
	}

	function handleDeductableMeetAmount1(event) {
		const str = event.target.value;
		if(!floatRegExp.test(str)) {
			setValidationErrors({...validationErrors, deductable_meet_amount1: floatRegExpMessage });
			return;
		}
		if(parseFloat(str) > parseFloat(form.deductable_amount1)) {
			setValidationErrors({...validationErrors, deductable_meet_amount1: 'Deductible Paid should be less then Plan Deductible Amount' });
		}
		else {
			setValidationErrors({});
		}
		setForm({ 
			...form,
			// deductable_due_amount1: parseFloat(form.deductable_amount1) - parseFloat(str),
			deductable_meet_amount1: str
		});
		dispatch(updateNavigationBlocked(true));
	}

	function handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		form[name] = value;
		setForm({ ...form });
		dispatch(updateNavigationBlocked(true));
	}

	function handleDeductableAmount1(event) {
		const str = event.target.value;
		if(!floatRegExp.test(str)) {
			setValidationErrors({...validationErrors, deductable_amount1: floatRegExpMessage });
			return;
		}
		else {
			setValidationErrors({...validationErrors, deductable_amount1: undefined });
		}
		if(parseFloat(str)) {
			setForm({ 
				...form,
				deductable_amount1: parseFloat(str),
				// deductable_due_amount1: parseFloat(str) - parseFloat(form.deductable_meet_amount1)
			});
		}
		else {
				setForm({ 
				...form,
				deductable_amount1: str
			});
		}
		dispatch(updateNavigationBlocked(true));
	}

	function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
	}

	function handleSubmit(event) {
		event.preventDefault();
		closeComposeDialog();
	}
	
	function handleSubmitNext(event) {
		event.preventDefault();
		closeComposeDialog();
		dispatch(openReferenceDialog(form));
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...deductibleInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Commercial Health Insurance {'>'} Deductible Detail
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				onValid={enableButton}
				onInvalid={disableButton}
				validationErrors={validationErrors}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Deductible</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.deductable1}
								id="deductable1"
								name="deductable1"
								exclusive
								onChange={handledeDuctable1}
								aria-label="deductable1"
								>
								<StyledToggleButton value="Yes" aria-label="left aligned">
									Yes
								</StyledToggleButton>
								<StyledToggleButton value="No" aria-label="centered">
									No
								</StyledToggleButton>
							</StyledGroupButton>
						</div>
					</div>
					{form.deductable1 === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="deductable_amount1"
							id="deductable_amount1"
							value={form.deductable_amount1}
							onChange={handleChange}
							label="Plan Deductible Amount"
							variant="outlined"
							fullWidth
							validations={{
								matchRegexp: floatRegExp,
							}}
							validationErrors={{
								matchRegexp: floatRegExpMessage,
							}}
						/>
					</div>)}
					{form.deductable1 === "Yes" && (
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Has the patient paid the full deductible amount?</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.deductable_meet1}
								id="deductable_meet1"
								name="deductable_meet1"
								exclusive
								onChange={handleDeductableMeet1}
								aria-label="deductable_meet1"
								>
								<StyledToggleButton value="Yes" aria-label="left aligned">
									Yes
								</StyledToggleButton>
								<StyledToggleButton value="No" aria-label="centered">
									No
								</StyledToggleButton>
							</StyledGroupButton>
						</div>
					</div>)}
					{form.deductable1 === "Yes" && form.deductable_meet1 === "No" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="deductable_meet_amount1"
							id="deductable_meet_amount1"
							value={form.deductable_meet_amount1}
							onChange={handleDeductableMeetAmount1}
							label="Deductible Paid"
							variant="outlined"
							// errorMessage="Deductible Paid should be less then Plan Deductible Amount"
							fullWidth
							validations={{
								matchRegexp: floatRegExp,
								// checkValue: form.deductable_meet_amount1 < form.deductable_amount1
							}}
							validationErrors={{
								matchRegexp: floatRegExpMessage
							}}
						/>
					</div>)}
					{form.deductable1 === "Yes" && form.deductable_meet1 === "No" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="deductable_due_amount1"
							id="deductable_due_amount1"
							// value={form.deductable_due_amount1}
							value={form.deductable_amount1 - form.deductable_meet_amount1}
							// onChange={handleChange}
							label="Remaining Deductible"
							variant="outlined"
							disabled
							fullWidth
						/>
					</div>)}
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="allowed_amount1"
							id="allowed_amount1"
							value={form.allowed_amount1}
							onChange={handleChange}
							label="Exam Allowable Amount"
							variant="outlined"
							fullWidth
							validations={{
								matchRegexp: floatRegExp,
							}}
							validationErrors={{
								matchRegexp: floatRegExpMessage,
							}}
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="collect_from_patient"
							id="collect_from_patient"
							value={form.collect_from_patient}
							onChange={handleChange}
							label="Collect From Patient"
							variant="outlined"
							fullWidth
							validations={{
								matchRegexp: floatRegExp,
							}}
							validationErrors={{
								matchRegexp: floatRegExpMessage,
							}}
						/>
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

export default DeductibleInfo;

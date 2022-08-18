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
	closeTICoPayDialog,
	openTIDeductibleDialog,
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

function TICoPayInfo(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const tiCoPayInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiCoPayInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [isFormValid, setIsFormValid] = useState(false);
	
    const initDialog = useCallback(async () => {
		if (tiCoPayInfoDialog.data) {
			setForm({ ...tiCoPayInfoDialog.data });
		}
	}, [tiCoPayInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (tiCoPayInfoDialog.props.open) {
			initDialog();
		}
	}, [tiCoPayInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeTICoPayDialog({ ...form, isFormValid, formName: 'TICoPay' }));
	}
	
	function handleCoPay3(event, newValue) {
		setForm({ 
			...form,
			co_pay3: newValue
		});
	}

	function handleOutOfNetwork3(event, newValue) {
		setForm({ 
			...form,
			out_of_network3: newValue
		});
	}
	function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
	}

	function handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		form[name] = value;
		setForm({ ...form });
		dispatch(updateNavigationBlocked(true));
	}

	function handleSubmit(event) {
		event.preventDefault();
		closeComposeDialog();
	}

	function handleSubmitNext(event) {
		event.preventDefault();
		closeComposeDialog();
		dispatch(openTIDeductibleDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...tiCoPayInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Tertiary Insurance {'>'} CoPay Detail
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				onValid={enableButton}
				onInvalid={disableButton}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Co Pay</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.co_pay3}
								id="co_pay3"
								name="co_pay3"
								exclusive
								onChange={handleCoPay3}
								aria-label="co_pay3"
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
					{form.co_pay3 === "Yes" ? 
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="co_pay_amount3"
							id="co_pay_amount3"
							value={form.co_pay_amount3}
							onChange={handleChange}
							label="Co Pay Amount"
							variant="outlined"
							fullWidth
							validations={{
								matchRegexp: floatRegExp,
							}}
							validationErrors={{
								matchRegexp: floatRegExpMessage,
							}}
						/>
					</div> : null }
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="co_insurance3"
							id="co_insurance3"
							value={form.co_insurance3}
							onChange={handleChange}
							label="Co Insurance"
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
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Out of Network</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.out_of_network3}
								id="out_of_network3"
								name="out_of_network3"
								exclusive
								onChange={handleOutOfNetwork3}
								aria-label="out_of_network3"
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

export default TICoPayInfo;

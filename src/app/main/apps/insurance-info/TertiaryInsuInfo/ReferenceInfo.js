import {
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
	closeTIReferenceDialog,
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

function TIReferenceInfo(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const tiReferenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiReferenceInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (tiReferenceInfoDialog.data) {
			setForm({ ...tiReferenceInfoDialog.data });
		}
	}, [tiReferenceInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (tiReferenceInfoDialog.props.open) {
			initDialog();
		}
	}, [tiReferenceInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeTIReferenceDialog(form));
	}
	
	function handleAuthorizationReferralRequired3(event, newValue) {
		setForm({ 
			...form,
			authorization_referral_required3: newValue
		});
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
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...tiReferenceInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Tertiary Insurance {'>'} Authorization Detail
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
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Authorization/ Referral Required</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.authorization_referral_required3}
								id="authorization_referral_required3"
								name="authorization_referral_required3"
								exclusive
								onChange={handleAuthorizationReferralRequired3}
								aria-label="authorization_referral_required3"
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
					{form.authorization_referral_required3 === "Yes" ? 
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="authorization_referral3"
							id="authorization_referral3"
							value={form.authorization_referral3}
							onChange={handleChange}
							label="Authorization/ Referral"
							variant="outlined"
							fullWidth
						/>
					</div> : null }
					{form.authorization_referral_required3 === "Yes" ? 
					<div className="flex mb-24">
						<TextFieldFormsy
							id="authorization_referral3_date"
							name="authorization_referral3_date"
							label="Authorization Date"
							type="date"
							value={moment(form.authorization_referral3_date).format("YYYY-MM-DD")}
							onChange={handleChange}
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							fullWidth
							required
						/>
					</div> : null }
					{form.authorization_referral_required3 === "Yes" ? 
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="spoke_to_reference3"
							id="spoke_to_reference3"
							value={form.spoke_to_reference3}
							onChange={handleChange}
							label="Spoke To/ Reference"
							variant="outlined"
							fullWidth
						/>
					</div> : null }
				</DialogContent>	
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
							>
								Close
							</Button>
						</div>
					</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default TIReferenceInfo;

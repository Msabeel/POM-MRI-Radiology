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
	closeAutoReferenceDialog,
	openAutoAttorneyDialog,
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

function AutoReferenceInfo(props) {
	const dispatch = useDispatch();
	const autoReferenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoReferenceInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (autoReferenceInfoDialog.data) {
			setForm({ ...autoReferenceInfoDialog.data });
		}
	}, [autoReferenceInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (autoReferenceInfoDialog.props.open) {
			initDialog();
		}
	}, [autoReferenceInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeAutoReferenceDialog(form));
	}
	
	function handleAuthorizationReferralRequired1(event, newValue) {
		setForm({ 
			...form,
			authorization_referral_required1: newValue
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
	
	function handleSubmitNext(event) {
		event.preventDefault();
		dispatch(openAutoAttorneyDialog(form));
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...autoReferenceInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Auto Insurance {'>'} Adjuster Detail
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
						<TextFieldFormsy
							type="text"
							name="auto_adjuster_name"
							id="auto_adjuster_name"
							value={form.auto_adjuster_name}
							onChange={handleChange}
							label="Adjuster Name"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_adjuster_phone"
							id="auto_adjuster_phone"
							value={form.auto_adjuster_phone}
							onChange={handleChange}
							label="Adjuster Phone"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_adjuster_fax"
							id="auto_adjuster_fax"
							value={form.auto_adjuster_fax}
							onChange={handleChange}
							label="Adjuster Fax"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_accident_comment1"
							id="auto_accident_comment1"
							value={form.auto_accident_comment1}
							onChange={handleChange}
							label="Comments"
							variant="outlined"
							fullWidth
						/>
					</div>
				</DialogContent>	
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								className="mr-8"
								color="secondary"
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

export default AutoReferenceInfo;

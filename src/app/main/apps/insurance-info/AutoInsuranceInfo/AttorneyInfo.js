import {
	ISelectSearchFormsy,
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
	closeAutoAttorneyDialog,
	updateNavigationBlocked
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

function AutoAttorneyInfo(props) {
	const dispatch = useDispatch();
	const attorneyData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.attorneyData);
	const autoAttorneyInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoAttorneyInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
	const [attorney, setAttorney] = useState({});
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (autoAttorneyInfoDialog.data) {
			if(attorneyData && attorneyData.length > 0 && autoAttorneyInfoDialog.data.attorney_name1) {
				const attorney = attorneyData.find(c=> c.id === parseInt(autoAttorneyInfoDialog.data.attorney_name1));
				setAttorney(attorney);
				setForm({ ...autoAttorneyInfoDialog.data, attorney_name1_name: attorney.name });
			}
			else {
				setForm({ ...autoAttorneyInfoDialog.data });
			}
		}
	}, [autoAttorneyInfoDialog.data, setForm, attorneyData]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (autoAttorneyInfoDialog.props.open) {
			initDialog();
		}
	}, [autoAttorneyInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeAutoAttorneyDialog(form));
	}
	
	function handleAttorneyChange(event, attorney) {
		if(attorney && attorney.id > 0) {
			setForm({ 
				...form, 
				attorney_name1: attorney.id,
				attorney_name1_name: attorney.name,
			});
			setAttorney(attorney);
		}
	}
	
    function handleAuto_Attorney(event, newValue) {
		setForm({ 
			...form,
			auto_attorney: newValue
		});
	}

	function handleAttorneyOutstanding(event, newValue) {
		setForm({ 
			...form,
			lop_attorney_outstanding: newValue
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
			{...autoAttorneyInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Auto Insurance {'>'} Attorney Detail
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
                            <Typography className="text-13">Does the patient have an attorney</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.auto_attorney}
                                id="auto_attorney"
                                name="auto_attorney"
                                exclusive
                                onChange={handleAuto_Attorney}
                                aria-label="auto_attorney"
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
					{form.auto_attorney === "Yes" && (
					<div className="flex mb-24">
						<ISelectSearchFormsy
							id="attorney_name1_name"
							name="attorney_name1_name"
							label="Attorney Name"
							style={{ width: '100%' }}
							onChange={handleAttorneyChange}
							value={form.attorney_name1_name}
							options={attorneyData && attorneyData}
						/>
					</div>)}
					{form.auto_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="address1"
							id="address1"
							value={attorney.address1}
							onChange={handleChange}
							label="Address1"
							variant="outlined"
							fullWidth
						/>
					</div>)}
					{form.auto_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="address2"
							id="address2"
							value={attorney.address2}
							onChange={handleChange}
							label="Address2"
							variant="outlined"
							fullWidth
						/>
					</div>)}
					{form.auto_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="phone"
							id="phone"
							value={attorney.phone}
							onChange={handleChange}
							label="Phone"
							variant="outlined"
							fullWidth
						/>
					</div>)}
					{form.auto_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="email"
							id="email"
							value={attorney.att_email}
							onChange={handleChange}
							label="Email"
							variant="outlined"
							fullWidth
						/>
					</div>)}
					{form.auto_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="notes"
							id="notes"
							value={attorney.att_notes}
							onChange={handleChange}
							label="Notes"
							variant="outlined"
							fullWidth
						/>
					</div>)}
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
					</div>
				</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default AutoAttorneyInfo;

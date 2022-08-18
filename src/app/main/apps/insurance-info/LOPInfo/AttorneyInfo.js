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
	closeLOPAttorneyDialog,
	openLOPCoverageDialog,
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

function LOPCoverageInfo(props) {
	const dispatch = useDispatch();
	const attorneyData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.attorneyData);
	const lopAttorneyInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.lopAttorneyInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (lopAttorneyInfoDialog.data) {
			if(attorneyData && attorneyData.length > 0 && lopAttorneyInfoDialog.data.lop_attorney_name1) {
				const attorney = attorneyData.find(c=> c.id === parseInt(lopAttorneyInfoDialog.data.lop_attorney_name1));
				setForm({ ...lopAttorneyInfoDialog.data, lop_attorney_name1_name: attorney.name });
			}
			else {
				setForm({ ...lopAttorneyInfoDialog.data });
			}
		}
	}, [lopAttorneyInfoDialog.data, setForm, attorneyData]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (lopAttorneyInfoDialog.props.open) {
			initDialog();
		}
	}, [lopAttorneyInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeLOPAttorneyDialog(form));
	}
	
	function handleAttorneyChange(event, attorney) {
		if(attorney && attorney.id > 0) {
			setForm({ 
				...form, 
				lop_attorney_name1: attorney.id,
				lop_attorney_name1_name: attorney.name,
				lop_attorney_company_name1: attorney.address1,
				lop_attorney_company_address1: attorney.address2,
				lop_attorney_phone1: attorney.phone
			});
		}
	}
	
    function handleLOP_Attorney(event, newValue) {
		setForm({ 
			...form,
			lop_attorney: newValue
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

	function handleSubmitNext(event) {
		event.preventDefault();
		closeComposeDialog();
		dispatch(openLOPCoverageDialog(form));
	}
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...lopAttorneyInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						LOP Insurance {'>'} Attorney Detail
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
                                value={form.lop_attorney}
                                id="lop_attorney"
                                name="lop_attorney"
                                exclusive
                                onChange={handleLOP_Attorney}
                                aria-label="lop_attorney"
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
					{form.lop_attorney === "Yes" && (
					<div className="flex mb-24">
						<ISelectSearchFormsy
							id="lop_attorney_name1_name"
							name="lop_attorney_name1_name"
							label="Attorney Name"
							style={{ width: '100%' }}
							onChange={handleAttorneyChange}
							value={form.lop_attorney_name1_name}
							options={attorneyData && attorneyData}
						/>
					</div>)}
					{form.lop_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="lop_attorney_company_name1"
							id="lop_attorney_company_name1"
							value={form.lop_attorney_company_name1}
							onChange={handleChange}
							label="Address1"
							variant="outlined"
							fullWidth
							disabled
						/>
					</div>)}
					{form.lop_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="lop_attorney_company_address1"
							id="lop_attorney_company_address1"
							value={form.lop_attorney_company_address1}
							onChange={handleChange}
							label="Address2"
							variant="outlined"
							fullWidth
							disabled
						/>
					</div>)}
					{form.lop_attorney === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="lop_attorney_phone1"
							id="lop_attorney_phone1"
							value={form.lop_attorney_phone1}
							onChange={handleChange}
							label="Phone"
							variant="outlined"
							fullWidth
							disabled
						/>
					</div>)}
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
                            <Typography className="text-13">Is The Attorney Willing to Sign The LOP to Conver any Outstanding Bill</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.lop_attorney_outstanding}
                                id="lop_attorney_outstanding"
                                name="lop_attorney_outstanding"
                                exclusive
                                onChange={handleAttorneyOutstanding}
                                aria-label="lop_attorney_outstanding"
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

export default LOPCoverageInfo;

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
	closeAutoCoverageDialog,
	openAutoReferenceDialog,
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

function AutoCoverageInfo(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const autoCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoCoverageInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredICompanyAdd, setICompanyAdd] = useState([]);
	const [validationErrors, setValidationErrors] = useState({ });
	const [isFormValid, setIsFormValid] = useState(false);
	
    const initDialog = useCallback(async () => {
		if (autoCoverageInfoDialog.data) {
			setForm({ ...autoCoverageInfoDialog.data });
		}
	}, [autoCoverageInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (autoCoverageInfoDialog.props.open) {
			initDialog();
		}
	}, [autoCoverageInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if(insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			if(insuranceFormData.auto_insurance_company_address && insuranceFormData.auto_insurance_company_address.length > 0) {
				const company_address = filterCompanyAddress(insuranceData.insuranceData[0].insurance_company_name1);
				setICompanyAdd(company_address);
			}
		}
	}, [insuranceFormData, insuranceData]);

	function closeComposeDialog() {
		dispatch(closeAutoCoverageDialog({ ...form, isFormValid, formName: 'AutoCoverage' }));
	}
	
	function filterCompanyAddress(companyId) {
		if(companyId > 0) {
			const company_address = insuranceFormData.auto_insurance_company_address.filter(item => item.insurance_company_id == companyId);
			const icompany_address = company_address.map(c=> {
				return {
					id: c.id,
					name: c.address,
					insurance_company_id: c.insurance_company_id
				}
			})
			return icompany_address;
		}
		else {
			const icompany_address = insuranceFormData.auto_insurance_company_address.map(c=> {
				return {
					id: c.id,
					name: c.address,
					insurance_company_id: c.insurance_company_id
				}
			})
			return icompany_address;
		}
	}

	function handleCompanyChange(event, company) {
		if(company && company.id > 0) {
			const address = filterCompanyAddress(company.id);
			setICompanyAdd(address);
			const company_address = insuranceFormData.auto_insurance_company_address.find(item => item.insurance_company_id == company.id);
			setForm({ 
				...form, 
				insurance_company_name1: company.id,
				insurance_company_name1_name: company.name,
				insurance_company_address1: company_address && company_address.id,
			});
		}
	}
	
	function handleCompanyAddressChange(event, company) {
		if(company && company.id > 0) {
			setForm({ 
				...form, 
				insurance_company_address1: company.id
			});
		}
	}

    function handleactive_coverage1(event, newValue) {
		setForm({ 
			...form,
			active_coverage1: newValue
		});
	}

	function handleDeductableMeet1(event, newValue) {
		setForm({ 
			...form,
			auto_deductable_meet: newValue
		});
	}

	function handleAutoMedPay(event, newValue) {
		setForm({ 
			...form,
			auto_med_pay: newValue
		});
	}

	function handleAutoBenefitRemaining(event, newValue) {
		setForm({ 
			...form,
			auto_benefit_remaining: newValue
		});
	}

	function handleDeductableMeetAmount1(event) {
		const str = event.target.value;
		if(!floatRegExp.test(str)) {
			setValidationErrors({...validationErrors, auto_deductable_meet_amount: floatRegExpMessage });
			return;
		}
		if(parseFloat(str) > parseFloat(form.auto_deductable_amount)) {
			setValidationErrors({...validationErrors, auto_deductable_meet_amount: 'Deductible Paid should be less then Plan Deductible Amount' });
		}
		else {
			setValidationErrors({ });
		}
		setForm({ 
			...form,
			auto_deductable_meet_amount: str
		});
	}

	function handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		form[name] = value;
		setForm({ ...form });
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
		dispatch(openAutoReferenceDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...autoCoverageInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Auto Insurance {'>'} Coverage & Deductible Detail
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
                            <Typography className="text-13">Active Coverage</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.active_coverage1}
                                id="active_coverage1"
                                name="active_coverage1"
                                exclusive
                                onChange={handleactive_coverage1}
                                aria-label="active_coverage1"
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
					{form.active_coverage1 === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
                            id="coverage_terminated_date1"
                            name="coverage_terminated_date1"
                            label="Coverage Terminated Date"
                            type="date"
                            value={moment(form.coverage_terminated_date1).format("YYYY-MM-DD")}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            fullWidth
                            required
                        />
					</div>)}
					{form.active_coverage1 === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_deductable_amount"
							id="auto_deductable_amount"
							value={form.auto_deductable_amount}
							onChange={handleChange}
							label="Deductible Amount"
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
					{form.active_coverage1 === "Yes" && (
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Deductible Met</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.auto_deductable_meet}
								id="auto_deductable_meet"
								name="auto_deductable_meet"
								exclusive
								onChange={handleDeductableMeet1}
								aria-label="auto_deductable_meet"
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
					{form.active_coverage1 === "Yes" && form.auto_deductable_meet === "No" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_deductable_meet_amount"
							id="auto_deductable_meet_amount"
							value={form.auto_deductable_meet_amount}
							onChange={handleDeductableMeetAmount1}
							label="Deductible Met Amount"
							variant="outlined"
							// errorMessage="Deductible Paid should be less then Plan Deductible Amount"
							fullWidth
							validations={{
								matchRegexp: floatRegExp,
								// checkValue: form.auto_deductable_meet_amount < form.deductable_amount1
							}}
							validationErrors={{
								matchRegexp: floatRegExpMessage
							}}
						/>
					</div>)}
					{form.active_coverage1 === "Yes" && form.auto_deductable_meet === "No" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_deductable_due_amount"
							id="auto_deductable_due_amount"
							value={form.auto_deductable_amount - form.auto_deductable_meet_amount}
							// onChange={handleChange}
							label="Deductible Due Amount"
							variant="outlined"
							disabled
							fullWidth
						/>
					</div>)}
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Med Pay</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.auto_med_pay}
								id="auto_med_pay"
								name="auto_med_pay"
								exclusive
								onChange={handleAutoMedPay}
								aria-label="auto_med_pay"
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
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Benefits Remaining</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.auto_benefit_remaining}
								id="auto_benefit_remaining"
								name="auto_benefit_remaining"
								exclusive
								onChange={handleAutoBenefitRemaining}
								aria-label="auto_benefit_remaining"
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
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_plan_pay"
							id="auto_plan_pay"
							value={form.auto_plan_pay}
							onChange={handleChange}
							label="How Much Does Plan Pay(%)"
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

export default AutoCoverageInfo;

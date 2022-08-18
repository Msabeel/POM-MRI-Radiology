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
	closeWorkersCoverageDialog,
	openWorkersReferenceDialog,
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

function WorkersCoverageInfo(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const workersCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.workersCoverageInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredICompanyAdd, setICompanyAdd] = useState([]);
	const [validationErrors, setValidationErrors] = useState({ });
	const [isFormValid, setIsFormValid] = useState(false);

    const initDialog = useCallback(async () => {
		if (workersCoverageInfoDialog.data) {
			setForm({ ...workersCoverageInfoDialog.data });
		}
	}, [workersCoverageInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (workersCoverageInfoDialog.props.open) {
			initDialog();
		}
	}, [workersCoverageInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if(insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			if(insuranceFormData.auto_insurance_company_address && insuranceFormData.auto_insurance_company_address.length > 0) {
				const company_address = filterCompanyAddress(insuranceData.insuranceData[0].insurance_company_name1);
				setICompanyAdd(company_address);
			}
		}
	}, [insuranceFormData, insuranceData]);

	function closeComposeDialog() {
		dispatch(closeWorkersCoverageDialog({ ...form, isFormValid, formName: 'WorkersCoverage' }));
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

    function handleactive_coverage3(event, newValue) {
		setForm({ 
			...form,
			active_coverage3: newValue
		});
	}

	function handleDeductableMeet1(event, newValue) {
		setForm({ 
			...form,
			worker_deductable_meet: newValue
		});
	}

	function handleWorkerMedPay(event, newValue) {
		setForm({ 
			...form,
			worker_med_pay: newValue
		});
	}

	function handleWorkerBenefitRemaining(event, newValue) {
		setForm({ 
			...form,
			worker_benefit_remaining: newValue
		});
	}

	function handleDeductableMeetAmount1(event) {
		const str = event.target.value;
		if(!floatRegExp.test(str)) {
			setValidationErrors({...validationErrors, lop_deductable_meet_amount: floatRegExpMessage });
			return;
		}
		if(parseFloat(str) > parseFloat(form.deductable_amount1)) {
			setValidationErrors({...validationErrors, worker_deductable_meet_amount: 'Deductible Paid should be less then Plan Deductible Amount' });
		}
		else {
			setValidationErrors({...validationErrors, worker_deductable_meet_amount: undefined });
		}
		setForm({ 
			...form,
			worker_deductable_meet_amount: str
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
		dispatch(openWorkersReferenceDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...workersCoverageInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Worker's Insurance {'>'} Coverage & Deductible Detail
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
                            <Typography className="text-13">Active Coverage</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.active_coverage3}
                                id="active_coverage3"
                                name="active_coverage3"
                                exclusive
                                onChange={handleactive_coverage3}
                                aria-label="active_coverage3"
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
					{form.active_coverage3 === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
                            id="coverage_terminated_date3"
                            name="coverage_terminated_date3"
                            label="Coverage Terminated Date"
                            type="date"
                            value={moment(form.coverage_terminated_date3).format("YYYY-MM-DD")}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            fullWidth
                        />
					</div>)}
					{form.active_coverage3 === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="worker_deductable_amount"
							id="worker_deductable_amount"
							value={form.worker_deductable_amount}
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
					{form.active_coverage3 === "Yes" && (
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
							<Typography className="text-13">Deductible Met</Typography>
						</div>
						<div className="w-1/2">
							<StyledGroupButton
								value={form.worker_deductable_meet}
								id="worker_deductable_meet"
								name="worker_deductable_meet"
								exclusive
								onChange={handleDeductableMeet1}
								aria-label="worker_deductable_meet"
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
					{form.active_coverage3 === "Yes" && form.worker_deductable_meet === "No" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="worker_deductable_meet_amount"
							id="worker_deductable_meet_amount"
							value={form.worker_deductable_meet_amount}
							onChange={handleDeductableMeetAmount1}
							label="Deductible Met Amount"
							variant="outlined"
							// errorMessage="Deductible Paid should be less then Plan Deductible Amount"
							fullWidth
							validations={{
								matchRegexp: floatRegExp,
								// checkValue: form.worker_deductable_meet_amount < form.deductable_amount1
							}}
							validationErrors={{
								matchRegexp: floatRegExpMessage
							}}
						/>
					</div>)}
					{form.active_coverage3 === "Yes" && form.worker_deductable_meet === "No" && (
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="lop_deductable_due_amount"
							id="lop_deductable_due_amount"
							// value={form.lop_deductable_due_amount}
							value={form.worker_deductable_amount - form.worker_deductable_meet_amount}
							onChange={handleChange}
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
								value={form.worker_med_pay}
								id="worker_med_pay"
								name="worker_med_pay"
								exclusive
								onChange={handleWorkerMedPay}
								aria-label="worker_med_pay"
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
								value={form.worker_benefit_remaining}
								id="worker_benefit_remaining"
								name="worker_benefit_remaining"
								exclusive
								onChange={handleWorkerBenefitRemaining}
								aria-label="worker_benefit_remaining"
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
							name="worker_plan_pay"
							id="worker_plan_pay"
							value={form.worker_plan_pay}
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

export default WorkersCoverageInfo;

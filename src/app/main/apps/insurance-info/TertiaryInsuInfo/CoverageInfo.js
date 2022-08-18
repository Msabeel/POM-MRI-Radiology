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
	closeTICoverageDialog,
	openTICoPayDialog,
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

function TICoverageInfo(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const tiCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiCoverageInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredICompanyAdd, setICompanyAdd] = useState([]);

    const initDialog = useCallback(async () => {
		if (tiCoverageInfoDialog.data) {
			setForm({ ...tiCoverageInfoDialog.data });
		}
	}, [tiCoverageInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (tiCoverageInfoDialog.props.open) {
			initDialog();
		}
	}, [tiCoverageInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if(insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			if(insuranceFormData.auto_insurance_company_address && insuranceFormData.auto_insurance_company_address.length > 0) {
				const company_address = filterCompanyAddress(insuranceData.insuranceData[0].insurance_company_name1);
				setICompanyAdd(company_address);
			}
		}
	}, [insuranceFormData, insuranceData]);

	function closeComposeDialog() {
		dispatch(closeTICoverageDialog(form));
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

    function handleActiveCoverage6(event, newValue) {
		setForm({ 
			...form,
			active_coverage6: newValue
		});
	}
    function handlePolicyExpired3(event, newValue) {
		setForm({ 
			...form,
			policy_expire3: newValue
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
		dispatch(openTICoPayDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...tiCoverageInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Tertiary Insurance {'>'} Coverage & Policy Detail
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
                            <Typography className="text-13">Active Coverage</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.active_coverage6}
                                id="active_coverage6"
                                name="active_coverage6"
                                exclusive
                                onChange={handleActiveCoverage6}
                                aria-label="active_coverage6"
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
					{form.active_coverage6 === "Yes" && (
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
					<div className="flex mb-24">
						<TextFieldFormsy
							id="effective_date3"
							name="effective_date3"
							label="Effective Date"
							type="date"
							value={moment(form.effective_date3).format("YYYY-MM-DD")}
							onChange={handleChange}
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							fullWidth
							required
						/>
					</div>
					<div className="flex mb-24">
						<div className="flex justify-start items-start w-1/2">
                            <Typography className="text-13">Policy Expired</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.policy_expire3}
                                id="policy_expire3"
                                name="policy_expire3"
                                exclusive
                                onChange={handlePolicyExpired3}
                                aria-label="policy_expire3"
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
					{form.policy_expire3 === "Yes" && (
					<div className="flex mb-24">
						<TextFieldFormsy
                            id="policy_expire_end_date3"
                            name="policy_expire_end_date3"
                            label="End Date"
                            type="date"
                            value={moment(form.policy_expire_end_date3).format("YYYY-MM-DD")}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
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

export default TICoverageInfo;

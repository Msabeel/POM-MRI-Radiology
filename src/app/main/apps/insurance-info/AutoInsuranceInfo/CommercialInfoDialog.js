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
import MenuItem from '@material-ui/core/MenuItem';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeAutoCommercialDialog,
	updateNavigationBlocked,
	openAutoCoverageDialog
} from '../store/InsuranceInfoSlice';

function AutoCommercialInfoDialog(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const autoCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoCommercialInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredICompanyAdd, setICompanyAdd] = useState([]);

    const initDialog = useCallback(async () => {
		if (autoCommercialInfoDialog.data) {
			if(insuranceFormData.auto_insurance_company_name && insuranceFormData.auto_insurance_company_name.length > 0 && autoCommercialInfoDialog.data.auto_insurance_company_name1) {
				const company = insuranceFormData.auto_insurance_company_name.find(c=> c.id === parseInt(autoCommercialInfoDialog.data.auto_insurance_company_name1));
				setForm({ ...autoCommercialInfoDialog.data, auto_insurance_company_name1_name: company.name });
			}
			else {
				setForm({ ...autoCommercialInfoDialog.data });
			}
		}
	}, [autoCommercialInfoDialog.data, setForm, insuranceFormData]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (autoCommercialInfoDialog.props.open) {
			initDialog();
		}
	}, [autoCommercialInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if(insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			if(insuranceFormData.auto_insurance_company_address && insuranceFormData.auto_insurance_company_address.length > 0) {
				const company_address = filterCompanyAddress(insuranceData.insuranceData[0].insurance_company_name1);
				setICompanyAdd(company_address);
			}
		}
	}, [insuranceFormData, insuranceData]);

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

	function closeComposeDialog() {
		dispatch(closeAutoCommercialDialog(form));
	}
	
	function handleCompanyChange(event, company) {
		if(company && company.id > 0) {
			setForm({ 
				...form, 
				auto_insurance_company_name1: company.id,
				auto_insurance_company_name1_name: company.name,
				auto_insurance_company_address1: company.address
			});
			dispatch(updateNavigationBlocked(true));
		}
	}
	function handleCompanyAddressChange(event, company) {
		const value = event.target.value;
		const company_address = insuranceFormData.auto_insurance_company_address.find(item => item.id == value);
		if(company_address && company_address.id > 0) {
			setForm({ 
				...form, 
				auto_insurance_company_address1: value,
				auto_insurance_company_address1_name: company_address.address
			});
		}
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
		dispatch(openAutoCoverageDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...autoCommercialInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Auto Insurance {'>'} Accident Detail
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					{/* <div className="flex mb-24">
						<SelectFormsy
							name="auto_insurance_type"
							id="auto_insurance_type"
							label="Auto Insurance Company Type"
							variant="outlined"
							style={{ width: '100%' }}
							onChange={handleChange}
							value={form.auto_insurance_type}
						>
						<MenuItem key="AUTO" value="AUTO">AUTO</MenuItem>
						</SelectFormsy>
					</div> */}
					<div className="flex mb-24">
						<ISelectSearchFormsy
							id="auto_insurance_company_name1_name"
							name="auto_insurance_company_name1_name"
							label="Auto Insurance Company Name"
							style={{ width: '100%' }}
							onChange={handleCompanyChange}
							value={form.auto_insurance_company_name1_name}
							options={insuranceFormData.auto_insurance_company_name && insuranceFormData.auto_insurance_company_name}
						/>
					</div>
					<div className="flex mb-24">
						<SelectFormsy
							id="auto_insurance_company_address1"
							name="auto_insurance_company_address1"
							label="Auto Insurance Company Address"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleCompanyAddressChange}
							value={form.auto_insurance_company_address1}
							>
							<option value="">
							</option>
							{filteredICompanyAdd && filteredICompanyAdd.map(item =>
								<option key={item.id} value={item.id}>{item.name}</option>
							)}
						</SelectFormsy>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_insurance_phone1"
							id="auto_insurance_phone1"
							InputLabelProps={{
								style: { color: '#000' },
							}}
							value={form.auto_insurance_phone1}
							onChange={handleChange}
							label="Phone"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_insurance_policy_no1"
							id="auto_insurance_policy_no1"
							InputLabelProps={{
								style: { color: '#000' },
							}}
							value={form.auto_insurance_policy_no1}
							onChange={handleChange}
							label="Policy No"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="auto_insurance_clam1"
							id="auto_insurance_clam1"
							InputLabelProps={{
								style: { color: '#000' },
							}}
							value={form.auto_insurance_clam1}
							onChange={handleChange}
							label="Claim"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
                            id="auto_accident_date1"
                            name="auto_accident_date1"
                            label="Date of Accident"
                            type="date"
                            value={moment(form.auto_accident_date1).format("YYYY-MM-DD")}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            fullWidth
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

export default AutoCommercialInfoDialog;

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
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeSICommercialDialog,
	updateNavigationBlocked,
	openSICoverageDialog
} from '../store/InsuranceInfoSlice';

function SICommercialInfoDialog(props) {
	const dispatch = useDispatch();
	const [filteredSecondaryICompany, setSecondaryICompany] = useState([]);
	const [filteredSecondaryICompanyAdd, setSecondaryICompanyAdd] = useState([]);
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const siCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.siCommercialInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredICompanyAdd, setICompanyAdd] = useState([]);

    const initDialog = useCallback(async () => {
		if (siCommercialInfoDialog.data) {
			setForm({ ...siCommercialInfoDialog.data });
		}
	}, [siCommercialInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (siCommercialInfoDialog.props.open) {
			initDialog();
		}
	}, [siCommercialInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if(insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			if(insuranceFormData.auto_insurance_company_address && insuranceFormData.auto_insurance_company_address.length > 0) {
				const company_address = filterCompanyAddress(insuranceData.insuranceData[0].insurance_company_name1);
				setICompanyAdd(company_address);
			}
			if(insuranceFormData.tran_insurance_company_address && insuranceFormData.tran_insurance_company_address.length > 0) {
				const company_address = filterTranCompanyAddress(insuranceData.insuranceData[0].insurance_company_name2);
				setSecondaryICompanyAdd(company_address);
			}
			if(insuranceFormData.tran_insurance_company && insuranceFormData.tran_insurance_company.length > 0 && insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
				// const company = insuranceFormData.tran_insurance_company.filter(item => item.id == insuranceData.insuranceData[0].insurance_company_name1);
				// const company_address = insuranceFormData.auto_insurance_company_address.filter(item => item.id == insuranceData.insuranceData[0].insurance_company_address1);
				setSecondaryICompany(insuranceFormData.tran_insurance_company);
			}
		}
	}, [insuranceFormData, insuranceData]);

	function closeComposeDialog() {
		dispatch(closeSICommercialDialog(form));
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

	function handleCompanyTypeChange(event, company) {
		if(company && company.id > 0) {
			// const company_address = insuranceFormData.tran_insurance_company.filter(item => item.type == companyId);
			setForm({ 
				...form, 
				insurance_company_address1: company.id
			});
		}
	}

	function handleCompany2Change(event, company) {
		if(company && company.id > 0) {
			const company_address = filterTranCompanyAddress(company.id);
			setSecondaryICompanyAdd(company_address);
			setForm({ 
				...form, 
				insurance_company_name2: company.id,
				insurance_company_name2_name: company.name,
				insurance_company_address2: company_address.length > 0 && company_address[0].id,
				insurance_company_address2_name: company_address && company_address[0].name,
			});
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
			dispatch(updateNavigationBlocked(true));
		}
	}
	
	function filterTranCompanyAddress(companyId) {
		if(companyId > 0) {
			const company_address = insuranceFormData.tran_insurance_company_address.filter(item => item.insurance_company_id == companyId);
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
			const icompany_address = insuranceFormData.tran_insurance_company_address.map(c=> {
				return {
					id: c.id,
					name: c.address,
					insurance_company_id: c.insurance_company_id
				}
			})
			return icompany_address;
		}
	}

	function handleCompanyAddressChange(event, company) {
		if(company && company.id > 0) {
			setForm({ 
				...form, 
				insurance_company_address1: company.id
			});
			dispatch(updateNavigationBlocked(true));
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		closeComposeDialog();
	}

	function handleSubmitNext(event) {
		event.preventDefault();
		closeComposeDialog();
		dispatch(openSICoverageDialog(form));
	}

	function handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		form[name] = value;
		setForm({ ...form });
		dispatch(updateNavigationBlocked(true));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...siCommercialInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Secondary Insurance {'>'} Company Detail
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
						<SelectFormsy
							id="insurance_company_type"
							name="insurance_company_type"
							label="Insurance Company Type"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleCompanyTypeChange}
							value={form.insurance_company_type}
							>
							<option value="">
							</option>
							{insuranceFormData.tran_insurance_company_type && insuranceFormData.tran_insurance_company_type.map(item =>
								<option key={item.id} value={item.id}>{item.type}</option>
							)}
						</SelectFormsy>
					</div>
					<div className="flex mb-24">
						<ISelectSearchFormsy
							name="insurance_company_name2"
							label="Insurance Company Name"
							style={{ width: '100%' }}
							onChange={handleCompany2Change}
							value={form.insurance_company_name2_name}
							options={filteredSecondaryICompany && filteredSecondaryICompany}
						/>
					</div>
					<div className="flex mb-24">
						<SelectFormsy
							id="insurance_company_address2"
							name="insurance_company_address2"
							label="Insurance Company Add"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleCompanyAddressChange}
							value={form.insurance_company_address2}
							>
							<option value="">
							</option>
							{filteredSecondaryICompanyAdd && filteredSecondaryICompanyAdd.map(item =>
								<option key={item.id} value={item.id}>{item.name}</option>
							)}
						</SelectFormsy>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="member_id2"
							id="member_id2"
							InputLabelProps={{
								style: { color: '#000' },
								}}
							value={form.member_id2}
							onChange={handleChange}
							label="Member ID"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="group_id2"
							id="group_id2"
							value={form.group_id2}
							onChange={handleChange}
							label="Group No"
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

export default SICommercialInfoDialog;

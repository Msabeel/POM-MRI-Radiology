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
	closeTICommercialDialog,
	updateNavigationBlocked,
	openTICoverageDialog
} from '../store/InsuranceInfoSlice';

function TICommercialInfoDialog(props) {
	const dispatch = useDispatch();
	const [filteredTertiryICompanyAdd, setTertiryICompanyAdd] = useState([]);
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const tiCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiCommercialInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (tiCommercialInfoDialog.data) {
			setForm({ ...tiCommercialInfoDialog.data });
		}
	}, [tiCommercialInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (tiCommercialInfoDialog.props.open) {
			initDialog();
		}
	}, [tiCommercialInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if(insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			if(insuranceFormData.tran_insurance_company_address && insuranceFormData.tran_insurance_company_address.length > 0) {
				const tcompany_address = filterTranCompanyAddress(insuranceData.insuranceData[0].insurance_company_name3);
				setTertiryICompanyAdd(tcompany_address);
			}
		}
	}, [insuranceFormData, insuranceData]);

	function closeComposeDialog() {
		dispatch(closeTICommercialDialog(form));
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
			setTertiryICompanyAdd(company_address);
			setForm({ 
				...form, 
				insurance_company_name3: company.id,
				insurance_company_name3_name: company.name,
				insurance_company_address3: company_address.length > 0 && company_address[0].id,
				insurance_company_address3_name: company_address.length > 0 && company_address[0].name,
			});
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
				insurance_company_address3: company.id
			});
			dispatch(updateNavigationBlocked(true));
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
		dispatch(openTICoverageDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...tiCommercialInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Tertiary Insurance {'>'} Company Detail
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
						<ISelectSearchFormsy
							name="insurance_company_name2"
							label="Insurance Company Name"
							style={{ width: '100%' }}
							onChange={handleCompany2Change}
							value={form.insurance_company_name3_name}
							options={insuranceFormData.tran_insurance_company && insuranceFormData.tran_insurance_company}
						/>
					</div>
					<div className="flex mb-24">
						<SelectFormsy
							id="insurance_company_address3"
							name="insurance_company_address3"
							label="Insurance Company Add"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleCompanyAddressChange}
							value={form.insurance_company_address3}
							>
							<option value="">
							</option>
							{filteredTertiryICompanyAdd && filteredTertiryICompanyAdd.map(item =>
								<option key={item.id} value={item.id}>{item.name}</option>
							)}
						</SelectFormsy>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="member_id3"
							id="member_id3"
							InputLabelProps={{
								style: { color: '#000' },
								}}
							value={form.member_id3}
							onChange={handleChange}
							label="Member ID"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="group_id3"
							id="group_id3"
							value={form.group_id3}
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

export default TICommercialInfoDialog;

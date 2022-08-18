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
	closeCommercialDialog,
	updateNavigationBlocked,
	openCoverageDialog
} from '../store/InsuranceInfoSlice';

function CommercialInfoDialog(props) {
	const dispatch = useDispatch();
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const commercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.commercialInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredICompanyAdd, setICompanyAdd] = useState([]);
	const [isFormValid, setIsFormValid] = useState(false);

    const initDialog = useCallback(async () => {
		if (commercialInfoDialog.data) {
			setForm({ ...commercialInfoDialog.data });
		}
	}, [commercialInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (commercialInfoDialog.props.open) {
			initDialog();
		}
	}, [commercialInfoDialog.props.open, initDialog]);

	useEffect(() => {
		if(insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			if(insuranceFormData.tran_insurance_company_address && insuranceFormData.tran_insurance_company_address.length > 0) {
				const company_address = filterCompanyAddress(insuranceData.insuranceData[0].insurance_company_name1);
				setICompanyAdd(company_address);
			}
		}
	}, [insuranceFormData, insuranceData]);

	function closeComposeDialog() {
		dispatch(closeCommercialDialog({ ...form, isFormValid }));
	}
	
	function filterCompanyAddress(companyId) {
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

	function handleCompanyChange(event, company) {
		if(company && company.id > 0) {
			const address = filterCompanyAddress(company.id);
			setICompanyAdd(address);
			const company_address = insuranceFormData.tran_insurance_company_address.find(item => item.insurance_company_id == company.id);
			setForm({ 
				...form, 
				insurance_company_name1: company.id,
				insurance_company_name1_name: company.name,
				insurance_company_address1: company_address && company_address.id,
				insurance_company_address1_name: company_address && company_address.address,
			});
			dispatch(updateNavigationBlocked(true));
		}
	}
	
	function handleCompanyAddressChange(event) {
		const value = event.target.value;
		if(value > 0) {
			const company_address = insuranceFormData.tran_insurance_company_address.find(item => item.id == value);
			setForm({ 
				...form, 
				insurance_company_address1: value,
				insurance_company_address1_name: company_address.address,
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
		dispatch(openCoverageDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...commercialInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Commercial Health Insurance {'>'} Company Detail
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
						<ISelectSearchFormsy
							id="insurance_company_name1"
							name="insurance_company_name1"
							label="Insurance Company Name"
							style={{ width: '100%' }}
							onChange={handleCompanyChange}
							value={form.insurance_company_name1_name}
							options={insuranceFormData.tran_insurance_company && insuranceFormData.tran_insurance_company}
						/>
					</div>
					<div className="flex mb-24">
						<SelectFormsy
							id="insurance_company_address1"
							name="insurance_company_address1"
							label="Insurance Company Add"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleCompanyAddressChange}
							value={form.insurance_company_address1}
							// options={filteredICompanyAdd}
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
							name="member_id1"
							id="member_id1"
							InputLabelProps={{
								style: { color: '#000' },
								}}
							value={form.member_id1}
							onChange={handleChange}
							label="Member ID"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="group_id1"
							id="group_id1"
							value={form.group_id1}
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

export default CommercialInfoDialog;

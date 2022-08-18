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
	closeWorkersCommercialDialog,
	updateNavigationBlocked,
	openWorkersCoverageDialog
} from '../store/InsuranceInfoSlice';

function WorkersCommercialInfoDialog(props) {
	const dispatch = useDispatch();
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const workersCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.workersCommercialInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (workersCommercialInfoDialog.data) {
			if(insuranceFormData.tran_company_accident && insuranceFormData.tran_company_accident.length > 0 && workersCommercialInfoDialog.data.company_accident_name1) {
				const company = insuranceFormData.tran_company_accident.find(c=> c.id === parseInt(workersCommercialInfoDialog.data.company_accident_name1));
				setForm({ ...workersCommercialInfoDialog.data, company_accident_name1_name: company.name });
			}
			else {
				setForm({ ...workersCommercialInfoDialog.data });
			}
		}
	}, [workersCommercialInfoDialog.data, setForm, insuranceFormData]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (workersCommercialInfoDialog.props.open) {
			initDialog();
		}
	}, [workersCommercialInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeWorkersCommercialDialog(form));
	}
	
	function handleCompanyChange(event, company) {
		if(company && company.id > 0) {
			setForm({ 
				...form, 
				company_accident_name1: company.id,
				company_accident_name1_name: company.name,
				company_accident_address1: company.address
			});
			dispatch(updateNavigationBlocked(true));
		}
	}
	
	function handleSubmit(event) {
		event.preventDefault();
		closeComposeDialog();
	}

	function handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		form[name] = value;
		setForm({ ...form });
		dispatch(updateNavigationBlocked(true));
	}

	function handleSubmitNext(event) {
		event.preventDefault();
		closeComposeDialog();
		dispatch(openWorkersCoverageDialog(form));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...workersCommercialInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Worker's Insurance {'>'} Accident Detail
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
							id="company_accident_name1"
							name="company_accident_name1"
							label="Company Name"
							style={{ width: '100%' }}
							onChange={handleCompanyChange}
							value={form.company_accident_name1_name}
							options={insuranceFormData.tran_company_accident && insuranceFormData.tran_company_accident}
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="company_accident_address1"
							id="company_accident_address1"
							InputLabelProps={{
								style: { color: '#000' },
								}}
							value={form.company_accident_address1}
							onChange={handleChange}
							label="Address"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="company_accident_phone1"
							id="company_accident_phone1"
							InputLabelProps={{
								style: { color: '#000' },
								}}
							value={form.company_accident_phone1}
							onChange={handleChange}
							label="Phone"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="company_accident_policy_no1"
							id="company_accident_policy_no1"
							InputLabelProps={{
								style: { color: '#000' },
								}}
							value={form.company_accident_policy_no1}
							onChange={handleChange}
							label="Authorization No"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="company_accident_clam1"
							id="company_accident_clam1"
							InputLabelProps={{
								style: { color: '#000' },
								}}
							value={form.company_accident_clam1}
							onChange={handleChange}
							label="Claim"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
                            id="company_accident_date1"
                            name="company_accident_date1"
                            label="Date of Accident"
                            type="date"
                            value={moment(form.company_accident_date1).format("YYYY-MM-DD")}
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

export default WorkersCommercialInfoDialog;

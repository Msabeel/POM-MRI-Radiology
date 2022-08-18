import {
    TextFieldFormsy
} from '@fuse/core/formsy';
import { useForm } from '@fuse/hooks';
import Formsy from 'formsy-react';
import _ from '@lodash';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import history from '@history';
import { StyledToggleButton, StyledGroupButton }  from 'app/fuse-layouts/shared-components/StyledToggleButton';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeNewFormDialog
} from './store/formBuilderSlice';

const defaultFormState = {
	id: '',
	name: '',
	required: false,
	isactive: true,
	modalities: [],
	payertype: []
};

function NewFormDialog(props) {
	const dispatch = useDispatch();
	const formDialog = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.formDialog);
	const modalities = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.modalities);
	const examList = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.examList);
	const payerType = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.payerType);
	const forms = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.forms);
	const [isValidName, setIsValidName] = useState(true);
	const [validationErrors, setValidationErrors] = useState({ });
	const formRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [userTypes, setUserTypes] = useState([]);
	const [distModalities, setDistModalities] = useState([]);
	const { form, handleChange, setForm } = useForm(defaultFormState);
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (formDialog.type === 'edit' && formDialog.data) {
			setForm({ ...formDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (formDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...formDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [formDialog.data, formDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (formDialog.props.open) {
			initDialog();
		}
	}, [formDialog.props.open, initDialog]);


	useEffect(() => {
		if (modalities && modalities.length > 0) {
			const distMod = _.uniqBy(modalities, 'mwl_display_name');
			setDistModalities(distMod);
		}
	}, [modalities]);

	function closeComposeDialog() {
		dispatch(closeNewFormDialog(form));
	}

	function canBeSubmitted() {
		return form.name.length > 0;
	}

	function handleGender(event, newValue) {
		setForm({
			...form,
			gender: newValue
		});
	}

	function handleModality(event, newValue) {
		setForm({ ...form, modalities: newValue });
	}

	function handlePayerType(event, newValue) {
		setForm({ ...form, payertype: newValue });
	}

	function handleExams(event, newValue) {
		setForm({ ...form, exams: newValue });
	}
	
	function isValidFormName() {
		const frm = forms.find(f=> f.name === form.name);
		if(frm) {
			if(formDialog.type === 'edit' && frm.id === form.id) {
				return true;
			}
			setValidationErrors({...validationErrors, name: "Form name is already exist" });
			setIsValidName(false);
			return false;
		}
		setIsValidName(true);
		return true;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if(!isValidFormName()) {
			return null;
		}
		if(formDialog.type === 'new') {
			history.push(`/apps/formBuilder/0`)
			closeComposeDialog();
		}
		else {
			closeComposeDialog();
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...formDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{formDialog.type === 'new' ? 'New Form' : 'Edit Form'}
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				// onValid={enableButton}
				// onInvalid={disableButton}
				validationErrors={validationErrors}
				className="flex flex-col md:overflow-hidden"
            >
			{/* <form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden"> */}
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="w-96 pt-20">
						</div>
						<TextFieldFormsy
							className="mb-24"
							label="Form Name"
							autoFocus
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							variant="outlined"
							// disabled={formDialog.type === 'edit'}
							required
							fullWidth
						/>
						{/* {!isValidName && <p style={{color: 'red', textAlign: 'center', marginTop: 5}}>Form name is already exist</p>} */}
					</div>
					<div className="flex mb-12">
						<div className="w-80 pt-20"></div>
						<FormControlLabel
							control={
							<Checkbox 
								onChange={handleChange} 
								name="isactive"
								checked={form.isactive}
							/>}
							label="Is Active"
						/>
					</div>
					<div className="flex mb-12">
						<div className="w-80 pt-20"></div>
						<FormControlLabel
							control={
							<Checkbox 
								onChange={handleChange} 
								name="required"
								checked={form.required}
								// onChange={(e) => handleAction(e, item)}
							/>}
							label="Is Required"
						/>
					</div>
					<div className="flex mb-12">
						<div className="w-96 pt-20"></div>
						<Autocomplete
							value={form.modalities}
							onChange={handleModality}
							multiple
							fullWidth
							disabled={form.required}
							limitTags={2}
							id="modalities"
							options={distModalities}
							getOptionLabel={(option) => option.mwl_display_name}
							renderInput={(params) => (
							<TextField {...params} variant="outlined" label="Modalities" placeholder="Modalities" />
							)}
						/>
					</div>
					<div className="flex mb-12">
						<div className="w-96 pt-20"></div>
						<Autocomplete
							value={form.payertype}
							onChange={handlePayerType}
							disabled={form.required}
							multiple
							fullWidth
							limitTags={1}
							id="payertype"
							options={payerType}
							getOptionLabel={(option) => option.display_name}
							renderInput={(params) => (
							<TextField {...params} variant="outlined" label="Payer Type" placeholder="Payer Type" />
							)}
						/>
					</div>
					<div className="flex mb-12">
						<div className="w-96 pt-20"></div>
						<Autocomplete
							value={form.exams}
							onChange={handleExams}
							disabled={form.required}
							multiple
							fullWidth
							limitTags={1}
							id="exams"
							options={examList}
							getOptionLabel={(option) => option.exam}
							renderInput={(params) => (
							<TextField {...params} variant="outlined" label="Select Exam" placeholder="Select Exam" />
							)}
						/>
					</div>
					<div className="flex mb-12">
						<div className="min-w-68 pt-20" style={{width: '10%'}}>
						</div>
						<StyledGroupButton
							value={form.gender}
							style={{width: '40%'}}
							id="gender"
							name="gender"
							exclusive
							onChange={handleGender}
							aria-label="text alignment"
							required
						>
							<StyledToggleButton value="M" aria-label="left aligned">
								Male
							</StyledToggleButton>
							<StyledToggleButton value="F" aria-label="centered">
								Female
							</StyledToggleButton>
						</StyledGroupButton>
					</div>
					<div className="flex mb-12">
						<div className="w-80 pt-20"></div>
						<FormControlLabel
							control={
							<Checkbox 
								onChange={handleChange} 
								name="forMinor"
								checked={form.forMinor}
								// onChange={(e) => handleAction(e, item)}
							/>}
							label="For Minor"
						/>
					</div>
				</DialogContent>

				{formDialog.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
								disabled={!canBeSubmitted() || loading}
							>
								Next
								{loading && <CircularProgress className="ml-10" size={18}/>}
							</Button>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
								disabled={!canBeSubmitted() || loading}
							>
								Save
								{loading && <CircularProgress className="ml-10" size={18}/>}
							</Button>
						</div>
					</DialogActions>
				)}
			</Formsy>
		</Dialog>
	);
}

export default NewFormDialog;

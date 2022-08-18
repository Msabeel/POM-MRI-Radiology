import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React, {useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useForm} from '@fuse/hooks'
import {useDispatch, useSelector} from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import ConfirmDialog from './ConfirmDialog';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Permissions} from 'app/config';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import history from '@history';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createModality} from './store/modalitySlice';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
const useStyles = makeStyles((theme) => ({
	root: {
		width: 400
	},
	button: {
		display: 'block',
		marginTop: theme.spacing(2),
	},
	formControl: {
		margin: theme.spacing(1),
		width: '100%'
	},
	boxPadding: {
		paddingHorizontal: 15
	}
}));
const ModalityDisplay = [
	"CR",
	"CT",
	"MR",
	"US",
	"OT",
	"BI",
	"CD",
	"DD",
	"DG",
	"ES",
	"LS",
	"PT",
	"RG",
	"ST",
	"TG",
	"XA",
	"RF",
	"RTIMAGE",
	"RTDOSE",
	"RTSTRUCT",
	"RTPLAN",
	"RTRECORD",
	"HC",
	"DX",
	"NM",
	"MG",
	"IO",
	"PX",
	"GM",
	"SM",
	"XC",
	"PR",
	"AU",
	"EPS",
	"HD",
	"SR",
	"IVUS",
	"OP",
	"SMR"
]

const CreateFormDialog = ({
	isOpen,
	handleCloseDialog,
	modality,
	data
}) => {
	const dispatch = useDispatch();
	const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_attorney);
	const [loading, setLoading] = useState(false);
	const defaultFormState = {
		locationid: data ? data.locationid : 0,
		modality: data ? data.modality : '',
		status: data ? data.status : false,
		ae_title: data ? data.ae_title : '',
		mwl_display_name: '',
		quantity: 0,
		bg_color: '',
		modality_id_exam: 0
	};
	const {form, handleChange, setForm} = useForm(defaultFormState);
	const confirmationDialog = useSelector(({modalityApp}) => modalityApp.modality.confirmationDialog);
	const [isSearchingState, setIsSearching] = useState(false);
	var locations = useSelector(state => state.modalityApp.modality.locations)
	var modalityForDrop = useSelector(state => state.modalityApp.modality.modalityForDrop)
	const classes = useStyles();
	const [checked, setChecked] = React.useState(false);


	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (data) {
			setForm(data);
		}


	}, [setForm]);

	useEffect(() => {

		initDialog();

	}, [initDialog, data]);

	useEffect(() => {
		let ignore = false;
		setIsSearching(true);
		return () => {ignore = true;}
	}, [confirmationDialog.data]);

	const handleClose = () => {
		handleCloseDialog(false)
	}
	async function addmModality(form) {
		const result = await dispatch(createModality(form))
		if (result.payload) {
			// setmodalityDropDown(result.payload.data)
		}
		setLoading(false)
	}

	async function handleSubmit(event) {
		event.preventDefault()
		setLoading(true)
		addmModality(form)
	}
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">

			<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
				<DialogTitle id="simple-dialog-title">Create New Modality</DialogTitle>
				<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
					<DialogContent className={classes.root}>
						<div className="flex">

							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel htmlFor="outlined-age-native-simple">Location</InputLabel>
								<Select
									native
									value={form.locationid}
									onChange={handleChange}
									label="Location"
									inputProps={{
										name: 'locationid',
										id: 'age-native-simple',
									}}
								>
									<option aria-label="None" value="" ></option>
									{
										locations &&
										Object.keys(locations).map((u, i) => {
											return (
												<option value={u}>{locations[u]}</option>

											)
										})
									}
								</Select>
							</FormControl>
						</div>
						<div className="flex">
							<TextField
								id="modality"
								label="Modality Name"
								variant="outlined"
								value={form.modality}
								name="modality"
								onChange={handleChange}
								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
						</div>
						<div className="flex">
							<TextField
								className="mb-5"
								label="AE Title"
								name="ae_title"
								id="ae_title"
								value={form.ae_title}
								onChange={handleChange}
								variant="outlined"
								required
								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
						</div>
						<div className="flex">
							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel htmlFor="outlined-age-native-simple">MWL Display Name</InputLabel>
								<Select
									native
									value={form.mwl_display_name}
									onChange={handleChange}
									label="MWL Display Name"
									inputProps={{
										name: 'mwl_display_name',
										id: 'age-native-simple',
									}}
								>
										<option aria-label="None" value="" ></option>

									{

										ModalityDisplay.sort(function (a, b) {
											return a.localeCompare(b);
										}).map((u, i) => {
											return (
												<option style={{backgroundColor: u.value, padding: 5}} value={u}>
													{u}
												</option>

											)
										})
									}
								</Select>

							</FormControl>

						</div>
						<div className="flex">

							<TextField
								className="mb-5"
								autoFocus
								id="quantity"
								label="quantity"
								name="quantity"
								autoComplete={false}
								value={form.quantity?form.quantity:""}
								onChange={handleChange}
								variant="outlined"
								required
								fullWidth
								className={classes.formControl}
							/>



						</div>
						<div className="flex">

							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel htmlFor="outlined-age-native-simple">BG Color</InputLabel>
								<Select
									native
									value={form.bg_color}
									onChange={handleChange}
									label="Bg Color"
									inputProps={{
										name: 'bg_color',
										id: 'age-native-simple',
									}}
								>
									<option aria-label="None" value="" ></option>

									{

										[
											{value: "#1dab43", name: 'Green'},
											{value: "#cc1427", name: 'Red'},
											{value: "#7f0c94", name: 'Purple'},
											{value: "#2210c7", name: 'Blue'},
											{value: "#eb0eca", name: 'Pink'},
											{value: "#b7c223", name: 'Yellow'},
										].map((u, i) => {
											return (
												<option style={{backgroundColor: u.value, padding: 5}} value={u.value}>
													{u.name}
												</option>

											)
										})
									}
								</Select>

							</FormControl>
						</div>

						<div className="flex">
							<FormControl className={classes.formControl}>
								<FormLabel component="legend">Status</FormLabel>
								<RadioGroup aria-label="status" name="status" value={form.status} onChange={handleChange}>
									<div style={{display: 'flex', flexDirection: 'row'}}>
										<FormControlLabel value="on" control={<Radio color="#192d3e" />} label="On" />
										<FormControlLabel value="off" control={<Radio color="#192d3e" />} label="Off" />
									</div>
								</RadioGroup>
							</FormControl>
						</div>
						<div className="flex">
							<FormControl className={classes.formControl}>
								{/* <FormLabel component="legend">Want To Copy Exams</FormLabel> */}
								<FormControlLabel
									control={
										<Checkbox
											checked={checked}
											onChange={(event) => {
												setChecked(event.target.checked);
											}}
											inputProps={{'aria-label': 'primary checkbox'}}
										/>
									}
									label="Copy Exams from Other Modality"
								/>
							</FormControl>
						</div>
						{

							checked &&
							<div className="flex">

								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel htmlFor="outlined-age-native-simple">Select Modality</InputLabel>
									<Select
										native
										value={form.modality_id_exam}
										onChange={handleChange}
										label="Modality Exam"
										inputProps={{
											name: 'modality_id_exam',
											id: 'age-native-simple',
										}}
									>
									<option aria-label="None" value="" ></option>
										{
											Object.keys(modalityForDrop).map((u, i) => {
												return (
													<option style={{backgroundColor: u.value, padding: 5}} value={u}>
														{modalityForDrop[u]}
													</option>

												)
											})
										}
									</Select>

								</FormControl>
							</div>

						}


					</DialogContent>


					<DialogActions className="justify-between p-8">
						<div>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
							>
								Create
								{loading && <CircularProgress className="ml-10" color="#fff" size={18} />}
							</Button>
						</div>
					</DialogActions>

				</form>


			</Dialog>
		</div>
	);
};



export default CreateFormDialog;

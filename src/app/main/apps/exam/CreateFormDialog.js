import FuseUtils from '@fuse/utils';
import React, {useEffect, useState, useCallback} from 'react';
import {useForm} from '@fuse/hooks'
import {useDispatch, useSelector} from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Permissions} from 'app/config';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import {createExam} from './store/examSlice'
const useStyles = makeStyles((theme) => ({
	root: {
		width: 600
	},
	button: {
		display: 'block',
		marginTop: theme.spacing(2),
	},
	formControl: {
		margin: 5,
		width: '100%'
	},
	boxPadding: {
		paddingHorizontal: 15
	}
}));

const CreateFormDialog = ({
	isOpen,
	handleCloseDialog,
	modality,
	data,
	onSaved
}) => {
	const dispatch = useDispatch();
	const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_attorney);
	const [loading, setLoading] = useState(false);
	const defaultFormState = {
		exam: '',
		modalityid: 0,
		locationId:0,
		cpt: '',
		cpt1: '',
		cpt2: '',
		price: '',
		selfprice: '',
		timeslot: '',
		exampreptext: '',
		p_instruction: '',
		laterality: false

	};
	const {form, handleChange, setForm} = useForm(defaultFormState);
	const confirmationDialog = useSelector(({examApp}) => examApp.exam.confirmationDialog);
	var locations = useSelector(({examApp}) => examApp.exam.locations)
	const [isSearchingState, setIsSearching] = useState(false);
	var modalityForDrop = useSelector(state => state.examApp.exam.modalityForDrop)
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
	async function addExam(form) {
		const result = await dispatch(createExam(form));
		console.log("result",result)
		onSaved()
		setLoading(false)
	}

	async function handleSubmit(event) {
		event.preventDefault()
		setLoading(true)
		addExam(form)
	}
	return (
		<div className="flex flex-col sm:border-1 overflow-hidden">

			<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
				<DialogTitle id="simple-dialog-title">Create New Exam</DialogTitle>
				<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
					<DialogContent className={classes.root}>
						<div className="flex">

							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel htmlFor="outlined-age-native-simple">Select Modality</InputLabel>
								<Select
									native
									value={form.modalityid}
									onChange={handleChange}
									label="Modality Exam"
									inputProps={{
										name: 'modalityid',
										id: 'age-native',
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
								id="examname"
								label="Exam Name"
								variant="outlined"
								value={form.exam}
								name="exam"
								onChange={handleChange}
								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
					
							<TextField
								className="mb-5"
								label="CPT1"
								name="cpt"
								id="cpt"
								value={form.cpt}
								onChange={handleChange}
								variant="outlined"
								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
						</div>
						<div className="flex">
							<TextField
								className="mb-5"
								label="CPT2"
								name="cpt1"
								id="cpt1"
								value={form.cpt1}
								onChange={handleChange}
								variant="outlined"
								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
							<TextField
								className="mb-5"
								label="CPT3"
								name="cpt2"
								id="cpt2"
								value={form.cpt2}
								onChange={handleChange}
								variant="outlined"
								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
						</div>

						<div className="flex">
							<TextField
								className="mb-5"
								label="Price"
								name="price"
								id="price"
								value={form.price}
								onChange={handleChange}
								variant="outlined"
								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
							<TextField
								className="mb-5"
								label="Self Price"
								name="selfprice"
								id="selfprice"
								value={form.selfprice}
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
								<InputLabel htmlFor="outlined-age-native-simple">Time Slot</InputLabel>
								<Select
									native
									value={form.timeslot}
									onChange={handleChange}
									label="Modality Exam"
									inputProps={{
										name: 'timeslot',
										id: 'age-native-simple',
									}}
								>
									<option aria-label="None" value="" ></option>
									{
										[1, 2, 3, 4, 5, 6, 7, 8].map((u, i) => {
											return (
												<option style={{backgroundColor: u.value, padding: 5}} value={u}>
													{u}
												</option>

											)
										})
									}
								</Select>

							</FormControl>
							<TextField
								className="mb-5"
								label="Exam Prepaation Text"
								name="exampreptext"
								id="exampreptext"
								value={form.exampreptext}
								onChange={handleChange}
								variant="outlined"
								required
								multiline

								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
						</div>
						<div className="flex">
							<TextField
								className="mb-5"
								label="Exam Prepaation Instruction"
								name="p_instruction"
								id="p_instruction"
								value={form.p_instruction}
								onChange={handleChange}
								variant="outlined"
								required
								multiline

								fullWidth
								autoComplete={false}
								className={classes.formControl}
							/>
						
							<FormControl className={classes.formControl}>
								<FormLabel component="legend">Laterality</FormLabel>
								<RadioGroup aria-label="status" name="status" value={form.status} onChange={handleChange}>
									<div style={{display: 'flex', flexDirection: 'row'}}>
										<FormControlLabel value="on" control={<Radio color="#192d3e" />} label="Yes" />
										<FormControlLabel value="off" control={<Radio color="#192d3e" />} label="No" />
									</div>
								</RadioGroup>
							</FormControl>
						</div>



					</DialogContent>


					<DialogActions className="justify-center p-8">
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

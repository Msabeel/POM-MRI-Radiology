import FuseUtils from '@fuse/utils';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
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
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import {Typography} from '@material-ui/core';
import {createCancelReason, setResponseStatus} from './store/CancelExamManagementSlice'
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';

const useStyles = makeStyles((theme) => ({
	root: {
		width: 400
	},
	button: {
		display: 'block',
		marginTop: theme.spacing(2),
		marginLeft: 25
	},
	formControl: {
		margin: theme.spacing(1),
		width: '100%'
	},
	boxPadding: {
		paddingHorizontal: 15
	},
	closeIcon: {
		position: 'absolute',
		right: '15px',
		top: '20px',
		color: 'grey',
		cursor: 'pointer'
	}
}));

const CreateFormDialog = ({
	isOpen,
	handleCloseDialog,
	// modality,
	// data
}) => {
	const dispatch = useDispatch();
	const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_attorney);
	const [loading, setLoading] = useState(false);
	const customeNotify = useCustomNotify();
	const [dataForm, setDataForm] = useState({
		reason: '',
		description: '',
	});
	const [reason, setReason] = useState('')
	const [description, setDescription] = useState('')
	const [ref_cancel, setRef_cancel] = useState(false)
	const [is_auto, setIs_auto] = useState(false)
	const [chk_incident, setChk_incident] = useState(false)

	const classes = useStyles();

	const handleClose = () => {
		handleCloseDialog(false)
	}

	const handleChange = (e) => {
		setDataForm({...dataForm, [e.target.name]: e.target.value});
	}

	const handleCheck = (e) => {
		setRef_cancel(e.target.checked);
	}
	const handleAutoCheck = (e) => {
		setIs_auto(e.target.checked);
	}
	const handleIncidentCheck = (e) => {
		setChk_incident(e.target.checked);

	}

	async function handleSubmit(event) {
		event.preventDefault()
		setLoading(true)
		const data = {
			reason: reason,
			description: description,
			ref_cancel: ref_cancel ? 'Y' : 'N',
			chk_incident: chk_incident ? 'Y' : 'N',
			auto_archive: is_auto ? 1 : 0
		};
		const result = await dispatch(createCancelReason(data)) 
		if (result.payload.isCreatedError !== true) {
			customeNotify("Reason created successfully!", 'success')
			dispatch(setResponseStatus())
		} else {
			customeNotify("something went wrong!", 'error')
		}
		// setDisabled(true);
		setLoading(false);
	}
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">

			<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
				<DialogTitle id="simple-dialog-title">Create a Reason</DialogTitle>
				<ClearIcon onClick={handleClose} className={classes.closeIcon} />
				<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
					<DialogContent dividers className={classes.root}>
						<div className="flex">
							<TextField
								className="mb-5"
								autoFocus
								label="Reason"
								name="reason"
								id="reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								variant="outlined"
								required
								fullWidth
								rows={4}
								multiline
								autoComplete='false'
								className={classes.formControl}
							/>
						</div>
						<Typography style={{color: 'red', fontSize: '13px'}}>{dataForm.reasonErr}</Typography>

						<div className="flex">

							<TextField
								className="mb-5"
								id="description"
								label="Description"
								name="description"
								autoComplete='false'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								variant="outlined"
								required
								rows={4}
								multiline
								fullWidth
								className={classes.formControl}
							/>
						</div>
						<Typography style={{color: 'red', fontSize: '13px'}}>{dataForm.descErr}</Typography>
						{/* <div className="flex">
							<FormControl className={classes.formControl}>
							
								<FormControlLabel
									control={
										<Checkbox
											value={ref_cancel}
											name='ref_check'
											onChange={handleCheck}
										/>
									}
									label="Allow the referrer to use this reason to cancel an exam:"
								/>
							</FormControl>
						</div> */}
						<div className="flex">
							<FormControl className={classes.formControl}>
								{/* <FormLabel component="legend">Want To Copy Exams</FormLabel> */}
								<FormControlLabel
									control={
										<Checkbox
											value={is_auto}
											name='ref_check'
											onChange={handleAutoCheck}
										/>
									}
									label="Automatically Archive Exams with this Reason on the Cancel Exam Report"
								/>
							</FormControl>
						</div>
						<div className="flex">
							<FormControl className={classes.formControl}>
								{/* <FormLabel component="legend">Want To Copy Exams</FormLabel> */}
								<FormControlLabel
									control={
										<Checkbox
											checked={chk_incident}
											name='ref_check'
											onChange={handleIncidentCheck}
										/>
									}
									label="Automatically Check Incident Exams with this Reason on the Cancel Exam Report"
								/>
							</FormControl>
						</div>
					</DialogContent>


					<DialogActions className="justify-between p-8">
						<div>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
								className={classes.button}
								disabled={loading}
							>
								Create
								{loading && <CircularProgress className="ml-10" size={18} />}
							</Button>
						</div>
					</DialogActions>

				</form>

			</Dialog>
		</div>
	);
};



export default CreateFormDialog;

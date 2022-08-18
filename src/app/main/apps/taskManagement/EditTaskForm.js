import FuseUtils from '@fuse/utils';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Button from '@material-ui/core/Button';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
// import {withStyles} from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import {editTaskManagementData, setResponseStatus} from './store/TaskManagementSlice'
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
	},
	button:{
		color: '#fff !important',
		margin: '10px 0px !important',
		padding: '6px 16px !important',
		borderRadius: '3px !important',
		backgroundColor: '#192d3e !important'
	}
}));
// const StyleButton=  withStyles({
// 	root:{
// 		color:' #fff !important',
// 		backgroundColor: '#192d3e !important',
// 		padding:' 6px 16px !important',
// 		borderRadius: '3px !important',
// 		margin:'10px 0px !important'
// 	}
// })(Button);
const EditFormDialog = ({
	isOpen,
	handleCloseDialog,
	editId,
	// modality,
	// data
}) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	// const [dataLoading, setDataLoading] = useState(true);
    const [task, setTaskName] = useState('')
	const customeNotify = useCustomNotify()
	const [dataForm, setDataForm] = useState({
		task: editId.task,

	});

	const classes = useStyles();

	const handleClose = () => {
		handleCloseDialog(false)
	}
    useEffect(() => {
		setTaskName(editId.task)
	}, [editId])
	const handleSubmit = async (event) => {
		event.preventDefault()
		setLoading(true)
		const data = {
			id: editId.id,
            key:'edit',
			task: task,

		};
		 const result = await dispatch(editTaskManagementData(data))
		 if (result.isUpdateError !== true) {
		 	customeNotify("Task updated successfully!", 'success')
		 	dispatch(setResponseStatus())
		 } 
		 else {
			customeNotify("something went wrong!", 'error')
		}
		 setLoading(false);
	}
	return (
		<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
			<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={isOpen}>
				<DialogTitle id="simple-dialog-title">Update a Task</DialogTitle>
				<ClearIcon onClick={handleClose} className={classes.closeIcon} />
				<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
					<DialogContent dividers className={classes.root}>
						{/* {dataLoading && <CircularProgress size = {18} />} */}
						<div className="flex">
							<TextField
								className="mb-5"
								autoFocus
								label="Task Name"
								name="task name"
								id="taskName"
                                value={task}
                                onChange={(e) => setTaskName(e.target.value)}
								variant="outlined"
								required
								rows={4}
								multiline
								fullWidth
								autoComplete='false'
								className={classes.formControl}
							/>
						</div>
					</DialogContent>


					<DialogActions className="justify-between p-8">
						<div>
						{/* <StyleButton> */}
							<Button
								
								color="primary"
								onClick={handleSubmit}
								type="submit"
								className={classes.button}
								disabled={loading}
							>
								
								Update
								{loading && <CircularProgress className="ml-10" size={18} />}
							</Button>
							{/* </StyleButton> */}
						</div>
					</DialogActions>

				</form>

			</Dialog >
		</div >
	);
};



export default EditFormDialog;

import Formsy from 'formsy-react';
import {useForm} from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	closeConfirmDialog,
	changeStatusModality,
	updateModality,
	deleteModality,
	setStatusUpdate,
	setUpdateStatus
} from './store/modalitySlice';

const defaultFormState = {
	id: 0
};

function ConfirmDialog(props) {
	const dispatch = useDispatch();
	const confirmationDialog = useSelector(({modalityApp}) => modalityApp.modality.confirmationDialog);
	const editdate = useSelector(({modalityApp}) => modalityApp.modality.storeEditData);
	const {form, setForm} = useForm(defaultFormState);
	const [loading, setLoading] = useState(false);
	const [type, settype] = useState(0)
	const [msg, setMsg] = useState('')
	const [btnTitle, setBtnTitle] = useState('')
	const [title, setTitle] = useState('')
	const formRef = useRef(null);
	const initDialog = useCallback(async () => {

		if (editdate.data) {
			setForm({...editdate.data});

		}
		setLoading(false)
	}, [editdate.data, setForm]);

	useEffect(() => {
		setLoading(true)
		if (confirmationDialog.props.open) {
			settype(confirmationDialog.data.type)
			setMsg(confirmationDialog.data.msg)
			setBtnTitle(confirmationDialog.data.btnTitle)
			setTitle(confirmationDialog.data.title)
			initDialog();
		}
	}, [confirmationDialog.props.open, editdate.data, initDialog]);


	function closeComposeDialog() {
		dispatch(closeConfirmDialog());
	}
	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		if (type === 1) {
			await dispatch(updateModality(form));
			dispatch(setUpdateStatus())
		} else if(type===2){
			const data={
				status:confirmationDialog.data.status,
				id:confirmationDialog.data.id
			}
			await dispatch(changeStatusModality(data));
		}else{
			const data={
				isDelete:confirmationDialog.data.isDelete,
				id:confirmationDialog.data.id
			}
			await dispatch(deleteModality(data))
		}
		setLoading(false);
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...confirmationDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{
							title
						}
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
				ref={formRef}
				className="flex flex-col md:overflow-hidden"
			>
				<DialogContent classes={{root: 'p-24'}}>
					{
						msg
					}
				</DialogContent>
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							type="submit"
							onClick={handleSubmit}
							disabled={loading}
						>
						{btnTitle}
							{loading && <CircularProgress className="ml-10" size={18} />}
						</Button>
					</div>
					<div className="px-16">
						<Button
							variant="contained"
							color="primary"
							type="submit"
							onClick={closeComposeDialog}
							disabled={loading}
						>
							Cancel
						</Button>
					</div>
				</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default ConfirmDialog;

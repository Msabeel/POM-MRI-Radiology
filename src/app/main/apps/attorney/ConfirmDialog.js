import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeConfirmDialog,
    deleteAttorney
} from './store/attorneySlice';

const defaultFormState = {
	id: 0
};

function ConfirmDialog(props) {
	const dispatch = useDispatch();
	const confirmationDialog = useSelector(({ attorneyApp }) => attorneyApp.attorney.confirmationDialog);
	const { form, setForm } = useForm(defaultFormState);
	const [loading, setLoading] = useState(false);
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (confirmationDialog.data) {
			setForm({ ...confirmationDialog.data });
		}
	}, [confirmationDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (confirmationDialog.props.open) {
			initDialog();
		}
	}, [confirmationDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeConfirmDialog());
	}
	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		await dispatch(deleteAttorney(form));
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
						Disable Attorney Confirmation
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
						Are you sure want to disable attorney ?					
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
								Disable
								{loading && <CircularProgress className="ml-10" size={18}/>}
							</Button>
						</div>
					</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default ConfirmDialog;

import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closePatientAccessPrintPage
} from './store/contactsSlice';

const defaultFormState = {
	id: 0,
	fname: '',
	lname: '',
	mname: '',
	nickname: '',
	company: '',
	jobTitle: '',
	email: '',
	phone: '',
	address: '',
	birthday: '',
	notes: ''
};

function PatientAccessPrintDialog(props) {
	const dispatch = useDispatch();
	const patientAccessPrintDialog = useSelector(({ contactsApp }) => contactsApp.contacts.patientAccessPrintDialog);
	const { form, handleChange, setForm } = useForm(defaultFormState);
    const formRef = useRef(null);

    const initDialog = useCallback(async () => {
		if (patientAccessPrintDialog.data) {
			setForm({ ...patientAccessPrintDialog.data });
		}
	}, [patientAccessPrintDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (patientAccessPrintDialog.props.open) {
			initDialog();
		}
	}, [patientAccessPrintDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closePatientAccessPrintPage());
	}
	function handleSubmit(event) {
		event.preventDefault();
		var printContents = document.getElementById('printme').innerHTML;
		var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
		winPrint.document.write(printContents);
		winPrint.document.close();
		winPrint.focus();
		winPrint.print();
		winPrint.close(); 
		closeComposeDialog();
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...patientAccessPrintDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Patient Access Print Page
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<div id="printme" dangerouslySetInnerHTML={{__html: patientAccessPrintDialog.data}}>
					</div>
				</DialogContent>	
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
							>
								Print
							</Button>
						</div>
					</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default PatientAccessPrintDialog;

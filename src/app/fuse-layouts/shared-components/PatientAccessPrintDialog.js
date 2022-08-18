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
} from './quickPanel/store/dataSlice';
import { useLocation } from 'react-router-dom';

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
	const location = useLocation();
	const { pathname } = location;
	const quickPanel = useSelector(({ quickPanel }) => quickPanel.data);
	//const patientAccessPrintDialog = useSelector(({ projectDashboardApp }) => projectDashboardApp.projects.patientAccessPrintDialog);
	const { form, handleChange, setForm } = useForm(defaultFormState);
    const formRef = useRef(null);
	const [patientAccessPrintDialog, setPatientAccessPrintDialog] = useState({});
	const [isDisabledBackDrop, setisDisabledBackDrop] = useState(false);

    const initDialog = useCallback(async () => {
		if (quickPanel && quickPanel.data && quickPanel.data.patientAccessPrintDialog.data) {
			setForm({ ...quickPanel.data.patientAccessPrintDialog.data });
		}
	}, [quickPanel, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (quickPanel && quickPanel.patientAccessPrintDialog) {
			setPatientAccessPrintDialog(quickPanel.patientAccessPrintDialog);
			initDialog();
		}
	}, [quickPanel, initDialog]);

	useEffect(() => {
		if(pathname && pathname.indexOf('patientaccess')>=0) {
			setisDisabledBackDrop(true);
		}
	}, [pathname]);


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
		// closeComposeDialog();
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-12 rounded-8',
				scrollPaper: 'flex justify-center items-baseline'
			}}
			{...patientAccessPrintDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
			disableBackdropClick={isDisabledBackDrop}
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
				<DialogActions className="justify-end p-8">
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
				<DialogContent classes={{ root: 'p-8' }}>
					<div id="printme" dangerouslySetInnerHTML={{__html: patientAccessPrintDialog.data}}>
					</div>
				</DialogContent>	
				
			</Formsy>
		</Dialog>
	);
}

export default PatientAccessPrintDialog;

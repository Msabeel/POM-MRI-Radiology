import Formsy from 'formsy-react';
import history from '@history';
import { useForm } from '@fuse/hooks';
import { CircularProgress } from '@material-ui/core';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitPatientLoginWithAWS } from 'app/auth/store/loginSlice';
import {
	closeLoginPatientsDialog,
} from '../store/loginSlice';

function PatientsForLogin(props) {
	const dispatch = useDispatch();
	const LoginPatientsDialog = useSelector(({ Login }) => Login.login.LoginPatientsDialog);
	const locationdata = useSelector(({ Login }) => Login.login);
	const [patientInfo, setPatientInfo] = useState([]);
	const [loading, setLoading] = useState(false);
	const [clickedIndex, setIndex] = useState(-1);
    const initDialog = useCallback(async () => {
		if (LoginPatientsDialog.data) {
			setPatientInfo(LoginPatientsDialog.data);
		}
	}, [LoginPatientsDialog.data, setPatientInfo]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (LoginPatientsDialog.props.open) {
			initDialog();
		}
	}, [LoginPatientsDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeLoginPatientsDialog());
	}

	const loginClick = async (e, data, ind)=>{
		setLoading(true);
		setIndex(ind);
		const result = await dispatch(submitPatientLoginWithAWS({ ...patientInfo.values, patient_id: data.patient_id }, locationdata));
		setLoading(false);
		setIndex(-1);
		dispatch(closeLoginPatientsDialog(result.error));
		if(!result.error) {
			history.push({
				pathname: '/pages/patient-page/' + data.id
			});
			// let redirectURI = 'http://pom.webflowonline.com/login/index/patientsharedloginservice';
			// if(locationdata.data.redirectUrl) {
			// 	redirectURI = locationdata.data.redirectUrl && locationdata.data.redirectUrl.PatientExistingURL;
			// }
			// window.open(redirectURI);
		}
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...LoginPatientsDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Please select an account you wish to login with.
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                // onValidSubmit={handleSubmit}
                // ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
				<div className="flex mb-24">
					<div className="flex flex-col justify-center w-full">
						{patientInfo.patients && patientInfo.patients.map((post, i) => (
							<div className={`flex justify-center w-auto mb-8 cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`} onClick={(e) => loginClick(e, post, i)}>
								<Typography className="font-bold text-15 p-4 sm:border-2 rounded-md hover:bg-indigo-100 focus:ring-opacity-50">Patient Id: {post.patient_id} Patient Name: {post.lname} {post.fname}</Typography>
								<div className="m-8">{loading && clickedIndex === i && <CircularProgress size={16}/>}</div>
							</div>
						))}
						
					</div>
				</div>
				</DialogContent>	
			</Formsy>
		</Dialog>
	);
}

export default PatientsForLogin;

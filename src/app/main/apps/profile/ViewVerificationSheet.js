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
	closeVerificationSheetDialog,
	getVerificationSheetData,
	getIndexDetails
} from './store/ProfileSlice';

function PatientExamInfo(props) {
	const patientInfo = props.patientInfo;
	const verificationData = props.verificationData;
	return(
		<div className="flex mb-24">
			<div className="flex flex-col justify-center w-1/2 mr-4 sm:border-2" style={{ backgroundColor: '#E7E6E6' }}>
				<div className="mb-4 text-center sm:border-b-2">
					<Typography className="font-bold text-15">PATIENT DETAILS</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">Patient Id: </Typography>
					<Typography className="ml-8">{patientInfo.patient_id}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">Name: </Typography>
					<Typography className="ml-8">{verificationData.name}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">DOB: </Typography>
					<Typography className="ml-8">{patientInfo.dob}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">Mobile: </Typography>
					<Typography className="ml-8">{patientInfo.mobile}</Typography>
				</div>
			</div>
			<div className="flex flex-col justify-center w-1/2 ml-4 sm:border-2" style={{ backgroundColor: '#DEEDF6' }}>
				<div className="mb-4 text-center sm:border-b-2">
					<Typography className="font-bold text-15">Exam Information</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">Exam Date: </Typography>
					<Typography className="ml-8">{verificationData.scheduling_date}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">Acc#: </Typography>
					<Typography className="ml-8">{verificationData.exam_access_no}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">CPT: </Typography>
					<Typography className="ml-8">{verificationData.cpt}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 text-right">Procedure: </Typography>
					<Typography className="ml-8">{verificationData.procedure}</Typography>
				</div>
			</div>
		</div>
	);
}

function ViewVerificationSheet(props) {
	const dispatch = useDispatch();
	const verificationSheetDialog = useSelector(({ profilePageApp }) => profilePageApp.profile.verificationSheetDialog);
	const [patientInfo, setPatientInfo] = useState({});
	const [verificationData, setVerificationData] = useState({});
	const [indexDetail, setIndexDetail] = useState({});
    const initDialog = useCallback(async () => {
		if (verificationSheetDialog.data) {
			setPatientInfo({ ...verificationSheetDialog.data.patientInfo });
			const indexData = JSON.parse(localStorage.getItem('Index_Details'));
			setIndexDetail(indexData);
			dispatch(getVerificationSheetData({ exam_id: verificationSheetDialog.data.exam.exam_id, p_id: '' }));
		}
	}, [verificationSheetDialog.data, setPatientInfo]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (verificationSheetDialog.props.open) {
			initDialog();
		}
	}, [verificationSheetDialog.props.open, initDialog]);

	useEffect(() => {
		if(verificationSheetDialog.verificationData) {
			setVerificationData(verificationSheetDialog.verificationData)
		}
	}, [verificationSheetDialog.verificationData]);

	function closeComposeDialog() {
		dispatch(closeVerificationSheetDialog());
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
			{...verificationSheetDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Verification Sheet
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                // ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<div id="printme">
						<div className="flex mb-24 sm:border-2">
							<div className="flex justify-center w-2/5 mr-4 sm:border-r-2">
								<img className="logo-icon " src={indexDetail.index_logo} alt="logo" />			
							</div>
							<div className="flex flex-col items-center justify-around w-3/5 sm:border-l-2">
								<Typography variant="h6" className="font-bold">FINANCIAL RESPONSIBILITY SUMMARY</Typography>
								<Typography className="font-bold text-15">Today's Date: </Typography>
							</div>
						</div>

						<PatientExamInfo patientInfo={patientInfo} verificationData={verificationData}></PatientExamInfo>
						<div className="flex mb-24">
							<div className="flex flex-col justify-center w-1/2 mr-4 sm:border-2" style={{ backgroundColor: '#FFF3CB' }}>
								<div className="mb-4 text-center">
									<Typography className="font-bold text-15">Ordering Physician: {verificationData.ref_id}</Typography>
								</div>
							</div>
							<div className="flex flex-col justify-center w-1/2 ml-4 sm:border-2" style={{ backgroundColor: '#FFF3CB' }}>
								<div className="mb-4 text-center">
									<Typography className="font-bold text-15">Phone: </Typography>
								</div>
							</div>
						</div>

						<div className="flex mb-24">
							<div className="flex flex-col justify-center w-full mr-4 sm:border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
								<div className="mb-4 text-center">
									<Typography className="font-bold text-15">SELF PAY PATIENT</Typography>
								</div>
							</div>
						</div>

						<div className="flex mb-24 sm:border-2">
							<div className="flex justify-center w-2/5 mr-4 sm:border-r-2">
								<img className="logo-icon " src={indexDetail.index_logo} alt="logo" />			
							</div>
							<div className="flex flex-col items-center justify-around w-3/5 sm:border-l-2">
								<Typography variant="h6" className="font-bold">Electronic Insurance Verification Results</Typography>
								<Typography className="font-bold text-15">Today's Date: </Typography>
							</div>
						</div>
						<PatientExamInfo patientInfo={patientInfo} verificationData={verificationData}></PatientExamInfo>

						<div className="flex mb-24">
							<div className="flex flex-col justify-center w-full sm:border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
								<div className="mb-4 text-center sm:border-b-2">
									<Typography className="font-bold text-15">FINANCIAL DETAILS via Electronic Insurance Request</Typography>
								</div>
								<div className="flex mb-4 justify-center sm:border-b-2">
									<Typography className="font-bold text-15 mr-20">Payer: </Typography>
									<Typography className="font-bold text-15">Provider: </Typography>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">NPI : </Typography>
										<Typography className="ml-8">{verificationData.NPI}</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Eligibility Status : </Typography>
										<Typography className="ml-8">{verificationData.EligibilityStatus}</Typography>
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Estimate Status : </Typography>
										<Typography className="ml-8">{verificationData.EstimateStatus}</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										{/* <Typography className="font-bold mb-4 text-15 w-1/2 text-right">Eligibility Status: </Typography>
										<Typography className="ml-8">N/A</Typography> */}
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Validate Date : </Typography>
										<Typography className="ml-8">{verificationData.ValidationDate}</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Policy Number : </Typography>
										<Typography className="ml-8">{verificationData.PolicyNumber}</Typography>
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Plan Name : </Typography>
										<Typography className="ml-8">{verificationData.PlanName}</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										{/* <Typography className="font-bold mb-4 text-15 w-1/2 text-right">Eligibility Status: </Typography>
										<Typography className="ml-8">N/A</Typography> */}
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Individual Deductible : </Typography>
										<Typography className="ml-8">{verificationData.IndividualDeductible}</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Family Deductible: </Typography>
										<Typography className="ml-8">{verificationData.FamilyDeductible}</Typography>
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Individual Deductible Met : </Typography>
										<Typography className="ml-8">{verificationData.IndividualDeductibleMet}</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Family Deductible Met: </Typography>
										<Typography className="ml-8">{verificationData.FamilyDeductibleMet}</Typography>
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Co-Insurance : </Typography>
										<Typography className="ml-8">{verificationData.CoInsurance}</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Co Pay: </Typography>
										<Typography className="ml-8">{verificationData.CoPay}</Typography>
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Total Charge Amount : </Typography>
										<Typography className="ml-8">N/A</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Total Insurance Responsibility : </Typography>
										<Typography className="ml-8">N/A</Typography>
									</div>
								</div>
								<div className="flex justify-center w-full">
									<div className="flex mb-4 w-1/2">
										<Typography className="font-bold mb-4 text-15 w-1/2 text-right">Total Patient Responibility : </Typography>
										<Typography className="ml-8">N/A</Typography>
									</div>
									<div className="flex mb-4 w-1/2">
										{/* <Typography className="font-bold mb-4 text-15 w-1/2 text-right">Total Insurance Responsibility : </Typography>
										<Typography className="ml-8">N/A</Typography> */}
									</div>
								</div>
							</div>
						</div>

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

export default ViewVerificationSheet;

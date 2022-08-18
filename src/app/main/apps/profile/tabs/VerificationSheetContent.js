import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import {useParams} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeVerificationSheetDialog,
	getVerificationSheetData,
	getIndexDetails
} from '../store/ProfileSlice';


function PatientExamInfo(props) {
	const verificationData = props.verificationData;
	const generalData = props.generalData;
	return(
		<div className="flex mb-24">
			<div className="flex flex-col justify-center w-1/2 w-1-2 mr-4 sm:border-2 border-2" style={{ backgroundColor: '#E7E6E6' }}>
				<div className="mb-4 text-center sm:border-b-2 border-b-2">
					<Typography className="font-bold text-15">PATIENT DETAILS</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">Patient Id: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-2-5 ml-8">{generalData.patient_id}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">Name: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-2-5 ml-8">{generalData.lname}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">DOB: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-2-5 ml-8">{moment(generalData.dob).format('MM-DD-YYYY')}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">Mobile: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-2-5 ml-8">{generalData.patient_phone}</Typography>
				</div>
			</div>
			<div className="flex flex-col justify-center w-1/2 w-1-2 ml-8 sm:border-2 border-2" style={{ backgroundColor: '#DEEDF6' }}>
				<div className="mb-4 text-center sm:border-b-2 border-b-2">
					<Typography className="font-bold text-15">Exam Information</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">Exam Date: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-2-5 ml-8">{generalData && moment(generalData.scheduling_date).format('MM-DD-YYYY')}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">Acc#: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-2-5 ml-8">{generalData && generalData.exam_access_no}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">CPT: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-2-5 ml-8">{verificationData && verificationData.cpt}</Typography>
				</div>
				<div className="flex mb-4">
					<Typography className="font-bold mb-4 text-15 w-2/5 w-2-5 text-right">Procedure: </Typography>
					<Typography className="mb-4 text-15 w-2/5 w-3-5 ml-8 break-word">{generalData && generalData.procedure}</Typography>
				</div>
			</div>
		</div>
	);
}

function VerificationSheetContent(props) {
	const dispatch = useDispatch();
	const { exam_id, id } = useParams();
	const routeParams = useParams();
	const { verificationDetail } = props;
	const [verificationData, setVerificationData] = useState({});
	const [everificationData, setEVerificationData] = useState({});
	const [generalData, setGeneralData] = useState({});
	const [indexDetail, setIndexDetail] = useState({});
    
	useEffect(() => {
		 const indexData = JSON.parse(localStorage.getItem('Index_Details'));
		 setIndexDetail(indexData);
	}, []);

	useEffect(() => {
		if(verificationDetail && verificationDetail.data) {
			setVerificationData(verificationDetail.data[0]);
			setGeneralData(verificationDetail.data[0].general_data);
			setEVerificationData(verificationDetail.data[0].electronic_insurance_verification);
		}
	}, [verificationDetail]);

	if (verificationDetail == null) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularStatic />
			</div>
		);
	}

	return (
		<>
			<div className="flex mb-24 sm:border-2 border-2">
				<div className="flex justify-center w-2/5 w-2-5 mr-4 sm:border-r-2 border-r-2">
					<img className="logo-icon " src={indexDetail.index_logo} alt="logo" />			
				</div>
				<div className="flex flex-col items-center justify-around w-3/5 w-3-5 sm:border-l-2 border-l-2">
					<Typography variant="h6" className="font-bold">FINANCIAL RESPONSIBILITY SUMMARY</Typography>
					<Typography className="font-bold text-15">Today's Date: {moment().format('MM-DD-YYYY')}</Typography>
				</div>
			</div>

			<PatientExamInfo verificationData={verificationData} generalData={generalData}></PatientExamInfo>
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-1/2 w-1-2 mr-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Ordering Physician: {generalData.ref}</Typography>
					</div>
				</div>
				<div className="flex flex-col justify-center w-1/2 w-1-2 ml-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Phone: {generalData.ref_phone}</Typography>
					</div>
				</div>
			</div>
			
			{verificationData && verificationData.self_pay1 &&
				<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full mr-4 sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">SELF PAY PATIENT</Typography>
					</div>
				</div>
				</div> }

			{verificationData && verificationData.primart_insurance &&
				<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full mr-4 sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center sm:border-b-2 border-b-2 p-8">
						<Typography className="font-bold text-20">PRIMARY FINANCIAL DETAIL</Typography>
					</div>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Payers Details</Typography>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Payer: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.insurance_company_name1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Payer's Phone: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.insurance_company_phone1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full sm:border-b-2 border-b-2">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Member ID: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.member_id1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Group Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.group_id1}</Typography>
						</div>
					</div>
					<div className="mb-4 text-center sm:border-b-2 border-b-2 p-8">
						<Typography className="font-bold text-20">Coverage Details</Typography>
					</div>
					<div className="flex justify-center items-center w-full sm:border-b-2 border-b-2 mb-4">
						<div className="flex mb-4 w-1/3 w-1-3 justify-center">
							<Typography className="font-bold text-15 w-1/2 w-1-2">EFFECTIVE DATE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.effective_date1 === 'N/A' ? 'N/A' : moment(verificationData.primart_insurance.effective_date1).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3 justify-center">
							<Typography className="font-bold text-15 w-2/3 w-2-3">POLICY EXPIRED ?: </Typography>
							<Typography className="ml-8 text-15 w-1/3 w-1-3">{verificationData.primart_insurance.policy_expire1}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3 justify-center">
							<Typography className="font-bold text-15 w-2/3 w-2-3">ACTIVE COVERAGE: </Typography>
							<Typography className="ml-8 text-15 w-1/3 w-1-3">{verificationData.primart_insurance.active_coverage4}</Typography>
						</div>
					</div>
					<div className="flex justify-center mb-8 text-center">
						<Typography className="text-20 mr-4">THIS INSURANCE PLAN</Typography>
						{verificationData.primart_insurance.deductable_due_amount1 > 0 ?
						<Typography className="font-bold text-20 underline">HAS A DEDUCTIBLE</Typography> :
						<Typography className="font-bold text-20 underline">DOES NOT HAVE A DEDUCTIBLE</Typography>}
					</div>
					{verificationData.primart_insurance.deductable_amount1 > 0 &&
					<div className="flex justify-center mb-8 text-center">
						<Typography className="text-20 mr-4">THE DEDUCTIBLE </Typography>
						{verificationData.primart_insurance.deductable_amount1 === verificationData.primart_insurance.deductable_meet_amount1 ?
						<Typography className="font-bold text-20 underline">HAS BEEN MEET</Typography>:
						<Typography className="font-bold text-20 underline">HAS NOT BEEN MEET</Typography>}
					</div>}

					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Co-Insurance: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.co_insurance1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Copay: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">${verificationData.primart_insurance.co_pay_amount1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Plan Deductible Amount: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">${verificationData.primart_insurance.deductable_amount1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible Paid: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">${verificationData.primart_insurance.deductable_meet_amount1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Remaining Deductible: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">${verificationData.primart_insurance.deductable_amount1 !== 'N/A' && verificationData.primart_insurance.deductable_meet_amount1 !== "N/A" ? verificationData.primart_insurance.deductable_amount1 - verificationData.primart_insurance.deductable_meet_amount1 : 'N/A'}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Exam Allowable Amount: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">${verificationData.primart_insurance.allowed_amount1}</Typography>
						</div>
					</div>
					<div className="mb-4 text-center sm:border-b-2 border-b-2 sm:border-t-2 p-8">
						<Typography className="font-bold text-20">Authorization Details</Typography>
					</div>
					<div className="flex justify-center mb-8 text-center">
						<Typography className="text-20 mr-4">This Plan</Typography>
						<Typography className="font-bold text-20 underline mr-4">Require an Authorization</Typography>
						<Typography className="text-20">For This Specific Exam.</Typography>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.authorization_referral1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Spoke to / Ref: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.spoke_to_reference1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization Date : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.authorization_referral1_date}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Exam Allowable Amount: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.primart_insurance.allowed_amount1}</Typography> */}
						</div>
					</div>
					<div className="mb-4 text-center sm:border-t-2 p-8">
						<Typography className="font-bold text-20">Collect From Patient: {verificationData.primart_insurance.collect_from_patient1}</Typography>
					</div>
				</div>
			</div>}

			{verificationData && verificationData.auto_accident1 && 
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full mr-4 sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center sm:border-b-2 border-b-2">
						<Typography className="font-bold text-20">PIP FINANCIAL DETAIL</Typography>
					</div>
					<div className="flex justify-center w-full sm:border-b-2 border-b-2">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">EFFECTIVE DATE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.date === "N/A" ? "N/A" : moment(verificationData.auto_accident1.date).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">ACTIVE COVERAGE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.active_coverage1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Ins. Comp Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.insurance_company_name1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Ins. Company Phone : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_insurance_phone}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Claim Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_insurance_clam1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Policy Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_insurance_policy_no1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Date of Accident: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.doa === 'N/A' ? 'N/A' : moment(verificationData.auto_accident1.doa).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Does the Patient have Med Pay: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_med_pay}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Benefits Remaining: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_benefit_remaining}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Does the Patient have any attorney: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.active_coverage1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Remaining Amount: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_deductable_due_amount}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Does the Patient have any attorney: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.active_coverage1}</Typography> */}
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_adjuster_name}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_adjuster_phone}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Fax: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.auto_adjuster_fax}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.active_coverage1}</Typography> */}
						</div>
					</div>

					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Attorney`s Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.attorney_name1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Attorney`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.attorney_phone1}</Typography>
						</div>
					</div>
				</div>
			</div>}

			{verificationData && verificationData.lop_accident1 && 
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full mr-4 sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center sm:border-b-2 border-b-2">
						<Typography className="font-bold text-20">LOP FINANCIAL DETAIL</Typography>
					</div>
					<div className="flex justify-center w-full sm:border-b-2 border-b-2">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">EFFECTIVE DATE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.date === "N/A" ? "N/A" : moment(verificationData.lop_accident1.date).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">ACTIVE COVERAGE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.active_coverage2}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Claim Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_insurance_clam1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Policy Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_insurance_policy_no1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Date of Accident: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_accident_date1 === 'N/A' ? 'N/A': moment(verificationData.lop_accident1.lop_accident_date1).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">Does the Patient have Med Pay: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.lop_accident1.lop_med_pay}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Benefits Remaining: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_benefit_remaining}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">Does the Patient have any attorney: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.lop_accident1.active_coverage1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Remaining Amount: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_deductable_amount - verificationData.lop_accident1.lop_deductable_meet_amount}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Does the Patient have any attorney: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.active_coverage1}</Typography> */}
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_adjuster_name}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_adjuster_phone}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Fax: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_adjuster_fax}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.active_coverage1}</Typography> */}
						</div>
					</div>

					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Attorney`s Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_attorney_name1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Attorney`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.lop_accident1.lop_attorney_phone1}</Typography>
						</div>
					</div>
				</div>
			</div>}

			{verificationData && verificationData.company_accident1 && 
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full mr-4 sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center sm:border-b-2 border-b-2">
						<Typography className="font-bold text-20">WORKER`S COMPENSATION FINANCIAL DETAIL</Typography>
					</div>
					<div className="flex justify-center w-full sm:border-b-2 border-b-2">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">EFFECTIVE DATE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.date === 'N/A' ? "N/A" :moment(verificationData.company_accident1.date).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">ACTIVE COVERAGE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.active_coverage3}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Ins. Comp Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.company_accident_name1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Ins. Company Phone : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.company_insurance_phone}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Claim Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.company_accident_clam1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Auth  Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.company_accident_policy_no1}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Date of Accident: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.company_accident_date1 === 'N/A' ? 'N/A' : moment(verificationData.company_accident1.company_accident_date1).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">Does the Patient have Med Pay: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.company_accident1.worker_med_pay}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Benefits Remaining: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.worker_benefit_remaining}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold text-15 w-1/2 w-3-5 text-right">Does the Patient have any attorney: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.company_accident1.active_coverage1}</Typography> */}
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Remaining Amount: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.worker_deductable_amount - verificationData.company_accident1.worker_deductable_meet_amount}</Typography>
						</div>
					</div>
					{/* <div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Remaining Amount: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2"></Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
						</div>
					</div> */}
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.worker_adjuster_name}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">Adjuster`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.company_accident1.worker_adjuster_phone}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Fax: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.worker_adjuster_fax}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Adjuster`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.auto_accident1.active_coverage1}</Typography> */}
						</div>
					</div>

					{/* <div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Attorney`s Name: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.attorney_name1}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Attorney`s Phone Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.company_accident1.attorney_phone1}</Typography>
						</div>
					</div> */}
				</div>
			</div>}

			
			{verificationData && verificationData.secondary_insurance && 
			<>
			<div className="page-break"></div>
			<div className="flex mb-24 sm:border-2 border-2">
				<div className="flex justify-center w-2/5 w-2-5 mr-4 sm:border-r-2 border-r-2">
					<img className="logo-icon " src={indexDetail.index_logo} alt="logo" />			
				</div>
				<div className="flex flex-col items-center justify-around w-3/5 w-3-5 sm:border-l-2 border-l-2">
					<Typography variant="h6" className="font-bold">FINANCIAL RESPONSIBILITY SUMMARY</Typography>
					<Typography className="font-bold text-15">Today's Date: {moment().format('MM-DD-YYYY')}</Typography>
				</div>
			</div>

			<PatientExamInfo verificationData={verificationData} generalData={generalData}></PatientExamInfo>
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-1/2 w-1-2 mr-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Ordering Physician: {generalData.ref}</Typography>
					</div>
				</div>
				<div className="flex flex-col justify-center w-1/2 w-1-2 ml-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Phone: {generalData.ref_phone}</Typography>
					</div>
				</div>
			</div>

			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full mr-4 sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center sm:border-b-2 border-b-2 p-8">
						<Typography className="font-bold text-20">SECONDARY FINANCIAL DETAIL</Typography>
					</div>
					<div className="flex justify-center w-full sm:border-b-2 border-b-2 mb-8">
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">EFFECTIVE DATE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.effective_date2 === 'N/A' ? 'N/A' :  moment(verificationData.secondary_insurance.effective_date2).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">POLICY EXPIRED ?: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.secondary_insurance.policy_expire2}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">ACTIVE COVERAGE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.secondary_insurance.active_coverage5}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Payer: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.insurance_company_name2}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Payer's Phone : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.insurance_company_phone2}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Member ID: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.member_id2}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Group Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.group_id2}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.deductable2}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible Met: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.deductable_meet2}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.deductable_amount2}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible Met: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.deductable_meet_amount2}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">Deductible Remaining: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.secondary_insurance.deductable_due_amount2}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization Req: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.authorization_referral_required2}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.authorization_referral2}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization Date: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{moment(verificationData.secondary_insurance.authorization_referral2_date).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Spoke to / Ref: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.secondary_insurance.spoke_to_reference2}</Typography>
						</div>
					</div>
				</div>
			</div>
			</>}
			
			{verificationData && verificationData.tertairy_insurance && 
			<>
			<div className="flex mb-24 sm:border-2 border-2">
				<div className="flex justify-center w-2/5 w-2-5 mr-4 sm:border-r-2 border-r-2">
					<img className="logo-icon " src={indexDetail.index_logo} alt="logo" />			
				</div>
				<div className="flex flex-col items-center justify-around w-3/5 w-3-5 sm:border-l-2 border-l-2">
					<Typography variant="h6" className="font-bold">FINANCIAL RESPONSIBILITY SUMMARY</Typography>
					<Typography className="font-bold text-15">Today's Date: {moment().format('MM-DD-YYYY')}</Typography>
				</div>
			</div>

			<PatientExamInfo verificationData={verificationData} generalData={generalData}></PatientExamInfo>
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-1/2 w-1-2 mr-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Ordering Physician: {generalData.ref}</Typography>
					</div>
				</div>
				<div className="flex flex-col justify-center w-1/2 w-1-2 ml-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Phone: {generalData.ref_phone}</Typography>
					</div>
				</div>
			</div>
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full mr-4 sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center sm:border-b-2 border-b-2 p-8">
						<Typography className="font-bold text-20">SECONDARY FINANCIAL DETAIL</Typography>
					</div>
					<div className="flex justify-center w-full sm:border-b-2 border-b-2 mb-8">
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">EFFECTIVE DATE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.effective_date3 === 'N/A' ? 'N/A' : moment(verificationData.tertairy_insurance.effective_date3).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">POLICY EXPIRED ?: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.tertairy_insurance.policy_expire3}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">ACTIVE COVERAGE: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.tertairy_insurance.active_coverage6}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Payer: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.insurance_company_name3}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Payer's Phone : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.insurance_company_phone3}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Member ID: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.member_id3}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Group Number: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.group_id3}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.deductable3}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible Met: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.deductable_meet3}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.deductable_amount3}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Deductible Met: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.deductable_meet_amount3}</Typography>
						</div>
						<div className="flex mb-4 w-1/3 w-1-3">
							<Typography className="font-bold text-15 w-1/2 w-3-5 text-right">Deductible Remaining: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{verificationData.tertairy_insurance.deductable_due_amount3}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization Req: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.authorization_referral_required3}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.authorization_referral3}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full mb-4">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Authorization Date: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{moment(verificationData.tertairy_insurance.authorization_referral3_date).format('MM-DD-YYYY')}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold text-15 w-1/2 w-1-2 text-right">Spoke to / Ref: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{verificationData.tertairy_insurance.spoke_to_reference3}</Typography>
						</div>
					</div>
				</div>
			</div>
			</>}

			{everificationData && 
			<>
			<div className="page-break"></div>
			<div className="flex mb-24 sm:border-2 border-2">
				<div className="flex justify-center w-2/5 w-2-5 mr-4 sm:border-r-2 border-r-2">
					<img className="logo-icon " src={indexDetail.index_logo} alt="logo" />			
				</div>
				<div className="flex flex-col items-center justify-around w-3/5 w-3-5 sm:border-l-2 border-l-2">
					<Typography variant="h6" className="font-bold">Electronic Insurance Verification Results</Typography>
					<Typography className="font-bold text-15">Today's Date: {moment().format('MM-DD-YYYY')}</Typography>
				</div>
			</div>
			<PatientExamInfo verificationData={verificationData} generalData={generalData}></PatientExamInfo>
			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-1/2 w-1-2 mr-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Ordering Physician: {generalData.ref}</Typography>
					</div>
				</div>
				<div className="flex flex-col justify-center w-1/2 w-1-2 ml-4 sm:border-2 border-2" style={{ backgroundColor: '#FFF3CB' }}>
					<div className="mb-4 text-center">
						<Typography className="font-bold text-15">Phone: {generalData.ref_phone}</Typography>
					</div>
				</div>
			</div>

			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="mb-4 text-center sm:border-b-2 border-b-2 p-8">
						<Typography className="font-bold text-20">FINANCIAL DETAILS via Electronic Insurance Request</Typography>
					</div>
					<div className="flex mb-4 justify-center sm:border-b-2 border-b-2">
						<Typography className="font-bold text-15 mr-20">Payer: </Typography>
						<Typography className="font-bold text-15">Provider: </Typography>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">NPI : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.NPI}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Eligibility Status : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.EligibilityStatus}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Estimate Status : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.EstimateStatus}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold mb-4 text-15 w-1/2 text-right">Eligibility Status: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">N/A</Typography> */}
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Validate Date : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.ValidationDate}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Policy Number : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.PolicyNumber}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Plan Name : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.PlanName}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold mb-4 text-15 w-1/2 text-right">Eligibility Status: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">N/A</Typography> */}
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Individual Deductible : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.IndividualDeductible}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Family Deductible: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.FamilyDeductible}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Individual Deductible Met : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.IndividualDeductibleMet}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Family Deductible Met: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.FamilyDeductibleMet}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Co-Insurance : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.CoInsurance}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Co Pay: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.CoPay}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Total Charge Amount : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.TotalChargedAmount}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-3-5 text-right">Total Insurance Responsibility : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-2-5">{everificationData.TotalInsuranceResponsibility}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Total Patient Responibility : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.TotalPatientResponsibility}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							{/* <Typography className="font-bold mb-4 text-15 w-1/2 text-right">Total Insurance Responsibility : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">N/A</Typography> */}
						</div>
					</div>
				</div>
			</div>

			<div className="flex mb-24">
				<div className="flex flex-col justify-center w-full sm:border-2 border-2" style={{ backgroundColor: 'rgb(197, 224, 178)' }}>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Individual Out Of Pocket : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.IndividualOOP}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Family Out Of Pocket : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.FamilyOOP}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Individual Out Of Pocket Met : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.IndividualOOPMet}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">Family Out Of Pocket Met: </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.FamilyOOPMet}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right break-word">Deductible Applies to Out Of Pocket : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.DeductibleAppliesToOOP}</Typography>
						</div>
						<div className="flex mb-4 w-1/2 w-1-2">
							<Typography className="font-bold mb-4 text-15 w-1/2 w-1-2 text-right">High Deductible Plan : </Typography>
							<Typography className="ml-8 text-15 w-1/2 w-1-2">{everificationData.HighDeductiblePlan}</Typography>
						</div>
					</div>
				</div>
			</div></>}
		</>
	);
}

export default VerificationSheetContent;

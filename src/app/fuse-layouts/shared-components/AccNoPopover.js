import React, { useState, useEffect } from 'react';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';

function AccNoPopover(props) {
	const { insuranceInfo, examId, allAttorney } = props;
	const [state, setState]=useState({});

	useEffect(() => {
		if (insuranceInfo && insuranceInfo.length > 0) {
			const insurance = insuranceInfo.find(i=> {
				if(i.insuranceData === null) {
					return null;
				}
				if(i.insuranceData && i.insuranceData.exam_id === examId) {
					return i;
				}
			});
			if(!insurance) {
				return;
			}
			const insuranceData = insurance.insuranceData;
			if(insuranceData.primary_insurance === "Yes" && insuranceData.company_accident1 !== "Yes" && insuranceData.auto_accident1 !== "Yes" && insurance.lop_accident1 !== "Yes") {
				state.payerType = "Commercial Health Insurance";
				state.companyName =  insurance.companydata.insurance_company_name1;
				state.companyName +=  insurance.companydata.insurance_company_address1 && insurance.companydata.insurance_company_address1 !== '' ? ", " + insurance.companydata.insurance_company_address1 : '';
				state.memberID = insuranceData.member_id1;
				state.coPayAmount = insuranceData.co_pay_amount1;
				state.allowedAmount = insuranceData.allowed_amount1;
				state.collectFrom = insuranceData.collect_from_patient;
				if(insuranceData.authorization_referral_required1 === "Yes") {
					state.authorizationReferral = insuranceData.authorization_referral1;
					state.authorizationReferralDate = insuranceData.authorization_referral1_date;
				}
			}
			else if(insuranceData.company_accident1 === "Yes") {
				state.payerType = "Worker's Compensation";
				state.companyName =  insurance.companydata.company_accident_name1;
				state.companyName +=  insuranceData.company_accident_address1 && insuranceData.company_accident_address1 !== '' ? ", " + insuranceData.company_accident_address1 : '';
				state.autoInsuranceClam = insuranceData.company_accident_clam1;
				state.autoAccidentDate = insuranceData.company_accident_date1;
				// if(insuranceData.lop_attorney === "Yes") {
				// 	const attorney = allAttorney.find(c=> c.id === parseInt(insuranceData.lop_attorney_name1));
				// 	state.attorneyName = attorney.name;
				// 	state.attorneyPhone = attorney.phone;
				// }
			}
			else if(insuranceData.auto_accident1 === "Yes") {
				state.payerType = "Auto Insurance";
				state.companyName =  insurance.companydata.auto_insurance_company_name1;
				state.companyName +=  insurance.companydata.auto_insurance_company_address1 && insurance.companydata.auto_insurance_company_address1 !== '' ? ", " + insurance.companydata.auto_insurance_company_address1 : '';
				state.autoInsuranceClam = insuranceData.auto_insurance_clam1;
				state.autoAccidentDate = insuranceData.auto_accident_date1;
				// if(insuranceData.auto_attorney === "Yes") {
				// 	const attorney = allAttorney.find(c=> c.id === parseInt(insuranceData.attorney_name1));
				// 	state.attorneyName = attorney.name;
				// 	state.attorneyPhone = attorney.phone;
				// }
			}
			else if(insuranceData.lop_accident1 === "Yes") {
				state.payerType = "LOP";
				// state.companyName =  insurance.companydata.lop_insurance_company_name1;
				// state.companyName +=  insurance.companydata.lop_insurance_company_address1 && insurance.companydata.lop_insurance_company_address1 !== '' ? ", " + insurance.companydata.lop_insurance_company_address1 : '';
				state.autoInsuranceClam = insuranceData.lop_insurance_clam1;
				state.autoAccidentDate = insuranceData.lop_accident_date1;
				// if(insuranceData.lop_attorney === "Yes") {
				// 	const attorney = allAttorney.find(c=> c.id === parseInt(insuranceData.lop_attorney_name1));
				// 	state.attorneyName = attorney.name;
				// 	state.attorneyPhone = attorney.phone;
				// }
			}
			else if(insurance.self_pay1 === "Yes")
				state.payerType = "Self Pay";
			setState({ ...state });
		}
	}, [insuranceInfo]);
	if(Object.keys(state).length === 0) {
		return null;
	}
	return (
		<Popover
			id="refPopover"
			open={props.open}
			anchorEl={props.anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			onClose={props.refMenuClose}
			classes={{
				paper: 'py-8 rounded-2xl'
			}}
		>
			<Box p={2}>
				{state.payerType &&
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Payer Type:</Typography>
					<Typography className="font-700 text-15">{state.payerType}</Typography>
				</div>}
				{state.companyName &&
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Company Name:</Typography>
					<Typography className="font-700 text-15">{state.companyName}</Typography>
				</div>}
				{state.memberID && 
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Member ID:</Typography>
					<Typography className="font-700 text-15">{state.memberID}</Typography>
				</div>}
				{state.coPayAmount && state.coPayAmount !== '' && 
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Co Pay Amount:</Typography>
					<Typography className="font-700 text-15">{state.coPayAmount}</Typography>
				</div>}
				{state.allowedAmount && state.allowedAmount !== ''&&
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Exam Allowable Amount:</Typography>
					<Typography className="font-700 text-15">{state.allowedAmount}</Typography>
				</div>}
				{state.collectFrom && state.collectFrom !== '' && 
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Collect From Patient:</Typography>
					<Typography className="font-700 text-15">{state.collectFrom}</Typography>
				</div>}
				{state.authorizationReferral && 
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Authorization / Referral:</Typography>
					<Typography className="font-700 text-15">{state.authorizationReferral}</Typography>
				</div>}
				{state.authorizationReferralDate &&
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Authorization Date:</Typography>
					<Typography className="font-700 text-15">{moment(state.authorizationReferralDate).format("MM-DD-YYYY")}</Typography>
				</div>}
				{state.autoInsuranceClam && 
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Claim:</Typography>
					<Typography className="font-700 text-15">{state.autoInsuranceClam}</Typography>
				</div>}
				{state.autoAccidentDate &&
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Date of Accident:</Typography>
					<Typography className="font-700 text-15">{moment(state.autoAccidentDate).format("MM-DD-YYYY")}</Typography>
				</div>}
				{state.attorneyName && 
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Attorney Name:</Typography>
					<Typography className="font-700 text-15">{state.attorneyName}</Typography>
				</div>}
				{state.attorneyPhone && 
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Attorney Phone:</Typography>
					<Typography className="font-700 text-15">{state.attorneyPhone}</Typography>
				</div>}
			</Box>
		</Popover>
	);
}

export default AccNoPopover;

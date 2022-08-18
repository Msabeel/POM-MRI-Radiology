import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';
import { useLocation, useParams } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import history from '@history';
import { getFinalReport } from 'app/main/apps/profile/store/ProfileSlice';
import CreateFormDialog from 'app/main/apps/profile/tabs/CreateFormDialog';
import useCustomNotify from './useCustomNotify';
import { DocumentPreview } from './DocumentPreview';
import { AuditPreview } from './AuditPreview';
import loadable from '@loadable/component'
import { useForm } from '@fuse/hooks';
import {
	openPatientAccessDialog,
	openPatientAccessPrintPage,
	getRequestAlertsData,
	clearPatientAccessResponse
} from 'app/fuse-layouts/shared-components/quickPanel/store/dataSlice';
import PatientAccessDialog from 'app/fuse-layouts/shared-components/PatientAccessDialog';
import PatientAccessPrintDialog from 'app/fuse-layouts/shared-components/PatientAccessPrintDialog';
import PatientArrive from 'app/main/apps/profile/tabs/PatientArrive';
import TechHold from 'app/main/apps/profile/tabs/techHold'
import moment from 'moment';

const ViewNotes = loadable(() => import('../../main/apps/profile/tabs/ViewNotes'));

function ActionsSwitcher({
	patient,
	patientData,
	changedStatus,
	setUploadFinalModel,
	isGrid,
	onFinalReportSubmit,
	handlePayload,
	s3Cred,
	currentStatus,
	selectedID,
	selectedScheduleDate,
	modalityID
}) {
	const dispatch = useDispatch();
	const location = useLocation();
	const CustomNotify = useCustomNotify();
	const { pathname } = location;
	const { id, name, exam_id } = useParams()
	const [menu, setMenu] = useState(null);
	const [isFetch, setIsFetch] = useState(false);
	const [open, setOpen] = useState(false);
	const [openFinalReport, setOpenFinalReport] = useState(false);
	const [accessNo, setAccessNo] = useState(0);
	const [exam, setExam] = useState('');
	const [model, setModel] = useState(false);
	const [isAuditOpen, setIsAuditOpen] = useState(false);
	const [isNotesOpen, setIsNotesOpen] = useState(false);
	const [isArriveOpen, setIsArriveOpen] = useState(false);
	const [isTechHoldOpen, setTechHoldOpen] = useState(false)
	const [isOpenFax, setIsFaxOpen] = useState(false);
	const [isOpenShare, setIsShareOpen] = useState(false);
	const [selectedDoc, setSelectedDoc] = useState([]);
	const [currentExam, setCurrentExam] = useState(null);
	const { form, handleChange, setForm } = useForm({});
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);

	console.log('currentStatus',currentStatus)
	const data = useSelector(({ quickPanel }) => quickPanel.data);
	const langMenuClick = event => {
		setMenu(event.currentTarget);
	};

	const langMenuClose = () => {
		setMenu(null);
	};

	// useEffect(() => {
	// 	if (exam_id === patient.access_no) {
	// 		setModel(true);
	// 	}
	// }, [exam_id]);

	useEffect(() => {
		if (data && data.patientAccessResponse) {
			const { patientAccessResponse } = data;
			if (patientAccessResponse.maildata && patientAccessResponse.maildata.length > 0) {
				setOpenPatientAccessMailSent(true);
				//dispatch(getRequestAlertsData());
			}
			if (patientAccessResponse.PrintPage && patientAccessResponse.PrintPage.length > 0) {
				dispatch(openPatientAccessPrintPage(patientAccessResponse.PrintPage));
				//dispatch(getRequestAlertsData());
			}
			// dispatch(clearPatientAccessResponse());
		}
	}, [data]);

	function handleUploadDoc() {
		if (pathname.indexOf('profile-page') < 0) {
			history.push(`/apps/uploads-document/${id}/${patient.access_no}/${name}`)
		} else {
			history.push(`/apps/uploads-doc-page/${id}/${patient.access_no}/${name}`)
		}
		langMenuClose();
	}
	const handleClosePatientAccessMailSent = (event, reason) => {
		setOpenPatientAccessMailSent(false);
	};
	function handleFaxPage() {
		setIsFaxOpen(true)
		var data = {
			id: patientData.patientInfo.id,
			printAction: true,
			type: "documents",
			emailAction: true
		}
		dispatch(openPatientAccessDialog(data));
		// if (pathname.indexOf('profile-page') < 0) {
		// history.push(`/apps/fax-page/${id}/${patient.access_no}/${name}`)
		// } else {
		// 	history.push(`/apps/uploads-doc-page/${id}/${patient.access_no}/${name}`)
		// }
		// langMenuClose();
	}
	function handleSharePage() {
		setIsShareOpen(true)
		dispatch(openPatientAccessDialog(patientData.patientInfo));
		// var data = {
		// 	id: patientData.patientInfo.id,
		// 	printAction: true,
		// 	type: "documents",
		// 	emailAction: true
	}
	useEffect(() => {
		if (patientData && patientData.exams.length > 0) {
			const exam = patientData.exams.find(e => e.exam_id === patient.access_no);
			setCurrentExam(exam);
		}
	}, [patientData]);
	function handleCancelExam() {
		if (pathname.indexOf('profile-page') < 0) {
			history.push(`/apps/exam-cancelled/${id}/${patient.access_no}/${name}`)
		}
		else {
			history.push(`/apps/exam-cancel/${id}/${patient.access_no}/${name}`)
		}
		langMenuClose();
	}

	const handleFetchFinalReport = async () => {
		setIsFetch(true)
		var data = {
			exam_access_no: patient.access_no
		}
		const result = await dispatch(getFinalReport(data));
		if (result.payload.getFinalReportError !== true)
			window.open(result.payload.data.link);
		setIsFetch(false)
		langMenuClose();
	}

	// const handleTechSheet = () => {
	// 	const user = awsService.getUserDetail();
	// 	const eid = examId;
	// 	const p_id = patientData.patientInfo.id;
	// 	const pname = patientData.patientInfo.lname + ',' + patientData.patientInfo.fname;
	// 	const tech_id = user.data.userId;
	// 	window.open(
	// 		`${CustomSettings.BackURL}/dailyworkflow/techform/eid/${eid}/p_id/${p_id}/pname/${pname}/tech_id/${tech_id}`,
	// 		'_blank'
	// 	);
	// }
	// const handleDicom = () => {
	// 	const user = awsService.getUserDetail();
	// 	const user_id = user.data.userId;
	// 	const userName = user.data.userName;
	// 	let currentDate = new Date();
	// 	//http://import.pomrispacs.com:9090/CDImport?un=4545688785&userid=13653&an=621539&token=d2ddea18f00665ce8623e36bd4e3c7c5
	// 	window.open(
	// 		`http://import.pomrispacs.com:9090/CDImport?un=${userName}&userid=${user_id}&an=${patient.access_no}&token=${currentDate.getTime()}`,
	// 		'_blank'
	// 	);
	// }

	function handleEditInsuarance(event) {
		const acc_number = patient.access_no;
		history.push(`/apps/insuranceInfo/${id}/${acc_number}/${name}`)
	}

	const getSelectedDocs = useCallback(
		(doc) => {
			let temp2 = JSON.parse(JSON.stringify(exam.auditData));
			let index = temp2.indexOf(doc);
			if (index > -1) {
				// var tempd = temp2.splice(index, 1);
				var tempd = temp2.filter(function (ele) {
					return ele != doc;
				});
				setSelectedDoc([...tempd])
			} else {
				setSelectedDoc([...selectedDoc, doc])
			}
		},

	);

	const onViewClick = async(event) => {
		
		window.location.href = `https://www.google.com/`
	};
	return (
		<>
			<SnackBarAlert snackOpen={openPatientAccessMailSent} onClose={handleClosePatientAccessMailSent} text="Patient portal access mail sent successfully." />
			<Button className="h-40 w-64" onClick={langMenuClick}>
				<Typography className="mx-4 font-bold">
					Actions
				</Typography>
				<ExpandMoreIcon style={{ fontSize: '28px' }} />
			</Button>

			<Popover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={langMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>

{
(currentStatus!="tech hold" &&  currentStatus!="Exam Cancelled" 
&& currentStatus!='arrive' &&
new moment().format('YYYY-MM-DD')===selectedScheduleDate) &&
				
(
	<MenuItem key="arrive" onClick={() => setIsArriveOpen(true)}>
					{/* <ListItemIcon className="min-w-40">
								<NotesIcon />
							</ListItemIcon> */}
					<ListItemText primary="Arrive" />
				</MenuItem>
)
}

{
(currentStatus!="tech hold" &&  currentStatus!="Exam Cancelled" ) 
&&			
(
	<MenuItem key="sentpaperwork" onClick={() => alert("paper work sent")}>
					{/* <ListItemIcon className="min-w-40">
								<NotesIcon />
							</ListItemIcon> */}
					<ListItemText primary="Sent Paper Work" />
				</MenuItem>
)
}

				<MenuItem key="audit" onClick={() => setIsAuditOpen(true)}>
					{/* <ListItemIcon className="min-w-40">
								<PermIdentityIcon />
							</ListItemIcon> */}
					<ListItemText primary="Audits" />
				</MenuItem>

				{patient.status !== "Exam Cancelled" && patient.status !== 'rad final report' &&
					(
						changedStatus !== "rad final report" ?
							<MenuItem key='cancel' onClick={() => handleCancelExam()}>
								{/* <ListItemIcon className="min-w-40">
									<CancelPresentationIcon />
								</ListItemIcon> */}
								<ListItemText primary="Cancel" />
							</MenuItem>
							: null
					)
				}

				<MenuItem key="documents" onClick={() => setModel(true)}>
					{/* <ListItemIcon className="min-w-40">
								<DescriptionIcon />
							</ListItemIcon> */}
					<ListItemText primary="Documents" />
				</MenuItem>


				<MenuItem key="email" title="Email Patient Access" onClick={() => handleFaxPage()}>
					{/* <ListItemIcon className="min-w-40">
								<NotesIcon />
							</ListItemIcon> */}
					<ListItemText primary="Email" />
				</MenuItem>
				<MenuItem key="notes" onClick={() => setIsNotesOpen(true)}>
					{/* <ListItemIcon className="min-w-40">
								<NotesIcon />
							</ListItemIcon> */}
					<ListItemText primary="Notes" />
				</MenuItem>

				{
					changedStatus == "rad final report" ?
						<MenuItem key='report' onClick={() => handleFetchFinalReport()}>
							{/* <ListItemIcon className="min-w-40">
								{isFetch ? null : <Visibility />}
							</ListItemIcon> */}
							{isFetch ?
								<CircularProgress className="ml-10" color="#fff" size={18} />
								:
								<ListItemText primary="Report" />}
						</MenuItem> :
						<MenuItem key='report' onClick={ev => {
							// setExam(exam.exam)
							// setAccessNo(exam.access_no)
							if (!isGrid) {
								setUploadFinalModel()
							} else {
								setOpenFinalReport(true)
							}
						}}>
							{/* <ListItemIcon className="min-w-40">
								<CloudUploadIcon />
							</ListItemIcon> */}
							{isFetch ?
								<CircularProgress className="ml-10" color="#fff" size={18} />
								:
								<ListItemText primary="Report" />}
						</MenuItem>

				}
				{
					isGrid &&
					<>





						<MenuItem key="share" onClick={() => handleSharePage()}>
							{/* <ListItemIcon className="min-w-40">
								<NotesIcon />
							</ListItemIcon> */}
							<ListItemText primary="Share" />
						</MenuItem>
						{ (currentStatus!="tech hold" &&  currentStatus!="Exam Cancelled") &&
						<MenuItem key="techhold" onClick={() => setTechHoldOpen(true)}>
							{/* <ListItemIcon className="min-w-40">
								<NotesIcon />
							</ListItemIcon> */}
							<ListItemText primary="Tech Hold" />
						</MenuItem>
						}
					</>
				}

				<MenuItem key="upload" onClick={() => handleUploadDoc()}>
					{/* <ListItemIcon className="min-w-40">
						<CloudUploadIcon />
					</ListItemIcon> */}
					<ListItemText primary="Upload" />
				</MenuItem>

				<MenuItem key="viewer" >
					{/* <ListItemIcon className="min-w-40">
								<DescriptionIcon />
							</ListItemIcon> */}
					<ListItemText primary="Viewer" />
				</MenuItem>


				<MenuItem key="viewer FDA " onClick={onViewClick}>
					{/* <ListItemIcon className="min-w-40">
								<DescriptionIcon />
							</ListItemIcon> */}
					<ListItemText primary="Viewer FDA " />
				</MenuItem>



				{/* <MenuItem key="insurance" onClick={() => handleEditInsuarance()}>
					<ListItemText primary="Insurance" />
				</MenuItem>
				<MenuItem key="email" title="Email Patient Access"  onClick={() => handleFaxPage()}>
				</MenuItem> */}



			</Popover>
			{isGrid && model &&
				<DocumentPreview
					// key={index}
					exam_id={patient.access_no}
					isGrid={true}
					patient={patient}
					documents={patient.data}
					selectedDocFunc={getSelectedDocs}
					selectedDoc={selectedDoc}
					isDocOpen={model}
					s3Cred={s3Cred}
					access_no={patient.access_no}
					closeDocument={() => {
						setModel(false)
						langMenuClose()
					}}
				/>}
			{isGrid && isAuditOpen &&
				<AuditPreview
					exam={currentExam}
					isGrid={true}
					isAuditOpen={isAuditOpen}
					s3Cred={s3Cred}
					access_no={patient.access_no}
					exam_id={patient.access_no}
					closeDocument={() => {
						setIsAuditOpen(false)
						langMenuClose()
					}}
				/>}
			{
				isGrid && isNotesOpen &&
				<ViewNotes
					isGrid={true}
					exam_id={patient.access_no}
					isNotesOpen={isNotesOpen}
					exam={currentExam}
					closeNotes={() => {
						setIsNotesOpen(false)
						langMenuClose()
					}}
				/>

			}
			{
				isGrid && isArriveOpen &&
				<PatientArrive
					patientData={patientData}
					name={name}
					id={id}
					isGrid={true}
					exam_id={patient.access_no}
					isArriveOpen={isArriveOpen}
					exam={currentExam}
					closeArrive={() => {
						setIsArriveOpen(false)
						langMenuClose()
					}}
					selectedID={selectedID}
					selectedScheduleDate={selectedScheduleDate}
					modalityID={modalityID}
				/>

			}
			{
				isGrid && isTechHoldOpen &&
				<TechHold
					patientData={patientData}
					name={name}
					id={id}
					isGrid={true}
					exam_id={patient.access_no}
					isTechHoldOpen={isTechHoldOpen}
					exam={currentExam}
					closeTechHold={() => {
						setTechHoldOpen(false)
						langMenuClose()
					}}
					selectedID={selectedID}
					selectedScheduleDate={selectedScheduleDate}
					modalityID={modalityID}
				/>

			}
			{isGrid && openFinalReport &&
				<CreateFormDialog
					isOpen={openFinalReport}
					handleCloseDialog={() => { setOpenFinalReport(false) }}
					onSaved={(msg, status, payload) => {
						if (status === 200) {
							onFinalReportSubmit(msg, payload, status, patient.access_no)
							// handleSuccessOpen()
							// setChangeStatus(msg)
							handlePayload(payload)
						} else {
							// handleOpenError()
						}
						setOpenFinalReport(false)
					}}
					access_no={patient.access_no}
					exam={patient.exam}
				/>
			}
			{/* {
				isOpenFax &&
				<>
					<PatientAccessDialog />
					<PatientAccessPrintDialog />
				</>
			} */}
			{
				isOpenShare &&
				<>
					<PatientAccessDialog />
					<PatientAccessPrintDialog />
					<SnackBarAlert snackOpen={openPatientAccessMailSent} onClose={handleClosePatientAccessMailSent} text="Patient portal access mail sent successfully." />
				</>
			}
		</>
	);
}

export default ActionsSwitcher;

import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useForm} from '@fuse/hooks';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ConfirmationView from '../../pages/patient-portal/ConfirmationView';
import clsx from 'clsx';
import history from '@history'
import React, {useState, useEffect} from 'react';
import {getPatientPortalData, generateReports, requestAccess, generateImages, openConfirmationDialog} from '../../pages/patient-portal/store/patientPortalSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Link} from 'react-router-dom';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {sendPatientAccessMail} from 'app/fuse-layouts/shared-components/quickPanel/store/dataSlice';
import ExamCard from 'app/fuse-layouts/shared-components/ExamCard';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {getDocuments} from './store/faxPageSlice'
// import {getDocuments} from '../uploads-document/store/uploadDocumentSlice';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	accNumber: {
		// backgroundColor:'#ffffff',
		width: '100%',
		justifyContent: "center",
		opacity: 1,
		fontWeight: '700',
		//    padding:"5px"
	},
	leftSection: {},
	rightSection: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

const selected = {
	background: 'rgb(76, 175, 80)',
	color: 'rgba(0, 0, 0, 0.87)',
}
const preSelected = {
	cursor: 'not-allowed',
	pointerEvents: 'none',
	background: 'rgb(76, 175, 80)',
	color: 'rgba(0, 0, 0, 0.87)',
}
const deSelected = {
	background: 'rgb(96, 125, 139)',
	color: 'rgb(255, 255, 255)',
}

const disable = {
	cursor: 'not-allowed',
	pointerEvents: 'none',
}

const enable = {
	cursor: 'pointer',
}


function PatientPortalPage() {
	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);
	const routeParams = useParams();
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const {token, patientId} = useParams();
	const [fechingData, fetchingData] = useState(false);
	const [selectedDocs, setSelectedDocs] = useState([]);
	const [selectedExamData, setSelectedExamData] = useState([]);
	const {form, handleChange, resetForm} = useForm({
		email: ''
	});
	const [exams, setExams] = useState([])
	const [upalodCred, setUploadCred] = useState([])
	const Exams = useSelector((state) => state);

	const confirmationDialog = useSelector(({patientPortalApp}) => patientPortalApp.patientPortal.confirmationDialog);
	const patientDetails = useSelector(({patientPortalApp}) => patientPortalApp.patientPortal.patientDetails);
	const [filteredData, setFilteredData] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [state, setState] = useState({
		selectedExam: [],
		isDownloadImage: false,
		isDownloadReport: false
	})
	const [loading, setLoading] = useState(false);
	const [loadingDImages, setLoadingForDownloadImages] = useState(false);
	const [loadingPage, setLoadingPAge] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [isShowError, showErrorMessage] = React.useState(false);
	const [openedExam, setOpenedExam] = useState("");
	const [selectedExams, setSelectedExam] = useState([]);
	const CustomNotify = useCustomNotify();

	useEffect(() => {
		if (Exams.profilePageApp) {
			setExams(Exams.profilePageApp.profile.examsForFax)
			setUploadCred(Exams.profilePageApp.profile.uploadCred)
			setFilteredData(Exams.profilePageApp.profile.examsForFax)
		}
	}, [])

	useEffect(() => {

		// fetchData();

	}, []);

	async function fetchData() {

		fetchingData(true)
		const result = await dispatch(getDocuments(routeParams));
		const data = result.payload.data;
		console.log("data",data)
		// setSelectedExamData(data);
		setFilteredData(data)
		fetchingData(false)

	}


	// useEffect(() => {
	// 	function setSelectedExam() {
	// 		const selectedExam = [];
	// 		exams.map((item, i) => {
	// 			if (i < 2) {
	// 				selectedExam.push(item.exam_id);
	// 			}
	// 		});
	// 		setState({...state, selectedExam: selectedExam})
	// 	}

	// 	if (filteredData && filteredData.length > 0) {
	// 		setSelectedExam();
	// 	}
	// }, [filteredData]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (!confirmationDialog.props.open && confirmationDialog.data) {
			if (confirmationDialog.data.isSuccess && confirmationDialog.data.isDownloadImage) {
				setLoadingForDownloadImages(true);
			}
			if (confirmationDialog.data.error) {
				showErrorMessage(true);
			}
		}
	}, [confirmationDialog.props.open]);





	function handleSearchText(event) {
		setSearchText(event.target.value);
	}



	const manageExam = (e, data) => {
		let exam = state.selectedExam.find(x => x == data.exam_id);
		if (exam) { //remove from list
			const tempExams = [...state.selectedExam];

			let exmaIndex = tempExams.indexOf(data.exam_id);// get index 
			tempExams.splice(exmaIndex, 1);
			setState({...state, selectedExam: tempExams});
		}
		else {
			if (state.selectedExam.length === 4) {
				CustomNotify("You cannot select more than 4 exams.", "info");
				return;
			}
			const tempExams = [...state.selectedExam];
			tempExams.push(data.exam_id);
			setState({...state, selectedExam: tempExams});
		}
	}

	// show unchecked and checked
	let mystyleCustom;
	const manageCheckUncheckExam = (id) => {
		let exam = state.selectedExam.find(x => x == id);
		if (exam) {
			mystyleCustom = true;

			return true
		}
		else {
			mystyleCustom = false;
			return false
		}
	}

	function canBeDownload() {
		if (state.selectedExam.length === 0)
			return false;
		return true;
		// return state.isDownloadImage || state.isDownloadReport;
	}

	async function handleDownloadClick() {
		dispatch(openConfirmationDialog({
			exams: exams,
			id: routeParams.patient_id,
			examIDs: state.selectedExam,
			"isDownloadReport": true,
			"isDownloadImage": false
		}));
		// setLoading(true);
		// const result = await dispatch(generateReports({ id: patientDetails.patient_data.id, examIDs: state.selectedExam, "isDownloadReport": state.isDownloadReport, "isDownloadImage": state.isDownloadImage } ));
		// window.open(result.payload.data, "_blank");
		// setLoading(false);
	}

	async function handleDownloadImageClick() {
		// dispatch(openConfirmationDialog({ id: patientDetails.patient_data.id, examIDs: state.selectedExam, "isDownloadReport": false, "isDownloadImage": true }));
		dispatch(openConfirmationDialog({
			exams: exams,
			id: routeParams.patient_id,
			examIDs: state.selectedExam,
			"isDownloadReport": false,
			"isDownloadImage": true, token
		}));
		// const result = await dispatch(generateImages({ id: patientDetails.patient_data.id, examIDs: state.selectedExam, "isDownloadReport": state.isDownloadReport, "isDownloadImage": state.isDownloadImage } ));
		// window.open(result.payload.data, "_blank");
		// setLoadingForDownloadImages(false);
	}
	async function handleDownloadDocumentsClick() {
		dispatch(openConfirmationDialog({
			documents: selectedDocs,
			id: routeParams.patient_id,
			examIDs: state.selectedExam,
			"isDownloadReport": false,
			"isDownloadImage": false,
			token,
			isDownloadDoc: true

		}));

	}
	async function handleRequestAccessClick() {
		setLoading(true);
		await dispatch(requestAccess({id: patientDetails.patient_id}));
		setOpen(true);
		setLoading(false);
	}

	const handleCloseError = (event, reason) => {
		showErrorMessage(false);
	};
	const handleClose = (event, reason) => {
		setOpen(false);
	};
	const overlayNoRowsTemplate = "There are no Upcoming Exams";

	if (patientDetails.requested_link == true) {
		return (
			<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32')}>
				<div className="flex flex-col items-center justify-center w-full">
					<FuseAnimate animation="transition.expandIn">
						<Card className="w-full max-w-xl rounded-8">
							<CardContent className="flex flex-col items-center justify-center p-32 text-center">
								<Typography variant="subtitle1" className="mb-16">
									You have already requested for access. Please wait for sometime.
								</Typography>
							</CardContent>
						</Card>
					</FuseAnimate>
				</div>
			</div>
		);
	}

	if (patientDetails.expired == true) {
		return (
			<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32')}>
				<div className="flex flex-col items-center justify-center w-full">
					<FuseAnimate animation="transition.expandIn">
						<Card className="w-full max-w-xl rounded-8">
							<CardContent className="flex flex-col items-center justify-center p-32 text-center">

								<Typography variant="subtitle1" className="mb-16">
									Your token is expired to access this page. Please request access again.
								</Typography>
								<div className="flex">
									<Button
										variant="contained"
										color="primary"
										className="w-224 mx-auto my-16 ml-16"
										aria-label="Subscribe"
										type="submit"
										onClick={handleRequestAccessClick}
										disabled={loading}
									>
										Request Access
										{loading && <CircularProgress className="ml-10" size={18} />}
									</Button>
								</div>
							</CardContent>
						</Card>
					</FuseAnimate>
				</div>
			</div>
		);
	}

	if (patientDetails.token == false) {
		return (
			<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32')}>
				<div className="flex flex-col items-center justify-center w-full">
					<FuseAnimate animation="transition.expandIn">
						<Card className="w-full max-w-xl rounded-8">
							<CardContent className="flex flex-col items-center justify-center p-32 text-center">
								<Typography variant="subtitle1" className="mb-16">
									You are not authorised to access this page.
								</Typography>
							</CardContent>
						</Card>
					</FuseAnimate>
				</div>
			</div>
		);
	}
	if (!filteredData || loadingPage) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}
	if (fechingData) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}

	const GetSelectedDocs = (docs) => {
		let tempArr = JSON.parse(JSON.stringify(selectedDocs));
		tempArr = [...tempArr, ...docs];
		tempArr.map((item, index) => {
			if (item.isSelected) {
				tempArr.push(item);
			} else {
				let index = tempArr.findIndex(x => x.id === item.id);
				let filter = tempArr.filter(x => x.id !== item.id);
				tempArr = filter
				tempArr.splice(item, index)
			}
		})
		setSelectedDocs(tempArr)
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32')}>
			<div className="flex flex-col items-center justify-center w-full">
				<FuseAnimate animation="transition.expandIn">
					<Card className="w-full max-w-xl rounded-8">
						<CardContent className="flex flex-col items-center justify-center p-32 text-center" style={{background: '#f6f7f9'}} >
							{/* <Typography variant="h4" className="mb-16 font-bold">
								{patientDetails.tokendata && patientDetails.tokendata.request_for === "other" ? 'You are accessing ' : 'Welcome '}
								<span className="font-700 text-blue-900">{patientDetails.patient_data && patientDetails.patient_data.fname}, {patientDetails.patient_data && patientDetails.patient_data.lname}</span> <br />
								Thank you for Business.
							</Typography> */}

							<Divider className="w-48" />
							<Button
								onClick={() => {
									history.goBack(null)
								}}
								component={Link}
								className="mx-8 normal-case"
								variant="contained"
								color="secondary"
								aria-label="Follow"
								style={{
									position: 'absolute',
									top: 30,
									left: 15
								}}
							>
								Back
							</Button>
							<Typography variant="h3" className="font-bold mb-12 w-full">
								What would you like to do ?
							</Typography>

							<Typography variant="h5" className="font-bold my-16 w-full sm:border-2">
								Download Documents or Reports or Images for selected exams ?
							</Typography>
							{/* <Typography variant="h5" className="font-bold my-8 w-full">
							</Typography> */}
							<div className="flex">
								{/* <div className="flex flex-col flex-shrink-0 sm:flex-row items-center justify-between">
									<Checkbox
										className="flex mb-16 sm:mb-0 mx-8"
										checked={form.isDownloadReport}
										tabIndex={-1}
										name="isDownloadReport"
										onChange={handleAction}
										label="Reports"
									/> Reports

									<Checkbox
										className="flex mb-16 sm:mb-0 mx-8"
										checked={form.isDownloadImage}
										tabIndex={-1}
										name="isDownloadImage"
										onChange={handleAction}
										label="Images"
									/> Images
								</div> */}
								<Button
									variant="contained"
									color="primary"
									className="w-224 mx-auto my-16 ml-16"
									aria-label="Subscribe"
									type="submit"
									onClick={handleDownloadClick}
									disabled={!canBeDownload() || loading}
								>
									Download Report
									{loading && <CircularProgress className="ml-10" size={18} />}
								</Button>
								<Button
									variant="contained"
									color="primary"
									className="w-224 mx-auto my-16 ml-16"
									aria-label="Subscribe"
									type="submit"
									onClick={handleDownloadImageClick}
									disabled={!canBeDownload()}
								>
									Download Images
									{/* {loadingDImages && <CircularProgress className="ml-10" size={18}/>} */}
								</Button>

								<Button
									variant="contained"
									color="primary"
									className="w-224 mx-auto my-16 ml-16"
									aria-label="Subscribe"
									type="submit"
									onClick={handleDownloadDocumentsClick}
									disabled={selectedDocs.length === 0}
								>
									Download Documents
									{/* {loadingDImages && <CircularProgress className="ml-10" size={18}/>} */}
								</Button>
							</div>
							{/* {loadingDImages &&
								<Typography variant="h6" className="font-bold text-green-800 my-8 w-full">
									We are processing your download request. You will receive an email when all of your images are ready.
								</Typography>} */}
							<div className="flex flex-col flex-1 max-w-2xl w-full mx-auto px-8 sm:px-16">
								<div className="flex flex-col flex-shrink-0 sm:flex-row items-center justify-center py-24">
									<TextField
										label="Search for an exam"
										placeholder="Enter a keyword..."
										className="flex w-full sm:w-320 mb-16 sm:mb-0 mx-16"
										value={searchText}
										inputProps={{
											'aria-label': 'Search'
										}}
										onChange={handleSearchText}
										variant="outlined"
										InputLabelProps={{
											shrink: true
										}}
									/>
								</div>
								<div style={{height: "580px", overflowX: "auto"}}>
									<FuseAnimateGroup
										enter={{
											animation: 'transition.slideUpBigIn'
										}}
										className="flex flex-wrap py-24"
									>
										{filteredData.map((exam, index) =>
											<div className="w-400 pt-8 pb-8 align-center" key={exam.exam_id} style={{marginRight: 10}}>
												<div style={{display: "flex", justifyContent: 'center', height: "2.9rem"}}>
													{(manageCheckUncheckExam(exam.exam_id)) &&
														<CheckCircle className="block text-32 text-green-800 bg-white rounded-full" />
													}
													{(!manageCheckUncheckExam(exam.exam_id)) &&
														<CheckCircle className="block text-32 text-gray-500 bg-white rounded-full" />
													}
												</div>
												<ExamCard
													patient={exam}
													isShowAction={false}
													manageExam={(e) => manageExam(e, exam)}
													isSelectedExam={manageCheckUncheckExam(exam.exam_id) || exam.exam_id == routeParams.exam_id}
													isCollapsed={true}
													setSelectedExam={(data) => {
														setOpenedExam(data.exam_id)
														let tempArr = JSON.parse(JSON.stringify(selectedExams))
														if (tempArr.indexOf(data.exam_id) > -1) {
															tempArr = tempArr.filter(x => x !== data.exam_id)
															setSelectedExam(tempArr)
														} else {
															tempArr.push(data.exam_id)
															setSelectedExam([...tempArr])
														}

													}}
													GetSelectedDocs={GetSelectedDocs}
													isDownloadbutton={true}
													showDocs={true}
													showDocuments={true}
													selectedExams={state.selectedExam}
													isExpand={index === 0 || index === 1}
												/>
											</div>
										)}
									</FuseAnimateGroup>
									{filteredData.length === 0 && (
										<div className="flex flex-1 items-center justify-center">
											<Typography color="textSecondary" className="text-24 my-24">
												No exam found!
											</Typography>
										</div>
									)}
								</div>
							</div>

							{/* <Typography variant="subtitle1" className="mb-16">
								We hope you enjoyed your Digital Experience at {patientDetails.location && patientDetails.location.location_text} <br />
								Please write a Google Review
							</Typography>
							{!routeParams.patientId &&
								<Typography variant="subtitle1" className="mb-16 font-bold">
									The patient request access link will be expired at  {patientDetails.exp_date}. <br />
									Do you want to request access again ?
									<Button
										variant="contained"
										color="primary"
										className="w-224 mx-auto ml-16"
										aria-label="Subscribe"
										type="submit"
										onClick={handleRequestAccessClick}
										disabled={loading}
									>
										Request Access
										{loading && <CircularProgress className="ml-10" size={18} />}
									</Button>
								</Typography>} */}
						</CardContent>
					</Card>
				</FuseAnimate>

				<SnackBarAlert snackOpen={open} onClose={handleClose} text="Request access successfully." />
				<SnackBarAlert snackOpen={isShowError} onClose={handleCloseError} text={confirmationDialog.data && confirmationDialog.data.error} error={true} />


			</div>
			<ConfirmationView />
		</div>
	);
}

export default PatientPortalPage;

import Formsy from 'formsy-react';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import _ from '@lodash';
import history from '@history';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import {Link} from 'react-router-dom';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import {createStyles, makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import {green} from '@material-ui/core/colors';
import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import {useForm} from '@fuse/hooks';
import {useParams, Prompt} from 'react-router-dom';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import moment from 'moment';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExamDetailsDialog from '../dialogs/ExamDetailsDialog';
import RadioLogistDialog from '../dialogs/RadioLogistDialog';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import QuestionDialog from '../dialogs/QuestionDialog';
import TasksDialog from '../dialogs/TasksDialog';
import CheckBoxesDialog from '../dialogs/RoutineHigh';
import ReffererDialog from '../dialogs/ReffererDialog';
import AlertDialog from '../dialogs/AlertsDialogs';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExamSearchbar from 'app/fuse-layouts/shared-components/ExamSearchBar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
	closeExamDetailEdit,
	openExamDetailEdit,
	openRadiologistEdit,
	openReffererEdit,
	getTasksByExam,
	openTasksEdit,
	getExamDetails,
	openAlertsEdit,
	openCheckboxDialog,
	openConfirmDialog,
	openQuestionDialog,
	setFilterOption,
	closeTabLoading,
	setExams,
} from '../store/ProfileSlice'
const AccordionSummary = withStyles({
	content: {
		margin: '0px !important'
	}
})(MuiAccordionSummary);
const GreenCheckbox = withStyles({
	root: {
		color: green[400],
		'&$checked': {
			color: green[600],
		},
	},
	checked: {},
})((props) => <Checkbox color="default" {...props} />);
const useStyles = makeStyles(theme => ({
	selectedButton: {
		backgroundColor: 'rgb(76, 175, 80)',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80)',
		},
	},
	heading: {
		backgroundColor: '#192d3e',
		margin: '0px'
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
}));

const defaultFormState = {
	id: '',
	pid: 0,
	tasks: [],
	old_tasks: [],
	alerts: [],
	old_alerts: [],
	patientName: '',
	radiologistName: '',
	rad_id: 0,
	ref_id: 0,
	referrer: '',
	refLocation: '',
	refPhone: '',
	stat: false,
	walkIn: false,
	pip: false,
	auth: false,
	refNotes: '',
	location: '',
	modality: '',
	modalityid: 0,
	exam: '',
	examid: 0,
	examPreIns: '',
	price: '',
	cpt1: '',
	cpt2: '',
	cpt3: '',
	routine: '',
	highPriority: '',
	scheduling_date: '',
	scheduling_time: '',
	cdfilms: "",
	compa: "",
	pregnancy: '',
	pexam: '',
	imageSent: '',
	sid: '',
	gender: '',
	tech_name: '',
	taskCount: 0,
	alertCount: 0,
	task: null,
	alert: null
};

function EditExam(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const {name, patient_id, exam_id} = useParams()
	const routeParams = useParams();
	const formRef = useRef(null);
	const {form, handleChange, setForm} = useForm(defaultFormState);
	const {examId, exams, patientInfo, familysData, examChanged} = props;
	const [tempData, setTempData] = useState(exams);
	const [data, setData] = useState(exams);

	const [fetchingExamDetails, setFetchExamDetails] = useState(false);
	const [currentExam, setCurrentExam] = useState(null);
	const [validationErrors, setValidationErrors] = useState({});
	const [exam, setExam] = useState({});
	const CustomNotify = useCustomNotify();
	const [isFormValid, setIsFormValid] = useState(false);
	const [expanded, setExpanded] = React.useState('panel1');
	const [examDetailAcc, setExamDetailAcc] = useState(true)
	const [radioDetailAcc, setRadioDetailAcc] = useState(true)
	const [otherDetailAcc, setOtherDetailAcc] = useState(true)
	const [tasksbyexam, setTaskbyexam] = useState([]);
	const [alertsbyexam, setAlertbyexam] = useState([]);
	const [selectedExam, setSelectedExam] = useState(false);
	const [old_data, setOld_data] = useState(false);
	const [newExamId, setNewExamId] = useState(0);
	const [filterOption, setFilterOption1] = useState([]);
	const [examDetail, setExametail] = useState(null);
	const [state, setState] = useState({selectedExam: []});
	const examDialogDetails = useSelector(({profilePageApp}) => profilePageApp.profile.examDetails);
	const checkBoxes = useSelector(({profilePageApp}) => profilePageApp.profile.checkBoxes);
	const radiologistDetails = useSelector(({profilePageApp}) => profilePageApp.profile.radiologistDetails);
	const reffererDetails = useSelector(({profilePageApp}) => profilePageApp.profile.reffererDetails);
	const alertsDetails = useSelector(({profilePageApp}) => profilePageApp.profile.alertsDetails);
	const tasksDetails = useSelector(({profilePageApp}) => profilePageApp.profile.tasksDetails);
	const questionDetials = useSelector(({profilePageApp}) => profilePageApp.profile.questionDetials);
	const filterOptions = useSelector(({profilePageApp}) => profilePageApp.profile.filterOptions);
	const Selected = useSelector(({profilePageApp}) => profilePageApp.profile.selectedExams);

	const handleAChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};
	function enableButton() {
		setIsFormValid(true);
	}
	function disableButton() {
		setIsFormValid(false);
	}
	useEffect(() => {
		if (exams) {
			let ex = exams.find(x => x.id === +examId)
			const data = {
				...form,
				scheduling_date: ex.scheduling_date,
				scheduling_time: ex.scheduling_time_from,
			}
			setForm(data)
			setCurrentExam(ex)
			dispatch(closeTabLoading())
		}
	}, [])

	useEffect(() => {
		if (filterOptions.length > 0) {

			let filter = data.filter(x => {


				let exam = x.exam ? x.exam : "";
				let modality = x.modality ? x.modality : "";
				let rad = x.radDetail ? x.radDetail.displayname : "";
				let ref = x.rafDetail ? x.rafDetail.displayname : "";
				let scheduling_date = x.scheduling_date ? x.scheduling_date : "";
				let access_no = x.access_no ? x.access_no : ""
				if (filterOptions.length === 1) {

					if (modality.toUpperCase() === filterOptions[0].match.toUpperCase() ||
						exam.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						rad.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						ref.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						scheduling_date.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						access_no.toString().startsWith(filterOptions[0].match)) {
						return x
					}

				}

			})
			if (filter) {
				setData(filter)
			}
		} else {
			setData(tempData)
		}
	}, [filterOptions])

	useEffect(() => {
		if (examDialogDetails.props.open === false) {
			setForm({...examDialogDetails.data})
		}
	}, [examDialogDetails.props.open])

	useEffect(() => {
		if (checkBoxes.props.open === false) {
			setForm({...checkBoxes.data})
		}
	}, [checkBoxes.props.open])

	useEffect(() => {
		if (radiologistDetails.props.open === false) {
			setForm({...radiologistDetails.data})
		}
	}, [radiologistDetails.props.open])

	useEffect(() => {
		if (questionDetials.props.open === false) {
			setForm({...questionDetials.data})
		}
	}, [questionDetials.props.open])

	useEffect(() => {
		if (reffererDetails.props.open === false) {
			setForm({...reffererDetails.data})
		}
	}, [reffererDetails.props.open])

	useEffect(() => {
		if (alertsDetails.props.open === false) {
			setForm({...alertsDetails.data})
			setAlertbyexam(alertsDetails.data.alerts)
		}
	}, [alertsDetails.props.open])

	useEffect(() => {
		if (tasksDetails.props.open === false) {
			setForm({...tasksDetails.data})
			setTaskbyexam(tasksDetails.data.tasks)
		}
	}, [tasksDetails.props.open])
	// useEffect(() => {
	// 	if (tasksbyexam) {
	// 		const formData = {...form, tasks: tasksbyexam}
	// 		setForm(formData)
	// 		setOld_data(formData)
	// 	}
	// }, [tasksbyexam])
	useEffect(() => {
		if (alertsbyexam) {
			const formData = {...form, alerts: alertsbyexam}
			setForm(formData)
			setOld_data(formData)
		}
	}, [alertsbyexam])

	useEffect(() => {

		if (Selected.length > 0) {
			let exam = Selected.find(x => x.id === examId);

			if (exam) {
				setExametail(exam)
				var data = {
					...form,
					id: exam.id,
					pid: patientInfo.id,
					radiologistName: exam.radiologist,
					referrer: exam.ref_name ? exam.ref_name : "",
					refLocation: exam.ref_add1 + " " + exam.ref_add2,
					refNotes: exam.ref_notes,
					refPhone: exam.ref_phone,
					location: exam.location,
					client_location: exam.client_location,
					modality: exam.modality,
					modalityid: exam.modalityid,
					exam: exam.exam,
					examid: exam.examid,
					rad_id: exam.rad_id,
					ref_id: exam.ref_id,
					examPreIns: exam.exam_prep_text,
					stat: exam.stat === "1" ? true : false,
					walkIn: exam.walkin == "on" ? true : false,
					pip: exam.pip,
					auth: exam.auth == "on" ? true : false,
					price: exam.price,
					cpt1: exam.cpt,
					cpt2: exam.cpt1,
					cpt3: exam.cpt2,
					routine: exam.routine,
					highPriority: exam.highPriority,
					cdfilms: exam.CDFILMES === 'y' ? true : false,
					compa: exam.compa === 'y' ? true : false,
					pregnancy: exam.pregnancy === "y" ? true : false,
					pexam: exam.pexam === "y" ? true : false,
					imageSent: exam.sid ? "Yes" : "No",
					sid: exam.sid,
					gender: exam.gender,
					tech_name: exam.tech_name,
					pregnancy: exam.pregnancy === "y" ? true : false,
					taskCount: exam.taskCount,
					alertCount: exam.alertCount,
					task: exam.task,
					alert: exam.alert,
					old_tasks: [],
					old_alerts: []
				}

				setForm(data);
				setOld_data(data)
			} else {
				fetchExamDetails();
			}
		} else {
			fetchExamDetails();
		}
		// fetchTasksByExam();
		// fetchAlertsByExam();
		function setSelectedExam() {
			const selectedExam = [];
			selectedExam.push(examId);

			setState({...state, selectedExam: selectedExam})
		}
		setSelectedExam()
	}, [examId])

	const fetchExamDetails = async () => {
		setFetchExamDetails(true)
		try {
			var data = {
				id: examId
			}
			const result = await dispatch(getExamDetails(data))
			setExametail(result.payload.data.data)
			let exam = result.payload.data.data;
			dispatch(setExams(exam))
			var data = {
				...form,
				id: exam.id,
				pid: patientInfo.id,
				radiologistName: exam.radiologist,
				referrer: exam.ref_name ? exam.ref_name : "",
				refLocation: exam.ref_add1 + " " + exam.ref_add2,
				refNotes: exam.ref_notes,
				refPhone: exam.ref_phone,
				location: exam.location,
				client_location: exam.client_location,
				modality: exam.modality,
				modalityid: exam.modalityid,
				exam: exam.exam,
				examid: exam.examid,
				rad_id: exam.rad_id,
				ref_id: exam.ref_id,
				examPreIns: exam.exam_prep_text,
				stat: exam.stat === "1" ? true : false,
				walkIn: exam.walkin == "on" ? true : false,
				pip: exam.pip,
				auth: exam.auth == "on" ? true : false,
				price: exam.price,
				cpt1: exam.cpt,
				cpt2: exam.cpt1,
				cpt3: exam.cpt2,
				routine: exam.routine,
				highPriority: exam.highPriority,
				cdfilms: exam.CDFILMES === 'y' ? true : false,
				compa: exam.compa === 'y' ? true : false,
				pregnancy: exam.pregnancy === "y" ? true : false,
				pexam: exam.pexam === "y" ? true : false,
				imageSent: exam.sid ? "Yes" : "No",
				sid: exam.sid,
				gender: exam.gender,
				tech_name: exam.tech_name,
				pregnancy: exam.pregnancy === "y" ? true : false,
				taskCount: exam.taskCount,
				alertCount: exam.alertCount,
				task: exam.task,
				alert: exam.alert,
				old_tasks: [],
				old_alerts: []
			}

			setForm(data);
			setOld_data(data)
			setFetchExamDetails(false)

		} catch (ex) {
			console.log("ex", ex)
		}
		setFetchExamDetails(false)
	}

	const fetchNewExamDetails = async (newexamId) => {
		setFetchExamDetails(true)
		try {
			const selectedExam = [];
			selectedExam.push(newexamId);
			setState({...state, selectedExam: selectedExam})
			var data = {
				id: newexamId
			}
			const result = await dispatch(getExamDetails(data))
			setExametail(result.payload.data.data)
			let exam = result.payload.data.data
			var data = {
				...form,
				id: exam.id,
				radiologistName: exam.radiologist,
				referrer: exam.ref_name ? exam.ref_name : "",
				refLocation: exam.ref_add1 + " " + exam.ref_add2,
				refNotes: exam.ref_notes,
				refPhone: exam.ref_phone,
				location: exam.location,
				modality: exam.modality,
				exam: exam.exam,
				examPreIns: exam.exam_prep_text,
				stat: exam.stat === "1" ? true : false,
				walkIn: exam.walkin ? true : false,
				pip: exam.pip,
				auth: exam.auth,
				price: exam.price,
				cpt1: exam.cpt,
				cpt2: exam.cpt1,
				cpt3: exam.cpt2,
				routine: exam.routine,
				highPriority: exam.highPriority,
				cdfilms: exam.CDFILMES === 'y' ? true : false,
				compa: exam.compa === 'y' ? true : false,
				pregnancy: exam.pregnancy === "y" ? true : false,
				pexam: exam.pexam === "y" ? true : false,
				imageSent: exam.sid ? "Yes" : "No",
				sid: exam.sid,
				gender: exam.gender,
				tech_name: exam.tech_name,
				taskCount: exam.taskCount,
				alertCount: exam.alertCount,
				task: exam.task,
				alert: exam.alert
			}
			setForm(data);
			setOld_data(data)
			CustomNotify("You are now viewing Acc# " + newexamId, "success")

		} catch (ex) {
			console.log("ex", ex)
		}
		setFetchExamDetails(false)
	}



	function handleOpenExamDialog() {
		dispatch(openExamDetailEdit(form));
	}

	function handleOpenRadiologist() {
		dispatch(openRadiologistEdit(form));
		// dispatch(openExamDetailEdit(form));

	}
	function handleOpenRefferer() {
		dispatch(openReffererEdit(form));
		// dispatch(openExamDetailEdit(form));

	}

	function handleTasks(type) {
		var data = {
			type: type,
			form: form
		}
		dispatch(openTasksEdit(data));
	}
	function handleAlerts(type) {
		var data = {
			type: type,
			form: form
		}
		dispatch(openAlertsEdit(data));
	}
	function handleCheckBox() {
		dispatch(openCheckboxDialog(form));
	}
	function handleQuestionDialog() {
		dispatch(openQuestionDialog(form))
	}
	const handleOpenInsuarance = (e, exam) => {
		e.preventDefault();
		setNewExamId(exam.id);
		fetchNewExamDetails(exam.id)
		examChanged(exam.id, examId)
	}


	const manageCheckUncheckExam = (id) => {
		let exam = state.selectedExam.find(x => x == id);
		if (exam) {
			return true
		}
		else {
			return false
		}
	}

	function handleAction(event, data) {
		if (data.exam_id == exam_id) {
			return
		}
		const str = event.target.checked;
		setSelectedExam(str);
		let exam = state.selectedExam.find(x => x == data.id);
		if (exam) { //remove from list
			const tempExams = [...state.selectedExam];
			let exmaIndex = tempExams.indexOf(data.id);// get index 
			tempExams.splice(exmaIndex, 1);
			setState({...state, selectedExam: tempExams});
		}
		else {
			const tempExams = [...state.selectedExam];
			tempExams.push(data.id);
			setState({...state, selectedExam: tempExams});
		}
	}

	const handleSubmit = () => {
		const data = {
			data: form,
			old_data: old_data,
			selectedExam: state.selectedExam
		}
		dispatch(openConfirmDialog(data))
	}
	const handleFilterOption = (data) => {
		let options = filterOption;
		if (data) {
			var obj = {
				match: data.match,
				title: data.title
			}
			options.push(obj)
			setFilterOption1(options)
			dispatch(setFilterOption(data))
		} else {
			setFilterOption1([])
			dispatch(setFilterOption(null))

		}
	}


	function getampmtime(min) {
		let from = 0;
		let ampm = "";
		let hour = 0;
		if (min > 719) {
			from = min - 720;
			ampm = 'pm';
		} else {
			from = min;
			ampm = 'am';
		}
		min = from % 60;
		from = from - min;
		hour = from / 60;
		if (hour == '0') {
			hour = '12';
		}
		if (min == '0') {
			min = '00';
		}
		return (hour + ':' + min + ' ' + ampm);
	}
	const getStatusColor = (status) => {
		if (status == 'pickup') {
			return '#F1C6F1';
		} else if (status == 'drop') {
			return '#D4D4FF';
		} else if (status == 'incoming order') {
			return '#F1C6F1';
		} else if (status == 'cancle exam' || status == 'cancel exam' || status == 'Exam Cancelled') {
			// return '#ddd5zz';
			return '#ddd500';
		} else if (status == 'quick order') {
			return '#D4D4FF';
		} else if (status == 'approved') {
			return '#da9695';
		}
		else if (status == 'scheduled') {
			return '#b2a2c7';
		} else if (status == 'pre scheduled') {
			return '#ddb883';
		} else if (status == 'examstart') {
			return '#bfbfbf';
		} else if (status == 'checkin') {
			return '#FF0000';
		} else if (status == 'study from technician') {
			return '#F3F3C9';
		}
		else if (status == 'rad non dicom accunts') {
			return '#CBF6CB';
		} else if (status == 'rad reports on hold') {
			return '#D2D2FD';
		} else if (status == 'rad reports pending signature') {
			return '#FCFCFC';
		} else if (status == 'rad final report') {
			return '#EE99C4';
		} else if (status == 'trans new messages') {
			return '#F1C6F1';
		} else if (status == 'no show') {
			return '#ffb746';
		} else if (status == 'trans reports on hold') {
			return '#D0FAFA';
		}
	}

	return (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<Formsy
					// onValidSubmit={handleSubmit}
					onValid={enableButton}
					onInvalid={disableButton}
					ref={formRef}
					validationErrors={validationErrors}
					// className="flex flex-col justify-center"
					className="flex flex-col md:overflow-hidden"
				>
					{
						fetchingExamDetails ?
							<div className="mb-24">
								<CircularStatic />
							</div>
							:

							<FuseAnimateGroup
								enter={{
									animation: 'transition.slideUpBigIn'
								}}
							>
								<Card className="w-full mb-16 rounded-8">
									{/* expanded === primaryType */}
									<Accordion expanded={examDetailAcc} onChange={() => setExamDetailAcc(!examDetailAcc)}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{color: 'white'}} />}
											aria-controls="panel1bh-content"
											className={classes.heading}
											id="panel1bh-header"
										>
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-">
													<Typography variant="subtitle1" color="inherit" className="px-3 w-4/5">
														{/* <span style={{marginRight: 10}}>{exam ? exam.location : ""}</span> <span style={{marginRight: 10}}>{exam ? exam.modality : ""}</span> {exam ? exam.exam : ""} */}
														Exam Details
													</Typography>
													<Typography variant="subtitle1" color="inherit" className="px-12 w-1/5 text-right">
														#{newExamId ? newExamId : examId}
													</Typography>
												</Toolbar>
											</AppBar>
										</AccordionSummary>


										<AccordionDetails className="justify-center">
											<CardContent className="w-full">
												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Location</Typography>
															<Typography>{form.location}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Modality</Typography>
															<Typography>{form.modality}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Exam</Typography>
															<Typography>{form.exam}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleOpenExamDialog}>
																<Icon>edit</Icon>
															</IconButton>

														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Sch. Date</Typography>
															<Typography>{currentExam ? currentExam.scheduling_date : '-'}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">Sch. Time</Typography>
															<Typography>{currentExam ? currentExam.time_from : '-'}</Typography>
														</div>
														<div className="w-6/12">
														</div>


													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Exam Preparation Instruction</Typography>
															<Typography>{form.examPreIns ? form.examPreIns : "-"}</Typography>
														</div>
													</div>

												</CardContent>
												{
													form.tech_name &&
													<CardContent className="w-full border rounded-md mb-8 mt-8">
														<div className="flex mt-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Tech Name</Typography>
																<Typography>{form.tech_name}</Typography>
															</div>
															<div className="w-6/12">
															</div>
															<div className="w-6/12">
															</div>
															<div className="w-6/12">
															</div>

															<div className="w-1/12 flex justify-end">

															</div>
														</div>
													</CardContent>
												}
												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mb-8">
														<div className="w-11/12">
															<Typography className="font-bold text-15">Tasks</Typography>

															<div>

																<div style={{margin: 5}}>
																	<Chip label={form.task ? form.task.task : ""} />
																	<span style={{marginLeft: 10}}>{form.taskCount - 1 ? "+" + `${form.taskCount - 1}` : ""}</span>
																</div>

															</div>


														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={() => handleTasks("show")}>
																<VisibilityIcon />
															</IconButton>
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={() => handleTasks("edit")}>
																<Icon>edit</Icon>
															</IconButton>

														</div>
													</div>
												</CardContent>

												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Radiologist</Typography>
															<Typography>{form.radiologistName}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15"></Typography>
															<Typography></Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleOpenRadiologist}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>

												</CardContent>


												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Referrer</Typography>
															<Typography>{form.referrer}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">Ref Location</Typography>
															<Typography>{form.refLocation}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleOpenRefferer}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Ref Notes</Typography>
															<Typography>{form.refNotes ? form.refNotes : '-'}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">Ref Mobile</Typography>
															<Typography>{form.refPhone ? form.refPhone : '-'}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">

														</div>

													</div>
												</CardContent>


												{/* <CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mb-8">
														<div className="w-11/12">
															<Typography className="font-bold text-15">Alerts</Typography>

															<div>
																<div style={{margin: 5}}>
																	<Chip label={form.alert ? form.alert.alert : ""} />
																	<span style={{marginLeft: 10}}>{form.alertCount - 1 ? "+" + `${form.alertCount - 1}` : ""}</span>
																</div>

															</div>

														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={() => handleAlerts("show")}>
																<VisibilityIcon />
															</IconButton>
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={() => handleAlerts("edit")}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
												</CardContent>
											 */}

											</CardContent>
										</AccordionDetails>

									</Accordion>
								</Card>


								<Card className="w-full mb-16 rounded-8">
									{/* expanded === "radDetails" */}
									<Accordion expanded={otherDetailAcc} onChange={() => setOtherDetailAcc(!otherDetailAcc)}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{color: 'white'}} />}
											aria-controls="panel1bh-content"
											className={classes.heading}
											id="panel1bh-header"
										>
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-">
													<Typography variant="subtitle1" color="inherit" className="px-3 w-4/5">
														{/* <span style={{marginRight: 10}}>{exam ? exam.location : ""}</span> <span style={{marginRight: 10}}>{exam ? exam.modality : ""}</span> {exam ? exam.exam : ""} */}
														Other Details
													</Typography>
												</Toolbar>
											</AppBar>
										</AccordionSummary>
										<AccordionDetails className="justify-center">
											<CardContent className="w-full">
												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mt-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">CD/FILMS Req?</Typography>
															<Typography>{form.cdfilms ? "Yes" : "No"}</Typography>
														</div>
														<div className="w-6/12">
															{
																form.gender !== 'M' &&
																<>
																	<Typography className="font-bold text-15">Any possiblity if pregnancy</Typography>
																	<Typography>{form.pregnancy ? "Yes" : "No"}</Typography>
																</>
															}
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleQuestionDialog}>
																<Icon>edit</Icon>
															</IconButton>

														</div>
													</div>
													<div className="flex mt-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Comparison report required?</Typography>
															<Typography>{form.compa ? "Yes" : "No"}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">Previous exam at this facility?</Typography>
															<Typography>{form.pexam ? form.pexam ? "Yes" : "No" : '-'}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">

														</div>
													</div>
													<div className="flex mt-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Image sent?</Typography>
															<Typography>{form.imageSent ? form.imageSent : '-'}</Typography>
														</div>
														<div className="w-6/12">

														</div>


														<div className="w-1/12 flex justify-end">

														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Routine</Typography>
															<Typography>{form.routine === 1 ? "Yes" : "No"}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">High Priority</Typography>
															<Typography>{form.highPriority === 1 ? "Yes" : "No"}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">Walk-In</Typography>
															<Typography>{form.walkIn ? "on" : 'off'}</Typography>
														</div>

														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleCheckBox}>
																<Icon>edit</Icon>
															</IconButton>

														</div>
													</div>

													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">PIP</Typography>
															<Typography>{form.pip ? form.pip === "False" ? "No" : "Yes" : '-'}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">STAT</Typography>
															<Typography>{form.stat ? "Yes" : "No"}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">Auth</Typography>
															<Typography>{form.auth ? "on" : 'off'}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<Typography className="font-bold text-15"></Typography>
															<Typography></Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8 mt-8">
													<div className="flex mt-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Price</Typography>
															<Typography>{form.price ? form.price : '-'}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">CPT1</Typography>
															<Typography>{form.cpt ? form.cpt : '-'}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">CPT2</Typography>
															<Typography>{form.cpt1 ? form.cpt1 : '-'}</Typography>
														</div>
														<div className="w-6/12">
															<Typography className="font-bold text-15">CPT3</Typography>
															<Typography>{form.cpt2 ? form.cpt2 : '-'}</Typography>
														</div>

														<div className="w-1/12 flex justify-end">

														</div>
													</div>
												</CardContent>

											</CardContent>
										</AccordionDetails>
									</Accordion>
								</Card>

							</FuseAnimateGroup>
					}
				</Formsy>
			</div>
			<div className="flex flex-col md:w-360">
				<FuseAnimateGroup
					nter={{
						animation: 'transition.slideUpBigIn'
					}}>


					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Update Exam
								</Typography>
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<div className="flex justify-evenly pt-24">
								<Button
									variant="contained"
									style={{float: 'right'}}
									className={classes.selectedButton}
									color="primary"
									type="submit"
									onClick={handleSubmit}
									disabled={JSON.stringify(form) === JSON.stringify(old_data)}
								>
									Update Exam
								</Button>

							</div>
						</CardContent>


					</Card>

					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Exam List
									{/* ACCESSION NUMBER = {exam.exam_id} */}
								</Typography>
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<ExamSearchbar setFilterOption={handleFilterOption} width="100%" />

							<List className="p-0">
								{data && data.map(exam => {
									return (
										<ListItem key={exam.id} className="px-8">
											<GreenCheckbox
												className="p-10"
												disableRipple
												// disabled={exam.status === "rad final report"}
												checked={manageCheckUncheckExam(exam.id)}
												tabIndex={-1}
												name="selectedExam"
												onChange={(e) => handleAction(e, exam)}

												label="Fax" />

											<ListItemText
												primary={
													<div>
														<div className="flex">
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																Accession #:
															</Typography>

															<Typography onClick={(e) => handleOpenInsuarance(e, exam)} className="mx-4" color="secondary" paragraph={false}>
																<a href="#" style={{color: '#225de6'}}>{exam.id}</a>
															</Typography>
														</div>
														<div className="flex">
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																Modality:
															</Typography>

															<Typography className="mx-4" paragraph={false}>
																{exam.modality}
															</Typography>
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																Exam:
															</Typography>

															<Typography title={exam.exam} className="mx-4 truncate md:overflow-clip" paragraph={false}>
																{exam.exam}
															</Typography>

														</div>
														<div className="flex">
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																Location:
															</Typography>

															<Typography className="mx-4" paragraph={false}>
																{exam.location}
															</Typography>
														</div>
														<div className="flex">
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																DOS:
															</Typography>
															<Typography className="mx-4" paragraph={false}>
																{moment(exam.scheduling_date).format("MM/DD/YYYY")}
															</Typography>
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																Sch.Time:
															</Typography>

															<Typography className="mx-4" paragraph={false}>
																{exam.time_from}
															</Typography>
														</div>
														<div className="flex">
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																Referrer:
															</Typography>

															<Typography title={exam.ref} className="mx-4 truncate md:overflow-clip" paragraph={false}>
																{exam.rafDetail ? exam.rafDetail.displayname : ""}
															</Typography>
														</div>
														<div className="flex">
															<Typography
																className="font-medium italic"
																paragraph={false}
															>
																Status:
															</Typography>

															<Typography className="mx-4" paragraph={false}>
																<span style={{color: getStatusColor(exam.status), fontWeight: '900'}}>	{exam.status ? exam.status.toUpperCase() : '-'}</span>
															</Typography>
														</div>
													</div>
												}
											// secondary={`${exam.exam} ${exam.location}`} 

											/>
										</ListItem>
									)
								})}
							</List>

						</CardContent>
					</Card>

				</FuseAnimateGroup>
			</div>
			<ExamDetailsDialog />
			<RadioLogistDialog />
			<ReffererDialog />
			<TasksDialog />
			<AlertDialog />
			<CheckBoxesDialog />
			<ConfirmDialog state={state} />
			<QuestionDialog />
		</div >
	);
}

export default EditExam




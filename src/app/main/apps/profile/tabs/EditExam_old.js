import {
	SelectSearchFormsy,
	TextFieldFormsy
} from '@fuse/core/formsy';
import React, {useCallback, useEffect, useRef, useState, useDeepCompareEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withStyles} from '@material-ui/core/styles';
import Formsy from 'formsy-react';
import {useForm} from '@fuse/hooks';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Link} from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useLocation, Prompt} from 'react-router-dom';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import _ from '@lodash';
import {getAlerts, getTasks, getLocations, getModalityForDropDown} from '../store/ProfileSlice'
const StyledToggleButton = withStyles({
	root: {
		lineHeight: '20px',
		letterSpacing: '0.25px',
		color: 'rgba(0, 0, 0, 0.87)',
		padding: '15px 15px',
		textTransform: 'none',
		width: '100%',
		'&$selected': {
			backgroundColor: 'rgb(76, 175, 80)',
			fontWeight: 'bold',
			color: 'black',
			'&:hover': {
				backgroundColor: 'rgb(76, 175, 80)',
			},
		},
	},

	selected: {},
})(ToggleButton);

const StyledGroupButton = withStyles({
	root: {
		padding: '15px 15px',
		width: '100%',
	},
})(ToggleButtonGroup);
const defaultFormState = {
	id: '',
	tasks: [],
	alerts: [],
	patientName: '',
	radiologistName: '',
	referrer: '',
	refLocation: '',
	stat: false,
	walkIn: false,
	pip: false,
	auth: false,
	refNotes: '',
	location: '',
	modality: '',
	exam: '',
	examPreIns: '',
	price: '',
	cpt1: '',
	cpt2: '',
	cpt3: ''
};

function ExamEdit(props) {
	const dispatch = useDispatch();
	const {form, handleChange, setForm} = useForm(defaultFormState);
	const {tab} = useParams()
	const [isFormValid, setIsFormValid] = useState(false);
	const formRef = useRef(null);
	const CustomNotify = useCustomNotify();
	const [snack, setSnack] = React.useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});

	const [loading, setLoading] = useState(false);
	const [fetchingAlert, setFetchingAlert] = useState(false);
	const [fetchingTasks, setFetchingTasks] = useState(false);
	const [fetchingLocations, setFetchingLocations] = useState(false);
	const [fetchingModalities, setFetchingModalities] = useState(false);
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);
	const data = useSelector(({quickPanel}) => quickPanel.data);
	const [value, setValue] = React.useState(null);
	const [allCity, setAllCity] = React.useState([]);
	const CityList = useSelector(({profilePageApp}) => profilePageApp.profile.allCity);
	const Alert = useSelector(({profilePageApp}) => profilePageApp.profile.alerts);
	const Tasks = useSelector(({profilePageApp}) => profilePageApp.profile.tasks);
	const Modalities = useSelector(({profilePageApp}) => profilePageApp.profile.modalities);
	const Locations = useSelector(({profilePageApp}) => profilePageApp.profile.locations);
	const location = useLocation();
	const {pathname} = location;
	const [alerts, setAlerts] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [modality, setModality] = useState([]);
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		if (CityList && CityList.length > 0) {
			setAllCity(CityList);
		}


	}, [CityList]);

	useEffect(() => {
		if (Alert.length === 0) {
			fetchAlerts()
		} else {
			const alert = Alert
			const temp = _.uniqBy(alert, 'alert');
			setAlerts(temp)
		}
	}, [Alert])

	useEffect(() => {
		if (Tasks.length === 0) {
			fetchTasks()
		} else {
			const task = Tasks
			const temp = _.uniqBy(task, 'task');
			setTasks(temp)
		}
	}, [Tasks])

	useEffect(() => {
		if (!Locations) {
			fetchLocations()
		} else {
			const task = Locations
			let tempArr = []

			if (task) {
				Object.keys(task).map((item, index) => {
					tempArr.push(task[item])
					return 0
				})
			}
			setLocations(tempArr)
		}
	}, [Locations])

	useEffect(() => {
		if (!Modalities) {
			fetchModalities()
		} else {
			const modalities = Modalities
			let tempArr = []
			if (modalities) {
				Object.keys(modalities).map((item, index) => {
					tempArr.push(modalities[item])
					return 0
				})
			}
			setModality(tempArr)
		}
	}, [Modalities])

	const fetchAlerts = async () => {
		setFetchingAlert(true)
		const result = await dispatch(getAlerts())
		const temp = _.uniqBy(result.payload.data.data, 'alert');
		setAlerts(temp)
		setFetchingAlert(false)
	}
	const fetchTasks = async () => {
		setFetchingTasks(true)
		const result = await dispatch(getTasks())
		const temp = _.uniqBy(result.payload.data.data, 'task');
		setTasks(temp)
		setFetchingTasks(false)
	}
	const fetchLocations = async () => {
		setFetchingLocations(true)
		const result = await dispatch(getLocations())
		let tempArr = []
		if (result.payload.data) {
			Object.keys(result.payload.data).map((item, index) => {
				tempArr.push(result.payload.data[item])
				return 0
			})

		}
		// const temp = _.uniqBy(result.payload.data.data, 'task');
		setLocations(tempArr)
		setFetchingLocations(false)
	}
	const fetchModalities = async () => {
		setFetchingModalities(true)
		const result = await dispatch(getModalityForDropDown())
		
		let tempArr = []
		if (result.payload.data) {
			Object.keys(result.payload.data).map((item, index) => {
				tempArr.push(result.payload.data[item])
				return 0
			})
		}
		// const temp = _.uniqBy(result.payload.data.data, 'task');
		setModality(tempArr)
		setFetchingModalities(false)
	}
	useEffect(() => {

		const {patientInfo, exams, examId} = props
		let exam = exams.find(x => x.access_no === examId)
		setForm({
			...form,
			id: exam.id,
			patientName: patientInfo.fname + " " + patientInfo.lname,
			radiologistName: exam.radDetail.displayname,
			referrer: exam.rafDetail.displayname,
			refLocation: exam.rafDetail.address_line1 + " " + exam.rafDetail.address_line2,
			refNotes: '',
			location: exam.location,
			modality: exam.modality,
			exam: exam.exam,
			examPreIns: ''
		});
	}, [])





	if (Object.keys(props.patientInfo).length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					User Info not found!
				</Typography>
			</div>
		);
	}

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}




	async function handleSubmit(event) {
		event.preventDefault();


	}
	function handleAlert(event, newValue) {
		setForm({...form, alerts: newValue});
	}

	function handleTasks(event, newValue) {
		setForm({...form, tasks: newValue});
	}

	function handleRadiologist(event, newValue) {
		setForm({...form, radiologistName: newValue?newValue.name:''});

	}
	function handleRef(event, newValue) {
		console.log("newValue",newValue)
		setForm({...form, referrer:newValue? newValue.name:''});

	}
	function handleStat(event, newValue) {
		setForm({...form, stat: newValue});
	}

	function handlewalkIn(event, newValue) {
		setForm({...form, walkIn: newValue});
	}

	function handlepip(event, newValue) {
		setForm({...form, pip: newValue});
	}
	function handleauth(event, newValue) {
		setForm({...form, auth: newValue});
	}

	function handleModality(event, newValue) {
		setForm({...form, modality: newValue});
	}
	function handleLocation(event, newValue) {
		setForm({...form, location: newValue});

	}


	return (
		<>
			<div>
				<div>

					<Formsy
						onValidSubmit={handleSubmit}
						onValid={enableButton}
						onInvalid={disableButton}
						ref={formRef}
						// className="flex flex-col justify-center"
						className="flex flex-col md:overflow-hidden"
					>
						<FuseAnimateGroup
							enter={{
								animation: 'transition.slideUpBigIn'
							}}
						>
							<Card className="w-full rounded-8">
								<AppBar position="static" elevation={0}>
									<Toolbar className="px-8">
										<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
											Acc #{props.examId}
										</Typography>

									</Toolbar>
								</AppBar>

								<CardContent>
									<div className="flex">
										<div style={{width: '50%'}} className=" pr-10">
											{
												fetchingTasks ?
													<div className="mb-24">
														<CircularProgress size={18} />
													</div>
													:
													// <></>
													<Autocomplete
														value={form.tasks}
														onChange={handleTasks}
														multiple
														fullWidth
														disabled={form.required}
														limitTags={2}
														id="Task"
														options={tasks}
														getOptionLabel={(option) => option.task}
														renderInput={(params) => (
															<TextField
																{...params}
																className="mb-24"
																fullWidth
																variant="outlined"
																label="Tasks"
																placeholder="Select Task"
															/>
														)}
													/>
											}
										</div>
										<div style={{width: '50%'}} className=" pl-10">
											{fetchingAlert ?
												<div className="mb-24">
													<CircularProgress size={18} />
												</div>
												:
												// <></>
												<Autocomplete
													value={form.alerts}
													onChange={handleAlert}
													multiple
													fullWidth
													disabled={form.required}
													limitTags={2}
													id="alert"
													options={alerts}
													getOptionLabel={(option) => option.alert}

													renderInput={(params) => (
														<TextField
															{...params}
															className="mb-24"
															fullWidth
															variant="outlined"
															label="Alert"
															placeholder="Select Alert"
														/>
													)}
												/>
											}
										</div>

									</div>

									<div className="flex">
										<TextFieldFormsy
											className="mb-24 mr-16"
											type="text"
											name="patientName"
											id="patientName"
											value={form.patientName}
											onChange={handleChange}
											label="Patient Name"
											disabled
											variant="outlined"
											fullWidth
										/>


										<Autocomplete
											value={form.radiologistName}
											onChange={handleRadiologist}
											fullWidth
											disabled={form.required}
											limitTags={2}
											id="radiologistName"
											options={[{name: 'Alex Alonso, MD'}, {name: 'Athentic 4D'}, {name: 'Athentic 4D'}]}
											getOptionLabel={(option) => option.name}
											inputValue={form.radiologistName}
											renderInput={(params) => (
												<TextField
													{...params}
													className="mb-24"
													fullWidth
													variant="outlined"
													label="Radiologist"
													placeholder="Select Radiologist"
												/>
											)}
										/>


									</div>

									<div className="flex">
										<div style={{width: '50%'}} className=" pr-10">
											<Autocomplete
												value={form.referrer}
												onChange={handleRef}
												fullWidth
												disabled={form.required}
												limitTags={2}
												id="Referrer"
												options={[{name: 'New Doctor, MD'}, {name: 'New Doctor 4D'}]}
												getOptionLabel={(option) => option.name}
												inputValue={form.referrer}

												renderInput={(params) => (
													<TextField
														{...params}
														className="mb-24 mr-24"
														fullWidth
														variant="outlined"
														label="Referrer"
														placeholder="Select Referrer"
													/>
												)}
											/>
										</div>
										<div style={{width: '50%'}} className=" pl-10">

											<TextFieldFormsy
												className="mb-24"
												type="text"
												name="refLocation"
												id="refLocation"
												value={form.refLocation}
												onChange={handleChange}
												label="Ref Location"
												variant="outlined"
												fullWidth
												disabled
											/>
										</div>

									</div>
									<div className="flex">
										<div style={{width: '50%'}} className="mr-24">
											<TextFieldFormsy
												className="mb-24 mr-24"
												type="text"
												name="refNotes"
												id="refNotes"
												multiline
												minRows={3}
												maxRows={3}
												value={form.refNotes}
												onChange={handleChange}
												label="Ref Notes"
												variant="outlined"
												fullWidth
												disabled
											/>
										</div>
										<div style={{width: '50%'}}>
											<FormControlLabel
												control={
													<Checkbox
														checked={form.stat}
														onChange={handleStat}
														name="Stat"
														color="primary"
													/>
												}
												label="Stat"
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={form.walkIn}
														onChange={handlewalkIn}
														name="walkin"
														color="primary"
													/>
												}
												label="Walk In"
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={form.pip}
														onChange={handlepip}
														name="pip"
														color="primary"
													/>
												}
												label="PIP"
											/>
											<FormControlLabel
												control={
													<Checkbox
														checked={form.auth}
														onChange={handleauth}
														name="auth"
														color="primary"
													/>
												}
												label="Auth"
											/>

										</div>
									</div>


									<div className="flex">
										<div style={{width: '50%'}} className="pr-10">
											{
												fetchingLocations ?
													<div className="mb-24">
														<CircularProgress size={18} />
													</div>
													:
													<Autocomplete
														value={form.location}
														onChange={handleLocation}
														fullWidth
														disabled={form.required}
														limitTags={2}
														id="location"
														inputValue={form.location}
														options={locations}
														getOptionLabel={(option) => option}

														renderInput={(params) => (
															<TextField
																{...params}
																className="mb-24 mr-24"
																fullWidth
																variant="outlined"
																label="Location"
																placeholder="Select Location"
															/>
														)}
													/>
											}
										</div>
										<div style={{width: '50%'}} className="pl-10">

											<TextFieldFormsy
												className="mb-24"
												type="text"
												name="exam"
												id="exam"
												value={form.exam}
												onChange={handleChange}
												label="exam"
												variant="outlined"
												fullWidth
											/>
										</div>
									</div>
									<div className="flex">
										<div style={{width: '50%'}} className=" pr-10">
											{
												fetchingModalities ?
													<div className="mb-24">
														<CircularProgress size={18} />
													</div>
													:
													<Autocomplete
														value={form.modality}
														onChange={handleModality}
														fullWidth
														disabled={form.required}
														limitTags={2}
														id="modality"
														options={modality}
														getOptionLabel={(option) => option}
														inputValue={form.modality}

														renderInput={(params) => (
															<TextField
																{...params}
																className="mb-24 mr-24"
																fullWidth
																variant="outlined"
																label="Modality"
																placeholder="Select Modality"
															/>
														)}
													/>
											}
										</div>
										<div style={{width: '50%'}} className=" pl-10">
											<TextFieldFormsy
												className="mb-24"
												type="text"
												name="examPreIns"
												id="examPreIns"
												multiline={true}
												minRows={3}
												maxRows={3}
												value={form.examPreIns}
												onChange={handleChange}
												label="Exam Preparation Instruction"
												variant="outlined"
												fullWidth
											/>
										</div>
									</div>

									<div className="flex">
										<TextFieldFormsy
											className="mb-24  mr-16"
											type="text"
											name="price"
											id="price"
											value={form.price}
											onChange={handleChange}
											label="Price"
											variant="outlined"
											fullWidth
											disabled

										/>
										<TextFieldFormsy
											className="mb-24  mr-25"
											type="text"
											name="cpt1"
											id="cpt1"
											value={form.cpt1}
											onChange={handleChange}
											label="CPT1"
											variant="outlined"
											fullWidth
											disabled

										/>
										<TextFieldFormsy
											className="mb-24"
											type="text"
											name="cpt2"
											id="cpt2"
											value={form.cp2}
											onChange={handleChange}
											label="CPT2"
											variant="outlined"
											fullWidth
											disabled
										/>
										<TextFieldFormsy
											className="mb-24  ml-16"
											type="text"
											name="cpt3"
											id="cpt3"
											value={form.cp3}
											onChange={handleChange}
											label="CPT3"
											variant="outlined"
											fullWidth
											disabled

										/>
									</div>




									<div className="flex">
										<div className="w-1/2 mb-24" style={{float: 'right'}}>
											<Button
												variant="contained"
												className="mb-24 ml-8"
												style={{float: 'right'}}
												color="primary"
												type="submit"
												onClick={handleSubmit}
												// disabled={!canBeSubmitted()}
												disabled={!isFormValid || loading}
											>
												Update
												{loading && <CircularProgress className="ml-10" size={18} />}
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</FuseAnimateGroup>
					</Formsy>
				</div>
			</div>
		</>
	);
}

export default ExamEdit;

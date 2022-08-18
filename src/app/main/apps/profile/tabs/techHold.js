import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import { Card, Chip } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useForm } from '@fuse/hooks';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Toolbar from '@material-ui/core/Toolbar';
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import { PatientView } from './PatientView';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import { getAlertsByPid ,techHoldSuccessMessage} from '../store/ProfileSlice'
import { getTasksByExam,saveTechHold } from '../store/ProfileSlice'
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';

import { 
	addNote,
} from '../../contacts/store/contactsSlice';
import ExamCard from 'app/fuse-layouts/shared-components/ExamCard';
const useStyles = makeStyles({

	closeIcon: {
		position: 'absolute',
		top: '0%',
		right: ' 0%',
		color: '#fff'
	},

});
function TechHold(props) {
	
	const classes = useStyles();
    const customeNotify = useCustomNotify();
	const [post, setPost] = React.useState([]);
	const [note, setNote] = React.useState('');
	const [loadCount, setLoadCount] = React.useState(5);
	const [loading, setLoading] = React.useState(false);
	const [addNoteLoading, setAddNoteLoading] = React.useState(false);
	const examDialogDetails = useSelector(({ profilePageApp }) => profilePageApp.profile.tasksDetails);
	const filterOptions = useSelector(({ profilePageApp }) => profilePageApp.profile.filterOptions);
    const techHoldData = useSelector(({ profilePageApp }) => profilePageApp.profile.techHold);
	const { form, handleChange1, setForm } = useForm({});
	const dispatch = useDispatch();
	const [alertsbyexam, setAlertbyexam] = useState([]);
	const [fetchingAlerts, setFetchingAlerts] = useState(false);
	const [tasksbyexam, setTaskbyexam] = useState([]);
	const [fetchingTasks, setFetchingTasks] = useState(false);
	const divRef = useRef(null)
	const id = props.id;
	const fields = {

	}


	useEffect(() => {
		if (divRef && divRef.current) {
			divRef.current.scrollIntoView(
				{
					behavior: 'smooth',
					block: 'end',
					inline: 'nearest'
				})
		}
	}, [loadCount])

	useEffect(() => {
		fetchAlertsByExam(id)
	}, [])
	const fetchAlertsByExam = async (id) => {
		setFetchingAlerts(true)
		try {
			var data = {
				key: "get",
				p_id: id
			}
			const result = await dispatch(getAlertsByPid(data))

			setAlertbyexam(result.payload.data.data)

		} catch (ex) {
			console.log("ex", ex)
		}
		setFetchingAlerts(false)

	}
	useEffect(() => {
		fetchTasksByExam(id)
	}, [])
    const techHold = async ()=>{
		
        var data={
            exam_access_no:techHoldData
        }
        const result =await dispatch(saveTechHold(data))
		if(techHoldData){
		dispatch(techHoldSuccessMessage(result))
		onCloseNotes()
		}else
		{
			dispatch(techHoldSuccessMessage(result))
		//onCloseNotes()
		}
		
    }
	const fetchTasksByExam = async (id) => {
		setFetchingTasks(true)
		try {
			var data = {
				key: "get",
				exam_id: id
			}
			const result = await dispatch(getTasksByExam(data))
			setTaskbyexam(result.payload.data.data)
			setForm({ ...examDialogDetails.data.form, old_tasks: result.payload.data.data });
		} catch (ex) {
			console.log("ex", ex)
		}
		setFetchingTasks(false)
	}

	function handleChangeNote(event, index) {
		const str = event.target.value;
		setNote(str);
	}

	const setTechHoldButton = (val)=>
	{
alert(val)
	}
	if (loading) {
		return (
			<div className="card-footer flex flex-column p-16">
				<CircularStatic />
			</div>
		);
	}
	const onCloseNotes = () => {
		props.closeTechHold()
	}
	return (
			<Dialog
				classes={{
					paper: 'm-12 rounded-8'
				}}
				onClose={onCloseNotes}
				open={props.isTechHoldOpen}
				fullWidth
				maxWidth="xl"
			>
				<AppBar position="static" elevation={1}>
					<Toolbar className="flex w-full">
						<Typography variant="subtitle1" color="inherit">
							Tech Hold
						</Typography>
						<IconButton onClick={onCloseNotes} className={classes.closeIcon} >
							<CancelIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				{
					<DialogContent>
						{/* <FuseScrollbars> */}
						<div style={{ marginBottom: 20, marginTop: 20 }}>
							<Typography
								display="block"
								color="initial"
								paragraph={false}
								align="center"
								variant="h5" 
							>
								Confirm you will like to place the following exams on Tech Hold <br/>for Patient:  {props.name}
							</Typography>
						</div>
						<Grid container spacing={5}>
							<Grid item xs={6}>
								<Card className={classes.paper} style={{ marginBottom: 30 }}>
									<Typography
										display="block"
										variant="subtitle2"
										align="center"
									>
										Alerts
									</Typography>
									<div style={{ alignItems: "center", maxHeight: 200, overflowY: 'scroll', scrollbarWidth: '1px' }} >
										{
											fetchingAlerts ?
												<div className="mb-24">
													<CircularStatic />
												</div>
												:
												alertsbyexam.map((item, index) => {
													if (item.alert) {
														return (
															<div style={{ marginRight: 5, marginBottom: 5, float: 'left' }}>
																<Chip label={item.alert ? item.alert : ""} />
															</div>
														)
													} else {
														return null;
													}
												})
										}
									</div>

								</Card>
							</Grid>
							<Grid item xs={6}>
								<Paper className={classes.paper} style={{ marginBottom: 30 }}>
									<Typography
										display="block"
										variant="subtitle2"
										align="center"
									>
										Tasks
									</Typography>
									<div style={{ alignItems: "center", maxHeight: 200, overflowY: 'scroll', scrollbarWidth: '1px' }} >
										{
											fetchingTasks ?
												<div className="mb-24">
													<CircularStatic />
												</div>
												:
												tasksbyexam.map((item, index) => {
													if (item.task) {
														return (
															<div style={{ marginRight: 5, marginBottom: 5, float: 'left' }}>
																<Chip label={item.task ? item.task : ""} />
															</div>
														)
													} else {
														return null;
													}
												})
										}
									</div>

								</Paper>
							</Grid>
						</Grid>
						<Grid>
							<PatientView
								data={props.patientData.document}
								patientData={props.patientData}
								examId={props.exam_id}
								// uploadedExamIds={uploadedExamIds}
								// handleSelectedAcc={props.handleSelectedAcc}
								filterOptions={filterOptions}
								patientName={props.name}
								selectedID={props.selectedID}
								selectedScheduleDate={props.selectedScheduleDate}
								modalityID={props.modalityID}
								placeHolder={'techhold'}
								setTechHoldButton={setTechHoldButton}
							//s3Cred={UploadCred}
							/>
						</Grid>
						<div>
							<div className="flex flex-auto -mx-4" style={{ borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10, marginBottom: 10 }}>
								<Avatar className="mx-4" src="assets/images/avatars/profile.jpg" />
								<div className="flex-1 mx-4">
									<Paper elevation={0} className="w-full mb-16">
										<Input
											className="p-8 w-full border-1"
											classes={{ root: 'text-13' }}
											placeholder="Add a note.."
											id="note"
											name="note"
											value={note}
											multiline
											onChange={(e) => handleChangeNote(e)}
											rows="6"
											margin="none"
											disableUnderline
										/>
									</Paper>
								</div>
							</div>
						</div>
						{/* </FuseScrollbars> */}
					</DialogContent>
				}
				<DialogActions style={{ marginRight: 25, paddingLeft: 10 }}>
					<Button
					onClick={()=>onCloseNotes()}
						className="normal-case"
						variant="contained"
						color="primary"
					>
						Cancel
					</Button>
					<Button
						disabled={false}
						className="normal-case"
						variant="contained"
						color="primary"
                        onClick={() => techHold()}
                        
					>
						Tech Hold
					</Button>
				</DialogActions>
			</Dialog>

	);
}
export default TechHold;

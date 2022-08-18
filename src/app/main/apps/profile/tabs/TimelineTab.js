import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState, Suspense } from 'react';
import loadable from '@loadable/component'
import { useDispatch, useSelector } from 'react-redux';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import {
	addNote,
} from '../../contacts/store/contactsSlice';
import ExamCard from 'app/fuse-layouts/shared-components/ExamCard';
const ViewNotes = loadable(() => import('./ViewNotes'));
const TimelineViewLazy = loadable(() => import('./TimelineViewLazy'));
const statuses = ['Document Scaned', 'update', 'scheduled', 'Document Scanned'];
const statuses_insert = ['update', 'insert', 'patient exam information updated', 'patient information updated', 'front desk radiologist assigned', 'Rad radiologist assigned', '0'];
const useStyles = makeStyles(theme => ({
	avatarPos: {
		alignSelf: 'flex-start'
	},
	auditDiv: {
		height: '40px',
		minHeight: '30px',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	}
}));

function TimelineTab(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState(null);
	const [exams, setExams] = useState([]);
	const [lastAudits, setAudits] = useState([]);
	const [note, handleChange] = useState('');
	const classes = useStyles();
	const dispatch = useDispatch();
	useEffect(() => {
		axios.get('/api/profile/timeline').then(res => {
			setData(res.data);
		});
	}, []);

	useEffect(() => {
		if (props.exams && props.exams.length>0) {
			setExams(props.exams);
		}
		if (props.lastAudits && props.lastAudits.length>0) {
			setAudits(props.lastAudits);
		}
	}, [props]);

	if(props.exams == null){
		return (
			<CircularStatic />
		)
	}
	if (!data) {
		return null;
	}

	async function handleAddNote(event, exam) {
		console.log(exam);
		const req = {
			"key": "save",
			"exam_id": exam.exam_id,
			"notes": [ exam.note ]
		
		};
		const result = await dispatch(addNote(req));
	}

	function handleChangeNote(event, index) {
		const str = event.target.value;
		exams[index].note = str;
		setExams([...exams]);		
	}

	function getStatusText(status, status_insert) {
		if (status_insert === '0') {
			return ' ' + status;
		}
		// else if(status === 'Document Scanned' || status === 'Document Scaned') {
		// 	return 'has ' + status_insert + ' Document Scaned';
		// }
		// else if(status === 'scheduled' || status === 'Admin Incident Report') {
		// 	return 'has ' + status_insert;
		// }
		// else if(status.indexOf('Status Changed') >= 0) {
		// 	return 'has ' + status_insert + ' ' + status;
		// }
		// else if(status.indexOf('Radiologist Reassigned') >= 0 || status.indexOf('Transcriber Reassigned') >= 0) {
		// 	return 'has ' + status_insert;
		// }
		// else if(status_insert === 'update' || status_insert === 'patient exam information updated' || status_insert === 'patient information updated' || status_insert === 'front desk radiologist assigned' || status_insert === 'Rad radiologist assigned' || status_insert === 'Fax Sent' || status_insert === 'order exam update') {
		// 	return 'has ' + status;
		// }
		else  {
			return ' ' + status;
		}
	}

	const createFullPostMarkup = (status, status_insert) => {
		return { __html: getStatusText(status, status_insert) }
	}

	if(isLoading){
		return(
			<CircularStatic />
		)
	}

	function findCurrentDoc (patientData, exam) {
		if (patientData && patientData.document.length > 0) {
            const doc = patientData.document.find(e=> e.access_no && e.access_no === exam.access_no);
			return doc;
		}
	};

	return (
		
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					{exams.length>0 && exams.map((post, i) => (
						// <TimelineViewLazy key={Math.random()} post={post} patientInfo={props.patientInfo} />
						<ExamCard 
							patient={findCurrentDoc(props.patientData, post)} 
							isShowAction={true}
							exam={post}
							insuranceInfo={props.patientData.insuranceInfo}
							patientInfo={props.patientData.patientInfo}
							allAttorney={props.patientData.allAttorney}
							cardClass="mb-32"
							isShowSubAction={true}
						/>
					))}
				</FuseAnimateGroup>
			</div>

			<div className="flex flex-col md:w-360">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					<Card className="w-full rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Latest Audits
								</Typography>
								{/* <Button color="inherit" size="small">
									See All
								</Button> */}
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<List>
								{lastAudits.map(audit => (
									<ListItem key={audit.id+Math.random()} className="px-12">
										<Avatar aria-label="Recipe" src={audit.tran_user && audit.tran_user.profile_image} />
										<ListItemText
											className="flex-1 mx-4"
											primary={
												<div className="flex">
													<Typography
														className="font-bold whitespace-no-wrap"
														color="primary"
														paragraph={false}
													>
														{`${audit.tran_user ? audit.tran_user.displayname : audit.uploadedy_user ? audit.uploadedy_user.lastname + ', ' + audit.uploadedy_user.firstname : '' }`}
													</Typography>
													{/* <span className="mx-4" dangerouslySetInnerHTML={createFullPostMarkup(audit.status, audit.status_insert)} /> */}
													<Typography className="px-4 truncate" paragraph={false} title={audit.status}>
														{audit.status}
													</Typography>
												</div>
											}
											secondary={
												<div className="flex">
													<Typography
														className="font-medium mr-8"
														color="primary"
														paragraph={false}
													>
														{audit.curr_date_time}
													</Typography>
													{/* {audit.status && audit.status.length > 30 && 
													<Typography className="px-4 truncate underline text-blue-500 cursur-pointer" paragraph={false}>
														View Full...
													</Typography>} */}
												</div>
											}
										/>
									</ListItem>
								))}
							</List>
						</CardContent>
					</Card>
				</FuseAnimateGroup>
			</div>
		</div>
	);
}

export default TimelineTab;

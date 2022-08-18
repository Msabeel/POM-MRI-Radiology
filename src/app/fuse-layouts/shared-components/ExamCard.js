import FuseScrollbars from '@fuse/core/FuseScrollbars';
import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, withStyles} from '@material-ui/core/styles';
import history from '@history';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import React, {useState, useEffect, Suspense} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import loadable from '@loadable/component'
import RefPopover from 'app/fuse-layouts/shared-components/RefPopover';
import AccNoPopover from 'app/fuse-layouts/shared-components/AccNoPopover';
import {openPreivewDialog} from '../../main/apps/profile/store/ProfileSlice';
import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { isUndefined } from 'lodash';
import ActionsSwitcher from './ActionsSwitcher';
const ViewNotes = loadable(() => import('../../main/apps/profile/tabs/ViewNotes'));

const AccordionSummary = withStyles({
	root: {
		padding: '0px 6px',
		minHeight: '40px',
	},
	content: {
	  margin: '0px !important',
	  minHeight: '40px',
	}
  })(MuiAccordionSummary);

const useStyles = makeStyles(theme => ({
	avatarPos: {
		alignSelf: 'flex-start'
	},
	idBackground :{
		background : 'rgba(240, 238, 223)',
		maxWidth : '100px',
		marginTop : '8px',
		marginLeft: '6px',
		padding: '5px',
		height : '25px',
		borderRadius: '6px',
		fontSize: '12px'
	},
	indexing :{
		background : 'rgba(0,0,0,0.05)',
		borderRadius : '50%',
		width : '40px',
		padding : '2px',
		marginTop : '10px',
		marginBottom : '0px',
		marginLeft :'20px',
		textAlign : 'center',
		fontWeight : 'bold',
	},
	status: {
		top: '1rem',
		right: '1rem',
		position: 'absolute',
		padding: '0px'
	},
	ListItem: {
		height: 35
	},
	docContainer: {
		maxHeight: 350,
		overflow: 'scroll',
		width: '100%',

	},
	heading: {
		// backgroundColor: '#192d3e',
		margin: '0px',
		minHeight: '40px !important'
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
}));

function ExamCard(props) {
	const classes = useStyles();
	const [refPopover, setrefPopover] = useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [anchorElAccNo, setAnchorElAccNo] = React.useState(null);
	const [isNoteView, openNoteView] = useState(false);
	const [isAuditView, openAuditView] = useState(false);
	const [isDocView, openDocView] = useState(false);
	const dispatch = useDispatch();
	const {patient, exam, isShowAction, cardClass, manageExam, insuranceInfo, patientInfo, allAttorney, examId, changedStatus, isSelectedExam, isCollapsed, isShowSubAction, setUploadFinalModel} = props;
	useEffect(() => {
		if(examId && exam && examId == exam.exam_id) {
			openDocView(true);
		}
	}, [examId]);
	const openRefPopover = (event, exam) => {
		if (exam && exam.ref !== "N/A") {
			setAnchorEl(event.currentTarget);
			setrefPopover(exam.rafDetail);
		}
		event.stopPropagation();
		event.preventDefault();
	}

	const openAccNoPopover = (event, exam) => {
		if (exam && exam.ref !== "N/A") {
			setAnchorElAccNo(event.currentTarget);
		}
		event.stopPropagation();
		event.preventDefault();
	}

	const refMenuClose = (e) => {
		setAnchorEl(null);
	}

	const accNoMenuClose = (e) => {
		setAnchorElAccNo(null);
	}

	const openNotes = (e) => {
		openNoteView(!isNoteView);
		openAuditView(false);
		openDocView(false);
	}

	const openAudits = (e) => {
		openNoteView(false);
		openAuditView(!isAuditView);
		openDocView(false);
	}

	const openDocs = (e) => {
		openNoteView(false);
		openAuditView(false);
		openDocView(!isDocView);
	}

	function getStatusText(status, status_insert) {
		return ' ' + status;
	}
	const createFullPostMarkup = (status, status_insert) => {
		return {__html: getStatusText(status, status_insert)}
	}

	const openAuditDialog = (e, doc) => {
		const data = {
			fileUrl: doc.image_link,
			fileExt: doc.image_link.split('.')[1],
			docName: doc.documnet_name,
		};
		dispatch(openPreivewDialog(data))
	}

	const openDocDialog = (e, doc) => {
		const data = {
			fileUrl: doc.link,
			fileExt: doc.attachment.split('.')[1],
			docName: doc.documnet_name,
			techsheet: doc.techsheet
		}
		if(doc.techsheet) {
			window.open(doc.link, "_blank");
		}
		else {
			dispatch(openPreivewDialog(data))
		}
	}

	function handleEditInsuarance(event) {
		const id = patientInfo.id;
		const name = patientInfo.lname + "," + patientInfo.fname;
		const acc_number = patient.access_no;
		history.push(`/apps/insuranceInfo/${id}/${acc_number}/${name}`)
	}

	const open = Boolean(anchorEl);
	const openAccNo = Boolean(anchorElAccNo);
	const [expanded, setExpanded] = React.useState(false);

	const handleAChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
		event.stopPropagation();
	};

	const handleMangageExam = (event) => {
		manageExam();
		event.stopPropagation();
	}

	let classNames = `flex flex-col rounded-8 ${cardClass}`;
	if(isCollapsed) {
		classNames = `flex flex-col rounded-8 border-2 border-solid border-gray-500 ${cardClass}`;
	}
	if(isSelectedExam) {
		classNames = `flex flex-col rounded-8 border-2 border-solid border-green-500 ${cardClass}`;
	}

	let lengthIndex;
	if(isAuditView && (exam != undefined)){
		if(exam.auditData.length>0){
			lengthIndex = exam.auditData.length;
		}	
	}
	return (
		<>
		{!isCollapsed && (
		<Card onClick={manageExam} style={{color: "black", background: "white", position: 'relative'}} elevation={1} className={classNames}>
			<div className={`flex h-30`} style={{'marginLeft' : '15px', 'marginBottom' : '10px', marginTop: '2px' }}>

				<Typography className="font-medium text-18 mr-10 italic" color="inherit">
					Accession #:
				</Typography>
				<Typography onClick={(e) => {openAccNoPopover(e, patient)}} className="font-700 text-18 underline text-blue-900" color="inherit">
					<a href="#">{patient.access_no | patient.acc_number}</a>
				</Typography>
			</div>
			<div style={{'position':'absolute', 'right':'15px', top: '2px' }}>
				<Typography style={{marginLeft: "auto", borderBottomColor: `${patient.bg_color}`}} className="font-700 text-12 truncate uppercase border-b-4 mr-6" color="inherit">
					{changedStatus?changedStatus:patient.status}
				</Typography>
			</div>
			<CardContent style={{padding: "0px"}} className="w-full flex flex-col flex-auto items-center justify-center">
				<div className={`flex flex-shrink-0 items-center justify-center px-12 w-full h-32`}>
					<Typography className='text-17 italic mr-6'>
						Modality:
					</Typography>
					<Typography className='font-700 text-17 mr-12'>
						{patient.modality}
					</Typography>
					<Typography className='text-17 italic mr-6'>
						Exam:
					</Typography>
					<Typography className='font-700 text-17 truncate'>
						{patient.exam}
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-24  h-32`}>
					<Typography className='text-17 truncate italic mr-6'>
						Location:
					</Typography>
					<Typography className='font-700 text-17 truncate mr-12'>
						{patient.location}
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-12  h-32`}>
					<Typography className='text-center text-17 italic mr-6'>
						DOS:
					</Typography>
					<Typography className='text-center font-700 text-17 font-700 mr-12'>
						{patient.scheduling_date}
					</Typography>
					<Typography className='text-center text-17 italic mr-6'>
						Sch.Time:
					</Typography>
					<Typography className='text-center text-17 font-700'>
						{patient.time_to}
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-12 h-32 w-full`}>
					<Typography className="text-center text-17 italic mr-6">
						Referrer:
					</Typography>
					<Typography onClick={(e) => {openRefPopover(e, patient)}} className="text-center underline text-17 font-400 mr-12 truncate md:overflow-clip">
						<a href="#">{patient.rafDetail ? patient.rafDetail.lastname + ", " + patient.rafDetail.firstname : ''}</a>
					</Typography>
					<Typography className="text-center text-17 italic mr-6">
						Rad:
					</Typography>
					<Typography className="text-center text-17 font-400 truncate md:overflow-clip" title={patient.radDetail ? patient.radDetail.lastname + ", " + patient.radDetail.firstname : ''}>
						{patient.radDetail ? patient.radDetail.lastname + ", " + patient.radDetail.firstname : ''}
					</Typography>
				</div>
				{isShowAction &&
					<div className="flex cursor-pointer" style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto"}}>
						<Typography onClick={(e) => {openAudits(e)}} style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
							Audits {isAuditView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
						</Typography>
						<Typography onClick={(e) => {openNotes(e)}} style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
							Notes {isNoteView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
						</Typography>
						<Typography onClick={(e) => {openDocs(e)}} style={{color: "black", background: '#e0e0e0', width: "100%", margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
							Documents {isDocView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
						</Typography>
						{isShowSubAction &&
						<Typography style={{color: "black", background: '#e0e0e0', width: "100%", margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
							<ActionsSwitcher patient={patient} changedStatus={changedStatus} setUploadFinalModel={setUploadFinalModel}/>
						</Typography>}
						{/* <Typography onClick={(e) => {handleEditInsuarance(e)}} style={{
							color: "black",
							background: '#e0e0e0',
							width: "100%",
							margin: "auto",
							lineHeight: "42px",
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}} className="text-center text-12 font-600 uppercase border-l-2">
							Insurance
							<IconButton disableRipple className="w-16 h-16 p-0 ml-8" color="inherit">
								<Icon>remove_red_eye</Icon>
							</IconButton>
						</Typography> */}
					</div>}
				<div style={{
					maxHeight: "650px",
					width: '100%',
					overflowY: 'auto',
					scrollbarWidth: '1px'
				}}>
					{isDocView && (
						<>
							<GridList className="w-full p-10" spacing={8} cols={0}>
								{patient.data && patient.data.map(doc => (
									<GridListTile
										classes={{
											root: 'w-full sm:w-1/2 md:w-1/3',
											tile: 'rounded-8'
										}}
										style={{ height: '60px'}}
										key={doc.id}
										title={`${doc.documnet_name == null ? (doc.attachment_type == null ? '': doc.attachment_type) : doc.documnet_name} has been uploaded by ${doc.user_id > 0 ? (doc.tran_user && doc.tran_user.displayname ? doc.tran_user.displayname : '') : (doc.tran_patient_detail.lname + "," + doc.tran_patient_detail.fname)} on \n${moment((patient.curr_date)).format('MMMM')} ${moment((patient.curr_date)).format('D')} ${moment((patient.curr_date)).format('YYYY')} ${moment((patient.curr_date)).format('hh:mm:ss:A')}`}
										onClick={(e) => openDocDialog(e, doc)}
									>
										{/* {doc.thumbnails_link ? (
											<img src={doc.thumbnails_link} alt={doc.documnet_name} />
										) : doc.link && doc.link.indexOf('.pdf') > 0 ? (
											<div className="flex justify-center items-center h-full">
												<DescriptionIcon style={{ fontSize: '40px'}}/>
											</div>
										) : (
											<Skeleton variant="rect" width={'100%'} height={'100%'} />
										)} */}
										<GridListTileBar className="cursor-pointer"
											title={doc.documnet_name == null ? (doc.attachment_type == null ? '': doc.attachment_type) : doc.documnet_name}

										/>
									</GridListTile>
								))}

							</GridList>
						</>
					)}
				</div>
				{isAuditView && exam && (
					<FuseScrollbars className="flex flex-1 overflow-y-auto max-h-640">
					<div>
						{exam.auditData && exam.auditData.length > 0 &&
							exam.auditData.map(audit => {
								return (
									<Card key={audit.id} className="m-16 overflow-hidden rounded-8">
										<Typography className={classes.indexing}>
											#{lengthIndex--}
										</Typography>
										<CardHeader
											avatar={<Avatar aria-label="Recipe" src={audit.tran_user && audit.tran_user.profile_image} />}
											classes={{
												avatar: classes.avatarPos,
											}}
											action={
												<IconButton aria-label="more">
													<Icon>more_vert</Icon>
												</IconButton>
											}
											title={
												<span className="flex">
													<Typography className="font-medium font-bold" color="primary" paragraph={false}>
														{`${audit.tran_user ? audit.tran_user.displayname : audit.uploadedy_user ? audit.uploadedy_user.lastname + ', ' + audit.uploadedy_user.firstname : ''}`}
													</Typography>
													<span className="mx-4" dangerouslySetInnerHTML={createFullPostMarkup(audit.status, audit.status_insert)} />
												</span>
											}
											subheader={audit.date_time}
										/>
										<CardContent className="py-0">
											{audit.comment && (
												<Typography component="p" className="mb-16">
													{audit.comment}
												</Typography>
											)}
											<div className="flex justify-center cursor-pointer" onClick={(e) => openAuditDialog(e, audit.tran_attachment)}>
												{audit.tran_attachment && <img style={{maxHeight: '400px'}} src={audit.tran_attachment.image_link} alt="Attched document" />}
											</div>
										</CardContent>
									</Card>
								)
							})
						}
					</div>
					</FuseScrollbars>
				)}
				{isNoteView && (
					<Suspense fallback={<div>Loading...</div>}>
						<ViewNotes exam={exam} />
					</Suspense>)}
			</CardContent>
			<RefPopover open={open} anchorEl={anchorEl} refMenuClose={refMenuClose} refPopover={refPopover} />
			<AccNoPopover
				open={openAccNo}
				anchorEl={anchorElAccNo}
				refMenuClose={accNoMenuClose}
				insuranceInfo={insuranceInfo}
				examId={patient.access_no | patient.acc_number}
				// allAttorney={allAttorney}
			/>
		</Card>)}
		{isCollapsed && (
		<Card onClick={manageExam} style={{color: "black", background: "white", position: 'relative'}} elevation={1} className={classNames}>
			<Accordion expanded={expanded === 'panel1'} onChange={handleAChange('panel1')}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon/>}
					aria-controls="panel1bh-content"
					className={classes.heading}
					id="panel1bh-header"
				>
					<AppBar onClick={(event) => handleMangageExam(event)} position="static" elevation={0} style={{color: "black", background: "white"}}>
						<Toolbar className="px-8" style={{ minHeight: "36px"}}>
							<Typography className="font-medium text-18 mr-10 italic" color="inherit">
								Accession #:
							</Typography>
							<Typography onClick={(e) => {openAccNoPopover(e, patient)}} className="font-700 text-18 underline text-blue-900" color="inherit">
								<a href="#">{patient.access_no | patient.acc_number}</a>
							</Typography>
							
							<div style={{ position: 'absolute', top:5, right:-12}}>
								<Typography style={{marginLeft: "auto", borderBottomColor: `${patient.bg_color}`}} className="font-700 text-12 truncate uppercase border-b-4 mr-6" color="inherit">
									{changedStatus?changedStatus:patient.status}
								</Typography>
							</div>
						</Toolbar>
						<div className={`px-8 flex`}>
							<Typography className='text-17 italic mr-6'>
								Modality:
							</Typography>
							<Typography className='font-700 text-17 mr-12'>
								{patient.modality}
							</Typography>
							<Typography className='text-17 italic mr-6'>
								Exam:
							</Typography>
							<Typography className='font-700 text-17 truncate' title={patient.exam} style={{ maxWidth: '160px' }}>
								{patient.exam}
							</Typography>
						</div>
					</AppBar>
				</AccordionSummary>
				<AccordionDetails className="justify-center">
			<CardContent style={{padding: "0px", 'marginTop':'-8px'}} className="w-full flex flex-col flex-auto items-center justify-center">
				<div className={`flex flex-shrink-0 items-center justify-center px-24  h-32`}>
					<Typography className='text-17 truncate italic mr-6'>
						Location:
					</Typography>
					<Typography className='font-700 text-17 truncate mr-12'>
						{patient.location}
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-12  h-32`}>
					<Typography className='text-center text-17 italic mr-6'>
						DOS:
					</Typography>
					<Typography className='text-center font-700 text-17 font-700 mr-12'>
						{patient.scheduling_date}
					</Typography>
					<Typography className='text-center text-17 italic mr-6'>
						Sch.Time:
					</Typography>
					<Typography className='text-center text-17 font-700'>
						{patient.time_to}
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-12 h-32 w-full`}>
					<Typography className="text-center text-17 italic mr-6">
						Referrer:
					</Typography>
					<Typography onClick={(e) => {openRefPopover(e, patient)}} className="text-center underline text-17 font-400 mr-12 truncate md:overflow-clip">
						<a href="#">{patient.rafDetail ? patient.rafDetail.lastname + ", " + patient.rafDetail.firstname : ''}</a>
					</Typography>
					<Typography className="text-center text-17 italic mr-6">
						Rad:
					</Typography>
					<Typography className="text-center text-17 font-400 truncate md:overflow-clip" title={patient.radDetail ? patient.radDetail.lastname + ", " + patient.radDetail.firstname : ''}>
						{patient.radDetail ? patient.radDetail.lastname + ", " + patient.radDetail.firstname : ''}
					</Typography>
				</div>
				{isShowAction &&
					<div className="flex" style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto"}}>
						<Typography onClick={(e) => {openAudits(e)}} style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
							Audits {isAuditView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
						</Typography>
						<Typography onClick={(e) => {openNotes(e)}} style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
							Notes {isNoteView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
						</Typography>
						<Typography onClick={(e) => {openDocs(e)}} style={{color: "black", background: '#e0e0e0', width: "100%", margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
							Documents {isDocView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
						</Typography>
						{/* <Typography onClick={(e) => {handleEditInsuarance(e)}} style={{
							color: "black",
							background: '#e0e0e0',
							width: "100%",
							margin: "auto",
							lineHeight: "42px",
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}} className="text-center text-12 font-600 uppercase border-l-2">
							Insurance
							<IconButton disableRipple className="w-16 h-16 p-0 ml-8" color="inherit">
								<Icon>remove_red_eye</Icon>
							</IconButton>
						</Typography> */}
					</div>}
				<div style={{
					maxHeight: "650px",
					width: '100%',
					overflowY: 'auto',
					scrollbarWidth: '1px'
				}}>
					{isDocView && (
						<>
							<GridList className="w-full p-10" spacing={8} cols={0}>
								{patient.data && patient.data.map(doc => (
									<GridListTile
										classes={{
											root: 'w-full sm:w-1/2 md:w-1/3',
											tile: 'rounded-8'
										}}
										style={{ height: '60px'}}
										key={doc.id}
										title={`${doc.documnet_name == null ? (doc.attachment_type == null ? '': doc.attachment_type) : doc.documnet_name} has been uploaded by ${doc.user_id > 0 ? (doc.tran_user.displayname) : (doc.tran_patient_detail.lname + "," + doc.tran_patient_detail.fname)} on \n${moment((patient.curr_date)).format('MMMM')} ${moment((patient.curr_date)).format('D')} ${moment((patient.curr_date)).format('YYYY')} ${moment((patient.curr_date)).format('hh:mm:ss:A')}`}
										onClick={(e) => openDocDialog(e, doc)}
									>
										{/* {doc.thumbnails_link ? (
											<img src={doc.thumbnails_link} alt={doc.documnet_name} />
										) : doc.link && doc.link.indexOf('.pdf') > 0 ? (
											<div className="flex justify-center items-center h-full">
												<DescriptionIcon style={{ fontSize: '40px'}}/>
											</div>
										) : (
											<Skeleton variant="rect" width={'100%'} height={'100%'} />
										)} */}
										<GridListTileBar
											title={doc.documnet_name}

										/>
									</GridListTile>
								))}

							</GridList>
						</>
					)}
				</div>
				{isAuditView && exam && (
					<div style={{maxHeight: '650px', width: '100%', overflowY: 'auto', scrollbarWidth: '1px'}}>
						{exam.auditData && exam.auditData.length > 0 &&
							exam.auditData.map(audit => {
								return (
									<Card key={audit.id} className="m-16 overflow-hidden rounded-8">
										<Typography className='mt-2' className={classes.idBackground} paragraph={false}>
											# {audit.id}
										</Typography>
										<CardHeader
											avatar={<Avatar aria-label="Recipe" src={audit.tran_user && audit.tran_user.profile_image} />}
											classes={{
												avatar: classes.avatarPos,
											}}
											action={
												<IconButton aria-label="more">
													<Icon>more_vert</Icon>
												</IconButton>
											}
											title={
												<span className="flex">
													<Typography className="font-medium font-bold" color="primary" paragraph={false}>
														{`${audit.tran_user ? audit.tran_user.displayname : audit.uploadedy_user ? audit.uploadedy_user.lastname + ', ' + audit.uploadedy_user.firstname : ''}`}
													</Typography>
													<span className="mx-4" dangerouslySetInnerHTML={createFullPostMarkup(audit.status, audit.status_insert)} />
												</span>
											}
											subheader={audit.date_time}
										/>
										<CardContent className="py-0">
											{audit.comment && (
												<Typography component="p" className="mb-16">
													{audit.comment}
												</Typography>
											)}
											<div className="flex justify-center cursor-pointer" onClick={(e) => openAuditDialog(e, audit.tran_attachment)}>
												{audit.tran_attachment && <img style={{maxHeight: '400px'}} src={audit.tran_attachment.image_link} alt="Attched document" />}
											</div>
										</CardContent>
									</Card>
								)
							})
						}
					</div>
				)}
				{isNoteView && (
					<Suspense fallback={<div>Loading...</div>}>
						<ViewNotes exam={exam} />
					</Suspense>)}
			</CardContent>
			<RefPopover open={open} anchorEl={anchorEl} refMenuClose={refMenuClose} refPopover={refPopover} />
			<AccNoPopover
				open={openAccNo}
				anchorEl={anchorElAccNo}
				refMenuClose={accNoMenuClose}
				insuranceInfo={insuranceInfo}
				examId={patient.access_no | patient.acc_number}
				// allAttorney={allAttorney}
			/>
			</AccordionDetails>
			</Accordion>
		</Card>)}
		</>
	);
}

export default ExamCard;

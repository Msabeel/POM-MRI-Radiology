import Avatar from '@material-ui/core/Avatar';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import history from '@history';
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import loadable from '@loadable/component'
import { openPreivewDialog, openVerificationSheetDialog  } from '../store/ProfileSlice';
import RefPopover from 'app/fuse-layouts/shared-components/RefPopover';

const ViewNotes = loadable(() => import('./ViewNotes'));
const useStyles = makeStyles(theme => ({
	avatarPos: {
		alignSelf: 'flex-start'
	}
}));

function TimelineViewLazy(props) {
	const classes = useStyles();
    const dispatch = useDispatch();
    const { name, id } = useParams()
    const [isDocView, openDocView] = useState(false);
    const [isNoteView, openNoteView] = useState(false);
    const [refPopover, setrefPopover]= useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	function getStatusText(status, status_insert) {
        return ' ' + status;
	}

	const createFullPostMarkup = (status, status_insert) => {
		return { __html: getStatusText(status, status_insert) }
	}

    // OPEN PREVIE DILOAG
	const openDialog =(e, doc)=>{
        const data ={
            fileUrl:doc.image_link,
            fileExt:doc.image_link.split('.')[1],
            docName:doc.documnet_name,
        };
        dispatch(openPreivewDialog(data))
     }

    function handleEditInsuarance(event) {
        const acc_number = props.post.acc_number;
		history.push(`/apps/insuranceInfo/${id}/${acc_number}/${name}`)
    }
    
     // OPEN PREVIE DILOAG
	const openVerificationDialog =(e, post)=>{
        dispatch(openVerificationSheetDialog({ exam: post, patientInfo: props.patientInfo }))
     }
    
     const openRefPopover = (event, exam) => {
		if(exam && exam.ref !== "N/A") {
			setAnchorEl(event.currentTarget);
			setrefPopover(exam.refDetail);
		}
		event.stopPropagation();
		event.preventDefault();
	}

	const refMenuClose =(e) => {
		setAnchorEl(null);
	}

	const open = Boolean(anchorEl);

    const openAuditView = (e) => {
		openDocView(!isDocView);
	}

    const openNotes = (e) => {
		openNoteView(!isNoteView);
	}

	return (
        <Card key={props.post.id} className="mb-32 overflow-hidden rounded-8">
            <div className={`flex flex-shrink-0 items-center justify-center px-24 h-40 mt-10 ${classes.accNumber}`}>
                <Typography className="font-medium text-18 italic mr-6" color="inherit">
                    Accession #:   
                </Typography>
                <Typography className="font-700 text-18 truncate text-blue-900" color="inherit">
                    {props.post.acc_number}
                </Typography>
            </div>
            <div className={`flex flex-shrink-0 items-center justify-center px-24  h-32`}>
                <Typography className='text-17 truncate italic mr-6'>
                    Exam:
                </Typography>
                <Typography className='font-bold  text-17 truncate mr-12'>
                    {props.post.exam}
                </Typography>
                <Typography className='text-17 truncate italic mr-6'>
                    Modality:
                </Typography>
                <Typography className='font-bold text-17 truncate'>
                    {props.post.modality}
                </Typography>
            </div>

            <div className={`flex flex-shrink-0 items-center justify-center px-24  h-32`}>
                <Typography className='text-17 truncate italic mr-6'>
                    Location:
                </Typography>
                <Typography className='font-bold text-17 truncate mr-12'>
                    {props.post.location}
                </Typography>
            </div>

            <div className={`flex flex-shrink-0 items-center justify-center px-12  h-32`}>
                <Typography className='text-center text-17 italic mr-6'>
                    DOS:
                </Typography>
                <Typography className='text-center text-17 font-bold mr-12'>
                    {props.post.scheduling_date}
                </Typography>
                <Typography className='text-center text-17 italic mr-6'>
                    Sch.Time:
                </Typography>
                <Typography className='text-center text-17 font-bold'>
                    {props.post.time_to}
                </Typography>
            </div>
            <div className={`flex flex-shrink-0 items-center justify-center px-12 h-32 w-full`}>
                <Typography className="text-center text-17 italic mr-6">
                    Referrer:
                </Typography> 
                <Typography onClick={(e) => { openRefPopover(e, props.post) }}  className="text-center text-17 font-400 mr-12 truncate md:overflow-clip">
                    <a href="#">{props.post.ref}</a>
                </Typography>
                <Typography className="text-center text-17 italic mr-6">
                    Rad:
                </Typography>
                <Typography className="text-center text-17 font-400 truncate md:overflow-clip">
                    {props.post.radDetail}
                </Typography>
            </div>
            <div className="flex rounded-b-md" style={{ color: "black", background: `${props.post.bg_color}`, width: "100%", margin: "auto", lineHeight: "49px" }}> 
                <Typography style={{ color: "black", width: "100%", margin: "auto", lineHeight: "49px" }} className="text-center text-17 font-600  uppercase">
                    {props.post.status}
                </Typography>
                <Typography onClick={(e) => { openNotes(e) }} style={{ color: "black", width: "100%", margin: "auto", lineHeight: "49px" }} className="text-center text-17 font-600 uppercase cursor-pointer border-l-2">
                    View Notes {isNoteView ? <ExpandLessIcon style={{ fontSize: '36px' }} /> : <ExpandMoreIcon style={{ fontSize: '36px' }} />}
                </Typography>

                <Typography onClick={(e) => { openAuditView(e) }} style={{ color: "black", width: "100%", margin: "auto", lineHeight: "49px" }} className="text-center text-17 font-600 uppercase cursor-pointer border-l-2">
                    View Audits {isDocView ? <ExpandLessIcon style={{ fontSize: '36px' }} /> : <ExpandMoreIcon style={{ fontSize: '36px' }} />}
                </Typography>
            </div>
            {isDocView && (
            <div style={{ height: '620px', overflowY: 'auto', scrollbarWidth: '1px' }}>
            {props.post.auditData.length>0 && props.post.auditData.map(audit => (
                <Card key={audit.id} className="m-16 overflow-hidden rounded-8">
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
                                    {`${audit.tran_user ? audit.tran_user.displayname : audit.uploadedy_user ? audit.uploadedy_user.lastname + ', ' + audit.uploadedy_user.firstname : '' }`}
                                </Typography>
                                {/* <span className="mx-4">
                                    {getStatusText(audit.status, audit.status_insert)} {` for ${audit.eid}`}
                                </span> */}

                                <span className="mx-4" dangerouslySetInnerHTML={createFullPostMarkup(audit.status, audit.status_insert)} />
                                {/* <span className="mx-4">
                                    {` for ${audit.eid}`}
                                </span> */}
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
                        <div className="flex justify-center cursor-pointer" onClick={(e)=>openDialog(e, audit.tran_attachment)}>
                            {audit.tran_attachment && <img style={{ maxHeight: '400px' }} src={audit.tran_attachment.image_link} alt="Attched document" />}
                        </div>
                    </CardContent>
                </Card>
            ))}
            </div>
            )}
            {isNoteView && (
            <Suspense fallback={<div>Loading...</div>}>
                <ViewNotes exam={props.post} />
            </Suspense>)}
            <CardActions disableSpacing className="px-12">
                <Button size="small" aria-label="Add to favorites" onClick={(e)=>openVerificationDialog(e, props.post)}>
                    <Icon className="text-16" color="action">
                        search
                    </Icon>
                    <Typography className="normal-case mx-4">Verification Sheet</Typography>
                </Button>
                <Button size="small" aria-label="Add to favorites" onClick={(e)=>handleEditInsuarance(e)}>
                    <Icon className="text-16" color="action">
                        edit
                    </Icon>
                    <Typography className="normal-case mx-4">Insurance Information</Typography>
                </Button>
            </CardActions>
            <RefPopover open={open} anchorEl={anchorEl} refMenuClose={refMenuClose} refPopover={refPopover} />
        </Card>
	);
}

export default TimelineViewLazy;

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
import Skeleton from '@material-ui/lab/Skeleton';
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
		maxWidth : '90px',
		marginLeft: '10px',
		padding: '2px',
		borderRadius: '6px',
		fontSize: '12px'
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

function SkeletonExamCard(props) {
	const classes = useStyles();
	const [isNoteView, openNoteView] = useState(false);
	const [isAuditView, openAuditView] = useState(false);
	const [isDocView, openDocView] = useState(false);
	const dispatch = useDispatch();
	const {isShowAction, cardClass, isSelectedExam, isCollapsed} = props;

	let classNames = `flex flex-col rounded-8 cursor-pointer ${cardClass}`;
	if(isCollapsed) {
		classNames = `flex flex-col rounded-8 cursor-pointer border-2 border-solid border-#e0e0e0-500 ${cardClass}`;
	}
	if(isSelectedExam) {
		classNames = `flex flex-col rounded-8 cursor-pointer border-2 border-solid border-green-500 ${cardClass}`;
	}
	return (
		<Card style={{color: "black", background: "white", position: 'relative'}} elevation={1} className={classNames}>
			<div className={`flex items-center justify-center h-40 mt-16`}>

				<Typography className="font-medium text-18 mr-10 italic" color="inherit">
					Accession #:
				</Typography>
				<Typography className="font-700 text-18 underline text-blue-900" style={{ backgroundColor: '#e0e0e0', height: '20px', width: '120px' }} color="inherit">
				</Typography>
			</div>
			<CardContent style={{padding: "0px"}} className="w-full flex flex-col flex-auto items-center justify-center">
				<div className={`flex flex-shrink-0 items-center justify-center px-12 w-full h-32`}>
					<Typography className='text-17 italic mr-6'>
						Modality:
					</Typography>
					<Typography className='font-700 text-17 mr-12' style={{ backgroundColor: '#e0e0e0', height: '20px', width: '220px' }}>
					</Typography>
					<Typography className='text-17 italic mr-6'>
						Exam:
					</Typography>
					<Typography className='font-700 text-17 truncate' style={{ backgroundColor: '#e0e0e0', height: '20px', width: '220px' }}>
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-24  h-32`}>
					<Typography className='text-17 truncate italic mr-6'>
						Location:
					</Typography>
					<Typography className='font-700 text-17 truncate mr-12' style={{ backgroundColor: '#e0e0e0', height: '20px', width: '120px' }}>
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-12  h-32`}>
					<Typography className='text-center text-17 italic mr-6'>
						DOS:
					</Typography>
					<Typography className='text-center font-700 text-17 font-700 mr-12' style={{ backgroundColor: '#e0e0e0', height: '20px', width: '220px' }}>
					</Typography>
					<Typography className='text-center text-17 italic mr-6'>
						Sch.Time:
					</Typography>
					<Typography className='text-center text-17 font-700' style={{ backgroundColor: '#e0e0e0', height: '20px', width: '220px' }}>
					</Typography>
				</div>
				<div className={`flex flex-shrink-0 items-center justify-center px-12 h-32 w-full`}>
					<Typography className="text-center text-17 italic mr-6">
						Referrer:
					</Typography>
					<Typography className="text-center underline text-17 font-400 mr-12 truncate md:overflow-clip" style={{ backgroundColor: '#e0e0e0', height: '20px', width: '120px' }}>
					</Typography>
					<Typography className="text-center text-17 italic mr-6">
						Rad:
					</Typography>
					<Typography className="text-center text-17 font-400 truncate md:overflow-clip" style={{ backgroundColor: '#e0e0e0', height: '20px', width: '120px' }}>
					</Typography>
				</div>
				<div className="flex" style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto"}}>
					<Typography style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
						Audits {isAuditView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
					</Typography>
					<Typography style={{color: "black", width: "100%", background: '#e0e0e0', margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
						Notes {isNoteView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
					</Typography>
					<Typography style={{color: "black", background: '#e0e0e0', width: "100%", margin: "auto", lineHeight: "42px"}} className="text-center text-12 font-600 uppercase border-l-2">
						Documents {isDocView ? <ExpandLessIcon style={{fontSize: '28px'}} /> : <ExpandMoreIcon style={{fontSize: '28px'}} />}
					</Typography>
				</div>
			</CardContent>
		</Card>
	);
}

export default SkeletonExamCard;

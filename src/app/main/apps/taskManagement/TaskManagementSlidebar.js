import FuseAnimate from '@fuse/core/FuseAnimate';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect ,useState} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


const useStyles = makeStyles(theme => ({
	listItem: {
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 40,
		width: 'calc(100% - 16px)',
		borderRadius: '0 20px 20px 0 !important',
		paddingLeft: 24,
		paddingRight: 12,
		'&.active': {
			backgroundColor: theme.palette.secondary.main,
			color: `${theme.palette.secondary.contrastText}!important`,
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: 'inherit'
			}
		},
		'& .list-item-icon': {
			marginRight: 16
		}
	},
	sideBar:
	{    color: 'inherit!important',
		width: 'calc(100% - 16px)',
		height: '40px',
		paddingLeft: '24px !important',
		borderRadius: '0 20px 20px 0 !important',
		paddingRight: '12px',
		textDecoration: 'none!important'
	}

}));
const Stylelist=  withStyles({
	root:{
		borderRadius: '0px 20px 20px 0px !important',
		paddingLeft:'14px'
	}
})(ListItemText);
function TaskSidebarContent({currentRangeNew,setCount,props}) {
	const [value,setValue]=useState('')
	const  currentRange = currentRangeNew;
    const classes = useStyles(props);
	useEffect(()=>{
		if(currentRange !=='all'){
			setValue(currentRange)
		}
	},[currentRange])
	return (
		<div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
			<FuseAnimate animation="transition.slideLeftIn" delay={200}>
				<Paper className="rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
					<div className="p-24 flex items-center">
                        <Typography>Menu</Typography>
					</div>

					<Divider />
					
					<List className="pt-0" >
					<ListItem
						className={classes.sideBar}
							button
							component={NavLinkAdapter}
							to={"/apps/taskMangement/"+value} 
					
							className={classes.listItem}
						>
							<Stylelist><ListItemText className="truncate" primary="Open Tasks"/></Stylelist>
						</ListItem>
						<ListItem
						className={classes.sideBar}
							button
							component={NavLinkAdapter}
							to={"/apps/taskMangement/all"}
							className={classes.listItem}
						>
							<Stylelist><ListItemText className="truncate" primary="Task Management"  /></Stylelist>
						</ListItem>			
					</List>
				</Paper>
			</FuseAnimate>
		</div>
	);
}

export default TaskSidebarContent;

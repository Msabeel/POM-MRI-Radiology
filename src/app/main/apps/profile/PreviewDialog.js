
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from "@material-ui/icons/Cancel";
import DialogContent from '@material-ui/core/DialogContent';

import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, withStyles, useTheme} from '@material-ui/core/styles';

import {useDispatch, useSelector} from 'react-redux';
import {
	closePreviewDialog,
} from './store/ProfileSlice';
const useStyles = makeStyles(theme => ({
	capturebtn: {
		position: 'absolute',
		// bottom: '9px',
		display: 'block',
		left: '50%',
		transform: 'translateX(-50%)',
		background: 'none',
		border: 'none',
		fontSize: '40px',
		bottom: "67px"
	},
	closeIcon: {
		position: 'absolute',
		top: '0%',
		right: ' 0%',
	},

	selfie: {
		display: 'flex',
		justifyContent: 'center'
	}
}));


function PreviewDialog(props) {
	//debugger
	const classes = useStyles()
	const dispatch = useDispatch();
	const previewDialog = useSelector(({profilePageApp}) => profilePageApp.profile.previewDialog);
	const [doc, setDoc] = useState({
		docName: "",
		url: "",
		fileExt: ""

	})


	useEffect(() => {
		if (previewDialog.props.open) {
			setDoc({...doc, docName: previewDialog.data.docName, url: previewDialog.data.fileUrl, fileExt: previewDialog.data.fileExt})
		}
	}, [previewDialog.props.open]);


	// close dialog
	const onCloseDialog = () => {

		dispatch(closePreviewDialog())

	}
	return (

		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...previewDialog.props}
			onClose={onCloseDialog}
			fullWidth
			maxWidth="md"
		>
			<DialogTitle id="alert-dialog-title">{doc.docName}</DialogTitle>
			<IconButton onClick={onCloseDialog} className={classes.closeIcon} >
				<CancelIcon />
			</IconButton>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{doc.fileExt === 'pdf' ? <iframe src={doc.url} width="900" height="400"></iframe> :
						<div style={{textAlign: "center"}}>
							<img style={{display: "inline", height: "auto"}} src={doc.url} />

						</div>}

				</DialogContentText>
			</DialogContent>
			<DialogActions>
			</DialogActions>
		</Dialog>
	);
}

export default PreviewDialog;

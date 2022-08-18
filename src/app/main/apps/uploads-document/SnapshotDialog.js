
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';

import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {  useEffect, useState } from 'react';
import { createStyles, makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeSnapShotDialog,
	setImageData
} from './store/uploadDocumentSlice';
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
	
selfie: {
	display: 'flex',
	justifyContent: 'center'
  }
}));


function SnapshotDialog(props) {
	const classes = useStyles(props);
	const dispatch = useDispatch();
	const snapshotDialog = useSelector(({ uploadDocumentApp }) => uploadDocumentApp.uploadDocument.SnaptShotDialog);
	const [image, setImage] = useState({
		imageURL: "",
		fileName:""
	})
	const [loadingCam, setCamera]=useState(true)
	const videoEle = React.createRef();
	const canvasEle = React.createRef();
	const imageEle = React.createRef();

	useEffect(() => {
		if (snapshotDialog.props.open) {
			
			startCamera()
		}
	}, [snapshotDialog.props.open]);


	const takeSelfie = async () => {
		// Get the exact size of the video element.
		const width = videoEle.current.videoWidth;
		const height = videoEle.current.videoHeight;

		// get the context object of hidden canvas
		const ctx = canvasEle.current.getContext('2d');

		// Set the canvas to the same dimensions as the video.
		canvasEle.current.width = width;
		canvasEle.current.height = height;

		// Draw the current frame from the video on the canvas.
		ctx.drawImage(videoEle.current, 0, 0, width, height);

		// Get an image dataURL from the canvas.
		const imageDataURL = canvasEle.current.toDataURL('image/png');
		stopCam();

		setImage({
			...image,
			imageURL: imageDataURL,
			fileName:'Snapshot'+new Date().toISOString()
		})
	}

	const stopCam = () => {
		if(videoEle && videoEle.current && videoEle.current.srcObject !== null){
			const stream = videoEle.current.srcObject;
			const tracks = stream.getTracks();
			tracks.forEach(track => {
				track.stop();
			});
		}
	}

	const backToCam = () => {
		setImage({...image,
			imageURL: '',
			fileName:"",
		})
		startCamera();
		}


	const startCamera = async () => {
		// var constraints = { 
		// 	"mandatory": {
		// 		"minWidth": 9,
		// 		"minHeight": 180,
		// 		"minFrameRate": "30"
		// 	  },
		// };
		var constraints = {
			// audio: false,
			// video: {
			// 	width: { min: 1024, ideal: 1280, max: 1920 },
			// 	height: { min: 576, ideal: 720, max: 1080 },
			// }
			video: {
				width:  320,
				height:  180,
			  }
			 }

			 var vid_constraints1 = {
				mandatory: {
					maxHeight: 180,
					maxWidth: 320
				}
			}
			var constraints1 = { audio: false, video: vid_constraints1 };
		
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video:constraints1
				// video:true
			});
            
			videoEle.current.srcObject = stream;

			setCamera(false)

		} catch (err) {
		}
	}


	// handle image
	 const hanldeImage=(e)=>{
	
		 e.preventDefault()
	    
		 dispatch(setImageData(image))
		 dispatch(closeSnapShotDialog())

	 }

	 // close dialog
	 const onCloseDialog= ()=>{
		stopCam();
		dispatch(closeSnapShotDialog())

	 }
	return (

		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...snapshotDialog.props}
			onClose={onCloseDialog}
			fullWidth
			maxWidth="xs"
		>
			<DialogTitle id="alert-dialog-title">Click to below camera icon to take picture</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<div className={classes.selfie}>

						{image.imageURL === '' && <div className="cam">
							<video width="100%" height="100%" className="video-player" autoPlay={true} ref={videoEle}></video>
							<div className={classes.capturebtn} >
								<IconButton  title="Click here to take picture" onClick={takeSelfie} color="primary" aria-label="upload picture" component="span">
									<PhotoCamera />
								</IconButton>
							
							</div>
						</div>
						

		              }
					
					{loadingCam&&<Typography variant="caption"  className={classes.capturebtn} style={{fontSize:"12px"}} component="div" color="textSecondary">{"Loading Camera"}</Typography>}
				

						<canvas ref={canvasEle} style={{ display: 'none' }}></canvas>
						{image.imageURL !== '' && <div className="preview">
							<img className="preview-img" key={image.imageURL} src={image.imageURL} ref={image.imageEle} />
							{/* <Typography variant="caption">{image.fileName}</Typography> */}
						</div>
						}

					</div>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{/* <Button onClick={onCloseDialog} size="small" variant="contained" color="primary">
					Cancel
               </Button> */}
				{/* <Button onClick={backToCam} size="small"  variant="contained" color="secondary">
					Reset
                 </Button> */}
				<Button onClick={hanldeImage}  size="small" variant="contained" color="primary" disabled={image.imageURL === ''}>
					Done
                </Button>
			</DialogActions>
		</Dialog>
	);
}

export default SnapshotDialog;

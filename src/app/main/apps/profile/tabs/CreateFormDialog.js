import FuseUtils from '@fuse/utils';
import React, {useEffect, useState, useCallback} from 'react';
import {useForm} from '@fuse/hooks'
import {useDispatch, useSelector} from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Permissions} from 'app/config';
import * as $ from 'jquery';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import moment from 'moment';
import {makeStyles} from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {uploadFinalReport} from '../store/ProfileSlice';
import {withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
const useStyles = makeStyles((theme) => ({
	root: {
		width: 600
	},
	button: {
		display: 'block',
		marginTop: theme.spacing(2),
	},
	formControl: {
		margin: 5,
		width: '100%'
	},
	boxPadding: {
		paddingHorizontal: 15
	}
}));


const CreateFormDialog = ({
	isOpen,
	handleCloseDialog,
	access_no,
	data,
	onSaved,
	exam
}) => {
	const dispatch = useDispatch();
	const [isLoading, setLoading] = useState(false);
	const [dragging, setDragging] = useState(0);
	const [errors, setErrors] = useState({})
	// const confirmationDialog = useSelector(({examApp}) => examApp.exam.confirmationDialog);
	// var locations = useSelector(({examApp}) => examApp.exam.locations)
	const [isSearchingState, setIsSearching] = useState(false);
	// var modalityForDrop = useSelector(state => state.examApp.exam.modalityForDrop)
	const classes = useStyles();
	const [filesData, setImages] = useState([])
	const [fileName, setFileName] = useState('')
	const [state, setState] = useState({
		documentTypeId: "0",
		selectedExam: [],
		document: '',
		fileName: "",
		isValid: true,
		documentName: '',
	})
	const [snack, setSnack] = React.useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});
	const {vertical, horizontal, open} = snack;
	const [openError, setOpenError] = React.useState(false);
	const [pdfFileError, setPdfFileError] = React.useState(false);

	const handleDragEnter = event => {
		event.preventDefault();
		if (event.dataTransfer.types[0] == "Files") {
			setDragging(dragging + 1)
			event.dataTransfer.dropEffect = "move";
			$("#container").addClass(classes.onDrop);
			$("#icon").addClass('text-96 font-900');
			$("#content").addClass('text-16');
		}

	}

	const handleDragEnd = event => {
		setDragging(dragging - 1)
		if (dragging - 1 == 0) {
			$("#container").removeClass(classes.onDrop);
			$("#icon").removeClass('text-96 font-900');
			$("#content").removeClass('text-16');
			// alert("working")
		}
		event.stopPropagation();
		event.preventDefault();
		// }
	};

	const handleDragOver = event => {
		event.preventDefault();
		if (event.dataTransfer.types[0] == "Files") {
			event.dataTransfer.dropEffect = "move";
			$("#container").addClass(classes.onDrop);
			$("#icon").addClass('text-96 font-900');
			$("#content").addClass('text-16');
		};
	}

	const handleDrop = event => {
		event.preventDefault();
		setPdfFileError(false);
		setFileName(null);
		if (event.dataTransfer.types[0] == "Files") {
			var files = [...event.dataTransfer.files];
			var isValid = true;
			const validExtensions = ['pdf'];

			for (let img of files) {

				if ($.inArray(img.name.substr(img.name.lastIndexOf('.') + 1), validExtensions) == -1) {
					event.target.value = "";
					isValid = false;
					setState({...state, isValid: false});
					$("#container").removeClass(classes.onDrop);
					$("#icon").removeClass('text-96 font-900');
					$("#content").removeClass('text-16');
					setDragging(0);
					setPdfFileError(true);
					break;
				}


			}

			//  if (event.dataTransfer.files.length + filesData.length > 5) {
			// 	$("#container").removeClass(classes.onDrop);
			// 	$("#icon").removeClass('text-96 font-900');
			// 	$("#content").removeClass('text-16');
			// 	 return setOpen(true)
			// 	 setDragging(0)
			//  }
			if (isValid) {
				/* Get files in array form */
				const files = Array.from(event.dataTransfer.files);

				/* Map each file to a promise that resolves to an array of image URI's */
				Promise.all(files.map(file => {
					return (new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.addEventListener('load', (ev) => {
							let ext = file.name.substr(file.name.lastIndexOf('.') + 1);
							let time = moment(new Date).format("hh:mm:ss:a")
							let dateTime = time.replace(/:\s*/g, "_");
							resolve({
								imageData: ev.target.result, filename: `${access_no}_${new Date().toISOString().slice(0, 10)}_${dateTime}_${file.name}`, documentTypeId: "0", isUploading: false, isUploaded: false,
							});
						});
						reader.addEventListener('error', reject);
						reader.readAsDataURL(file);
					}));
				}))
					.then(data => {
						setFileName(data[0].filename)
						setImages(data)
						/* Once all promises are resolved, update state with image URI array */

					}, error => {
					});

				$("#container").removeClass(classes.onDrop);
				$("#icon").removeClass('text-96 font-900');
				$("#content").removeClass('text-16');
				setDragging(0)
				setErrors({})
			}
		}
	};

	useEffect(() => {
		setImages([])
		setFileName("")

	}, [exam]);

	useEffect(() => {
		let ignore = false;
		setIsSearching(true);
		return () => {ignore = true;}
	}, [filesData]);//confirmationDialog.data

	const handleClose = () => {
		setFileName("")
		handleCloseDialog(false)
	}
	const customOnUploadProgress = (ev) => {
		console.log('customOnUploadProgress', ev);
	  }
	async function addFinalReport() {
		var data = {
			//todo
			exam_access_no: access_no,
			filename: fileName,
			imageData: filesData[0].imageData

		}
		const result = await dispatch(uploadFinalReport(data,customOnUploadProgress))
		customOnUploadProgress(result.payload.customOnUploadProgress);
		if (result.payload && result.payload.isFinalReport) {
			onSaved("rad final report", 200, result.payload)
		} else {
			onSaved("", 500, null)
			setOpenError(true)
		}

		setLoading(false)
	}

	async function handleSubmit(event) {
		if(fileName){
			event.preventDefault()
			addFinalReport()
			setLoading(true)
		}
	}
	function handleUploadChange(e) {
		setPdfFileError(false);
		setFileName(null)
		const file = e.target.files[0];
		if (!file) {
			return;
		}
		var fileName = e.target.files[0].name;
		const validExtensions = ['pdf'];
		var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
		var isValid = true;
		for (let img of e.target.files) {
			if ($.inArray(img.name.substr(img.name.lastIndexOf('.') + 1), validExtensions) == -1) {
				e.target.value = "";
				isValid = false;
				setState({
					...state,
					isValid: false
				})
				setPdfFileError(true);
			}

			break;

		}
		//   if(e.target.files.length+filesData.length>5){
		// 	  return setOpen(true)
		//   }
		if (isValid) {
			/* Get files in array form */
			const files = Array.from(e.target.files);

			/* Map each file to a promise that resolves to an array of image URI's */
			Promise.all(files.map(file => {
				return (new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.addEventListener('load', (ev) => {
						let ext = file.name.substr(file.name.lastIndexOf('.') + 1);
						let time = moment(new Date).format("hh:mm:ss:a")
						let dateTime = time.replace(/:\s*/g, "_");
						resolve({
							imageData: ev.target.result, filename: `${access_no}_${new Date().toISOString().slice(0, 10)}_${dateTime}_${file.name}`, documentTypeId: "0", isUploading: false, isUploaded: false,
						});
					});
					reader.addEventListener('error', reject);
					reader.readAsDataURL(file);
				}));
			}))
				.then(data => {
					/* Once all promises are resolved, update state with image URI array */
					setFileName(data[0].filename)
					setImages(data)
					setErrors({})

				}, error => {
				});


		}
	}

	return (
		<div className="flex flex-col sm:border-1 overflow-hidden ">

			<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" className="p-15" open={isOpen}>
				<DialogTitle id="simple-dialog-title">
					<p style={{fontSize: 16, }}>
						<FiberManualRecordIcon style={{fontSize: 15, color: '#192d3e', marginRight: 10}} />
						This Popup is Used For <span style={{
							fonctSize:25,
							color:'red',
							textTransform:'uppercase',
							fontWeight:'bold'
						}}>Uploading a Final Report </span>From an External Source.
					</p>
					<p style={{fontSize: 16, }}><FiberManualRecordIcon style={{fontSize: 15, color: '#192d3e', marginRight: 10}} />Please Select a File From Your Computer And Press Submit.</p>
				</DialogTitle>

				{fileName &&
					<DialogTitle id="simple-dialog-title">{fileName}</DialogTitle>
				}
				{pdfFileError && <Alert variant="filled" severity="error" className="m-12">You can only  upload a Final Report that is in PDF Format.</Alert>}
				<div id="drag1"
					onDrop={event => handleDrop(event)}
					onDragEnter={event => handleDragEnter(event)}
					onDragOver={event => handleDragOver(event)}
					onDragLeave={event => handleDragEnd(event)}
					className="flex flex-col flex-auto flex-shrink-0 w-full">
					<div style={{margin: "auto"}} className="flex justify-center sm:justify-start flex-wrap -mx-8 p-10">
						<label
							style={{background: "#f6f7f9"}}
							title="Browse file"
							htmlFor="button-file"
							className={clsx(
								classes.documentImageUpload,
								'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
							)}
						>
							<input
								multiple
								accept="application/pdf"
								className="hidden"
								id="button-file"
								type="file"
								onChange={handleUploadChange}
							/>
							<div className="w-192 h-128 p-16 flex flex-col items-center justify-center" >
								<Icon style={{color: "#e75b5b"}} fontSize="large" color="action">
									open_in_browser
								</Icon>
								<Typography style={{color: "#e75b5b", fontWeight: "900"}} variant="caption" className="mt-4">
									Browse File
								</Typography>
							</div>

						</label>

						<label
							style={{background: "#f6f7f9"}}
							id="container"
							title="Drag your files here"

							className={clsx(
								classes.documentImageUpload,
								'flex items-center justify-center relative w-320 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
							)}
						>
							<div className="w-200 h-128 p-16 flex flex-col items-center justify-center" >
								<Icon id="icon" style={{color: "blue"}} fontSize="large" color="action">
									cloud_upload
								</Icon>
								<Typography id="content" style={{color: "blue", fontWeight: "900"}} variant="caption" className="mt-4">
									Drag File here
								</Typography>
							</div>

						</label>
					</div>
				</div>
				{/* <div style={{paddingLeft: 20, paddingRight: 15,marginBottom:15}}>
					<LinearProgressWithLabel value={80} />
				</div> */}
				<DialogActions className="justify-center p-8">
					
					<div>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
							type="submit"
							disabled={isLoading}
						>
							Upload
							{isLoading && <CircularProgress className="ml-10" color="#fff" size={18} />}
						</Button>
					</div>
				</DialogActions>
			</Dialog>

		</div>
	);
};



export default CreateFormDialog;

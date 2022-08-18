import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from "@material-ui/core/FormHelperText";
import _ from '@lodash';
import AWS from 'aws-sdk'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Cancel from '@material-ui/icons/Cancel';
import {createStyles, makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import * as $ from 'jquery';
import history from '@history';
import {
	getDocuments,
	uploadDocumentReact,
	openSnaptShotDialog,
	setImageData,
	openPreivewDialog,
	uploadBulkDocumentReact
} from './store/uploadDocumentSlice';
import {useParams} from 'react-router-dom';
import {Alert, } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import RefPopover from 'app/fuse-layouts/shared-components/RefPopover';
import {useLocation, Prompt} from 'react-router-dom';
import ExamCard from 'app/fuse-layouts/shared-components/ExamCard';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import {useSnackbar} from 'notistack';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {setDocumentUploadStatus, removePatientInfo} from '../profile/store/ProfileSlice'

let S3_BUCKET = 'pomrisdev';
const REGION = 'us-east-1';

var myBucket = new AWS.S3({
	params: {Bucket: S3_BUCKET},
	region: REGION,
})
const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	table: {
		minWidth: '600px !important',
	},
	header: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
		color: theme.palette.getContrastText(theme.palette.primary.main)
	},
	headerIcon: {
		position: 'absolute',
		top: -64,
		left: 0,
		opacity: 0.04,
		fontSize: 512,
		width: 512,
		height: 512,
		pointerEvents: 'none'
	},
	buttonProgress: {
		// color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
	documentImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	// thumpImg:{
	// 	width:"74px",
	// 	height:"74px"
	// },
	thumpImg: {
		width: "74px",
		height: "74px",
		cursor: "pointer",
		// transition: 'transform .2s',
		'&:hover': {
			transform: 'scale(1.5)',
			boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
			width: '110px !important',
			height: "110px !important",
			display: 'block',
			position: 'absolute',
			left: '130px',
			zIndex: "9999",
			cursor: "pointer"

		}
	},

	uploadImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $remove': {
				opacity: 0.8
			}
		},
		'&.cross': {
			boxShadow: theme.shadows[3],
			'& $remove': {
				opacity: 1
			},
			'&:hover $remove': {
				opacity: 1
			}
		}
	},
	remove: {
		position: 'absolute',
		top: 0,
		right: 0,
		// color: orange[400],
		opacity: 0,
		borderRadius: '100%',
		background: '#8a8d91',
		color: 'white',
		borderColor: 'white',
		border: '1px solid white',
		fontSize: '19px',
		padding: '1px',
		height: '22px',
		width: '23px',
	},
	fileName: {
		position: 'absolute',
		bottom: '0px',
		width: '100%',
		fontSize: '9px',
		color: 'black',
		textAlign: 'center',
		fontWeight: "800"
	},
	onDrop: {
		outline: ' 2px dashed black',
		outlineOffset: '-10px',
		// backgroundColor:' #e5edf1',
		position: "absolute !important",
		// zIndex:' 1',
		// top: '50%',
		// right: '50%',
		// bottom: '50%',
		// left: '-1%',
		width: '100% !important',
		height: '100%  !important',

		margin: "0px !important",

		padding: '0px',
		// position: 'absolute',
		right: '0px',
		top: '0px',
		// width: '100%',
		// height: '100%',
		backgroundColor: 'rgb(255, 255, 255)',
		zIndex: '30001',
		opacity: '0.9',
	},
	onDropIcon: {
		fontweight: 900,
		fontSize: "112px",
	},
	onDropIcon: {
		fontweight: 900,
		fontSize: "112px",
	},

	accNumber: {
		// backgroundColor:'#ffffff',
		width: '100%',
		justifyContent: "center",
		opacity: 1,
		fontWeight: '700',
		//    padding:"5px"
	},
	cardDate: {
		// background: "#2d8dff",
		color: "white",
	},
	cardTitle: {
		padding: ' 1px 14px',
		borderBottom: "1px solid #61dafb",
		// fontSize: '1.7rem'
	},
	cardSubTitle: {
		color: "white",
		// background:" #2d8dff",
		// fontSize: "1.7rem",
		fontWeight: '700',
	},
	scrollHr: {
		display: "grid",
		gridTemplateColumns: "auto auto",
		gridColumnGap: "2px",
		overflowX: "scroll",
		width: "100%"
	},
	scrollHrSelectedExam: {
		display: "grid",
		gridTemplateColumns: "auto auto",
		gridColumnGap: "2px",
		width: "100%",
		justifyContent: "center"
	},
	scrollHrMin: {
		display: "flex",
		gridTemplateRows: "auto auto",
		gridAutoFlow: "column",
		overflowX: "scroll",
		width: "100%"
	},
	imgScroll: {
		width: '100%',
		textAlign: "center",
		overflowX: 'scroll',
		whiteSpace: 'nowrap',
		'&::-webkit-scrollbar': {
			width: '0.2rem',
			height: "10px",
		},
		'&::-webkit-scrollbar-track': {
			boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
			webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#bbbcbd',
			// 	border: '2px solid transparent',
			// boxShadow: 'inset 0 0 0 20px rgba(0, 0, 0, 0.24)',
		}

	},



}));

const selected = {
	background: 'rgb(76, 175, 80)',
	color: 'rgba(0, 0, 0, 0.87)',
}
const preSelected = {
	cursor: 'not-allowed',
	pointerEvents: 'none',
	background: 'rgb(76, 175, 80)',
	color: 'rgba(0, 0, 0, 0.87)',
}
const deSelected = {
	background: 'rgb(96, 125, 139)',
	color: 'rgb(255, 255, 255)',
}

const disable = {
	cursor: 'not-allowed',
	pointerEvents: 'none',
}

const enable = {
	cursor: 'pointer',
}

function createData(name, calories, fat, carbs, protein) {
	return {name, calories, fat, carbs, protein};
}
const rows = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const NavigationBlocker = (props) => {
	if (props.navigationBlocked) {
		window.onbeforeunload = () => true
	} else {
		window.onbeforeunload = null
	}
	return (
		<Prompt
			when={props.navigationBlocked}
			message="Changes have not been saved. Are you sure you want to leave? "
		/>
	)
}

function UploadDocument(props) {
	const dispatch = useDispatch();
	const documentType = useSelector(({uploadDocumentApp}) => uploadDocumentApp.uploadDocument.documentType);
	const uploadCred = useSelector(({uploadDocumentApp}) => uploadDocumentApp.uploadDocument.uploadCred);
	const SnaptShotDialog = useSelector(({uploadDocumentApp}) => uploadDocumentApp.uploadDocument.document);
	const classes = useStyles(props);
	const [filteredData, setFilteredData] = useState(null);
	const [selectedExamData, setSelectedExamData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [isEdge, setEdgeBrowser] = useState(false)
	const [isOpen, setOpen] = useState(false)
	const [isUploadFinished, setUploadFinished] = useState(false)
	const [isNavigationBlocked, setNavigationBlocked] = useState(false)
	const [refPopover, setrefPopover] = useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [isFileSizeExceed, setIsFileSizeExceed] = useState(false);
	const {enqueueSnackbar} = useSnackbar();
	const customeNotify = useCustomNotify();

	const [state, setState] = useState({
		documentTypeId: "0",
		selectedExam: [],
		document: '',
		fileName: "",
		isValid: true,
		documentName: '',
	})
	const [errors, setErrors] = useState({})
	const [dragging, setDragging] = useState(0);
	const [filesData, setImages] = useState([])
	const routeParams = useParams();
	const location = useLocation();
	const {pathname} = location;

	useEffect(() => {
		localStorage.setItem('routeParams', JSON.stringify(routeParams));
	}, [routeParams]);

	useEffect(() => {

		setData()
	}, [SnaptShotDialog]);

	useEffect(() => {
		if (filesData.length > 0) {
			const filteredData = filesData.filter(f => f.isUploaded === true);
			if (filteredData.length !== filesData.length) {
				setNavigationBlocked(true);
			}
		}
	}, [filesData]);

	useEffect(() => {
		async function fetchCred() {
			if (uploadCred) {
				AWS.config.update({
					accessKeyId: uploadCred.plainKeyText,
					secretAccessKey: uploadCred.plainSecretText
				});
				S3_BUCKET = uploadCred.bucket;
				console.log('S3_BUCKET:', S3_BUCKET);
				myBucket = new AWS.S3({
					params: {Bucket: S3_BUCKET},
					region: REGION,
				})
			}
		}
		fetchCred();
	}, [uploadCred]);

	const openRefPopover = (event, exam) => {
		if (exam && exam.ref !== "N/A") {
			setAnchorEl(event.currentTarget);
			setrefPopover(exam.rafDetail);
		}
		event.stopPropagation();
		event.preventDefault();
	}

	const refMenuClose = (e) => {
		setAnchorEl(null);
	}

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const setData = () => {
		console.log('routeParams.exam_id: ', routeParams.exam_id)
		if (SnaptShotDialog.imageURL != undefined) {
			let file = [...filesData]

			//   if (file.length>4) {
			// 	 return setOpen(true)
			//  }		 
			let time = moment(new Date).format("hh:mm:ss:a")
			let dateTime = time.replace(/:\s*/g, "_");
			file.push({imageData: SnaptShotDialog.imageURL, documentTypeId: "0", filename: `${routeParams.exam_id}_${new Date().toISOString().slice(0, 10)}_${dateTime}_${routeParams.name}.png`, isUploading: false, isUploaded: false, })

			setImages(file)
			//setState({...state, document:SnaptShotDialog.imageURL, fileName:SnaptShotDialog.fileName })
			setErrors({})
		}
		else {
			setState({...state, document: "", fileName: ''})
		}

	}
	// handle change
	const handleChange = (e, d) => {
		e.preventDefault();
		setState({...state, [e.target.name]: e.target.value, })
		setErrors({})
	}

	const handleChangeDocument = (e, value) => {

		e.preventDefault();
		var index = e.target.id.split('-')[0]
		var data = [...filesData]

		if (value) {
			//setState({...state, documentTypeId:value, documentName:value.document})
			if (filesData.length > 0) { // check if file array lenght is bigger ? append document name in file name
				data.forEach((el, i) => {
					let ext = el.filename.substr(el.filename.lastIndexOf('.') + 1);
					//data[i]['filename']=`${routeParams.name}${value.document}${new Date().getTime()}.${ext}`
					data[+index]['documentTypeId'] = value
				})
				data[+index]['error'] = ''//clear error when docuetent type gets change
				data[+index]['documentTypeId'] = value
				setImages(data)

			}
			setErrors({})
		}
		else {
			data[+index]['error'] = 'Document type is required'//clear error when docuetent type gets change
			data[+index]['documentTypeId'] = '0'
			setImages(data)
		}
	}
	// select de-select exam
	const manageExam = (e, data) => {
		if (data.exam_id == routeParams.exam_id) {
			return
		}
		let exam = state.selectedExam.find(x => x == data.exam_id);
		if (exam) { //remove from list
			let exmaIndex = state.selectedExam.indexOf(data.exam_id);// get index 
			state.selectedExam.splice(exmaIndex, 1)
		}
		else {
			state.selectedExam.push(data.exam_id)
			const examData = [...selectedExamData];
			examData.push(data);
			setSelectedExamData(examData);

			const filtered = filteredData.filter(f => f.exam_id !== data.exam_id);
			setFilteredData(filtered);

		}
		setState({...state, selectedExam: state.selectedExam})
	}

	const removeSelectedExam = (e, data) => {
		if (data.exam_id == routeParams.exam_id) {
			return
		}
		let exam = state.selectedExam.find(x => x == data.exam_id);
		if (exam) { //remove from list
			let exmaIndex = state.selectedExam.indexOf(data.exam_id);// get index 
			state.selectedExam.splice(exmaIndex, 1)

			const examData = [...filteredData];
			examData.push(data);
			setFilteredData(examData);

			const filtered = selectedExamData.filter(f => f.exam_id !== data.exam_id);
			setSelectedExamData(filtered);

		}
		setState({...state, selectedExam: state.selectedExam})
	}

	// show unchecked and checked
	const manageCheckUncheckExam = (id) => {
		let exam = state.selectedExam.find(x => x == id);
		if (exam) {
			return true
		}
		else {
			return false
		}
	}


	// Browse file 
	function handleUploadChange(e) {
		const file = e.target.files[0];
		if (!file) {
			return;
		}
		var fileName = e.target.files[0].name;

		const validExtensions = ['pdf', 'jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];
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
						let time = moment(new Date).format("hh:mm:ss:a")
						const fSize = Math.round((file.size / 1024 / 1024));
						resolve({
							imageData: ev.target.result, filename: `${file.name}`, documentTypeId: "0", isUploading: false, isUploaded: false, fileSize: fSize, isFileSizeExceed: fSize > 40 ? true : false
						});
					});
					reader.addEventListener('error', reject);
					reader.readAsDataURL(file);
				}));
			}))
				.then(data => {
					/* Once all promises are resolved, update state with image URI array */
					var oldFile = filesData
					var newFile = data
					var allFiles = [...oldFile, ...newFile];
					setImages(allFiles)
					setErrors({})
					const isFileSizeExceed = allFiles.find(a => a.isFileSizeExceed);
					setIsFileSizeExceed(isFileSizeExceed);
				}, error => {
				});


		}
	}


	/**
	 * handle submit bulk upload document
	 * @param {*} e 
	 */
	const handleSubmitDocument = async (e) => {
		var is_valid = true;
		e.preventDefault();

		var filesObj = [];
		var uploadableFiles = [];
		filesData.forEach((el, i) => {
			if (el.documentTypeId == '0' || el.documentTypeId == null) {
				el.error = 'Document type is required'
				is_valid = false;
			}
			if (!el.isUploaded) {
				uploadableFiles.push(el)
			}
			filesObj.push(el)
		});
		setImages(filesObj)

		if (is_valid) {
			if (uploadableFiles.length > 0) {
				//set loading true for all uploadable images
				var newFilesObj = [];
				filesData.forEach((el, i) => {
					if (!el.isUploaded) {
						el.isUploading = true;
					}
					newFilesObj.push(el)
				});
				setImages(newFilesObj)

				let exam = state.selectedExam.find(x => x == routeParams.exam_id);
				if (!exam) {
					state.selectedExam.push(+routeParams.exam_id);
				}

				setLoading(true)
				var fileObj = []
				let result = await Promise.all(uploadableFiles.map(async (file) => {
					if (file.isFileSizeExceed) {
						return;
					}
					let ext = file.filename.slice(file.filename.lastIndexOf('.'));
					const filename = state.selectedExam + '_' + routeParams.patient_id + '_' + momentTimezone().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss') + '_' + Math.floor(Math.random() * 1000) + ext;
					const bs64 = file.imageData.replace(/^data:.+;base64,/, "")
					let ContentType = file.imageData.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
					const fileContent = Buffer.from(bs64, 'base64');
					const params = {
						Body: fileContent,
						Bucket: S3_BUCKET,
						Key: 'ris/upload_technician/' + filename,
						ContentType
					};

					const response = await myBucket.putObject(params).promise();

					const document = {
						patient_id: routeParams.patient_id,
						exam_id: JSON.stringify(state.selectedExam),
						document_type: file.documentTypeId.id,
						docname: file.documentTypeId.document,
						status: 'online',
						filename: 'upload_technician/' + filename
					}
					fileObj.push(document)

					return response;
				}));

				console.log(result);


				var allFilesObj = [...filesData]
				// uploadableFiles.forEach((el, i) => {

				// 	const document = {
				// 		patient_id: routeParams.patient_id,
				// 		exam_id: JSON.stringify(state.selectedExam),
				// 		document_type: el.documentTypeId.id,
				// 		status: 'online',
				// 		filename: el.filename,
				// 		imageData: el.imageData,
				// 	}
				// 	fileObj.push(document)
				// })
				setImages(allFilesObj)

				var uploadData = {
					patient_id: routeParams.patient_id,
					data: fileObj,
				}
				const accessNosArr = JSON.parse(fileObj[0].exam_id);
				let docTpyes = '';
				fileObj.map((item, index) => {
					let docFilter = documentType.find(x => x.id === item.document_type)
					docTpyes += docFilter.document + ', ';
					return 0;
				})
				let alertExamId = accessNosArr.map((item) => {
					return '#' + item + " "
				})
				let docLenth = fileObj.length;

				const data = await dispatch(uploadBulkDocumentReact(uploadData))
				setLoading(false)
				if (data.payload.data) {
					setNavigationBlocked(false);
					if (pathname.indexOf('uploads-doc-page') < 0) {
						setUploadSuccess(true);
						// const alertExamId = routeParams.exam_id;
						// enqueueSnackbar( 'Document uploaded Successfully ACC #' +alertExamId, {
						// 	anchorOrigin: { vertical: 'top',horizontal: 'center'},
						// 	variant: 'success',
						// })	
						dispatch(removePatientInfo());
						dispatch(setDocumentUploadStatus({
							fileObj: fileObj,
							docTpyes: docTpyes,
							accessNos: alertExamId,
							docLenth: docLenth,
							isUploaded: true
						}));
						history.push(`/apps/profile/${routeParams.patient_id}/${routeParams.name}/0/${routeParams.exam_id}`)
					}
					else {
						history.push(`/apps/profile-page/${routeParams.patient_id}/${routeParams.name}/0/${routeParams.exam_id}`)
					}
				}
			} else {
				console.log('Nothing to upload.')
			}

		}

	};

	/**
	 * single document upload
	 * @param {*} e 
	 * @param {*} data 
	 * @param {*} i 
	 */
	const uploadFile = async (e, data, i) => {

		e.preventDefault();
		if (data.documentTypeId == '0' || data.documentTypeId == null) {
			let docData = [...filesData]
			docData[i].error = 'Document type is required'
			return setImages(docData)

		}
		else {
			let d = [...filesData]
			d[i].isUploading = true
			setImages(d)
			let exam = state.selectedExam.find(x => x == routeParams.exam_id);
			if (!exam) {
				state.selectedExam.push(+routeParams.exam_id);
			}

			let ext = d[i].filename.slice(d[i].filename.lastIndexOf('.'));
			const filename = state.selectedExam + '_' + routeParams.patient_id + '_' + momentTimezone().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss') + '_' + Math.floor(Math.random() * 1000) + ext;
			let ContentType = d[i].imageData.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
			const bs64 = d[i].imageData.replace(/^data:.+;base64,/, "")
			const fileContent = Buffer.from(bs64, 'base64');
			const params = {
				Body: fileContent,
				Bucket: S3_BUCKET,
				Key: 'ris/upload_technician/' + filename,
				ContentType
			};

			const response = await myBucket.putObject(params).promise();

			var uploadData = {
				patient_id: routeParams.patient_id,
				document_type: d[i].documentTypeId.id,
				docname: d[i].documentTypeId.document,
				exam_id: JSON.stringify(state.selectedExam),
				status: "online",
				filename: 'upload_technician/' + filename,
				// imageData: d[i].imageData,
			}
			const data = await dispatch(uploadDocumentReact(uploadData))
			let doc = [...filesData]

			if (data.payload && data.payload.data && data.payload.data) {
				//history.push(`/apps/profile/${routeParams.patient_id}/${routeParams.name}/2`)
				doc[i].isUploaded = true
				doc[i].isUploading = false
				const filteredData = doc.filter(f => f.isUploaded === true);
				if (filteredData.length === doc.length) {
					setUploadFinished(true);
					setNavigationBlocked(false);
				}
			} else {
				doc[i].isUploaded = false
				doc[i].isUploading = false
			}
			setImages(doc)
			// setImages(d)
			// setTimeout(() => {

			// 	let d = [...filesData]
			// 	d[i].isUploaded = true
			// 	d[i].isUploading = false
			// 	setImages(d)
			// }, 3000)
		}
	}


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
		if (event.dataTransfer.types[0] == "Files") {
			var files = [...event.dataTransfer.files];
			var isValid = true;
			const validExtensions = ['pdf', 'jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];

			for (let img of files) {

				if ($.inArray(img.name.substr(img.name.lastIndexOf('.') + 1), validExtensions) == -1) {
					event.target.value = "";
					isValid = false;
					setState({...state, isValid: false})
					$("#container").removeClass(classes.onDrop);
					$("#icon").removeClass('text-96 font-900');
					$("#content").removeClass('text-16');
					setDragging(0)

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
							const fSize = Math.round((file.size / 1024 / 1024));
							resolve({
								imageData: ev.target.result, filename: `${file.name}`, documentTypeId: "0", isUploading: false, isUploaded: false, fileSize: fSize, isFileSizeExceed: fSize > 40 ? true : false
							});
						});
						reader.addEventListener('error', reject);
						reader.readAsDataURL(file);
					}));
				}))
					.then(data => {
						var oldFile = filesData
						var newFile = data
						var allFiles = [...oldFile, ...newFile];
						setImages(allFiles)
						/* Once all promises are resolved, update state with image URI array */
						const isFileSizeExceed = allFiles.find(a => a.isFileSizeExceed);
						setIsFileSizeExceed(isFileSizeExceed);
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
		async function fetchData() {

			setLoading(true)
			const result = await dispatch(getDocuments(routeParams));

			if (routeParams.exam_id == 0) {
				if (result.payload.data && result.payload.data.length > 0) {
					state.selectedExam.push(result.payload.data[0].exam_id)
					setState({...state, selectedExam: state.selectedExam})
				}
			}

			setLoading(false)
			var fresult = [];
			var sresult = [];
			const data = result.payload.data;
			if (data && data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					if (routeParams.exam_id === data[i].exam_id.toString()) {
						sresult.push(data[i]);
					}
				}
				for (var i = 0; i < data.length; i++) {
					if (routeParams.exam_id !== data[i].exam_id.toString()) {
						fresult.push(data[i]);
					}
				}
			}
			setSelectedExamData(sresult);
			return setFilteredData(fresult);


		}
		fetchData();
		// Detect IE or Edge brower
		detectBrowser()

	}, []);


	//  Detect Browser 
	const detectBrowser = () => {
		var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
		// Edge (based on chromium) detection
		var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
		if (isEdgeChromium) {
			setEdgeBrowser(true)
		}
	}
	const openDialog = event => {
		dispatch(openSnaptShotDialog(event.data));
	};
	// handle close alert
	const handleClose = (event, reason) => {
		setOpen(false);
	};

	const handleCloseUploadSuccess = () => {
		setUploadSuccess(false);
	}

	// OPEN PREVIE DILOAG
	const openDialogPreview = (e, doc) => {

		const data = {
			fileUrl: doc.imageData,
			fileExt: doc.filename.split('.')[1],
			docName: doc.documentTypeId == '0' ? '' : doc.documentTypeId.document
		}
		dispatch(openPreivewDialog(data))
	}
	if (!filteredData) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularStatic />
			</div>
		);
	}

	if (!filteredData || (filteredData.length === 0 && selectedExamData.length === 0)) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					No Exams Found !
				</Typography>
			</div>
		);
	}
	const removeFile = (e, i) => {
		const ar = [...filesData];
		ar.splice(i, 1);
		setImages(ar)
		const isFileSizeExceed = ar.find(a => a.isFileSizeExceed);
		setIsFileSizeExceed(isFileSizeExceed);
	}
	return (
		<>
			<div id="drag1"
				onDrop={event => handleDrop(event)}
				onDragEnter={event => handleDragEnter(event)}
				onDragOver={event => handleDragOver(event)} onDragLeave={event => handleDragEnd(event)} className="flex flex-col flex-auto flex-shrink-0 w-full">
				<Typography style={{textAlign: "center", marginBottom: "10px"}} variant="h5">Please select the document you wish to upload.</Typography>
				<div style={{margin: "auto"}} className="flex justify-center sm:justify-start flex-wrap -mx-8">
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
							accept="*/*"
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

					<label
						style={{background: "#f6f7f9"}}
						title="Take SnaptShot"
						// htmlFor="button-file"
						className={clsx(
							classes.documentImageUpload,
							'flex items-center justify-center relative w-128  h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
						)}
					>
						<input className="hidden" onClick={(e) => {openDialog(e)}} />
						<div className="w-192 h-128 p-16 flex flex-col items-center justify-center" >
							<Icon fontSize="large" style={{color: "rgba(0, 0, 0, 0.54)"}} color="action">
								photo_camera
							</Icon>
							<Typography style={{fontWeight: "900", color: "rgba(0, 0, 0, 0.87)"}} variant="caption" className="mt-4">
								Take Snapshot
							</Typography>
						</div>

					</label>
					{/* show only when broswer is edge */}
					{/* {!isEdge && <label
					style={{ background: "#f6f7f9" }}
					title="Scan Document"
					// htmlFor="button-file"
					className={clsx(
						classes.documentImageUpload,
						'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
					)}
				>
					<input className="hidden" />
					<div className="w-192 h-128 flex flex-col items-center justify-center" >
						<Icon style={{ color: "rgba(0, 0, 0, 0.54)" }} fontSize="large" color="action">
							scanner
                           </Icon>
						<Typography style={{ fontWeight: "900", color: "rgba(0, 0, 0, 0.87)" }} variant="caption" className="mt-4">
							Scan document
                             </Typography>
					</div>

				</label>} */}

				</div>
				{filesData.length > 0 && <TableContainer style={{width: "900px", maxHeight: "337px", margin: "auto", }} component={Paper}>
					<Table size="small" stickyHeader className={classes.table} aria-label="a dense table">
						<TableHead stickyHeader  >
							<TableRow style={{backgroundColor: "white", color: "black"}}>
								<TableCell style={{backgroundColor: "white", color: "black", width: "125px"}}>Document</TableCell>
								<TableCell style={{backgroundColor: "white", color: "black"}} align="center">Filename</TableCell>
								<TableCell style={{backgroundColor: "white", color: "black"}} align="center">Document Type</TableCell>
								{/* <TableCell style={{ backgroundColor: "white", color: "black" }} align="center"></TableCell> */}
								<TableCell colSpan={2} style={{backgroundColor: "white", color: "black", paddingLeft: "0px"}} align="right">
									{filteredData.length > 0 && <Button onClick={(e) => {handleSubmitDocument(e)}} variant="contained" disabled={isLoading || (isFileSizeExceed && filesData.length === 1)} color="primary">
										{isLoading && <CircularProgress size={16} className={classes.buttonProgress} />}
										{!isLoading && 'Upload all'}
										{isLoading && 'Uploading..'}
									</Button>}


								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filesData.map((media, i) => (
								<TableRow key={media.imageData}>
									<TableCell className={`w-52 px-4`} component="th" padding="none" scope="row">
										<img onClick={(e) => openDialogPreview(e, media)} key={media.i} title={media.filename} className={`w-full block rounded ${classes.thumpImg}`} src={media.filename.split('.')[1] == 'pdf' ? `assets/images/upload/pdf.png` : media.imageData} alt="Doc" />

									</TableCell>
									<TableCell style={{width: "24%", paddingLeft: "0px", paddingRight: "0px"}} title={media.filename} align="center">{media.filename.length > 25 ? (media.filename.substring(0, 25) + "..." + media.filename.split('.')[1]) : (media.filename)}</TableCell>
									<TableCell align="center" style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										paddingTop: "15px",
										paddingBottom: "15px"
									}}>
										<Autocomplete
											aria-required
											disabled={(media.isUploaded) ? true : false}
											id={i}
											value={media.documentTypeId}
											onChange={handleChangeDocument}
											options={documentType}
											getOptionLabel={(option) => option.document}
											style={{width: 300}}
											renderInput={(params) => <TextField {...params} error={media.error} label="CHOOSE DOCUMENT TYPE" helperText={media.error}
												variant="outlined" />}

										/></TableCell>
									<TableCell style={{paddingRight: "16px"}} align="right">
										<Button onClick={(e) => {!media.isUploaded && uploadFile(e, media, i)}} title={media.isUploaded ? "File successfully uploaded" : media.isUploading ? "File uploading" : "File Upload"} size="small" disabled={media.isUploading || media.isFileSizeExceed} variant="contained" color={media.isUploaded ? 'secondary' : "primary"}>
											{media.isUploading && !media.isFileSizeExceed && <CircularStatic size={16} className={classes.buttonProgress} />}
											{!media.isUploading && !media.isUploaded && 'Upload'}
											{media.isUploading && !media.isUploaded && !media.isFileSizeExceed && 'Uploading'}
											{media.isUploaded && 'Uploaded'}
											{media.isUploading && !media.isUploaded && media.isFileSizeExceed && 'File size is too big'}
										</Button>
										{!media.isUploaded && !media.isUploading ? <Button style={{marginLeft: "10px"}} onClick={(e) => {removeFile(e, i)}} title="Remove File" size="small" variant="contained" color="primary">Remove</Button> : null}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>}

				{isUploadFinished && pathname.indexOf('uploads-doc-page') < 0 &&
					<div className="flex justify-center mt-12">
						<Link style={{textDecoration: "none"}} to={`/apps/profile/${routeParams.patient_id}/${routeParams.name}/0/${routeParams.exam_id}`}><Button variant="contained" color="primary">
							Finished
						</Button>
						</Link>
					</div>}

				{isUploadFinished && pathname.indexOf('uploads-doc-page') >= 0 &&
					<div className="flex justify-center mt-12">
						<Link style={{textDecoration: "none"}} to={`/apps/profile-page/${routeParams.patient_id}/${routeParams.name}/0/${routeParams.exam_id}`}><Button variant="contained" color="primary">
							Finished
						</Button>
						</Link>
					</div>}

				{errors.file && <FormHelperText style={{color: "red", textAlign: "center"}}>{errors.file}</FormHelperText>}
				{!state.isValid && <div style={{marginBottom: "5px"}} className={classes.root}>
					<Alert severity="error">Unsupported  file format, allowed file type are: PNG, JPEG,JPG, PDF</Alert>
				</div>}
				{isFileSizeExceed && <div style={{marginBottom: "5px"}} className={classes.root}>
					<Alert severity="error">You cannot upload more then 40 MB file.</Alert>
				</div>}
				<div className="mb-12 flex justify-center" className={classes.scrollHrSelectedExam}>
					{selectedExamData.map(exam =>
						<div className={selectedExamData && selectedExamData.length <= 1 ? 'w-440 pt-8 pb-8 mr-8' : 'w-400 pt-8 pb-8 mr-8'} key={exam.exam_id}>
							<div style={{display: "flex", justifyContent: "center", height: "2.9rem"}}>
								{(manageCheckUncheckExam(exam.exam_id) || exam.exam_id == routeParams.exam_id) &&
									<CheckCircle className="block text-32 text-green-800 bg-white rounded-full" />
								}
								{exam.exam_id != routeParams.exam_id &&
									<Cancel className="block text-32 rounded-full cursor-pointer" onClick={(e) => removeSelectedExam(e, exam)} />
								}
							</div>
							<ExamCard
								patient={exam}
								isShowAction={false}
								isSelectedExam={manageCheckUncheckExam(exam.exam_id) || exam.exam_id == routeParams.exam_id}
								isShowClose={true}
							/>
						</div>
					)}
					<RefPopover open={open} anchorEl={anchorEl} refMenuClose={refMenuClose} refPopover={refPopover} />
				</div>
				<div className="mb-12">
					<FuseAnimateGroup
						enter={{
							animation: 'transition.slideUpBigIn'
						}}
						className={filteredData && filteredData.length <= 2 ? classes.scrollHrMin : classes.scrollHr}
					>
						{filteredData.map(exam =>
							<div className="w-400 pt-8 pb-8" key={exam.exam_id} style={{margin: "auto"}}>
								<div style={{display: "flex", justifyContent: "center", height: "2.9rem"}}>
									{(manageCheckUncheckExam(exam.exam_id) || exam.exam_id == routeParams.exam_id) &&
										<CheckCircle className="block text-32 text-green-800 bg-white rounded-full" />
									}
									{(!manageCheckUncheckExam(exam.exam_id) && exam.exam_id !== routeParams.exam_id) &&
										<CheckCircle className="block text-32 text-gray-500 bg-white rounded-full" />
									}
								</div>
								<ExamCard
									patient={exam}
									isShowAction={false}
									manageExam={(e) => manageExam(e, exam)}
									isSelectedExam={manageCheckUncheckExam(exam.exam_id) || exam.exam_id == routeParams.exam_id}
									isCollapsed={true}
									isDownloadbutton={true}

								/>
							</div>
						)}
					</FuseAnimateGroup>
					<RefPopover open={open} anchorEl={anchorEl} refMenuClose={refMenuClose} refPopover={refPopover} />
				</div>
				{pathname.indexOf('uploads-doc-page') < 0 &&
					<div className={classes.root}>
						{/* {filteredData.length > 0 && <Button onClick={(e) => { handleSubmitDocument(e) }} variant="contained" disabled={isLoading} color="primary">
					   {isLoading && <CircularProgress size={16} className={classes.buttonProgress} />}
					   {!isLoading && 'Upload'}
					   {isLoading && 'Uploading..'}
				   </Button>} */}
						{/* <Link style={{ textDecoration: "none" }} to={`/apps/profile/${routeParams.patient_id}/${routeParams.name}/0`}><Button variant="contained" color="primary">
					Back
					</Button>
				</Link> */}
					</div>}
				{/* <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="error">
						Max 5 documents are allowed at a time only.
					</Alert>
				</Snackbar> */}



				{/* : (
							<div className="flex flex-1 items-center justify-center">
								<Typography color="textSecondary" className="text-24 my-24">
									No Exams found!
								</Typography>
							</div>
						)), */}

				{/* )} */}
				<NavigationBlocker navigationBlocked={isNavigationBlocked} />
			</div>
		</>

	);
}

export default UploadDocument



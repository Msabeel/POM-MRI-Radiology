
import Typography from '@material-ui/core/Typography';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
	openPreivewDialog,
	getUploadCred
} from '../store/ProfileSlice';
import history from '@history';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import TaskList from '../TaskList';
import AlertList from '../AlertList';
import PaymentWindow from '../PaymentWindow';
import CancelExamCard from './CancelExamCard';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {useSnackbar} from 'notistack';
import {useLocation, Prompt} from 'react-router-dom';
import {setDocumentUploadStatus, getRadiologist, getRefferers, openNewOrderDialog} from '../store/ProfileSlice';
import {useDeepCompareEffect} from '@fuse/hooks';
import {ExamCardGrid} from './ExamCardGrid';
import NewOrderDialog from '../dialogs/NewOrderDialog';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles(theme => ({
	button: {
		margin: theme.spacing(1),
		[theme.breakpoints.down("sm")]: {
			minWidth: 32,
			paddingLeft: 8,
			paddingRight: 8,
			"& .MuiButton-startIcon": {
				margin: 0
			}
		}
	},
	buttonText: {
		[theme.breakpoints.down("sm")]: {
			display: "none"
		}
	},
	iconBtn: {
		padding: 10
	}
}));
const LightTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 13,
	},
	tooltipPlacementTop: {
		margin: "-15px 0",
	},
}))(Tooltip);

function PhotosVideosTab(props) {
	//debugger
	const dispatch = useDispatch();
	const classes = useStyles()
	const CustomNotify = useCustomNotify();
	const {id, name, exam_id} = useParams()
	const [showAlert, setShowAlert] = useState(false);
	const [docViewIndex, setdocViewIndex] = useState(-1);
	const [isDocView, setOpenDocView] = useState(false);
	const [data, setData] = useState(props.patientData.document);
	const [tempData, setTempData] = useState(props.patientData.document);
	const filterOptions = useSelector(({profilePageApp}) => profilePageApp.profile.filterOptions);
	const location = useLocation();
	const {pathname} = location;
	const isUploadedStatus = useSelector(({profilePageApp}) => profilePageApp.profile.isUploaded);
	const UploadCred = useSelector(({profilePageApp}) => profilePageApp.profile.uploadCred);
	const Radiologist = useSelector(({profilePageApp}) => profilePageApp.profile.radiologist);
	const Refferers = useSelector(({profilePageApp}) => profilePageApp.profile.refferers);

	const [snack, setSnack] = React.useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});
	const [openError, setOpenError] = React.useState(false);
	const [uploadedExamIds, setUploadedExamIds] = React.useState([]);

	useDeepCompareEffect(() => {
		if (!UploadCred) {
			dispatch(getUploadCred());
		}
	}, [dispatch, UploadCred])
	useEffect(() => {
		setData(props.patientData.document)
		setTempData(props.patientData.document)
	}, [props.patientData.document])
	useEffect(() => {
		if (filterOptions.length > 0) {

			let filter = data.filter(x => {


				let exam = x.exam ? x.exam : "";
				let modality = x.modality ? x.modality : "";
				let rad = x.radDetail ? x.radDetail.displayname : "";
				let ref = x.rafDetail ? x.rafDetail.displayname : "";
				let scheduling_date = x.scheduling_date ? x.scheduling_date : "";
				let access_no = x.access_no ? x.access_no : ""
				if (filterOptions.length === 1) {

					if (modality.toUpperCase() === filterOptions[0].match.toUpperCase() ||
						exam.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						rad.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						ref.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						scheduling_date.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
						access_no.toString().startsWith(filterOptions[0].match)) {
						return x
					}

				}

			})
			if (filter) {
				setData(filter)
			}
		} else {
			setData(tempData)
		}
	}, [filterOptions])
	useEffect(() => {
		if (isUploadedStatus != null) {
			const {fileObj, docLenth, docTpyes, accessNos} = isUploadedStatus;
			setUploadedExamIds(accessNos);
			CustomNotify(<div><p>{docLenth > 1 ? docLenth + " Documents Uploaded Successfully: " + docTpyes : "A Document  Uploaded Successfully: " + docTpyes} For {"ACC: " + accessNos}</p></div>, 'success')
		}
	}, [isUploadedStatus])
	useEffect(() => {
		if (exam_id && props.patientData.document) {
			const index = props.patientData.document.findIndex(x => x.access_no === exam_id);
			setdocViewIndex(index);
		}

		if (!props.patientData.document || props.patientData.document.length === 0) {
			dispatch(openNewOrderDialog())
		}
	}, [exam_id, props.patientData.document]);


	useEffect(() => {
		if (Radiologist.length === 0) {
			fetchRadioList();
		}
	}, [Radiologist]);

	useEffect(() => {
		if (Refferers.length === 0) {
			fetchRefferers();
		}

	}, [Refferers]);

	const fetchRadioList = async () => {
		const response = await dispatch(getRadiologist());
		return response;
	};

	const fetchRefferers = async () => {
		const response = await dispatch(getRefferers());
		return response;
	};
	const handleSubmit = () => {
		CustomNotify("This Feature is coming soon!", 'success')
	}
	if (props.patientData.document == null) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularStatic />
			</div>
		);
	}

	if (!props.patientData.document || props.patientData.document.length === 0) {
		return (
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
				<Button
					variant="contained"
					color="secondary"
					className="mr-8"
					type="submit"
					title="Coming Soon"
					onClick={handleSubmit}
					style={{marginBottom: 10}}
				>
					Order An Exam
				</Button>
				<Typography color="textSecondary" variant="h5">
					No exams Ordered
				</Typography>

			</div>
			// <div className="flex flex-1 items-center justify-center h-full">



			// </div>
		);
	}
	// Redirct to upload document page

	// OPEN PREVIE DILOAG
	const openDialog = (e, doc) => {
		const data = {
			fileUrl: doc.link,
			fileExt: doc.attachment.split('.')[1],
			docName: doc.documnet_name,
		}
		dispatch(openPreivewDialog(data))
	}


	const handleSuccessOpen = (event, reason) => {
		setSnack({open: true, vertical: 'top', horizontal: 'center'});
	};

	const handleOpenError = (event, reason) => {
		setOpenError(true);
	};
	const handleCloseError = (event, reason) => {
		setOpenError(false);
	};
	const UploadDocument = (event, exam) => {
		dispatch(setDocumentUploadStatus(null))
		if (pathname.indexOf('profile-page') < 0) {
			history.push(`/apps/uploads-document/${id}/${exam.access_no}/${name}`)
		} else {
			history.push(`/apps/uploads-doc-page/${id}/${exam.access_no}/${name}`)

		}
	};

	const HandleCancelExam = (e, exam) => {
		if (pathname.indexOf('profile-page') < 0) {
			history.push(`/apps/exam-cancelled/${id}/${exam.access_no}/${name}`)
		}
		else {
			history.push(`/apps/exam-cancel/${id}/${exam.access_no}/${name}`)
		}
	}
	const handlePayload = (payload) => {
		if (payload.isFinalReport === true) {
			CustomNotify(payload.data.message[0], "success");
			setTimeout(() => {
				if (payload.data.message[1]) {
					CustomNotify(payload.data.message[1], "info");
				} else {
					if (payload.data.error) {
						CustomNotify(payload.data.error, "error");
					}
				}
			}, 1500)
		} else {
			CustomNotify("Something weng wrong.", "error");
		}
	}
	const openDocs = (e) => {
		// openNoteView(false);
		// openAuditView(false);
		setOpenDocView(e);
	}


	return (
		<>
			<div className="md:flex w-full">

				<div className="flex flex-col flex-1">

					<div style={{
						display: 'flex',
						alignSelf: 'flex-end',
						justifyContent: 'center',
						alignItems: 'center',
						// padding: 15
					}}>

					</div>

					{
						props.isGrid ?

							<div className="md:grid grid-cols-2 gap-2 mb-20" style={{marginTop: 20}}>

								{data && data.map((patient, i) => {
									return (

										<CancelExamCard
											key={i}
											index={i}
											patientData={props.patientData}
											patient={patient}
											handleSuccessOpen={handleSuccessOpen}
											handleOpenError={handleOpenError}
											UploadDocument={UploadDocument}
											HandleCancelExam={HandleCancelExam}
											handlePayload={handlePayload}
											examId={exam_id}
											uploadedExamIds={uploadedExamIds}
											filterOptions={filterOptions}
											handleSelectedAcc={props.handleSelectedAcc}
										/>


									)
								})}
							</div>
							:
							<ExamCardGrid
								data={props.patientData.document}
								patientData={props.patientData}
								handleSuccessOpen={handleSuccessOpen}
								handleOpenError={handleOpenError}
								UploadDocument={UploadDocument}
								HandleCancelExam={HandleCancelExam}
								handlePayload={handlePayload}
								examId={exam_id}
								uploadedExamIds={uploadedExamIds}
								handleSelectedAcc={props.handleSelectedAcc}
								filterOptions={filterOptions}
								s3Cred={UploadCred}
								setSelectedGridRows={props.setSelectedGridRows}
							/>
					}
				</div>
				<AlertList />
				<TaskList />
				<PaymentWindow patientData={props.patientData} />

			</div>
		</>
	);
}

export default PhotosVideosTab;


import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {getExamCancelReasons, getSelectedExam, openPreivewDialog, examCancelSubmit, examCancelRevert} from './store/examCancelledSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useParams} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExamCard from '../../../fuse-layouts/shared-components/ExamCard';
import AlertDialog from '../../../fuse-layouts/shared-components/AlertDialog';
import Switch from '@material-ui/core/Switch';
import {withStyles} from '@material-ui/core/styles'; 
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PreviewDialog from './PreviewDialog';
import history from '@history';
import CircularProgress from '@material-ui/core/CircularProgress';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {getAllDocuments, getAllAudit, getUploadCred} from '../profile/store/ProfileSlice';
import {useDeepCompareEffect} from '@fuse/hooks';

const IncidetSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: '#52d869',
        },
        '&$checked + $track': {
            backgroundColor: '#52d869',
        },
    },
    checked: {},
    track: {},
})(Switch);
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        borderRadius: '50px',
        marginBottom: '20px',
    },
    reasonInput: {
        background: '#fff',
    },
    autoExCard: {
        width: '70%',
        padding: '12px 20px',
    },
    headDiv: {
        border: '1px solid #142534',
        borderRadius: '5px',
        margin: '20px',

    },
    heading: {
        padding: '10px 0 10px 0',
        background: '#142534',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '10px',
        color: '#fff',
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    incident: {
        padding: '12px 15px',
    },
    note: {
        padding: '12px 20px',
    },
    examnote: {
        width: '500px',
        background: '#fff',
    },
}));

function ExamCancelled(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const routeParams = useParams();
    const location = useLocation();
    const {pathname} = location;
    const {reasonsList, selectedExamCard, isPatientCardRender} = useSelector(({examCancelledApp}) => examCancelledApp.examCancelled);
    const {userId} = useSelector(({auth}) => auth.user.data);
    const [selectedReason, setSelectedReason] = useState({});
    const [note, setNote] = useState('');
    const [sendIncident, setSendIncident] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isdocLoading, setIsDocLoading] = useState(false);
    const [openAlert, setopenAlert] = useState({isOpen: false, type: '', alertMsg: '', showButton: false});
    const [incidentReportCheck, setIncidentReportCheck] = useState(false);
    const [reasonError, serReasonError] = useState('');
    const [isDocView, setOpenDocView] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [audits, setAudits] = useState([])
    const [s3Cred, setS3Cred] = useState(null)
    const customNotify = useCustomNotify()
    useEffect(() => {
        localStorage.setItem('routeParams', JSON.stringify(routeParams));
    }, [routeParams]);
    const handleChange = (event) => {
        setSendIncident(event.target.checked);
    };


    useEffect(() => {
        const fetchS2Cred = async () => {
            const result = await dispatch(getUploadCred());
            setS3Cred(result.payload.data)
        }
        fetchS2Cred();
    }, [dispatch,])
    const callAPI = async () => {
        await dispatch(getExamCancelReasons(routeParams));
        await dispatch(getSelectedExam(routeParams));
    }

    useEffect(() => {
        callAPI()
    }, []);

    useEffect(() => {

        if (isDocView) {
            fetchAllDocuments()
        }
    }, [isDocView]);
    useEffect(() => {
        if (isAuditOpen) {
            fetchAllAudits()
        }
    }, [isAuditOpen]);
    const fetchAllAudits = async () => {
        setIsDocLoading(true)
        const data = {
            exam_id: routeParams.exam_id
        }
        console.log("data",data)
        const result = await dispatch(getAllAudit(data))
        if (result.payload) {
            setAudits(result.payload.data.data)
        }
        setIsDocLoading(false)

    }

    const fetchAllDocuments = async () => { 
        setIsDocLoading(true)
        const data = {
            exam_id: routeParams.exam_id
        }
        const result = await dispatch(getAllDocuments(data))
        if (result.payload) {

            setDocuments(result.payload.data.data)


        }
        setIsDocLoading(false)

    }

    function handleBack() {
        const IndexSettings = JSON.parse(localStorage.getItem('Index_Details'));
        const routeParams = JSON.parse(localStorage.getItem('routeParams'));
        let FinishedURL = '';
        if (IndexSettings.redirectUrl && IndexSettings.redirectUrl.FinishedURL !== null) {
            FinishedURL = IndexSettings.redirectUrl.FinishedURL;
        }
        const from = routeParams.from;
        let FromURL = '';
        if (from === 'patientlookup') {
            FromURL = `/patient/lookuplist/pid/${routeParams.id || routeParams.patient_id}/txt_patient_lname//txt_patient_fname//txt_patient_id//dob_mon//dob_dat//dob_yer//txt_phone//txt_access/${routeParams.exam_id}`;
        } else if (from === 'dailyworkflow') {
            FromURL = '/dailyworkflow/index/val/load%20preference';
        }
        window.open(FinishedURL + FromURL, "_self");
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        if (!selectedReason.reason) {
            serReasonError("Please select a reason")
            setIsLoading(false);
            return 0;
        }
        const payload = {
            trigger:"cancelexam",
            exam_id: routeParams.exam_id,
            patient_id: routeParams.patient_id,
            userid: userId,
            reasonid: selectedReason.id,
            reason: selectedReason.reason,
            comment: note,
            SendReport: incidentReportCheck
        }
        const result = await dispatch(examCancelSubmit(payload));
        if (result.payload.isExamCancel) {
            customNotify(result.payload.data, "success")
        } // setopenAlert({isOpen: true, type: 'success', alertMsg: result.payload.data, showButton: true})
        else {
            customNotify("Something went wrong! ", "error")

        }
        // setopenAlert({isOpen: true, type: 'error', alertMsg: "Something went wrong! ", showButton: false})

        if (pathname.indexOf('exam-cancelled') < 0) {
            handleBack();
        }
        else {
            history.goBack();
        }
        setIsLoading(false);
    }

    const handleSelectReason = (e, value) => {
        let filter = reasonsList.find(reason => reason === value)
        setSelectedReason(value);
        setIncidentReportCheck(filter.chk_incident === 'Y' ? true : false);

    }

    const handleNote = (e) => {
        setNote(e.target.value);
    }

    const hadleCloseAlert = () => {
        setopenAlert({isOpen: false, type: '', alertMsg: ''});
    }

    const handleCancelExamRevert = async () => {
        const payload = {
            exam_access_no: routeParams.exam_id,
            user_id: userId,
            previousStatus: selectedExamCard && selectedExamCard.documnets[0].status || ''
        }
        const result = await dispatch(examCancelRevert(payload));
        if (result.payload.isExamCancelRevert)
            setopenAlert({isOpen: true, type: 'success', alertMsg: result.payload.data, showButton: false})
        else
            setopenAlert({isOpen: true, type: 'error', alertMsg: "Something went wrong!!", showButton: false})

    }
    const goBack = (e, exam) => {
        history.goBack()
    }

    const handleIncidentReport = (event) => {
        setIncidentReportCheck(event.target.checked);
    };
    return (
        <>

            {isPatientCardRender ? (

                <div className={classes.headDiv}>
                    <Typography style={{textAlign: "center", marginBottom: "10px"}} className={classes.heading} variant="h5">Please select a reason for cancelling this exam</Typography>
                    <div className={classes.center}>
                        <div className={classes.autoExCard}>
                            <Grid container justify='center'>
                                <Autocomplete
                                    id="reason-list"
                                    onChange={handleSelectReason}
                                    options={reasonsList}
                                    getOptionLabel={(option) => option.reason}
                                    style={{width: 520}}
                                    renderInput={(params) => <TextField {...params} className={classes.reasonInput} label="Select Reason" variant="outlined" />}
                                />
                            </Grid>
                            {reasonError ? <p style={{color: 'red', textAlign: 'center', marginTop: 5}}>{reasonError}</p> : ""}
                        </div>
                        <div className={classes.autoExCard}>
                            {selectedExamCard && (
                                <ExamCard
                                    patient={selectedExamCard[0]}
                                    isShowAction={false}
                                    isShowClose={true}
                                />
                            )}
                        </div>
                        <div className={classes.incident}>
                            <Grid container style={{
                                dispplay: 'flex',
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Checkbox
                                    checked={incidentReportCheck}
                                    color="primary"
                                    onChange={handleIncidentReport}
                                    inputProps={{'aria-label': 'secondary checkbox'}}
                                />
                                {/* <IncidetSwitch
                                    checked={sendIncident}
                                    onChange={handleChange}
                                    name="sendIncident"
                                /> */}
                                <label> Send Incident Report to Ordering Physician</label>
                            </Grid>
                        </div>
                        <div className={classes.note}>
                            <Grid container justify='center'>
                                <TextField
                                    id="exam-note"
                                    label="Enter Note"
                                    multiline
                                    rows={4}
                                    className={classes.examnote}
                                    variant="outlined"
                                    onChange={handleNote}
                                />
                            </Grid>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className={classes.button}
                                disabled={isLoading}
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                            >
                                CANCEL THE EXAM
                                {
                                    isLoading &&
                                    <CircularProgress className="ml-10" size={18}></CircularProgress>
                                }
                            </Button>
                            <AlertDialog isOpen={openAlert.isOpen} onClick={handleCancelExamRevert} onClose={hadleCloseAlert} alertMessage={openAlert.alertMsg} buttonTitle="UNDO" showButton={openAlert.showButton} alertType={openAlert.type} />
                        </div>
                    </div>
                    <PreviewDialog />
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center h-full">
                    <CircularStatic />
                </div>
            )}
        </>
    );
}

export default ExamCancelled;
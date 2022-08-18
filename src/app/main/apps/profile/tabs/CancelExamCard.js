import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import history from '@history';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Visibility from '@material-ui/icons/Visibility';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import Button from '@material-ui/core/Button';
import ExamCard from 'app/fuse-layouts/shared-components/ExamCard';
import CreateFormDialog from './CreateFormDialog';
import {getFinalReport} from '../store/ProfileSlice'
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import {Permissions, CustomSettings} from 'app/config';
import FuseUtils from '@fuse/utils';
import awsService from 'app/services/awsService';
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
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
    }
}));


function CancelExamCard({
    patient,
    patientData,
    index,
    handleSuccessOpen,
    handleOpenError,
    HandleCancelExam,
    UploadDocument,
    handlePayload,
    examId
}) {
    //debugge
    const dispatch = useDispatch();
    const classes = useStyles()
    const [isFetch, setIsFetch] = useState(false);
    const [open, setOpen] = useState(false);
    const [accessNo, setAccessNo] = useState(0);
    const [exam, setExam] = useState('');
    const [currentExam, setCurrentExam] = useState({});
    const [changedStatus, setChangeStatus] = useState(patient.status);
    const isUserTech = FuseUtils.hasButtonPermission(Permissions.user_tech);

    useEffect(() => {
        if (patientData && patientData.exams.length > 0) {
            const exam = patientData.exams.find(e => e.exam_id === patient.access_no);
            setCurrentExam(exam);
        }
    }, [patientData]);

    const handleFetchFinalReport = async () => {
        setIsFetch(true)
        var data = {
            exam_access_no: patient.access_no
        }
        const result = await dispatch(getFinalReport(data));
        if (result.payload.getFinalReportError !== true)
            window.open(result.payload.data.link);
        else
            handleOpenError()
        setIsFetch(false)
    }
    const handleTechSheet = () => {
        const user = awsService.getUserDetail();
        const eid = patientData.exams[index].exam_id;
        const p_id = patientData.patientInfo.id;
        const pname = patientData.patientInfo.lname + ',' + patientData.patientInfo.fname;
        const tech_id = user.data.userId;
        window.open(
            `${CustomSettings.BackURL}/dailyworkflow/techform/eid/${eid}/p_id/${p_id}/pname/${pname}/tech_id/${tech_id}`,
            '_blank'
        );
    }
    const handleDicom = () => {
        const user = awsService.getUserDetail();
        const user_id = user.data.userId;
        const eid = patientData.exams[index].exam_id;
        const userName = user.data.userName;
        //http://import.pomrispacs.com:9090/CDImport?un=4545688785&userid=13653&an=621539&token=d2ddea18f00665ce8623e36bd4e3c7c5
        //console.log(`http://import.pomrispacs.com:9090/CDImport?un=${userName}&userid=${eid}&an=621539&token=d2ddea18f00665ce8623e36bd4e3c7c5`)
        window.open(
            `http://import.pomrispacs.com:9090/CDImport?un=${userName}&userid=${eid}&an=621539&token=d2ddea18f00665ce8623e36bd4e3c7c5`,
            '_blank'
        );
    }

    function setUploadFinalModel(patient) {
        setOpen(true);
    }
    if (patient.access_no == null) {
        return null;
    }

    return (

        <span key={patient.id + Math.random()} >

            <div className="mb-32">
                {/* <FuseAnimateGroup
                    enter={{
                        animation: 'transition.slideUpBigIn'
                    }}
                > */}
                <ListSubheader component="div" className="flex items-center px-0">
                    {patient.access_no > 0 &&
                        <Grid container spacing={10}>
                            <Grid item xs={12}>
                                <ExamCard
                                    changedStatus={changedStatus}
                                    patient={patient}
                                    isShowAction={true}
                                    exam={currentExam}
                                    insuranceInfo={patientData.insuranceInfo}
                                    patientInfo={patientData.patientInfo}
                                    allAttorney={patientData.allAttorney}
                                    examId={examId}
                                    isShowSubAction={true}
                                    setUploadFinalModel={setUploadFinalModel}
                                />
                                <Typography className="mx-16" variant="subtitle1" color="textSecondary">
                                    {patient.info}
                                </Typography>
                            </Grid>
                            
                        </Grid>}
                    <CreateFormDialog
                        isOpen={open}
                        handleCloseDialog={() => {setOpen(false)}}
                        onSaved={(msg, status, payload) => {
                            if (status === 200) {

                                handleSuccessOpen()
                                setChangeStatus(msg)
                                handlePayload(payload)
                            } else {
                                handleOpenError()
                            }
                            setOpen(false)
                        }}
                        access_no={patient.access_no}
                        exam={patient.exam}
                    />
                </ListSubheader>
                {/* </FuseAnimateGroup> */}
            </div>
        </span>


    );
}

export default CancelExamCard;


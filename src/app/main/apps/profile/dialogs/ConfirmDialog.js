import {
    ISelectSearchFormsy,
    TextFieldFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import {useForm} from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CardContent from '@material-ui/core/CardContent';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {green} from '@material-ui/core/colors';
import _ from '@lodash';
import moment from 'moment';
import {
    removePatientInfo,
    closeConfirmDialog,
    editExam,
    editFirstStep,
    editSecondStep,
    addExamTasks
} from '../store/ProfileSlice';
function AutoAttorneyInfo(props) {
    const dispatch = useDispatch();
    const confirmDetails = useSelector(({profilePageApp}) => profilePageApp.profile.confirmDetails);
    const {form, handleChange1, setForm} = useForm({});
    const [old_data, setOld_data] = useState(null);
    const [selectedExams, setSelectedExam] = useState([]);
    const [data, setData] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const formRef = useRef(null);
    const CustomNotify = useCustomNotify();
    const initDialog = useCallback(async () => {
        if (confirmDetails.data) {
            var data = JSON.parse(JSON.stringify(confirmDetails.data))
            Object.keys(data).map((item, index) => {
                switch (item) {
                    case "location":
                        data.a_location = data[item]
                        delete data.item
                        break;
                    case "modality":
                        data.b_modality = data[item]
                        delete data.item
                        break;
                    case "exam":
                        data.c_exam = data[item]
                        delete data.item
                        break;
                    case "tasks":
                        data.d_tasks = data[item]
                        delete data.item
                        break;
                    case "radiologistName":
                        data.e_radiologistName = data[item]
                        delete data.item
                        break;
                    case "referrer":
                        data.f_referrer = data[item]
                        delete data.item
                        break;
                    case "refLocation":
                        data.g_refLocation = data[item]
                        delete data.item
                        break;
                    case "refNotes":
                        data.h_refNotes = data[item]
                        delete data.item
                        break;
                    case "refPhone":
                        data.i_refPhone = data[item]
                        delete data.item
                        break;
                    case "cdfilms":
                        data.j_cdfilms = data[item]
                        delete data.item
                        break;
                    case "pregnancy":
                        data.k_pregnancy = data[item]
                        delete data.item
                        break;
                    case "compa":
                        data.l_compa = data[item]
                        delete data.item
                        break;
                    case "pexam":
                        data.m_compa = data[item]
                        delete data.item
                        break;
                    case "routine":
                        data.n_routine = data[item]
                        delete data.item
                        break;
                    case "highPriority":
                        data.o_highPriority = data[item]
                        delete data.item
                        break;
                    case "walkIn":
                        data.p_walkIn = data[item]
                        delete data.item
                        break;
                    case "pip":
                        data.q_pip = data[item]
                        delete data.item
                        break;
                    case "stat":
                        data.r_stat = data[item]
                        delete data.item
                        break;
                    case "auth":
                        data.s_auth = data[item]
                        delete data.item
                        break;

                    default:

                        data["z_" + item] = data[item]
                        delete data.item
                }
            })
            setData(data)
            setOld_data(confirmDetails.old_data)
            setSelectedExam(confirmDetails.selectedExam)
        }
    }, [confirmDetails.data, setForm]);

    useEffect(() => {
        if (confirmDetails.props.open) {
            initDialog();
        }
    }, [confirmDetails.props.open, initDialog]);


    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmit(true)
        const currentUser = JSON.parse(localStorage.getItem('USER'));
        var ids = [];
        selectedExams.map((item, index) => {
            ids.push({id: item})
            return 0;
        })
        var tasks = []
        data.tasks.map((item, index) => {
            if (!item.exam_id) {

                tasks.push({
                    userid: currentUser.data.userId,
                    exam_id: data.examid,
                    patient_id: data.pid,
                    taskid: item.id,
                    task: item.task
                })
            }
            return 0;
        })
        var alerts = []
        data.alerts.map((item, index) => {
            if (!item.exam_id) {

                alerts.push({
                    userid: currentUser.data.userId,
                    exam_id: data.examid,
                    patient_id: data.pid,
                    alertid: item.id,
                    alert: item.alert
                })
            }
            return 0;
        })
       
        const updateExamReq = {
            id: ids,
            pid: data.pid,
            user_id: 123,
            client_location: data.client_location,
            location: data.location,
            examid: data.examid,
            exam: data.exam,
            modalityid: data.modalityid,
            modality: data.modality,
            radiologist: data.radiologistName,
            ref_name: data.referrer,
            rad_id: data.rad_id,
            ref_id: data.ref_id,
        }
        const stepOneReq = {
            id: ids,
            pid: data.pid,
            user_id: 123,
            walkin: data.walkIn ? "on" : "off",
            pip: data.pip,
            stat: data.stat ? 1 : 0,
            auth: data.auth ? "on" : "off",
        }
        const stepSecondReq = {
            id: ids,
            pid: data.pid,
            user_id: 123,
            cdfilms: data.cdfilms ? 'y' : 'n',
            pexam: data.pexam ? 'y' : 'n',
            pregnancy: data.pregnancy ? 'y' : 'n',
            compa: data.compa ? 'y' : 'n',
            highPriority: data.highPriority,
            routine: data.routine,
        }
        const tasksReq = {
            id: ids,
            pid: data.pid,
            user_id: 123,
            tasks: tasks,

        }
   
        const req = {
            id: ids,
            pid: data.pid,
            user_id: 123,
            walkin: data.walkIn ? "on" : "off",
            pip: data.pip,
            stat: data.stat ? 1 : 0,
            auth: data.auth ? "on" : "off",
            highPriority: data.highPriority,
            routine: data.routine,
            client_location: data.client_location,
            location: data.location,
            examid: data.examid,
            exam: data.exam,
            modalityid: data.modalityid,
            modality: data.modality,
            radiologist: data.radiologistName,
            ref_name: data.referrer,
            rad_id: data.rad_id,
            ref_id: data.ref_id,
            tasks: tasks,
            alerts: alerts,
            cdfilms: data.cdfilms ? 'y' : 'n',
            pexam: data.pexam ? 'y' : 'n',
            pregnancy: data.pregnancy ? 'y' : 'n',
            compa: data.compa ? 'y' : 'n'
        }
        const result = await dispatch(editExam(updateExamReq))
        const resultFirst = await dispatch(editFirstStep(stepOneReq))
        const resultSecond = await dispatch(editSecondStep(stepSecondReq))
        const resultTask = await dispatch(addExamTasks(tasksReq))



        const response = result.payload.data
        if (response) {

            CustomNotify(`exam updated successfully Acc #${selectedExams.join(", #")}`, "success")
            const newData = {
                data: req,
                old_data: data,
                selectedExam: selectedExams,
            }
            dispatch(removePatientInfo())
            dispatch(closeConfirmDialog(newData))
        }
        setIsSubmit(false)

    }
    function closeDialog() {
        dispatch(closeConfirmDialog({...form}));
    }


    const FormLabel = (label) => {
        let leb = ""
        switch (label) {
            case "routine":
                leb = "Routine"
                break;
            case "highPriority":
                leb = "HighPriority"
                break;
            case "stat":
                leb = "STAT"
                break;
            case "pip":
                leb = "PIP"
                break;
            case "auth":
                leb = "Auth"
                break;
            case "walkIn":
                leb = "Walk-In"
                break;
            case "pregnancy":
                leb = "Any possiblity if pregnancy?"
                break;
            case "compa":
                leb = "Comparison report required?"
                break;
            case "pexam":
                leb = "Previous exam at this facility?"
                break;
            case "cdfilms":
                leb = "CD/FILMS Req"
                break;
            case "tasks":
                leb = "Tasks"
                break;
            case "alerts":
                leb = "Alerts"
                break;
            case "exam":
                leb = "Exam"
                break;
            case "modality":
                leb = "Modality"
                break;
            case "location":
                leb = "Location"
                break;
            case "radiologistName":
                leb = "Radiologist"
                break;
            case "referrer":
                leb = "Referrer"
                break;
            case "refLocation":
                leb = "Ref Location";
                break
            case "notes":
                leb = "Notes";
                break
            case "refPhone":
                leb = "Phone";
                break

        }

        return leb;
    }
    const sortObject = function (data) {
        var keys = Object.keys(data);
        var result = {};

        keys.sort();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            result[key] = data[key];
        }

        return result;
    };
    return (
        <Dialog
            classes={{
                paper: 'm-24 rounded-8'
            }}
            {...confirmDetails.props}
            onClose={closeDialog}
            fullWidth
            maxWidth="sm"
        >
            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        You are about to  change below information for given exams {selectedExams.join(", ")}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Formsy
                // onValidSubmit={handleSubmit}
                ref={formRef}
                className="flex flex-col md:overflow-hidden"
            >
                <DialogContent classes={{root: 'p-24'}}>
                    <CardContent className="w-full border rounded-md mb-8 mt-8">
                        <div className="flex mb-8">
                            <div className="w-6/12">
                                <Typography className="font-bold font-italic text-15" style={{color: 'gray', }}>Current Value</Typography>
                            </div>
                            <div className="w-5/12">
                                <Typography className="font-bold text-15" style={{color: green[700]}}>Updated Value</Typography>
                            </div>
                        </div>
                        {
                            data &&
                            Object.keys(sortObject(data)).map((item1, index) => {

                                if (item1.charAt(1) === "_") {
                                    let item = item1.slice(2)


                                    if (data[item] !== old_data[item]) {
                                        if (item === "notes") {
                                        }
                                        let Cvalue = "";
                                        let Uvalue = "";
                                        let Lname = FormLabel(item);
                                        if (item === "routine" || item === "highPriority" || item === "stat") {
                                            Cvalue = old_data[item] ? "Yes" : "No";
                                            Uvalue = data[item] ? "Yes" : "No";

                                        } else if (item === "pip") {
                                            Cvalue = old_data[item] === "True" ? "Yes" : "No";
                                            Uvalue = data[item] === "True" ? "Yes" : "No";
                                        } else if (item === "auth" || item === "walkIn") {
                                            Cvalue = old_data[item] ? "On" : "Off";
                                            Uvalue = data[item] ? "On" : "Off";
                                        } else if (item === "pregnancy" || item === "pexam" || item === "compa" || item === "cdfilms") {
                                            Cvalue = old_data[item] ? "Yes" : "No";
                                            Uvalue = data[item] ? "Yes" : "No";
                                        } else if (item === "tasks") {
                                            let tempC = [];
                                            let tempU = [];
                                            data["old_tasks"].map((item, index) => {
                                                tempC.push(item.task)
                                                return 0
                                            })
                                            data[item].map((item, index) => {
                                                tempU.push(item.task)
                                                return 0
                                            })
                                            Cvalue = tempC.join(", ");
                                            Uvalue = tempU.join(", ");

                                        } else if (item === "old_tasks" || item === "task") {
                                            return null;
                                        }
                                        else if (item === "alerts" || item === "alert") {
                                            return null
                                            // let tempC = [];
                                            // let tempU = [];
                                            // old_data[item].map((item, index) => {
                                            //     tempC.push(item.alert)
                                            //     return 0
                                            // })
                                            // data[item].map((item, index) => {
                                            //     tempU.push(item.alert)
                                            //     return 0
                                            // })
                                            // Cvalue = tempC.join(", ");
                                            // Uvalue = tempU.join(", ");
                                        }
                                        else {
                                            if (item !== "task" && item !== "old_alerts") {
                                                Cvalue = old_data[item]
                                                Uvalue = data[item]
                                            }
                                        }
                                        if (item === "client_location") {
                                            return null
                                        } else if (item === "examid") {
                                            return null
                                        } else if (item === "modalityid") {
                                            return null;
                                        } else if (item === "ref_id") {
                                            return null;
                                        } else if (item === "rad_id") {
                                            return null;
                                        } else if (data[item] === "" || data[item] === "-") {
                                            return null;
                                        } else {
                                            return (
                                                <div className="flex mb-8" >
                                                    <div className="w-6/12" style={{marginRight: 5}}>
                                                        <Typography className="font-bold font-italic text-15" style={{color: 'gray', fontStyle: 'italic'}}>{Lname}</Typography>
                                                        <Typography className="font-italic" style={{color: 'gray', fontStyle: 'italic'}}>{Cvalue ? Cvalue : '-'}</Typography>
                                                    </div>
                                                    <div className="w-5/12">
                                                        <Typography className="font-bold text-15" style={{color: green[700]}}>{Lname}</Typography>
                                                        <Typography>{Uvalue ? Uvalue : "-"}</Typography>
                                                    </div>
                                                </div>
                                            )
                                        }

                                    } else {
                                        return null;
                                    }
                                }
                            })
                        }


                    </CardContent>

                </DialogContent>
                <DialogActions className="justify-between p-8">
                    <div className="px-16">
                        <Button
                            variant="contained"
                            color="primary"
                            className="mr-8"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmit}
                        >
                            {
                                isSubmit ?
                                    <CircularStatic />
                                    :
                                    "Update"
                            }

                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={closeDialog}
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </Formsy>
        </Dialog>
    );
}

export default AutoAttorneyInfo;

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
import {createStyles, makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import _ from '@lodash';
import Chip from '@material-ui/core/Chip';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import moment from 'moment';
import {
    closeTasksEdit,
    updateNavigationBlocked,
    getTasks,
    openAlertsEdit,
    getTasksByExam,
    openRadiologistEdit
} from '../store/ProfileSlice';

function AutoAttorneyInfo(props) {
    const dispatch = useDispatch();
    const examDialogDetails = useSelector(({profilePageApp}) => profilePageApp.profile.tasksDetails);
    const Radiologist = useSelector(({profilePageApp}) => profilePageApp.profile.radiologist);
    const {form, handleChange1, setForm} = useForm({});
    const formRef = useRef(null);
    const [radiologists, setRadiologists] = useState([]);
    const [fetchingLocations, setFetchingLocations] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [fetchingTasks, setFetchingTasks] = useState(false);
    const [tasksbyexam, setTaskbyexam] = useState([]);
    const initDialog = useCallback(async () => {
        if (examDialogDetails.data) {
            setForm({...examDialogDetails.data.form});
            // if (examDialogDetails.data.type === "show") {
                fetchTasksByExam(examDialogDetails.data.form.id)
            // }
        }
    }, [examDialogDetails.data, setForm]);

    useEffect(() => {
        if (examDialogDetails.props.open) {
            initDialog();
        }
    }, [examDialogDetails.props.open, initDialog]);


    useEffect(() => {
        if (examDialogDetails.props.open) {
            if (examDialogDetails.data.type !== "show") {
                fetchTaks()
            }
        }
    }, [Radiologist, examDialogDetails.props.open])

    const fetchTasksByExam = async (id) => {
        setFetchingTasks(true)
        try {
            var data = {
                key: "get",
                exam_id: id
            }
            const result = await dispatch(getTasksByExam(data))
            setTaskbyexam(result.payload.data.data)
            setForm({...examDialogDetails.data.form,old_tasks:result.payload.data.data});
        } catch (ex) {
            console.log("ex", ex)
        }
        setFetchingTasks(false)
    }

    const fetchTaks = async () => {
        setFetchingLocations(true)
        const result = await dispatch(getTasks())
        const temp = _.uniqBy(result.payload.data.data, 'task');
        setTasks(temp)
        setFetchingLocations(false)
    }

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        form[name] = value;
        setForm({...form});
        dispatch(updateNavigationBlocked(true));
    }

    function handleSubmit(event) {
        event.preventDefault();
        closeDialog();
    }

    function closeDialog() {
        dispatch(closeTasksEdit({...form}));
    }

    function handleSubmitNext(event) {
        event.preventDefault();
        closeDialog();
        dispatch(openRadiologistEdit(form));
    }

    function handleSubmitPrev(event) {
        event.preventDefault();
        closeDialog();
        // dispatch(openExamDetailEdit(form));

    }
    function handleTasks(event, newValue) {
        setForm({...form, tasks: newValue});
    }
    return (
        <Dialog
            classes={{
                paper: 'm-24 rounded-8'
            }}
            {...examDialogDetails.props}
            onClose={closeDialog}
            fullWidth
            maxWidth="sm"
        >
            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        Taskts
                    </Typography>
                </Toolbar>
            </AppBar>
            <Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
                className="flex flex-col md:overflow-hidden"
            >
                
                {
                
                    examDialogDetails.data &&
                        examDialogDetails.data.type !== "show" ?
                        <DialogContent classes={{root: 'p-24'}}>
                            {
                                fetchingLocations ?
                                    <div className="mb-24">
                                        <CircularStatic size={18} />
                                    </div>
                                    :
                                    <Autocomplete
                                        value={form.tasks}
                                        onChange={handleTasks}
                                        multiple
                                        fullWidth
                                        disabled={form.required}
                                        limitTags={1}
                                        id="Task"
                                        options={tasks}
                                        getOptionLabel={(option) => option.task}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                className="mb-24"
                                                fullWidth
                                                variant="outlined"
                                                label="Tasks"
                                                placeholder="Select Task"
                                            />
                                        )}
                                    />
                            }

                        </DialogContent>
                        :
                        <DialogContent classes={{root: 'p-24'}}>
                            {
                                fetchingTasks ?
                                    <div className="mb-24">
                                        <CircularStatic />
                                    </div>
                                    :
                                    <div>
                                        {
                                            tasksbyexam.map((item, index) => {
                                                if (item.task) {
                                                    return (
                                                        <div style={{margin: 5, float: 'left'}}>
                                                            <Chip label={form.task ? form.task.task : ""} />
                                                        </div>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })
                                        }
                                    </div>
                            }
                        </DialogContent>

                }

                {examDialogDetails.data &&
                    examDialogDetails.data.type !== "show" ?
                    <DialogActions className="justify-between p-8">
                        <div className="px-16">
                            <Button
                                variant="contained"
                                color="primary"
                                className="mr-8"
                                type="submit"
                                onClick={handleSubmitPrev}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className="mr-8"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={handleSubmitNext}
                            >
                                Next
                            </Button>
                        </div>
                    </DialogActions>
                    :
                    <DialogActions className="justify-between p-8">
                        <div className="px-16">

                            <Button
                                variant="contained"
                                color="secondary"
                                className="mr-8"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Close
                            </Button>

                        </div>
                    </DialogActions>

                }
            </Formsy>
        </Dialog>
    );
}

export default AutoAttorneyInfo;

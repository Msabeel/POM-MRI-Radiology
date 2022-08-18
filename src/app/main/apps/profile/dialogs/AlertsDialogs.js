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
    closeAlertsEdit,
    updateNavigationBlocked,
    getAlerts,
    openRadiologistEdit,
    openTasksEdit,
    getAlertsByPid
} from '../store/ProfileSlice';
function AutoAttorneyInfo(props) {
    const dispatch = useDispatch();
    const alertDetails = useSelector(({profilePageApp}) => profilePageApp.profile.alertsDetails);
    const {form, handleChange1, setForm} = useForm({});
    const formRef = useRef(null);
    const [fetchingLocations, setFetchingLocations] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [fetchingAlerts, setFetchingAlerts] = useState(false);
    const [alertsbyexam, setAlertbyexam] = useState([]);
    const initDialog = useCallback(async () => {
        if (alertDetails.data) {
            setForm({...alertDetails.data.form});
            if (alertDetails.data.type === "show") {
                fetchAlertsByExam(alertDetails.data.form.id)
            }
        }
    }, [alertDetails.data, setForm]);
    useEffect(() => {
        if (alertDetails.props.open) {
            initDialog();
        }
    }, [alertDetails.props.open, initDialog]);
    useEffect(() => {
        if (alertDetails.props.open) {
            if (alertDetails.data.type !== "show") {

                fetchTasks()
            }
        }
    }, [alertDetails.props.open]);
    
    const fetchAlertsByExam = async (id) => {
        setFetchingAlerts(true)
        try {
            var data = {
                key: "get",
                exam_id: id
            }
            const result = await dispatch(getAlertsByPid(data))
            setAlertbyexam(result.payload.data.data)
            
        } catch (ex) {
            console.log("ex", ex)
        }
        setFetchingAlerts(false)

    }

    const fetchTasks = async () => {
        setFetchingLocations(true)
        const result = await dispatch(getAlerts())
        const temp = _.uniqBy(result.payload.data.data, 'alert');
        setTasks(temp)
        // const temp = _.uniqBy(result.payload.data.data, 'task');
        setFetchingLocations(false)
    }

    function handleSubmit(event) {
        event.preventDefault();
        closeDialog();
    }
    function closeDialog() {
        dispatch(closeAlertsEdit({...form}));
    }
    function handleSubmitNext(event) {
        event.preventDefault();
        closeDialog();
        dispatch(openRadiologistEdit(form));
    }

    function handleSubmitPrev(event) {
        event.preventDefault();
        closeDialog();
        dispatch(openTasksEdit(form));

    }
    function handleAlerts(event, newValue) {
        setForm({...form, alerts: newValue});
    }
    return (
        <Dialog
            classes={{
                paper: 'm-24 rounded-8'
            }}
            {...alertDetails.props}
            onClose={closeDialog}
            fullWidth
            maxWidth="sm"
        >
            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        Alerts
                    </Typography>
                </Toolbar>
            </AppBar>
            <Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
                className="flex flex-col md:overflow-hidden"
            >
                {
                    alertDetails.data &&
                        alertDetails.data.type !== "show" ?

                        <DialogContent classes={{root: 'p-24'}}>
                            {
                                fetchingLocations ?
                                    <div className="mb-24">
                                        <CircularStatic  />
                                    </div>
                                    :
                                    <Autocomplete
                                        value={form.alerts}
                                        onChange={handleAlerts}
                                        multiple
                                        fullWidth
                                        disabled={form.required}
                                        limitTags={1}
                                        id="Alert"
                                        options={tasks}
                                        getOptionLabel={(option) => option.alert}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                className="mb-24"
                                                fullWidth
                                                variant="outlined"
                                                label="Alerts"
                                                placeholder="Select Alerts"
                                            />
                                        )}
                                    />
                            }

                        </DialogContent>
                        :
                        <DialogContent classes={{root: 'p-24'}}>
                            {
                                fetchingAlerts ?
                                    <div className="mb-24">
                                        <CircularStatic />
                                    </div>
                                    :
                                    alertsbyexam.map((item, index) => {
                                        if (item.alert) {
                                            return (
                                                <div style={{margin: 5,float:'left'}}>
                                                    <Chip label={form.alert ? form.alert.alert : ""} />
                                                </div>
                                            )
                                        } else {
                                            return null;
                                        }
                                    })
                            }
                        </DialogContent>
                }
                {
                    alertDetails.data &&
                        alertDetails.data.type !== "show" ?

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
                        : <DialogActions className="justify-between p-8">
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

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
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import moment from 'moment';
import {
    closeExamDetailEdit,
    updateNavigationBlocked,
    getModalityForDropDown,
    getLocations,
    getExamByModality,
    openRadiologistEdit,
    openCheckboxDialog,
    openTasksEdit
} from '../store/ProfileSlice';

const StyledToggleButton = withStyles({
    root: {
        lineHeight: '12px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '15px 15px',
        textTransform: 'none',
        borderColor: 'black',
        width: '100%',
        '&$selected': {
            backgroundColor: 'rgb(76, 175, 80)',
            fontWeight: 'bold',
            color: 'black',
            '&:hover': {
                backgroundColor: 'rgb(76, 175, 80)',
            },
        },
    },
    selected: {},
})(ToggleButton);

const StyledGroupButton = withStyles({
    root: {
        padding: '2px 30px',
        width: '100%',
    },
})(ToggleButtonGroup);

function AutoAttorneyInfo(props) {
    const dispatch = useDispatch();
    const examDialogDetails = useSelector(({profilePageApp}) => profilePageApp.profile.examDetails);
    const Modalities = useSelector(({profilePageApp}) => profilePageApp.profile.modalities);
    const Locations = useSelector(({profilePageApp}) => profilePageApp.profile.locations);
    const {form, handleChange1, setForm} = useForm({});
    const formRef = useRef(null);
    const [modality, setModality] = useState([]);
    const [modalityByLocation, setModalityByLocation] = useState([]);
    const [examsbyModality, setExambyModality] = useState([]);
    const [locations, setLocations] = useState([]);
    const [fetchingLocations, setFetchingLocations] = useState(false);
    const [fetchingModalities, setFetchingModalities] = useState(false);
    const [fetchingExams, setFetchingExams] = useState(false);
    const [errLocation, setErrLocation] = useState("");
    const [errModality, setErrModality] = useState("");
    const [errExam, setErrExam] = useState("");
    const initDialog = useCallback(async () => {
        if (examDialogDetails.data) {
            setForm({...examDialogDetails.data});
        }
    }, [examDialogDetails.data, setForm]);

    useEffect(() => {
        if (examDialogDetails.props.open) {
            initDialog();
        }
    }, [examDialogDetails.props.open, initDialog]);

    useEffect(() => {
        if (!Locations) {
            if (examDialogDetails.props.open) {
                fetchLocations()
            }
        } else {
            const task = Locations
            let tempArr = []

            if (task) {
                Object.keys(task).map((item, index) => {
                    tempArr.push({name: task[item], id: item})
                    return 0
                })
            }
            setLocations(tempArr)
        }
    }, [Locations, examDialogDetails.props.open])

    useEffect(() => {
        if (!Modalities) {
            if (examDialogDetails.props.open) {
                fetchModalities()
            }
        } else {
            const modalities = Modalities
            let tempArr = []
            let temp = modalities.filter(item => item.locationName === form.location)
            setModality(modalities)
            setModalityByLocation(temp)
        }
    }, [Modalities, examDialogDetails.props.open])
    useEffect(() => {
        if (form && Modalities) {
            const modalities = Modalities
            let tempArr = []
            let temp = modalities.filter(item => item.locationName === form.location)
            let temp1 = modalities.find(item => item.modality === form.modality)
            setModality(modalities)
            setModalityByLocation(temp)
        }
    }, [form]);

    useEffect(() => {

        if (examDialogDetails.props.open) {
            fetchExamsbyModality(form.modalityid)
        }


    }, [examDialogDetails.props.open])

    const fetchLocations = async () => {
        setFetchingLocations(true)
        const result = await dispatch(getLocations())
        let tempArr = []
        if (result.payload.data) {
            Object.keys(result.payload.data).map((item, index) => {

                tempArr.push({name: result.payload.data[item], id: item})
                return 0
            })

        }
        setLocations(tempArr)
        setFetchingLocations(false)
    }
    const fetchModalities = async () => {
        setFetchingModalities(true)
        const result = await dispatch(getModalityForDropDown())
        var data = result.payload.data;
        let tempArr = []
        let filteredMod = data.filter(item => item.locationName === form.location)
        console.log({filteredMod})
        setModality(data)
        setModalityByLocation(filteredMod)

        setFetchingModalities(false)
    }


    const fetchExamsbyModality = async (id) => {
        setFetchingExams(true)
        const reqdata = {
            id: id
        }
        const result = await dispatch(getExamByModality(reqdata))
        var data = result.payload.data;
        let tempArr = []
        if (result.payload.data) {
            Object.keys(result.payload.data).map((item, index) => {
                tempArr.push({name: result.payload.data[item], id: item})
                return 0
            })
        }
        // const temp = _.uniqBy(result.payload.data.data, 'task');
        setExambyModality(tempArr)
        setFetchingExams(false)
    }



    function handleSubmit(event) {
        event.preventDefault();
        let isValid = validate();
        if (isValid.includes(false) != true) {
            closeDialog();
        }

    }

    function validate() {
        let isValid = [];
        if (!form.location) {
            setErrLocation("Please select location");
            isValid.push(false);
        } else {
            setErrLocation("");
            isValid.push(true);
        }
        if (!form.modality) {
            setErrModality("Please select modality");
            isValid.push(false);
        } else {
            setErrModality("");
            isValid.push(true);
        }
        if (!form.exam) {
            setErrExam("Please select exam");
            isValid.push(false);
        } else {
            setErrExam("");
            isValid.push(true);
        }
        return isValid;
    }
    function closeDialog() {
        dispatch(closeExamDetailEdit({...form}));
    }
    function handleSubmitNext(event) {
        event.preventDefault();
        let isValid = validate();
        if (isValid.includes(false) != true) {
            closeDialog();
            var data = {
                type: "edit",
                form: form
            }
            dispatch(openTasksEdit(data));
        }
    }
    function handleLocation(event, newValue) {
        if (newValue) {
            setForm({...form, location: newValue.name, client_location: newValue.id});
            let filteredMod = modality.filter(x => x.locationName === newValue.name)
            setModalityByLocation(filteredMod)
        } else {
            setForm({...form, location: ""});
        }
    }
    function handleModality(event, newValue) {
        if (newValue) {
            setForm({...form, modality: newValue ? newValue.modality : "", modalityid: newValue.id});

            fetchExamsbyModality(newValue.id)

        } else {
            setForm({...form, modality: ""});
        }
    }
    function handleExam(event, newValue) {
        if (newValue) {
            let examname = newValue.name.toUpperCase();
            let moda = form.modality.toUpperCase();
            let contain = examname.indexOf(moda)

            setForm({...form, exam: newValue.name, examid: newValue.id, compa: contain > -1 ? true : false});
        } else {
            setForm({...form, exam: ""});
        }
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
                        Exam Details
                    </Typography>
                </Toolbar>
            </AppBar>
            <Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
                className="flex flex-col md:overflow-hidden"
            >
                <DialogContent classes={{root: 'p-24'}}>
                    {
                        fetchingLocations ?
                            <div className="mb-24">
                                <CircularProgress size={18} />
                            </div>
                            :
                            <>
                                {errLocation ? <p style={{color: 'red', textAlign: 'center', marginTop: 5}}>{errLocation}</p> : ""}
                                <Autocomplete
                                    value={form.location}
                                    onChange={handleLocation}
                                    fullWidth
                                    disabled={form.required}
                                    limitTags={2}
                                    id="location"
                                    inputValue={form.location}
                                    options={locations}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            className="mb-24 mr-24"
                                            fullWidth
                                            variant="outlined"
                                            label="Location"
                                            placeholder="Select Location"
                                        />
                                    )}
                                />

                            </>
                    }
                    {
                        fetchingModalities ?
                            <div className="mb-24">
                                <CircularProgress size={18} />
                            </div>
                            :
                            <>
                                {errModality ? <p style={{color: 'red', textAlign: 'center', marginTop: 5}}>{errModality}</p> : ""}
                                <Autocomplete
                                    value={form.modality}
                                    onChange={handleModality}
                                    fullWidth
                                    disabled={form.required}
                                    limitTags={2}
                                    id="modality"
                                    options={modalityByLocation}
                                    getOptionLabel={(option) => option.modality}
                                    inputValue={form.modality}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            className="mb-24 mr-24"
                                            fullWidth
                                            variant="outlined"
                                            label="Modality"
                                            placeholder="Select Modality"
                                        />
                                    )}
                                />
                            </>
                    }
                    {
                        fetchingExams ?
                            <div className="mb-24">
                                <CircularProgress size={18} />
                            </div>
                            :
                            <>
                                {errExam ? <p style={{color: 'red', textAlign: 'center', marginTop: 5}}>{errExam}</p> : ""}

                                <Autocomplete
                                    value={form.exam}
                                    onChange={handleExam}
                                    fullWidth
                                    disabled={form.required}
                                    limitTags={2}
                                    id="Exam"
                                    options={examsbyModality}
                                    getOptionLabel={(option) => option.name}
                                    inputValue={form.exam}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            className="mb-24 mr-24"
                                            fullWidth
                                            variant="outlined"
                                            label="Exam"
                                            placeholder="Select Exam"
                                        />
                                    )}
                                />
                            </>
                    }
                </DialogContent>
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
            </Formsy>
        </Dialog>
    );
}

export default AutoAttorneyInfo;

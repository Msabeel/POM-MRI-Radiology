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
    closeRadiologistEdit,
    updateNavigationBlocked,
    getRadiologist,
    openExamDetailEdit,
    openReffererEdit,
    openAlertsEdit,
    openTasksEdit
} from '../store/ProfileSlice';


function AutoAttorneyInfo(props) {
    const dispatch = useDispatch();
    const examDialogDetails = useSelector(({profilePageApp}) => profilePageApp.profile.radiologistDetails);
    const Radiologist = useSelector(({profilePageApp}) => profilePageApp.profile.radiologist);
    const {form, handleChange1, setForm} = useForm({});
    const formRef = useRef(null);
    const [radiologists, setRadiologists] = useState([]);
    const [errRadiologists, setErrRadiologists] = useState([]);
    const [fetchingLocations, setFetchingLocations] = useState(false);

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
        if (examDialogDetails.props.open) {
            if (!Radiologist) {
                fetchRadiologist()
            } else {
                setRadiologists(Radiologist)
            }
        }
    }, [Radiologist, examDialogDetails.props.open])

    const fetchRadiologist = async () => {
        setFetchingLocations(true)
        const result = await dispatch(getRadiologist())
        let tempArr = []
        setRadiologists(result.payload.data)
        // const temp = _.uniqBy(result.payload.data.data, 'task');
        setFetchingLocations(false)
    }

    function validate() {
        let isValid = [];
        if (!form.radiologistName) {
            setErrRadiologists("Please select Radiologist");
            isValid.push(false);
        } else {
            setErrRadiologists("");
            isValid.push(true);
        }

        return isValid;
    }
    function handleSubmit(event) {
        event.preventDefault();
        let valid = validate();
        if (valid.includes(false) != true) {
            closeDialog();
        }
    }
    function closeDialog() {
        dispatch(closeRadiologistEdit({...form}));
    }
    function handleSubmitNext(event) {
        event.preventDefault();
        if (form.isGrid) {
            let valid = validate();
            if (valid.includes(false) != true) {
                props.onClose(form)
                closeDialog();
            }
        } else {
            let valid = validate();
            if (valid.includes(false) != true) {
                closeDialog();
                dispatch(openReffererEdit(form));
            }
        }


    }

    function handleSubmitPrev(event) {
        event.preventDefault();
        let valid = validate();
        if (valid.includes(false) != true) {
            closeDialog();
            var data = {
                type: "edit",
                form: form
            }
            dispatch(openTasksEdit(data));
        }

    }
    function handleRadiologist(event, newValue) {
        if (newValue) {
            setForm({...form, radiologistName: newValue.displayname, rad_id: newValue.id});
        } else {
            setForm({...form, radiologistName: ""});

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
                        Radiologist
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
                                {errRadiologists ? <p style={{color: 'red', textAlign: 'center', marginTop: 5}}>{errRadiologists}</p> : ""}

                                <Autocomplete
                                    value={form.radiologistName}
                                    onChange={handleRadiologist}
                                    fullWidth
                                    disabled={form.required}
                                    limitTags={2}
                                    id="radiologist"
                                    inputValue={form.radiologistName}
                                    options={radiologists}
                                    getOptionLabel={(option) => option.displayname}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            className="mb-24 mr-24"
                                            fullWidth
                                            variant="outlined"
                                            label="Radiologist"
                                            placeholder="Select Radiologist"
                                        />
                                    )}
                                />
                            </>
                    }

                </DialogContent>
                <DialogActions className="justify-between p-8">
                    {form.isGrid ?
                        <div className="px-16">
                            <Button
                                variant="contained"
                                color="primary"
                                className="mr-8"
                                type="submit"
                                onClick={handleSubmitPrev}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                className="mr-8"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>

                        </div>
                        :
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

                    }</DialogActions>
            </Formsy>
        </Dialog>
    );
}

export default AutoAttorneyInfo;

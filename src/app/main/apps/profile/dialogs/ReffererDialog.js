import {
    ISelectSearchFormsy,
    SelectSearchFormsy,
    SelectFormsy,
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
    getRefferers,
    openExamDetailEdit,
    closeReffererEdit,
    openRadiologistEdit,
    openQuestionDialog
} from '../store/ProfileSlice';

function AutoAttorneyInfo(props) {
    const dispatch = useDispatch();
    const examDialogDetails = useSelector(({profilePageApp}) => profilePageApp.profile.reffererDetails);
    const Refferers = useSelector(({profilePageApp}) => profilePageApp.profile.refferers);
    const {form, handleChange1, setForm} = useForm({});
    const formRef = useRef(null);
    const [radiologists, setRadiologists] = useState([]);
    const [errRef, setErrRef] = useState("");
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
            if (!Refferers) {
                fetchRadiologist()
            } else {
                setRadiologists(Refferers)
            }
        }
    }, [examDialogDetails.props.open])

    const fetchRadiologist = async () => {
        setFetchingLocations(true)
        const result = await dispatch(getRefferers())
        let tempArr = []
        setRadiologists(result.payload.data)
        // const temp = _.uniqBy(result.payload.data.data, 'task');
        setFetchingLocations(false)
    }
    function validate() {
        let isValid = [];
        if (!form.referrer) {
            setErrRef("Please select Referrer");
            isValid.push(false);
        } else {
            setErrRef("");
            isValid.push(true);
        }
        return isValid;
    }
    function handleSubmit(event) {
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
            }
        }

    }
    function handleClose(event) {
        event.preventDefault();
        if (form.isGrid) {
                props.onClose(form)
                closeDialog();
       
        } 

    }
    function closeDialog() {
        dispatch(closeReffererEdit({...form}));
    }
    function handleSubmitNext(event) {
        event.preventDefault();
        let valid = validate();
        if (valid.includes(false) != true) {
            closeDialog();
            dispatch(openQuestionDialog(form));
        }
    }

    function handleSubmitPrev(event) {
        event.preventDefault();
        let valid = validate();
        if (valid.includes(false) != true) {
            closeDialog();
            dispatch(openRadiologistEdit(form));
        }
    }
    function handleRadiologist(event, newValue) {
        if (newValue) {
            setForm({...form, referrer: newValue.displayname, ref_id: newValue.id});
        } else {
            setForm({...form, referrer: ""});

        }
    }
    function handleCompanyChange(event, ref) {
        if (ref) {
            setForm({
                ...form,
                ref_id: ref.id,
                referrer: ref ? ref.name : "",
                notes: ref ? ref.notes : '',
                refLocation: ref ? ref.address_line1 + " " + ref.address_line2 : ""
            });
        } else {
            setForm({
                ...form,
                referrer: "",
                notes: '',
                refLocation: ""
            });
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
                        Refferer Details
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
                                {errRef ? <p style={{color: 'red', textAlign: 'center', marginTop: 5}}>{errRef}</p> : ""}

                                <div className="flex mb-24">

                                    <ISelectSearchFormsy
                                        id="referrer"
                                        name="referrer"
                                        label="Referrer"
                                        style={{width: '100%'}}
                                        onChange={handleCompanyChange}
                                        value={form.referrer}
                                        options={radiologists}
                                    />
                                </div>
                            </>
                    }
                    {
                        form && !form.isGrid &&
                        <>
                            <div className="flex mb-24">
                                <TextFieldFormsy
                                    type="text"
                                    name="refLocation"
                                    id="refLocation"
                                    InputLabelProps={{
                                        style: {color: '#000'},
                                    }}
                                    value={form.refLocation}
                                    disabled={true}
                                    label="Ref Location"
                                    variant="outlined"
                                    fullWidth
                                />
                            </div>
                            <div className="flex mb-24">
                                <TextFieldFormsy
                                    type="text"
                                    name="notes"
                                    id="notes"
                                    InputLabelProps={{
                                        style: {color: '#000'},
                                    }}
                                    value={form.notes}
                                    disabled={true}
                                    multiline={true}
                                    rowspan={5}
                                    label="Ref Notes"
                                    variant="outlined"
                                    fullWidth
                                />
                            </div>
                            <div className="flex mb-24">
                                <TextFieldFormsy
                                    type="text"
                                    name="ref_phone"
                                    id="ref_phone"
                                    InputLabelProps={{
                                        style: {color: '#000'},
                                    }}
                                    value={form.refPhone}
                                    disabled={true}
                                    multiline={true}
                                    rowspan={5}
                                    label="Ref Mobile"
                                    variant="outlined"
                                    fullWidth
                                />
                            </div>

                        </>
                    }
                </DialogContent>
                <DialogActions className="justify-between p-8">
                    {form.isGrid ?
                        <div className="px-16">

                            <Button
                                variant="contained"
                                color="secondary"
                                className="mr-8"
                                type="submit"
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
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

                    }
                </DialogActions>
            </Formsy>
        </Dialog>
    );
}

export default AutoAttorneyInfo;

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
import _ from '@lodash';

import moment from 'moment';
import {
    openExamDetailEdit,
    updateNavigationBlocked,
    getTasks,
    openTasksEdit,
    openReffererEdit,
    closeCheckboxDialog,
    openCheckboxDialog,
    closeQuestionDialog,
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
    const examDialogDetails = useSelector(({profilePageApp}) => profilePageApp.profile.questionDetials);
    const {form, handleChange1, setForm} = useForm({});
    const formRef = useRef(null);
   

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


    function handlecCfilms(event, newValue) {
        setForm({
            ...form,
            cdfilms: newValue
        });
    }
    function handleCompa(event, newValue) {
        setForm({
            ...form,
            compa: newValue
        });
    }

    function handlePregnancy(event, newValue) {
        setForm({
            ...form,
            pregnancy: newValue
        });
    }
    function handlePexam(event, newValue) {
        setForm({
            ...form,
            pexam: newValue
        });
    }
    

    function handleSubmit(event) {
        event.preventDefault();
        closeDialog();
    }
    function closeDialog() {
        dispatch(closeQuestionDialog({...form}));
    }
    function handleSubmitNext(event) {
        event.preventDefault();
        closeDialog();
        dispatch(openCheckboxDialog(form));
    }

    function handleSubmitPrev(event) {
        event.preventDefault();
        closeDialog();
        dispatch(openReffererEdit(form));
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
                        Other Details
                    </Typography>
                </Toolbar>
            </AppBar>
            <Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
                className="flex flex-col md:overflow-hidden"
            >
                <DialogContent classes={{root: 'p-24'}}>
                    <div className="flex mb-24">
                        <div className="flex justify-start items-start w-1/2">
                            <Typography className="text-13">CD/FILMES Req?</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.cdfilms}
                                id="cdfilms"
                                name="cdfilms"
                                exclusive
                                onChange={handlecCfilms}
                                aria-label="cdfilms"
                            >
                                <StyledToggleButton value={true} aria-label="left aligned">
                                    Yes
                                </StyledToggleButton>
                                <StyledToggleButton value={false} aria-label="centered">
                                    No
                                </StyledToggleButton>
                            </StyledGroupButton>
                        </div>
                    </div>

                    <div className="flex mb-24">
                        <div className="flex justify-start items-start w-1/2">
                            <Typography className="text-13">Comparison report required?</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.compa}
                                id="compa"
                                name="compa"
                                exclusive
                                onChange={handleCompa}
                                aria-label="compa"
                            >
                                <StyledToggleButton value={true} aria-label="left aligned">
                                    Yes
                                </StyledToggleButton>
                                <StyledToggleButton value={false} aria-label="centered">
                                    No
                                </StyledToggleButton>
                            </StyledGroupButton>
                        </div>
                    </div>

                    <div className="flex mb-24">
                        <div className="flex justify-start items-start w-1/2">
                            <Typography className="text-13">Any possiblity if pregnancy</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.pregnancy}
                                id="pregnancy"
                                name="pregnancy"
                                exclusive
                                onChange={handlePregnancy}
                                aria-label="pregnancy"
                            >
                                <StyledToggleButton value={true} aria-label="left aligned">
                                    Yes
                                </StyledToggleButton>
                                <StyledToggleButton value={false} aria-label="centered">
                                    No
                                </StyledToggleButton>
                            </StyledGroupButton>
                        </div>
                    </div>

                    <div className="flex mb-24">
                        <div className="flex justify-start items-start w-1/2">
                            <Typography className="text-13">Previous exam at this facility?</Typography>
                        </div>
                        <div className="w-1/2">
                            <StyledGroupButton
                                value={form.pexam}
                                id="pexam"
                                name="pexam"
                                exclusive
                                onChange={handlePexam}
                                aria-label="pexam"
                            >
                                <StyledToggleButton value={true} aria-label="left aligned">
                                    Yes
                                </StyledToggleButton>
                                <StyledToggleButton value={false} aria-label="centered">
                                    No
                                </StyledToggleButton>
                            </StyledGroupButton>
                        </div>
                    </div>
                
                </DialogContent>
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
            </Formsy>
        </Dialog>
    );
}

export default AutoAttorneyInfo;

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
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {
    closeNewOrderDialog,
    openNewOrderDialog,
} from '../store/ProfileSlice';
function NewOrderDialog(props) {
    const dispatch = useDispatch();
    const CustomNotify = useCustomNotify();
    const newOrderDetails = useSelector(({profilePageApp}) => profilePageApp.profile.newOrderDetails);
    console.log("newOrderDetails", newOrderDetails);
    const handleSubmit = () => {
        CustomNotify("This Feature is coming soon!",'success')
    }

    const closeDialog = () => {
        dispatch(closeNewOrderDialog())
    }

    return (
        <Dialog
            classes={{
                paper: 'm-24 rounded-8'
            }}
            // {...newOrderDetails.props}
            open={true}
            onClose={closeDialog}
            fullWidth
            maxWidth="sm"
        >
            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        New Exam Order
                    </Typography>
                </Toolbar>
            </AppBar>

            <DialogContent classes={{root: 'p-24 justify-center align-center'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button
                        variant="contained"
                        color="secondary"
                        className="mr-8"
                        type="submit"
                        title="Coming Soon"
                        onClick={handleSubmit}
                    >
                        Order An Exam
                    </Button>
                </div>
            </DialogContent>


        </Dialog>
    );
}

export default NewOrderDialog;

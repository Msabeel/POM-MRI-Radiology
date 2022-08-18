
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from "@material-ui/icons/Cancel";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useEffect, useState, useRef } from 'react';
import { createStyles, makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { useForm } from '@fuse/hooks';
import {
    TextFieldFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';

import { useDispatch, useSelector } from 'react-redux';
import {
    closeModalDialog,completeTask, showCommentForm
} from './store/ProfileSlice';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
      },
    
    closeIcon: {
        position: 'absolute',
        top: '0%',
        right: ' 0%',
    },
}));


function ModalDialog(props) {
    //debugger
    const classes = useStyles()
    const dispatch = useDispatch();
    const modalDialog = useSelector(({ profilePageApp }) => profilePageApp.profile.modalDialog);

    // close dialog
    const onCloseDialog = () => {
        
        dispatch(closeModalDialog())

    }


    
    return (

        <Dialog
            classes={{
                paper: 'm-24 rounded-8 h-300'
            }}
            {...modalDialog.props}
            onClose={onCloseDialog}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">{modalDialog.title}</DialogTitle>
            <IconButton onClick={onCloseDialog} className={classes.closeIcon} >
                <CancelIcon />
            </IconButton>
            {props.children}
            
        </Dialog>
    );
}

export default ModalDialog;

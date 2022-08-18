
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

import ModalDialog from './ModalDialog';

import { useDispatch, useSelector } from 'react-redux';
import {
    completeTask, showCommentForm
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
    tableContainer: {
        maxHeight: 440,
        marginTop: 20
      },
}));


function TaskList(props) {
    //debugger
    const classes = useStyles()
    const dispatch = useDispatch();
    const modalDialog = useSelector(({ profilePageApp }) => profilePageApp.profile.modalDialog);
    const [taskId, setTaskId] = useState('')
    const [isFormShow, setIsFormShow] = useState(false)
    const { form, handleChange, setForm } = useForm({});
    const formRef = useRef(null);




    const showForm = (task_id) => {
        setForm({
            ...form,
            task_id: task_id
        });
        setIsFormShow(true)
        dispatch(showCommentForm())
        //modalDialog.is_form_show = true;
    }
    const submitForm = () => {
        let params = {
            "exam_id": modalDialog.data.exam_id,
            "task_completed_userid": "",
            "task_id": form.task_id,
            "comment": form.comment
        }
        dispatch(completeTask(params))
    }

    return (
        (modalDialog.type == 'task') ?
            <ModalDialog>
                <DialogContent>
                    <div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
                        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%', lineHeight: '30px' }}>

                            {(modalDialog.is_form_show) ?

                                <Formsy
                                    // onValidSubmit={handleSubmit}
                                    // onValid={enableButton}
                                    // onInvalid={disableButton}
                                    ref={formRef}
                                    // className="flex flex-col justify-center"
                                    className="flex flex-col md:overflow-hidden"
                                >
                                    <Grid container spacing={3}>

                                        <Grid item xs={4} justify="center" alignItems="center">
                                            <TextFieldFormsy
                                                type="text"
                                                name="comment"
                                                id="comment"
                                                value={form.comment}
                                                onChange={handleChange}
                                                label="Comment"
                                                variant="outlined"
                                                fullWidth
                                            />
                                            
                                        </Grid>
                                        <Grid item xs={4} alignItems="center" container direction="row">
                                            <Button variant="contained" onClick={(e) => submitForm()} color="primary">Save</Button>
                                        </Grid>
                                    </Grid>
                                </Formsy>
                                : null}
                            {(modalDialog.taskData && modalDialog.taskData.length > 0) ? 
                            <TableContainer component={Paper} className={classes.tableContainer}>
                                <Table className={classes.table} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Action</TableCell>
                                            <TableCell>Username</TableCell>
                                            <TableCell>First Name</TableCell>
                                            <TableCell>Last Name</TableCell>
                                            <TableCell>Cre. Time</TableCell>
                                            <TableCell>Task</TableCell>
                                            <TableCell>Comment</TableCell>
                                            <TableCell>Com. By</TableCell>
                                            <TableCell>Com. Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(modalDialog.taskData && modalDialog.taskData.length > 0) ? modalDialog.taskData.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    {(!row.comment || row.comment == '') ? <i onClick={(e) => showForm(row.id)} className="material-icons cursor-pointer" title="View Referrer Details">remove_red_eye</i> : null}
                                                </TableCell>
                                                <TableCell>{row.user_name}</TableCell>
                                                <TableCell>{row.p_fname}</TableCell>
                                                <TableCell>{row.p_lname}</TableCell>
                                                <TableCell>{row.curr_date}</TableCell>
                                                <TableCell>{row.task}</TableCell>
                                                <TableCell>{row.comment}</TableCell>
                                                <TableCell>{(row.task_completed_user !== '') ? row.task_completed_user : '--'}</TableCell>
                                                <TableCell>{(row.task_completed_date && row.task_completed_date !== '') ? moment(row.task_completed_date).format('MM-DD-YYYY HH:mm:ss') : '--'}</TableCell>
                                            </TableRow>
                                        )) : null}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            : 
                            <div className="flex flex-1 items-center justify-center h-full">
                                <Typography color="textSecondary" variant="h5">
                                    There are no task list.
                                </Typography>
                            </div>
                            }
                        </div>
                    </div>
                </DialogContent>
            </ModalDialog>
            : null
    );
}

export default TaskList;

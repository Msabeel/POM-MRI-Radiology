
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
import { useParams } from 'react-router-dom';
import {
  TextFieldFormsy, SelectFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';

import ModalDialog from './ModalDialog';

import { useDispatch, useSelector } from 'react-redux';
import {
  deletePaymentData, savePaymentData
} from './store/ProfileSlice';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PrintIcon from '@material-ui/icons/Print';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: 440,
  },
}));


function PaymentWindow(props) {
  //debugger
  const classes = useStyles()
  const dispatch = useDispatch();
  const modalDialog = useSelector(({ profilePageApp }) => profilePageApp.profile.modalDialog);
  const { id, name, tab } = useParams()

  const { form, handleChange, setForm } = useForm({});
  const formRef = useRef(null);



  const reversePayment = (p_id) => {

    let params = {
      "id": p_id,
    }
    dispatch(deletePaymentData(params))
  }


  const submitForm = (type = '') => {
    let params = {
      "e_id": modalDialog.taskData.insurenceData.exam_access_no,
      "p_id": id,
      "exam_id": modalDialog.taskData.insurenceData.tran_exam.id,
      "scheduling_date": modalDialog.taskData.insurenceData.scheduling_date,
      "scheduling_time_from": modalDialog.taskData.insurenceData.scheduling_time_from,
      "txt_notes": (type === 'no_payment') ? '' : form.txt_notes,
      "txt_amount_paid": (type === 'no_payment') ? '$0' : form.amount_paid,
      "cmb_payment_type": (type === 'no_payment') ? 1 : form.cmb_payment_type,
    }
    dispatch(savePaymentData(params))
    
  }


  const handleCardChange = (event) => {
    setForm({
      ...form,
      cmb_payment_type: event.target.value
    });
  };


  const paymentMethod = (pay_method) => {

    if (pay_method == "1") return "CREDIT CARD-MC, VISA, DISCOVER";
    if (pay_method == "2") return "AMEX";
    if (pay_method == "3") return "CHECK";
    if (pay_method == "4") return "CASH";
    if (pay_method == "5") return "CARE CREDIT";

  }

  const printPage = () => {
   //window.print()
  }

  return (
    (modalDialog.type == 'payment') ?
      <ModalDialog>
        {(modalDialog.taskData && modalDialog.taskData.insurenceData) ?
          <Formsy
            // onValidSubmit={handleSubmit}
            // onValid={enableButton}
            // onInvalid={disableButton}
            ref={formRef}
            // className="flex flex-col justify-center"
            className="flex flex-col md:overflow-hidden"
          >
            <DialogContent>

              <TableContainer component={Paper}>
                <Table aria-label="simple table" stickyHeader aria-label="sticky table" >
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Patient: {props.patientData.patientInfo.fname} {props.patientData.patientInfo.lname}</TableCell>
                      <TableCell align="left">Scheduling Date: {modalDialog.taskData.insurenceData.scheduling_date}</TableCell>
                      <TableCell align="left">Scheduling Time: {moment.utc((parseInt(modalDialog.taskData.insurenceData.scheduling_time_from)) * 1000 * 60).format('hh:mm A')}</TableCell>

                    </TableRow>

                    <TableRow>
                      <TableCell align="left">Acc#: {modalDialog.taskData.insurenceData.exam_access_no}</TableCell>
                      <TableCell align="left">Exam: {modalDialog.taskData.insurenceData.tran_exam.exam}</TableCell>
                      <TableCell></TableCell>

                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>

              <div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
                <div className="ag-theme-alpine" style={{ height: '100%', width: '100%', lineHeight: '30px' }}>

                  {/* top table from gggg className={classesTwo.table}  */}





                  {/* top table from gggg  */}

                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Co Insurance(%):</TableCell>
                          {/* <TableCell>21</TableCell> */}
                          <TableCell>{modalDialog.taskData.insurenceData.tran_patient_insurance_detail.co_insurance1}</TableCell>
                          <TableCell>Pay Amount</TableCell>
                          <TableCell>{modalDialog.taskData.insurenceData.tran_patient_insurance_detail.co_pay_amount1}</TableCell>
                          {/* <TableCell>Alert</TableCell> */}
                        </TableRow>

                        <TableRow>
                          <TableCell>Deductible Amount:</TableCell>
                          <TableCell>{modalDialog.taskData.insurenceData.tran_patient_insurance_detail.deductable_amount1}</TableCell>
                          <TableCell>Deductible Met Amount:</TableCell>
                          <TableCell>{modalDialog.taskData.insurenceData.tran_patient_insurance_detail.deductable_meet_amount1}</TableCell>

                        </TableRow>
                        <TableRow>
                          <TableCell>Deductible Due Amount:</TableCell>
                          <TableCell>{modalDialog.taskData.insurenceData.tran_patient_insurance_detail.deductable_due_amount1}</TableCell>
                          <TableCell>Allowable Amount</TableCell>
                          <TableCell>{modalDialog.taskData.insurenceData.tran_patient_insurance_detail.allowed_amount1}</TableCell>

                        </TableRow>
                        <TableRow>
                          <TableCell>Collect Form Patient:</TableCell>
                          <TableCell>{modalDialog.taskData.insurenceData.tran_patient_insurance_detail.collect_from_patient}</TableCell>
                          <TableCell><FormControl className={classes.formControl}>
                            <SelectFormsy
                              className="my-16"
                              name="related-outlined"
                              label="Card Type"
                              value="none"
                              onChange={handleCardChange}
                              //validations="equals:none"
                              //validationError="Must be None"
                              variant="outlined"
                            >
                              <MenuItem value="none">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="1">CREDIT CARD-MC, VISA, DISCOVER</MenuItem>
                              <MenuItem value="2">AMEX</MenuItem>
                              <MenuItem value="3">CHECK</MenuItem>
                              <MenuItem value="4">CASH</MenuItem>
                              <MenuItem value="5">CARE CREDIT</MenuItem>
                            </SelectFormsy>

                            {/* <FormHelperText>Without label</FormHelperText> */}
                          </FormControl></TableCell>
                          <TableCell>
                            <TextFieldFormsy
                              type="text"
                              name="amount_paid"
                              id="amount_paid"
                              value={form.amount_paid}
                              onChange={handleChange}
                              label="Amount Paid"
                              variant="outlined"
                              fullWidth
                            />
                          </TableCell>

                        </TableRow>
                        <TableRow>
                          <TableCell>Notes:</TableCell>
                          <TableCell colSpan={3}>
                            <TextFieldFormsy
                              multiline
                              type="text"
                              name="txt_notes"
                              id="txt_notes"
                              value={form.txt_notes}
                              onChange={handleChange}
                              label="Notes"
                              variant="outlined"
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>


                      </TableBody>
                    </Table>


                  </TableContainer>

                </div>
              </div>
              <div className="flex flex-col min-h-full sm:border-1 overflow-hidden mt-2">
                <div className="ag-theme-alpine">

                  <Button onPress={() => printPage()}><PrintIcon /></Button>
                  <TableContainer className={classes.tableContainer}>
                    <Table stickyHeader aria-label="sticky table"  >
                      <TableHead>

                        <TableRow>

                          <TableCell>Reverse</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Co Insurance(%)</TableCell>
                          <TableCell>Co Pay Amount</TableCell>
                          <TableCell>Deductible Amount </TableCell>
                          <TableCell>Deductible Met Amount </TableCell>
                          <TableCell>Deductible Due Amount </TableCell>
                          <TableCell>Allowable Amount </TableCell>
                          <TableCell>Collect From Patient </TableCell>
                          <TableCell>Type </TableCell>
                          <TableCell>Amount Paid</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(modalDialog.taskData) ? modalDialog.taskData.paymnetdata.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <Button className="normal-case" color="secondary" size="small" onClick={(e) => reversePayment(row.id)} >Reverse</Button>
                            </TableCell>
                            <TableCell>{row.tran_user.displayname}</TableCell>
                            <TableCell>{row.curr_date_time}</TableCell>
                            <TableCell>{row.tran_patient_insurance_detail.co_insurance1}</TableCell>
                            <TableCell>{row.tran_patient_insurance_detail.co_pay_amount1}</TableCell>
                            <TableCell>{row.tran_patient_insurance_detail.deductable_amount1}</TableCell>
                            <TableCell>{row.tran_patient_insurance_detail.deductable_meet_amount1}</TableCell>
                            <TableCell>{row.tran_patient_insurance_detail.deductable_due_amount1}</TableCell>
                            <TableCell>{row.tran_patient_insurance_detail.allowed_amount1}</TableCell>
                            <TableCell>{row.tran_patient_insurance_detail.collect_from_patient}</TableCell>

                            <TableCell>{paymentMethod(row.amount_type)}</TableCell>
                            <TableCell>{row.amount_paid}</TableCell>

                          </TableRow>
                        )) : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>


            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={(e) => submitForm('no_payment')} >
                No Payment
              </Button>
              <Button variant="contained" color="secondary" onClick={(e) => submitForm()} >
                Submit
              </Button>
            </DialogActions>
          </Formsy>
          : 
          <div className="flex flex-1 items-center justify-center h-full">
              <Typography color="textSecondary" variant="h5">
                  There are no payment information.
              </Typography>
          </div>
          }
      </ModalDialog>
      : null
  );
}

export default PaymentWindow;

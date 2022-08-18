import 'date-fns';
import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import {makeStyles} from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginTop:10,
    width: '100%',
    fontSize: 18
  },
}));

export default function TimePicker(props) {
  // The first commit of Material-UI
  const classes = useStyles()
  const [time, setTime] = useState(props.value)
  const [selectedDate, setSelectedDate] = useState(props.value);
  const [isShow, setIsShow] = useState(false);
  const handleDateChange = (event) => {
    setTime(tConv24(event.target.value))
    // setIsShow(false)
  };
  const handleShow = () => {
    setIsShow(true)
  }
  function tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10) ? ("0" + h) : h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };
  return (
    isShow ?
      // <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div style={{paddingBottom: 10}}>
        <TextField
          id="time"
          type="time"
          defaultValue={time}
          onChange={handleDateChange}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
        {/* <KeyboardTimePicker
          id="time-picker"
          value={selectedDate}
          className={classes.textField}
          style={{fontSize: 18}}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        /> */}
      </div>
      // </MuiPickersUtilsProvider>
      :
      <p onDoubleClick={handleShow}>{time}</p>
  );
}
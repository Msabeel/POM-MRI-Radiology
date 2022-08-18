import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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

export default function ScheduleDate(props) {
    const classes = useStyles();
    const [s_date, setSDate] = useState(props.value);
    const [isShow, setIsShow] = useState(false);
    const onChangeSDate = (event) => {
        // props.onChangeRad(event.target.value);

        var date = event.target.value.split("-");
        setSDate(date[2] + "-" + date[1] + "-" + date[0]);
        setIsShow(false)
    }
    const handleShow = () => {
        setIsShow(true)
    }
    return (
        isShow ?
            <div style={{paddingBottom: 0}}>
                <TextField
                    id="date"
                    type="date"
                    onChange={onChangeSDate}
                    defaultValue={s_date}
                    format="dd-MM-yyyy"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            : <p onDoubleClick={handleShow}>{s_date}</p>
    );

}
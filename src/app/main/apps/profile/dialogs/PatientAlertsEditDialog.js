import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from '@lodash';
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useForm} from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import Formsy from 'formsy-react';

import {
    closePatientAlertsDialog,
    getAlerts
} from '../store/ProfileSlice';
import TextField from '@material-ui/core/TextField';

function PatientAlertsEditDialog(props) {
    
    const dispatch = useDispatch();
	const [allAlerts, setAllAlerts] = useState([]);
    const patientAlertDialogInfo = useSelector(({profilePageApp}) => profilePageApp.profile.patientAlertsDetails);
    const alerts = useSelector(({profilePageApp}) => profilePageApp.profile.alerts);
	const [loading, setLoading] = useState(false);
    const {form, setForm} = useForm({});
    
    
	useEffect(() => {

    },[loading])

	useEffect(() => {
		if (alerts && alerts.length > 0) {
			setAllAlerts(alerts);
            setLoading(false);
		}
	}, [alerts]);

    useEffect(()=>{
        if(patientAlertDialogInfo.props.open){
        setLoading(true)
        dispatch(getAlerts())   
        setForm({...form, alerts: props.alerts});
        }
    },[patientAlertDialogInfo.props.open])
    
    function closeDialog() {
        dispatch(closePatientAlertsDialog())
    }

    function handleSubmit(event) {
        event.preventDefault();
       // closeDialog();
    }
    function handleAlerts(event, newValue) {
        setForm({...form, alerts: newValue});
    }

    return (
 <Dialog
            classes={{
                paper: 'm-24 rounded-8'
            }}
            {...patientAlertDialogInfo.props}
            //onClose={closeDialog}
            fullWidth
            maxWidth="sm"
        >
            {/*<pre>{JSON.stringify(form)}</pre>*/}
            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        Alerts
                    </Typography>
                </Toolbar>
            </AppBar>

            <Formsy
                onValidSubmit={handleSubmit}
               // ref={formRef}
                className="flex flex-col md:overflow-hidden"
            >

<DialogContent classes={{root: 'p-24'}}>
<Autocomplete
            loading={loading}
             value={form.alerts}
             onChange={handleAlerts}
             multiple
             fullWidth
             // disabled={form.required}
             limitTags={1}
             id="Alert"
             options={allAlerts}
             getOptionLabel={(option) => option.alert?option.alert:""}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                className="mb-24"
                                                fullWidth
                                                variant="outlined"
                                                label="Patient Alerts"
                                                placeholder="Select Or Remove Alerts"
											    disabled={loading}
                                            />
                                        )}

                                        

                                    />
                                    
                        </DialogContent>

 <DialogActions className="justify-between p-8">
                        <div className="px-16">

                            <Button
                                variant="contained"
                                color="secondary"
                                className="mr-8"
                                type="submit"
                                onClick={closeDialog}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Update
                            </Button>
                        </div>
                    </DialogActions>

            </Formsy>
           
 </Dialog>
    );
        }

        
export default PatientAlertsEditDialog;
        
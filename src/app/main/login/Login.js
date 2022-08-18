import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import withReducer from 'app/store/withReducer';
import React, { useState,useEffect, useRef } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useForm } from '@fuse/hooks';
import { Link, useParams } from 'react-router-dom';
import PatientForm from './tabs/patientForm';
import StaffForm from './tabs/staffForm';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import reducer from './store';
import { getLocation } from './store/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import PatientsForLogin from './tabs/PatientsForLogin';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';

const useStyles = makeStyles(theme => ({
    root: {
        background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
            theme.palette.primary.dark,
            0.5
        )} 100%)`,
        color: theme.palette.primary.contrastText
    },
    leftSection: {},
    rightSection: {
        background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
            theme.palette.primary.dark,
            0.5
        )} 100%)`,
        color: theme.palette.primary.contrastText
    }
}));

function Login(props) {
    const dispatch = useDispatch();
    const { form, handleChange, resetForm } = useForm({
		email: '',
		password: '',
		remember: true
	});
    const { tab } = useParams();
    const classes = useStyles();
    const locationdata = useSelector(({ Login }) => Login.login);
    const [selectedTab, setSelectedTab] = useState(tab ? +tab : 0);
    const [open, setOpen] = React.useState(false);
    const handleClose = (event, reason) => {
		setOpen(false);
	};
	
    function handleTabChange(event, value) {
        setSelectedTab(value);
    }
     useEffect(() => {
         if(!locationdata.data.index_logo) {
		    dispatch(getLocation());
         }
      }, [])
    
    return (
        <div
            className={clsx(
                classes.root,
                'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
            )}
        >
            <div className="flex w-full max-w-400 md:max-w-3xl rounded-12 shadow-2xl overflow-hidden">
                <Card
                    className={clsx(classes.leftSection, 'flex flex-col w-full max-w-sm items-center justify-center')}
                    square
                    elevation={0}
                >
                    <CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320" style={{ display: 'block' }}>
                        <div className="flex items-center mb-48" style={{ display: 'block' }}>
                            <img className="logo-icon " src={locationdata.data.index_logo} alt="logo" />
                        </div>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            className="w-full mb-32"
                        >
                            <Tab className="min-w-0" label="PHYSICIAN & STAFF" />
                            <Tab className="min-w-0" label="PATIENT" />
                        </Tabs>
                        {selectedTab === 0 && locationdata.data.pooldata !== undefined && <StaffForm />}
                        {selectedTab === 1 && locationdata.data.pooldata !== undefined && <PatientForm />}
                        {locationdata.data.pooldata === undefined && <CircularProgress />}

                        {/* <div className="flex items-center justify-between">
									<FormControl>
										<FormControlLabel
											control={
												<Checkbox
													name="remember"
													checked={form.remember}
													onChange={handleChange}
												/>
											}
											label="Remember Me"
										/>
									</FormControl>

									<Link className="font-medium" to="/forgot-password">
										Forgot Password?
									</Link>
								</div>

                            <div className="my-24 flex items-center justify-center">
								<Divider className="w-32" />
								<span className="mx-8 font-bold">OR</span>
								<Divider className="w-32" />
							</div>

							<Button variant="outlined" onClick={setOpen} color="primary" size="small" className="normal-case w-192 mb-8">
								Log in with Google
							</Button>

							<Button variant="outlined" onClick={setOpen} color="primary" size="small" className="normal-case w-192">
								Log in with Facebook
							</Button> */}
                            

                    </CardContent>
                    <div className="flex flex-col items-center justify-center pb-32">
							{/* <span className="font-medium">Don't have an account?</span>
							<Link className="font-medium" to="/register">
								Create an account
							</Link> */}
						</div>
                </Card>

                <div className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}>
                    <div className="max-w-320">
                        <Typography variant="h3" color="inherit" className="font-800 leading-tight">
                            Welcome to  {locationdata.data.location_text} <br />
                        </Typography>
                        <Typography variant="h6">{locationdata.data.welcome_message}</Typography>
                    </div>
                </div>
            </div>
            
            <SnackBarAlert snackOpen={open} onClose={handleClose} text="This feature is under development." />
            <PatientsForLogin />
        </div>
    );
}


export default withReducer('Login', reducer)(Login);
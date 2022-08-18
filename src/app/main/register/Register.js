import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Auth0RegisterTab from './tabs/Auth0RegisterTab';
import FirebaseRegisterTab from './tabs/FirebaseRegisterTab';
import JWTRegisterTab from './tabs/JWTRegisterTab';
import PatientRegister from './tabs/PatientRegister';
import reducer from './store';
import { getLocation } from '../../../app/main/login/store/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import Divider from '@material-ui/core/Divider';



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
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	review: {
		display: 'flex',
		padding: "2% 0",
		flexDirection: 'row',
		letterSpacing: '0px',
		color: '#707070',
		opacity: 1,
		fontSize: '16px',
		justifyContent: 'center',
		paddingBottom:"9%"
	},

ul:{
  listStyle: 'none',
  display: 'table'
},

li:{
  display:' table-row',
  lineHeight:'28px'
},

b:{
  display: 'table-cell',
  paddingRight: '3em'
},
}));

function Register() {
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(1);
	const [step, setStep] = useState(0);
	const dispatch =useDispatch();
	const locationdata = useSelector(({ Login }) => Login.login);
   const [state, setState]=useState({
     
   })

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}
   // Fetching location and logo
	useEffect(() => {
		dispatch(getLocation());
	}, [dispatch]);



	// FETCH FORM DATA
	const getData =(data, step)=>{
	setState({...state, data})
	setStep(+step+1)
	}

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}
		>
			<FuseAnimate animation="transition.expandIn">
				<div className="flex w-full max-w-400 md:max-w-3xl rounded-12 shadow-2xl overflow-hidden">
					<Card
						className={clsx(
							classes.leftSection,
							'flex flex-col w-full max-w-sm items-center justify-center'
						)}
						square
						elevation={0}
					>
						<CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
							<FuseAnimate delay={300}>
							<div className="flex items-center mb-48">
                            <img className="logo-icon " src={locationdata.index_logo} alt="logo" />
                        </div>
							</FuseAnimate>
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
							
							{selectedTab === 0 && <PatientRegister  />}
							{selectedTab === 1 && <PatientRegister  sendData={getData} />}
						
						</CardContent>

						<div className="flex flex-col items-center justify-center pb-32">
							<span className="font-medium">Already have an account?</span>
							<Link className="font-medium" to="/login">
								Login
							</Link>
						</div>
					</Card>
					{step>0&&<Card className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}>
					<CardContent  style={{ background: "white", color: "black", borderRadius:"4px" }} className="flex flex-col items-center justify-center w-full py-96 max-w-320">
					
							{/* <div style={{ background: "white", color: "black" }} className="max-w-320"> */}
								<div  style={{ background: "white", color: "black" }} style={{ textAlign: "center" }} className={classes.review}>
									<ul className={classes.ul}>
										{step>0&&<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Name</b>: {state.data&&state.data.name}</li>}
										{step>0&&<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Email</b>: {state.data&&state.data.email}</li>}
										{/* <Divider /> */}
										{step>1&&<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Address</b>: {state.data&&state.data.address}</li>}
										{step>1&&<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>Phone</b>: {state.data&&state.data.phone}</li>}
										{step>1&&<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>State</b>: {state.data&&state.data.state}</li>}
										{step>1&&<li className={classes.li}><b style={{ fontWeight: "normal" }} className={classes.b}>PIN</b>: {state.data&&state.data.pin}</li>}

									</ul>
								</div>
							{/* </div> */}
						
						
						</CardContent>	
					</Card>}

					{step==0&&<div
						className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}
					>
						<div className="max-w-320">
                        <Typography variant="h3" color="inherit" className="font-800 leading-tight">
                            Welcome to  {locationdata.location_text} <br />
                            <h6>{locationdata.welcome_message}</h6>
                        </Typography>
                    </div>
					</div>}
				</div>
			</FuseAnimate>
		</div>
	);
}

export default  withReducer('Register', reducer)(Register);
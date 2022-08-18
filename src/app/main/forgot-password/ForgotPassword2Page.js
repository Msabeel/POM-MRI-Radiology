import FuseAnimate from '@fuse/core/FuseAnimate';
import { useForm } from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { getLocation } from '../login/store/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
const validEmailRegex = RegExp(
	/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

function ForgotPassword2Page() {
	const dispatch = useDispatch();
	const classes = useStyles();
	const[ form, setForm] = useState({
		email: ''
	});
	const [errors, setErrors]=useState({

	})
	const locationdata = useSelector(({ Login }) => Login.login);

	const handleChange = () => (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
		setErrors({})
    };
	function isFormValid() {
		return form.email.length > 0;
	}

	function handleSubmit(ev) {
		ev.preventDefault();
	if(!validEmailRegex.test(form.email)){
		return setErrors({...errors, email:"Invalid email address",})
	}
	
	}
// Get Location
	useEffect(() => {
		dispatch(getLocation());
	}, [dispatch]);

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
				<img className="logo-icon " src={locationdata.index_logo} alt="logo" />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={300}>
					<Typography variant="h3" color="inherit" className="font-light">
						Welcome to {locationdata.location_text} 
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={400}>
					<Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
						{locationdata.welcome_message}
					</Typography>
				</FuseAnimate>
			</div>

			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
						<Typography variant="h6" className="md:w-full mb-32">
							RECOVER YOUR PASSWORD
						</Typography>

						<form
							name="recoverForm"
							noValidate
							className="flex flex-col justify-center w-full"
							onSubmit={handleSubmit}
						>
							<TextField
								className="mb-16"
								label="Email"
								autoFocus
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange()}
								variant="outlined"
								required
								fullWidth
								helperText={errors.email}
								error={errors.email}

							/>

							<Button
								variant="contained"
								color="primary"
								className="w-224 mx-auto mt-16"
								aria-label="Reset"
								disabled={!isFormValid()}
								type="submit"
							>
								SEND RESET LINK
							</Button>
						</form>

						<div className="flex flex-col items-center justify-center pt-32 pb-24">
							<Link className="font-medium" to="/">
								Go back to login
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default ForgotPassword2Page;

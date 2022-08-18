import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PersonIcon from '@material-ui/icons/Person';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import history from '@history';
import { auth } from '../../../actions/authActions';
import { submitLoginWithAWS } from 'app/auth/store/loginSlice';
import { CustomSettings } from 'app/config';

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '90%'
            }
        },
        margin: {
            margin: theme.spacing(1)
        },
        withoutLabel: {
            marginTop: theme.spacing(3)
        },
        label: {
            fontSize: 'auto'
        },
        textField: {
            width: '90%'
        }
    })
);
const ColorButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText('#192d3e'),
        backgroundColor: '#192d3e',
        '&:hover': {
            backgroundColor: '#192d3e'
        }
    }
}))(Button);

function StaffForm() {
    const dispatch = useDispatch();
    const locationdata = useSelector(({ Login }) => Login.login);
    const [values, setValues] = useState({
        userName: '',
        password: '',
        showPassword: false,
        result: false,
        loading: false
    });
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = () => (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    const handleSubmit = async event => {
        event.preventDefault();
        setValues({ ...values, loading: true });
        const result = await dispatch(submitLoginWithAWS(values, locationdata));
        // setValues({ ...values, loading: false, result });
        if(!result.error) {
/*
            if(CustomSettings.IsProdDeployment) {
                let redirectURI = '';
                if(locationdata.data.redirectUrl) {
                    redirectURI = locationdata.data.redirectUrl && locationdata.data.redirectUrl.StaffExistingURL;
                }
                window.open(redirectURI, "_self");
            }
            else {
                history.push({
                    pathname: '/apps/dashboards/project'
                });
            }
            */
            let redirectURI = '';
            if(locationdata.data.redirectUrl) {
                redirectURI = locationdata.data.redirectUrl && locationdata.data.redirectUrl.StaffExistingURL;
            }
            window.open(redirectURI, "_self");

        }
        else {
            setValues({ ...values, loading: false, result });
        }
    };
    const classes = useStyles();
    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <div style={{ position: 'relative', display: 'block' }}>
                <TextField
                    style={{ width: '100%' }}
                    className="login-input"
                    value={values.userName}
                    name="userName"
                    id="outlined-error-helper-text"
                    label="Username "
                    variant="outlined"
                    onChange={handleChange()}
                />
                <PersonIcon
                    style={{
                        color: 'rgb(0, 0, 0, 0.50)',
                        position: 'absolute',
                        fontSize: '30px',
                        right: '14px',
                        top: '12px',
                        margin: 'auto'
                    }}
                />
            </div>

            <div style={{ position: 'relative', display: 'inline-flex' }}>
                <TextField
                    style={{ width: '100%' }}
                    className="login-input"
                    name="password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    id="outlined-passwprd-helper-text"
                    label="Password "
                    variant="outlined"
                    onChange={handleChange()}
                />
                <IconButton
                    style={{
                        color: 'rgb(0, 0, 0, 0.50)',
                        position: 'absolute',
                        fontSize: '30px',
                        right: '2px',
                        top: '4px',
                        margin: 'auto'
                    }}
                    aria-label="toggle password visibility"
                    disableFocusRipple
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                />
            </div>
            <ColorButton type="submit" className="login" variant="contained" color="primary" disabled={values.loading}>
                {values.loading && <CircularProgress size={16}/>}
                {!values.loading && 'Login'}
            </ColorButton>
            {values.result.error && values.result.block &&
            <Typography variant="h3" color="inherit" className="font-800 leading-tight">
                <h6 style={{ color: 'red'}}>Your account is deactivated please contact your Site Administrator.</h6>
            </Typography>}
            {values.result.error && !values.result.block &&
            <Typography variant="h3" color="inherit" className="font-800 leading-tight">
            <h6 style={{ color: 'red'}}>Incorrect Username or Password.</h6>
            </Typography>}
        </form>
    );
}
export default StaffForm;

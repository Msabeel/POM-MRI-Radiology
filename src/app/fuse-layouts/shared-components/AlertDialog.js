import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function AlertDialog(props) {
    const { alertMessage, buttonTitle, isOpen, onClick, onClose, alertType, showButton } = props
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Snackbar open={isOpen} autoHideDuration={3000} onClose={onClose} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}>
                <Alert
                    variant="filled"
                    severity={alertType}
                    onClose={onClose}
                    action={showButton && (<Button color="inherit" size="small" onClick={onClick}>
                        {buttonTitle}
                    </Button>)
                    }
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AlertDialog;
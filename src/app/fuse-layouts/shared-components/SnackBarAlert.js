import React, {useEffect, useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {withStyles} from '@material-ui/core/styles';


const StyledSnackbar=withStyles({
	root:{
		// position: 'absolute',
		top:210
	},
})(Snackbar);

const SnackBarAlert = ({snackOpen, text, onClose, error=false}) => {
    const [snack, setSnack] = useState({
		open: snackOpen,
		vertical: 'top',
		horizontal: 'center',
	});
	const {vertical, horizontal, open} = snack;
	const [openError, setOpenError] = useState(false);
	const handleClose = (event, reason) => {
		setSnack({open:false, vertical: 'top', horizontal: 'center' });
		onClose();
	};
	const handleCloseError = (event, reason) => {
		onClose();
	};
	
    return(
		
		<StyledSnackbar
			anchorOrigin={{vertical, horizontal}}
			open={snackOpen} autoHideDuration={6000} onClose={error===true?handleCloseError:handleClose}>
			<Alert onClose={error===true?handleCloseError:handleClose} severity={error===true?"error":"success"}>
				{text}
			</Alert>
		</StyledSnackbar>
		
    );
}

export default SnackBarAlert;
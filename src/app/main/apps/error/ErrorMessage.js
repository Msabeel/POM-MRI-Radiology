import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { CustomSettings } from 'app/config';

const useStyles = makeStyles({
	selectedButton: {
		backgroundColor: 'rgb(76, 175, 80)',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80)',
		  },
	},
});

function ErrorMessage(props) {
	const classes = useStyles(props);
	function handleBack(event) {
		window.open(CustomSettings.BackURL, "_self");
	}
	return (
		<Container style={{display: 'flex',justifyContent: 'center', alignItems: 'center',height:"100%"}}>
			<Box component="span" m={1} style={{textAlign: 'center'}}>
				<Button
					variant="contained"
					style={{ marginBottom: 25 }}
					type="submit"
					color="primary"
					className={classes.selectedButton}
					onClick={handleBack}
				>
					FINISHED
				</Button>
				<Typography variant="h4" component="h2">Oops! Something went wrong.</Typography>
				
			</Box>
		</Container>
	);
}

export default ErrorMessage;

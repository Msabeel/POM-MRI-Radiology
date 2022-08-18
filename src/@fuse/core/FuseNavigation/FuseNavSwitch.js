import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '0 7px',
		fontSize: 11,
		fontWeight: 600,
		height: 20,
		minWidth: 20,
		borderRadius: 20,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
	}
}));

function FuseNavSwitch(props) {
	const classes = useStyles(props);
	const { className, badge } = props;
	let usertype = window.localStorage.getItem('usertype');
	console.log('usertype: ', usertype);
	return (
		<div>
			{usertype && 
			<Switch
				checked={props.checkedA}
				// onChange={handleChange}
				name="checkedA"
				inputProps={{ 'aria-label': 'secondary checkbox' }}
			/>}
		</div>
	);
}

FuseNavSwitch.propTypes = {
	badge: PropTypes.shape({
		title: PropTypes.node,
		bg: PropTypes.string,
		fg: PropTypes.string
	})
};
FuseNavSwitch.defaultProps = {};

export default React.memo(FuseNavSwitch);

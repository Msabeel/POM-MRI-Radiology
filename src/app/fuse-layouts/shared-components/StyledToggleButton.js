import {withStyles} from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export const StyledToggleButton = withStyles({
	root: {
		lineHeight: '20px',
		letterSpacing: '0.25px',
		color: 'rgba(0, 0, 0, 0.87)',
		padding: '15px 15px',
		textTransform: 'none',
		width: '100%',
		'&$selected': {
			backgroundColor: 'rgb(76, 175, 80)',
			fontWeight: 'bold',
			color: 'black',
			'&:hover': {
				backgroundColor: 'rgb(76, 175, 80)',
			},
		},
	},

	selected: {},
})(ToggleButton);

export const StyledGroupButton = withStyles({
	root: {
		padding: '5px 10px',
		width: '100%',
	},
})(ToggleButtonGroup);

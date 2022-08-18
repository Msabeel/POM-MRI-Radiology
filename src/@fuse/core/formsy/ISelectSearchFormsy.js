import _ from '@lodash';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import { withFormsy } from 'formsy-react';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
const filter = createFilterOptions(); 

function ISelectSearchFormsy(props) {
	const importedProps = _.pick(props, [
		'autoWidth',
		'children',
		'classes',
		'displayEmpty',
		'input',
		'inputProps',
		'MenuProps',
		'multiple',
		'native',
		'onChange',
		'onClose',
		'onOpen',
		'open',
		'renderValue',
		'SelectDisplayProps',
		'value',
		'variant',
		'style'
	]);

	// An error message is returned only if the component is invalid
	const { errorMessage, value } = props;
	// const [value, setValue] = React.useState(null);
	function input() {
		switch (importedProps.variant) {
			case 'outlined':
				return <OutlinedInput labelWidth={props.label.length * 8} id={props.name} />;
			case 'filled':
				return <FilledInput id={props.name} />;
			default:
				return <Input id={props.name} />;
		}
	}

	function changeValue(event, newValue) {
		props.setValue(event.target.value);
		if (props.onChange) {
			props.onChange(event, newValue);
		}
	}

	return (
		<FormControl
			error={Boolean((!props.isPristine && props.showRequired) || errorMessage)}
			className={props.className}
			variant={importedProps.variant}
			style={importedProps.style}
		>
			{/* {props.label && <InputLabel htmlFor={props.name}>{props.label}</InputLabel>} */}
			{/* <Select {...importedProps} value={value} onChange={changeValue} input={input()} /> */}
			<Autocomplete
				{...importedProps}
				value={value}
				onChange={changeValue}
				filterOptions={(options, params) => {
					const filtered = filter(options, params);
					// Suggest the creation of a new value
					if (params.inputValue !== '') {
						filtered.push({
							inputValue: params.inputValue,
							title: `Add "${params.inputValue}"`,
						});
					}

					return filtered;
				}}
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				id={props.id}
				options={props.options}
				getOptionLabel={(option) => {
					// Value selected with enter, right from the input
					if (typeof option === 'string') {
						return option;
					}
					// Add "xxx" option created dynamically
					if (option.inputValue) {
						return option.inputValue;
					}
					// Regular option
					return option.name;
				}}
				renderOption={(option) => option.name + ', ' + option.code}
				// style={{ width: 300 }}
				freeSolo
				required
				renderInput={(params) => (
					<TextField 
						{...params} 
						InputLabelProps={{
							style: { color: '#000', fontSize: '1.5rem' },
						  }}
						label={props.label}
						variant="outlined" 
						error={Boolean((!props.isPristine && props.showRequired) || errorMessage)}
					/>
				)}
			/>
			{Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
		</FormControl>
	);
}

export default React.memo(withFormsy(ISelectSearchFormsy));

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
import CircularProgress from '@material-ui/core/CircularProgress';

const filter = createFilterOptions(); 

function SelectSearchFormsy(props) {
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

	if (props.allCity.length === 0) {
        return (
            <div className="w-full flex justify-center mr-16">
                <CircularProgress></CircularProgress>
            </div>
        );
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
				id="free-solo-with-text-demo"
				options={props.allCity}
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
				renderOption={(option) => option.name + ', ' + option.state_name}
				// style={{ width: 300 }}
				freeSolo
				required
				renderInput={(params) => (
					<TextField 
						{...params} 
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

export default React.memo(withFormsy(SelectSearchFormsy));

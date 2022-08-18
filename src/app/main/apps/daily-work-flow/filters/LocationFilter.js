
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles({
	rd_splashitemselected: {
		border: '4px solid green'
	}
});


export const LocationFilter = ({locationOptionsDD,...props}) => {
	const classes = useStyles(props);
    const [locations,setLocations]= useState(locationOptionsDD)

        function handleTasks(event, newValue) {
           // setForm({...form, tasks: newValue});
        }
	return (
        <Autocomplete
       // value={form.tasks}
        onChange={handleTasks}
        multiple
        fullWidth
       // disabled={form.required}
        limitTags={1}
        id="Location"
        options={locations}
        getOptionLabel={(locations) => locations}
        renderInput={(params) => (
            <TextField
                {...params}
                className="mb-24"
                fullWidth
                variant="outlined"
                label="Location"
                placeholder="Select Locations"
            />
        )}
    />
	);
}

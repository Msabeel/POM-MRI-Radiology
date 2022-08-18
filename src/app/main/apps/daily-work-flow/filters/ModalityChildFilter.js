
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useState,useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
	rd_splashitemselected: {
		border: '4px solid green'
	}
});

export const ModalityChildFilter = ({modalityChildsFilter,...props}) => {
    
	const classes = useStyles(props);
    const [modalityChilds,setModalityChilds]= useState(modalityChildsFilter)

    useEffect(()=>{
    setModalityChilds(modalityChildsFilter)
    },[modalityChilds])

        function handleModalityChildChange(event, newValue) {
            props.setLocationDD(newValue)
        }
	return (
        <Autocomplete
       // value={form.tasks}
        onChange={handleModalityChildChange}
        multiple
        fullWidth
       // disabled={form.required}
        limitTags={1}
        id="ModalityChild"
        options={modalityChildsFilter}
        getOptionLabel={(modalityChildsFilter) => modalityChildsFilter.modality}
        renderInput={(params) => (
            <TextField
                {...params}
                className="mb-24"
                fullWidth
                variant="outlined"
                label="Modalities"
                placeholder="Select Modalities"
            />
        )}
    />
	);
}

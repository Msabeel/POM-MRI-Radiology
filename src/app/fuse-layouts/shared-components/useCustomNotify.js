import React from 'react';
import { useSnackbar } from 'notistack';

const useCustomNotify = () => {
    const { enqueueSnackbar } = useSnackbar();
    
    function CustomNotify(message=null, type=null) {
        if (message !== null) {
            enqueueSnackbar(message, {
                anchorOrigin: { vertical: 'top',horizontal: 'center'},
                variant: type,
            })
        }
    }

    return CustomNotify;
}

export default useCustomNotify;
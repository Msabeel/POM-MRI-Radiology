import FuseUtils from '@fuse/utils';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Dialog from '@material-ui/core/Dialog';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import {downloadFax} from '../../main/apps/profile/store/ProfileSlice'
const useStyles = makeStyles((theme) => ({
    root: {
        width: 600
    },
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: 5,
        width: '100%'
    },
    boxPadding: {
        paddingHorizontal: 15
    }
}));


const RetrieveModel = ({
    isOpen,
    handleCloseModel,
    access_no,
    data,
    onSaved,
    exam,
    tempDoc
}) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [showFaxField, setFaxField] = useState(false);
    const [faxObject, setFaxObject] = useState(null);
    const [faxNumber, setFaxNumber] = useState('');
    const ExamData = useSelector(({profilePageApp}) => profilePageApp.profile);

    const handleClose = () => {
        handleCloseModel(false)
    }

    const handleDownloadFax = (type) => {
        let tempdata = []
        ExamData.selectedDoc &&
            ExamData.selectedDoc.map((item, index) => {
                tempdata.push(item.id)
                return 0
            })

        let data = {
            key: type===1?'download':'fax',
            ids: tempdata
        }
        if (type === 1) {
            setLoading(true)
            const result = dispatch(downloadFax(data));
            setLoading(false)
            handleCloseModel(false)
        } else {
            setFaxObject(data)
            setFaxField(true)
        }
    }
    const handlFax = () => {
        setLoading(true)

        faxObject.faxNumber = faxNumber;
        const result = dispatch(downloadFax(faxObject));
        handleCloseModel(false)
        setLoading(false)

    }

    return (
        <div className="flex flex-col sm:border-1 overflow-hidden ">

            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" className="p-15" open={isOpen}>
                <div style={{padding: 15}}>
                    {
                        showFaxField ?
                            <div style={{disply:'flex',justifyContent: 'center',width:'100%'}}>
                                <TextField
                                    className="mb-24 mr-16"
                                    label="Patient ID"
                                    id="patient_id"
                                    name="patient_id"
                                    value={faxNumber}
                                    onChange={(e)=>setFaxNumber(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlFax}
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    Fax
                                    {isLoading && <CircularProgress className="ml-10" color="#fff" size={18} />}
                                </Button>

                            </div>
                            :
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlFax}
                                    type="submit"
                                    style={{marginRight:10}}
                                    disabled={isLoading}
                                    onClick={() => handleDownloadFax(1)}
                                >
                                    {
                                        isLoading ? <CircularProgress className="ml-10" color="#fff" size={18} /> : "Download"
                                    }

                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={() => handleDownloadFax(2)}
                                >
                                    Fax
                                </Button>
                            </>
                    }
                </div>
            </Dialog>

        </div>
    );
};



export default RetrieveModel;

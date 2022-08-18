import React, {useEffect, useState, useCallback} from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Switch from '@material-ui/core/Switch';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'clear',
    }
}));

const ActionComponent = ({
    isChecked,
    handleEdit,
    isDeleted,
    isCurrentRowEditing,
    params,
    handleDelete,
    handleSubmit,
    handleStatus
}) => {
    const classes = useStyles()
    const [checked, setChecked] = React.useState(isChecked);
    const [isdelete, setdelete] = useState(isDeleted);

    const changeStatus = (event) => {
        handleStatus()
        setChecked(event.target.checked)

    }
    const changeDelete = (event) => {
        handleDelete()
        setdelete(event.target.checked)
    }
    return (
        <div style={{
            width: '100%'
        }}>
            {
                isCurrentRowEditing ?
                    <>
                        <Button>
                            <Icon
                                onClick={() => {
                                    handleSubmit()
                                }}
                                className="list-item-icon text-16" color="action">
                                done
                            </Icon>
                        </Button>
                        <Button>
                            <Icon
                                onClick={() => {
                                    params.api.stopEditing(true);
                                }}
                                className="list-item-icon text-16" color="action">
                                close
                            </Icon>
                        </Button>
                    </>
                    :
                    <>
                        <Button>
                            <Icon
                                onClick={() => {
                                    handleEdit()
                                }}
                                className="list-item-icon text-16" color="action">
                                create
                            </Icon>
                        </Button>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!checked}
                                    onChange={changeStatus}
                                    color="primary"
                                    name="checkedB"
                                    label="Status"
                                    inputProps={{'aria-label': 'primary checkbox'}}
                                />}
                        // label="Status"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isdelete}
                                    onChange={changeDelete}
                                    name="checked"
                                />}
                        // label="Delete"
                        />
                    </>
            }
        </div>
    );
};



export default ActionComponent;

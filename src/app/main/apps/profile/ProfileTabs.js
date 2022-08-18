import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {Link, useParams} from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    tabRoot: {
        height: 55,
        width: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",

    }
}));


export const ProfileTabs = ({
    selectedTab,
    handleTabChange,
    selectedAcc,
    handleCloseReturn
}) => {

    const classes = useStyles()
    const [selected, setSelected] = useState([])
    useEffect(() => {
        setSelected(selectedAcc)
    }, [selectedAcc])

    const handleClose = (acc) => {

        var tempArr = JSON.parse(JSON.stringify(selected));
        var tempArr1 = tempArr.filter(x => x !== acc);
        var prev = tempArr1[tempArr1.length - 2];
        if (tempArr1.length > 0) {
            // setTabedAcc(prev)
            // setSelectedTab(0);
            // setSelectedAcc(tempArr1);
            handleCloseReturn(tempArr1)
        } else {
            // setSelectedTab(0);
            // setTabedAcc('')
            // setSelectedAcc([]);
            handleCloseReturn(tempArr1)
        }
        // history.push(location.pathname);
    }

    return (
        <div style={{display: 'flex', marginBottom: 10,flexDirection: 'row'}}>
            {/* {
            filterOptions && */}
            <Button to={`/apps/patient/all`}
                component={Link}
                className="mx-8 normal-case"
                variant="contained"
                color="secondary"
                aria-label="Follow"
                style={{
                    height:30,
                    marginTop:20
                }}
                >
                Back
            </Button>
            {/* <IconButton onClick={() => {
            history.push(`/apps/patient/all`)
            // history.goBack();
        }}
            style={{padding: 10, height: 50, width: 50, }}>

            <Typography variant="caption" display="block" gutterBottom>
                Back
            </Typography>
        </IconButton> */}
            {/* } */}
            <Tabs
                value={selectedTab}
                // onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="off"
                classes={{
                    root: 'h-64 w-full'
                }}
            >
                {/* {FuseUtils.hasButtonPermission(Permissions.view_document) &&  */}
                <Tab
                    label={
                        <span className={classes.tabRoot} onClick={() => {
                            handleTabChange(0, true)
                        }}>
                            <span style={{color: '#999'}}>Exam List</span>
                        </span>
                    }
                />
                {
                    selected &&
                    selected.map((item, index) => {
                        return (
                            <Tab key={index} label={
                                <div className={classes.tabRoot}>
                                    <span onClick={() => {
                                        handleTabChange(item, false)
                                    }}>
                                        <span style={{color: '#000'}}>{item}</span>
                                    </span>
                                    <IconButton size="small" onClick={() => {handleClose(item)}}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            } />
                        )
                    })
                }

                {/* } */}
                {/* <Tab
                classes={{
                    root: 'h-64'
                }}
                label="195"
            /> */}
                <Tab
                    classes={{
                        root: 'h-64'
                    }}
                    className={classes.tabRoot}
                    label={
                        <span onClick={() => {
                            handleTabChange(1, true)
                        }}>
                            <span style={{color: '#999'}}>Patient Info</span>

                        </span>
                    }
                />
                <Tab
                    classes={{
                        root: 'h-64'
                    }}
                    className={classes.tabRoot}
                    label={
                        <span onClick={() => {
                            handleTabChange(2, true)
                        }}>
                            <span style={{color: '#999'}}>Timeline</span>

                        </span>
                    }
                />
            </Tabs>
        </div>
    )
}
import FuseAnimate from '@fuse/core/FuseAnimate';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import history from '@history';
import ContactsTable from './ContactsTable';
import { openEditContactDialog, removeContact, getContacts, selectContacts, setSearchCount, getRecentSearchedPatient, removeRecentSearch } from './store/contactsSlice';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));


function RecentSearched(props) {
    const classes = useStyles();


    const dispatch = useDispatch();

    const contacts = useSelector(selectContacts);

    const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
    const isSearching = useSelector(({ contactsApp }) => contactsApp.contacts.isSearching);
    const searchCount = useSelector(({ contactsApp }) => contactsApp.contacts.searchCount);
    const user = useSelector(({ contactsApp }) => contactsApp.user);

    const [recentPatients, setRecentPatients] = useState([]);

    const [filteredData, setFilteredData] = useState(null);
    const [isSearchingState, setIsSearching] = useState(false);

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            const result = await dispatch(getRecentSearchedPatient());
            if (result.payload && result.payload.data) {
                setIsSearching(false);
                setRecentPatients(result.payload.data)
            }
        }
        setIsSearching(true);
        fetchData();

        return () => { ignore = true; }
    }, []);

    useEffect(() => {
        // if (contacts) {
        // 	setFilteredData(contacts);
        // }
    }, [contacts]);

    useEffect(() => {
        //setIsSearching(isSearching)
    }, [isSearching]);


    const removeFromRecentSearch = async (index, patient) => {

        var contact = JSON.parse(JSON.stringify(patient));
        var contacts = JSON.parse(JSON.stringify(recentPatients));

        contacts.splice(index, 1);
        setRecentPatients(contacts);
        dispatch(setSearchCount(searchCount - 1));
        dispatch(removeRecentSearch({
            id: contact.id,
            user_id: user.id
        }));

    }


    if (isSearchingState) {
        return (
            <CircularStatic />
        );
    }

    if (!recentPatients || recentPatients.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="textSecondary" variant="h5">
                    There are no recent search
				</Typography>
            </div>
        );
    }
    const handleClick = (patient) => {
        history.push(`/apps/profile/${patient.id}/${patient.lname + ',' + patient.fname}/1`)
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={8} className="plist-0">
                    <Timeline align={'alternate'}>
                        {recentPatients.map((patient, index) => {
                            return (
                                <TimelineItem >
                                    <TimelineSeparator>
                                        <TimelineDot />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Paper title="View Details" elevation={3} className={"patient-card " + classes.paper} >
                                            <div key={patient.id}>
                                                <div className="floating-cancel-btn" onClick={(e) => removeFromRecentSearch(index, patient)}>
                                                    <label htmlFor="icon-button-file">
                                                        <Button className="cancel-btn" variant="contained" color="default" component="span" title="Remove">
                                                            <ClearIcon />
                                                        </Button>
                                                    </label>

                                                </div>
                                                <div className="patient-box" onClick={() => handleClick(patient)}>
                                                    <div>ID: &nbsp;<b>{patient.patient_id}</b></div>
                                                    <div>Name: &nbsp;<b>{patient.lname + ',' + patient.fname}</b></div>
                                                    <div>DOB: &nbsp;<b>{moment(patient.dob).format('MM-DD-YYYY')}</b></div>
                                                    <div>Recent Date: &nbsp;<b>{moment(patient.recent_searched_date).format('MM-DD-YYYY HH:mm:ss')}</b></div>
                                                </div>
                                            </div>
                                        </Paper>
                                        {/* <div key={patient.id} className="patient-card">
                                            <div className="floating-cancel-btn" onClick={(e) => removeFromRecentSearch(index, patient)}>
                                                <ClearIcon />
                                            </div>
                                            <div className="patient-box" onClick={() => handleClick(patient)}>
                                                <div>ID: <b>{patient.patient_id}</b></div>
                                                <div>Name: <b>{patient.lname+','+patient.fname}</b></div>
                                                <div>DOB: <b>{moment(patient.dob).format('MM-DD-YYYY')}</b></div>
                                                <div>Recent Date: <b>{moment(patient.curr_date).format('MM-DD-YYYY')}</b></div>
                                            </div>
                                        </div> */}
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        })}

                    </Timeline>
                </Grid>
            </Grid>
        </div>
    );
}

export default RecentSearched;

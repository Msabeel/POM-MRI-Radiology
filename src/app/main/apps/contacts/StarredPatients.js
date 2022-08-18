import FuseAnimate from '@fuse/core/FuseAnimate';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsTable from './ContactsTable';
import { selectContacts, getStarredPatient, setStarredPatient, setStaredCount } from './store/contactsSlice';
import history from '@history';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import Paper from '@material-ui/core/Paper';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';


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


function StarredPatients(props) {
    const classes = useStyles();


    const dispatch = useDispatch();

    const contacts = useSelector(selectContacts);

    const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
    const staredCount = useSelector(({ contactsApp }) => contactsApp.contacts.staredCount);
    const isSearching = useSelector(({ contactsApp }) => contactsApp.contacts.isSearching);
    const user = useSelector(({ contactsApp }) => contactsApp.user);

    const [searchedPatients, setSearchedPatients] = useState([]);

    const [filteredData, setFilteredData] = useState(null);
    const [isSearchingState, setIsSearching] = useState(false);

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            const result = await dispatch(getStarredPatient());
            if (result.payload && result.payload.data) {
                setIsSearching(false);
                setSearchedPatients(result.payload.data)
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




    if (isSearchingState) {
        return (
            <CircularStatic />
        );
    }

    const addRemoveStar = async (index, patient) => {

        var contact = JSON.parse(JSON.stringify(patient));
        var contacts = JSON.parse(JSON.stringify(searchedPatients));

        contacts.splice(index, 1);
        setSearchedPatients(contacts);

        dispatch(setStaredCount(staredCount - 1));
        dispatch(setStarredPatient({
            id: contact.id,
            patient_starred: 0
        }));

    }

    const handleClick = (patient) => {
        history.push(`/apps/profile/${patient.id}/${patient.lname + ',' + patient.fname}/1`)
    };

    if (!searchedPatients || searchedPatients.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">

                <Typography color="textSecondary" variant="h5">
                    There are no recent search
				</Typography>
            </div>
        );
    }

    return (
        
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={8} className="plist-0">
                    <Timeline align={'alternate'}>

                        {searchedPatients.map((patient, index) => {
                            return (
                                <TimelineItem>
                                    <TimelineSeparator>
                                        <TimelineDot />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Paper title="View Details" elevation={3} className={"patient-card " + classes.paper} >
                                            <div key={patient.id} >
                                                <div className="floating-cancel-btn" onClick={(e) => addRemoveStar(index, patient)}>
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
                                                    <div>Starred Date: &nbsp;<b>{moment(patient.patient_starred_date).format('MM-DD-YYYY HH:mm:ss')}</b></div>
                                                </div>
                                            </div>
                                        </Paper>
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

export default StarredPatients;

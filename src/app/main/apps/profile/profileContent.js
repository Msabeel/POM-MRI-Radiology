import React, {useEffect, useCallback, useState, useRef} from 'react';
import PatientEditTab from './tabs/PatientEditTab';
import PhotosVideosTab from './tabs/PhotosVideosTab';
import EditExam from './tabs/EditExam';
import {ExamContent} from './tabs/ExamContent';
import TimelineTab from './tabs/TimelineTab';
import {ProfileTabs} from './ProfileTabs';
import history from '@history';
import {Link, useParams, useLocation} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {setFilterOption, resetFilterOption, removeTabs, openVerificationSheetDialog} from './store/ProfileSlice'
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExamSearchbar from 'app/fuse-layouts/shared-components/ExamSearchBar';
import DehazeIcon from '@material-ui/icons/Dehaze';
import AppsIcon from '@material-ui/icons/Apps';
import {useDispatch, useSelector} from 'react-redux';
import VerificationSheetDialog from './tabs/VerificationSheetDialog';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';

import _ from '@lodash';
const useStyles = makeStyles({
    tabs: {
        display: 'flex',
        padding: '10px',
        paddingLeft: 20,
        paddingRight: 20,
        display: 'inline',
        textTransform: 'uppercase',
        color: 'rgb(153, 153, 153)',
        fontWeight: 600,
        fontSize: '1.4rem',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'transparent',
        },
        width: 150
    },
    activeTabs: {
        padding: '10px',
        paddingLeft: 20,
        paddingRight: 20,
        display: 'inline',
        textTransform: 'uppercase',
        color: '#192d3e',
        fontWeight: 600,
        fontSize: '1.4rem',
        cursor: 'pointer',
        borderBottom: '3px solid #192d3e',
        '&:hover': {
            backgroundColor: 'transparent',
        }
    }
});


export const ProfileContent = ({
    patientData,
    tab
}) => {
    const tabRef = useRef(null);
    const location = useLocation();
    const dispatch = useDispatch()
    const classes = useStyles();
    const [selected, setSelected] = useState([])
    const [deletedList, setDeletedList] = useState([])
    const [tabedAcc, setTabedAcc] = useState('')
    const [activeTab, setActiveTab] = useState('exam-list');
    const [isGrid, setIsGrid] = useState(false);
    const [filterOption, setFilterOption1] = useState([]);
    const Tabs = useSelector(({profilePageApp}) => profilePageApp.profile.tabs);
    const CurrentTab = useSelector(({profilePageApp}) => profilePageApp.profile.activeTab);
    const TechHoldSuccessMsg = useSelector(({profilePageApp}) => profilePageApp.profile.techHoldMsgObj);
    const customeNotify = useCustomNotify();
    const [selectedTabs, setSelectedTabs] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [printVerificationText, setPrintVerificationText] = useState('Print Verification Sheets');
    const {id, name} = useParams()

    useEffect(() => {
        if (parseInt(tab) === 0) {
            setActiveTab('exam-list');
        } else if (parseInt(tab) === 1) {
            setActiveTab('patient-info');
        } else {
            setActiveTab('timeline');
        }
    }, [])

    useEffect(() => {
        if (CurrentTab && Tabs.length === 0) {
            setActiveTab('exam-list');
            setSelected(Tabs);
        } else {
            setSelected(Tabs);
        }
    }, [Tabs])
    useEffect(() => {
        if (CurrentTab) {
            setActiveTab(CurrentTab)
        }
    }, [CurrentTab])
    const changeTab = (name) => {
        setActiveTab(name)
        dispatch(resetFilterOption(""))
    }
    const handleCloseReturn = (data) => {
        dispatch(removeTabs(data));

        // let tempArr = JSON.parse(JSON.stringify(selected))
        // let currentIndex = selected.indexOf(data);
        // let filter = tempArr.filter(x => x !== data);
        // setSelected(filter)
        // let tempDel = deletedList;
        // tempDel.push(data)
        // setDeletedList(tempDel)
        // if (parseInt(currentIndex) === 0 || tempArr.lenth === 0) {
        //     setActiveTab('exam-list')
        // } else {
        //     let value = selected[currentIndex - 1]
        //     setActiveTab(value)
        // }
        // history.push(location.pathname);
        // dispatch(resetFilterOption(""))
    }
    const handleSelectedAcc = () => {

    }

    const handleSelectedAcc1 = useCallback((acc) => {
        let tempArr = JSON.parse(JSON.stringify(selected))
        if (tempArr.length > 0) {
            tempArr.map((item, index) => {

                let find = deletedList.indexOf(item);
                if (find > -1) {
                    let filtet = tempArr.filter((item) => item !== item)
                    tempArr = filtet
                    tempArr.push(acc)
                } else {
                    tempArr.push(acc)
                }
            })
        } else {
            tempArr.push(acc);
        }
        // 
        const distinct = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        let final = tempArr.filter(distinct)
        setTabedAcc(acc)
        setSelected(final);
        setActiveTab(acc)
        setDeletedList([])
        dispatch(resetFilterOption(""))
    }, [selected])
    const examChanged = (id, old) => {
        let list = JSON.parse(JSON.stringify(selected))
        let index = list.indexOf(id);
        if (index === -1) {
            list.map((item, index) => {
                if (item === old) {
                    list[index] = id
                }
            })
            setActiveTab(id);
            setSelected(list)
            history.push(location.pathname);
        } else {
            setActiveTab(id);
        }
    }

    const handleAddTab = (tabItem) => {
        setActiveTab(tabItem)
    }

    const handleFilterOption = (data) => {
        let options = filterOption;
        if (data) {
            var obj = {
                match: data.match,
                title: data.title
            }
            options.push(obj)
            setFilterOption1(options)
            dispatch(setFilterOption(data))
        } else {
            setFilterOption1([])
            dispatch(setFilterOption(null))

        }
    }

    const setSelectedGridRows = (data) => {
        setSelectedRows(data);
        if (data.length > 0) {
            setPrintVerificationText('Print Verification Sheets (' + data.length + ')');
        }
        else {
            setPrintVerificationText('Print Verification Sheets');
        }
    }

    function handleOpenVerification() {
        dispatch(openVerificationSheetDialog({selectedRows, patientData}));
    }

    const ActiveTab = (item) => {
        if (activeTab === 'exam-list') {
            return (
                <>

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}>
                        <ExamSearchbar setFilterOption={handleFilterOption} />
                        <div style={{width: '20%'}}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={handleOpenVerification}
                                disabled={selectedRows.length === 0}
                            >
                                {printVerificationText}
                            </Button>
                        </div>
                        <div style={{
                            marginBottom: 20
                        }}>
                            {
                                isGrid ?
                                    <IconButton
                                        onClick={() => {
                                            setIsGrid(!isGrid)
                                        }}
                                        style={{padding: 10, height: 60, width: 60, }}>
                                        <DehazeIcon fontSize="large" />

                                    </IconButton>
                                    :
                                    <IconButton
                                        onClick={() => {
                                            setIsGrid(!isGrid)
                                        }}
                                        style={{padding: 10, height: 60, width: 60, }}>
                                        <AppsIcon fontSize="large" />

                                    </IconButton>
                            }
                        </div>
                    </div>


                    <PhotosVideosTab filter={filterOption} setSelectedGridRows={setSelectedGridRows} isGrid={isGrid} patientData={patientData} handleSelectedAcc={handleSelectedAcc} />
                </>
            )
        } else if (activeTab === 'patient-info') {
            return (
                <PatientEditTab patientInfo={patientData.patientInfo} exams={patientData.exams} familysData={patientData.familysData} allCity={patientData.allCity} />
            )
        } else if (activeTab === "timeline") {
            return (
                <TimelineTab patientData={patientData} exams={patientData.exams} lastAudits={patientData.lastAudits} />
            )
        } else {
            return (

                <ExamContent
                    examId={activeTab}
                    patientData={patientData}
                    examChanged={examChanged}
                />
                // <EditExam
                //     examId={activeTab}
                //     patientInfo={patientData.patientInfo}
                //     exams={patientData.exams}
                //     familysData={patientData.familysData}
                //     allCity={patientData.allCity}
                //     examChanged={examChanged}
                // />
            )
        }
    }

    useEffect(()=>{
        if(TechHoldSuccessMsg)
        {
            if(TechHoldSuccessMsg.error){
            customeNotify(TechHoldSuccessMsg.error.msg, 'error')
            }
            else
            {           
            customeNotify(TechHoldSuccessMsg.payload.data, 'success') 
		    history.go(0) // 0 tab mean exam list
           
            }
        }
    },
    [TechHoldSuccessMsg])
    return (
        <div className="p-12 sm:p-12">
            <div>
                <List style={{listStyle: 'none', marginBottom: 5}}>
                    <ListItem
                        className={classes.tabs}
                        onClick={() => changeTab('exam-list')}

                    >
                        <Button to={`/apps/patient/all`}
                            component={Link}
                            className="mx-8 normal-case"
                            variant="contained"
                            color="secondary"
                            aria-label="Follow"
                        >
                            Back
                        </Button>
                    </ListItem>
                    <ListItem
                        className={activeTab === 'exam-list' ? classes.activeTabs : classes.tabs}
                        onClick={() => changeTab('exam-list')}
                        button
                    >Exam List</ListItem>
                    {
                        selected.length >= 4 &&
                        <IconButton onClick={() => {
                            tabRef.current.scrollLeft -= 200
                        }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    }

                    <div ref={tabRef} id="tabScrolling" style={{display: 'inline-flex', maxWidth: 500, overflowX: 'auto', }}>

                        {
                            selected.map((tabItem) => {
                                return (
                                    <ListItem
                                        className={activeTab === tabItem ? classes.activeTabs : classes.tabs}
                                        style={{paddingLeft: 35}}
                                        button
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            paddingBottom: 0
                                        }}

                                        >
                                            {/* <ListItemText style={{padding:0}} primary={tabItem}
                                                onClick={() => handleAddTab(tabItem)}
                                            /> */}
                                            <span onClick={() => handleAddTab(tabItem)}>
                                                {tabItem}
                                            </span>

                                            <IconButton style={{marginLeft: 20, position: 'relative', zIndex: 9999}}
                                                onClick={() => {
                                                    handleCloseReturn(tabItem)
                                                }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                            {/* </div> */}
                                        </div>
                                    </ListItem>
                                )
                            })
                        }

                    </div>
                    {
                        selected.length >= 4 &&
                        <IconButton onClick={() => {
                            tabRef.current.scrollLeft += 200
                        }}>
                            <ChevronRightIcon />
                        </IconButton>
                    }
                    <ListItem
                        className={activeTab === 'patient-info' ? classes.activeTabs : classes.tabs}

                        onClick={() => changeTab('patient-info')}
                        button
                    >PATIENT INFO</ListItem>
                    <ListItem
                        className={activeTab === 'timeline' ? classes.activeTabs : classes.tabs}

                        onClick={() => changeTab('timeline')}
                        button
                    >TIMELINE</ListItem>
                </List>
            </div>

            {ActiveTab(filterOption)}
            <VerificationSheetDialog></VerificationSheetDialog>

        </div>
    )
}
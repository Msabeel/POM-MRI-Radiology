import React, {useEffect, useCallback, useState, useRef} from 'react';
import PatientEditTab from './PatientEditTab';
import EditExam from './EditExam';
import TimelineTab from './TimelineTab';
import InsuranceInfo from '../../insurance-info/InsuranceInfo';
import ViewVerificationSheet from './ViewVerificationSheet';
import history from '@history';
import {Link, useParams, useLocation} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {useDispatch, useSelector} from 'react-redux';
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


export const ExamContent = ({
    patientData,
    examId,
    examChanged
}) => {
    const tabRef = useRef(null);
    const location = useLocation();
    const dispatch = useDispatch()
    const classes = useStyles();
    const [selected, setSelected] = useState([])
    const [deletedList, setDeletedList] = useState([])
    const [tabedAcc, setTabedAcc] = useState('')
    const [activeTab, setActiveTab] = useState('exam-detail');
    const [isGrid, setIsGrid] = useState(false);
    const [filterOption, setFilterOption1] = useState([]);
    const [selectedTabs, setSelectedTabs] = useState([])
    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (parseInt(tab) === 0) {
            setActiveTab('exam-detail');
        } else if (parseInt(tab) === 1) {
            setActiveTab('verification-sheet');
        } else {
            setActiveTab('insurance');
        }
    }, [])

    const changeTab = (name) => {
        setActiveTab(name)
    }

    const handleCloseReturn = (data) => {
        let tempArr = JSON.parse(JSON.stringify(selected))

        let currentIndex = selected.indexOf(data);
        let filter = tempArr.filter(x => x !== data);
        setSelected(filter)
        let tempDel = deletedList;
        tempDel.push(data)
        setDeletedList(tempDel)
        if (parseInt(currentIndex) === 0 || tempArr.lenth === 0) {
            setActiveTab('exam-detail')
        } else {
            let value = selected[currentIndex - 1]
            setActiveTab(value)
        }
        history.push(location.pathname);
    }


    const handleSelectedAcc = useCallback((acc) => {
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
    }, [selected])
    
    
    const ActiveTab = (item) => {
        if (activeTab === 'exam-detail') {
            return (
                <EditExam
                    examId={examId}
                    patientInfo={patientData.patientInfo}
                    exams={patientData.exams}
                    familysData={patientData.familysData}
                    allCity={patientData.allCity}
                    examChanged={examChanged}
                />
            )
        } else if (activeTab === 'verification-sheet') {
            return (
                <ViewVerificationSheet patientData={patientData} examId={examId} id={patientData.patientInfo.id} />
            )
        } else if (activeTab === "insurance") {
            return (
                <InsuranceInfo exam_id={examId} patient_id={patientData.patientInfo.patient_id} />
            )
        }
    }

    return (
        <div>
            <div>
                <List style={{listStyle: 'none', marginBottom: 35}}>
                    
                    <ListItem
                        className={activeTab === 'exam-detail' ? classes.activeTabs : classes.tabs}
                        onClick={() => changeTab('exam-detail')}
                        button
                    >Exam Detail</ListItem>
                    <ListItem
                        className={activeTab === 'verification-sheet' ? classes.activeTabs : classes.tabs}

                        onClick={() => changeTab('verification-sheet')}
                        button
                    >Verification Sheet</ListItem>
                    <ListItem
                        className={activeTab === 'insurance' ? classes.activeTabs : classes.tabs}

                        onClick={() => changeTab('insurance')}
                        button
                    >Insurance</ListItem>
                </List>
            </div>

            {ActiveTab(filterOption)}


        </div>
    )
}
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import ExamCard from 'app/fuse-layouts/shared-components/ExamCard';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import Icon from '@material-ui/core/Icon';
import {createStyles, makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import {getAllDocuments, sendFax, addAudit} from '../profile/store/ProfileSlice';
import {useParams} from 'react-router-dom';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RefPopover from 'app/fuse-layouts/shared-components/RefPopover';
import Cancel from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import clsx from 'clsx';
import ContactsIcon from '@material-ui/icons/Contacts';
import EmailIcon from '@material-ui/icons/Email';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import AWS from 'aws-sdk';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    table: {
        minWidth: '600px !important',
    },
    header: {
        background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: theme.palette.getContrastText(theme.palette.primary.main)
    },
    headerIcon: {
        position: 'absolute',
        top: -64,
        left: 0,
        opacity: 0.04,
        fontSize: 512,
        width: 512,
        height: 512,
        pointerEvents: 'none'
    },
    buttonProgress: {
        // color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    documentImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut
    },
    // thumpImg:{
    // 	width:"74px",
    // 	height:"74px"
    // },
    thumpImg: {
        width: "74px",
        height: "74px",
        cursor: "pointer",
        // transition: 'transform .2s',
        '&:hover': {
            transform: 'scale(1.5)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            width: '110px !important',
            height: "110px !important",
            display: 'block',
            position: 'absolute',
            left: '130px',
            zIndex: "9999",
            cursor: "pointer"

        }
    },

    uploadImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $remove': {
                opacity: 0.8
            }
        },
        '&.cross': {
            boxShadow: theme.shadows[3],
            '& $remove': {
                opacity: 1
            },
            '&:hover $remove': {
                opacity: 1
            }
        }
    },
    remove: {
        position: 'absolute',
        top: 0,
        right: 0,
        // color: orange[400],
        opacity: 0,
        borderRadius: '100%',
        background: '#8a8d91',
        color: 'white',
        borderColor: 'white',
        border: '1px solid white',
        fontSize: '19px',
        padding: '1px',
        height: '22px',
        width: '23px',
    },
    fileName: {
        position: 'absolute',
        bottom: '0px',
        width: '100%',
        fontSize: '9px',
        color: 'black',
        textAlign: 'center',
        fontWeight: "800"
    },
    onDrop: {
        outline: ' 2px dashed black',
        outlineOffset: '-10px',
        // backgroundColor:' #e5edf1',
        position: "absolute !important",
        // zIndex:' 1',
        // top: '50%',
        // right: '50%',
        // bottom: '50%',
        // left: '-1%',
        width: '100% !important',
        height: '100%  !important',

        margin: "0px !important",

        padding: '0px',
        // position: 'absolute',
        right: '0px',
        top: '0px',
        // width: '100%',
        // height: '100%',
        backgroundColor: 'rgb(255, 255, 255)',
        zIndex: '30001',
        opacity: '0.9',
    },
    onDropIcon: {
        fontweight: 900,
        fontSize: "112px",
    },
    onDropIcon: {
        fontweight: 900,
        fontSize: "112px",
    },

    accNumber: {
        // backgroundColor:'#ffffff',
        width: '100%',
        justifyContent: "center",
        opacity: 1,
        fontWeight: '700',
        //    padding:"5px"
    },
    cardDate: {
        // background: "#2d8dff",
        color: "white",
    },
    cardTitle: {
        padding: ' 1px 14px',
        borderBottom: "1px solid #61dafb",
        // fontSize: '1.7rem'
    },
    cardSubTitle: {
        color: "white",
        // background:" #2d8dff",
        // fontSize: "1.7rem",
        fontWeight: '700',
    },
    scrollHr: {
        display: "grid",
        gridTemplateColumns: "auto auto",
        gridColumnGap: "2px",
        overflowX: "scroll",
        width: "100%"
    },
    scrollHrSelectedExam: {
        display: "grid",
        gridTemplateColumns: "auto auto",
        gridColumnGap: "2px",
        width: "100%",
        justifyContent: "center"
    },
    scrollHrMin: {
        display: "flex",
        gridTemplateRows: "auto auto",
        gridAutoFlow: "column",
        overflowX: "scroll",
        width: "100%"
    },
    imgScroll: {
        width: '100%',
        textAlign: "center",
        overflowX: 'scroll',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': {
            width: '0.2rem',
            height: "10px",
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bbbcbd',
            // 	border: '2px solid transparent',
            // boxShadow: 'inset 0 0 0 20px rgba(0, 0, 0, 0.24)',
        }

    },


}));
const FaxPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    // const Exams = useSelector((state) => profilePageApp.profile.examsForFax);
    const [exams, setExams] = useState([])
    const [upalodCred, setUploadCred] = useState([])
    const [selectedReports, setSelectedReports] = useState([])
    const Exams = useSelector((state) => state);
    const [isDocView, setOpenDocView] = useState(false);
    const [isDocLoading, setIsLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedExamData, setSelectedExamData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isEdge, setEdgeBrowser] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [refPopover, setrefPopover] = useState({});
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState("");
    const [emailField, setEmailField] = useState(false);
    const [showFaxField, setFaxField] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState([]);
    const [fetchingFiles, setFetchingFiles] = useState(false);
    const [base64Files, setBase64Files] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [faxNumber, setFaxNumber] = useState('');
    const [email, setEmail] = useState('');
    const CustomNotify = useCustomNotify();
    const [state, setState] = useState({
        documentTypeId: "0",
        selectedExam: [],
        document: '',
        fileName: "",
        isValid: true,
        documentName: ''
    })
    const routeParams = useParams();
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const refMenuClose = (e) => {
        setAnchorEl(null);

    }
    useEffect(() => {
        if (Exams.profilePageApp) {
            setExams(Exams.profilePageApp.profile.examsForFax)
            setUploadCred(Exams.profilePageApp.profile.uploadCred)
        }
    }, [])
    useEffect(() => {
        if (isDocView) {
            fetchAllDocuments()
        }
    }, [isDocView]);
    const fetchAllDocuments = async () => {
        setIsLoading(true)
        const data = {
            exam_id: exams.access_no | exams.acc_number
        }
        const result = await dispatch(getAllDocuments(data))
        if (result.payload) {
            setDocuments(result.payload.data.data)

        }
        setIsLoading(false)

    }
    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setLoading(false)
            var fresult = [];
            var sresult = [];
            if (exams && exams.length > 0) {
                for (var i = 0; i < exams.length; i++) {
                    if (routeParams.exam_id === exams[i].exam_id.toString()) {
                        sresult.push(exams[i]);
                    }
                }
                for (var i = 0; i < exams.length; i++) {
                    if (routeParams.exam_id !== exams[i].exam_id.toString()) {
                        fresult.push(exams[i]);
                    }
                }
            }
            setSelectedExamData(sresult);
            setFetchingData(false)
            return setFilteredData(fresult);
        }
        fetchData();
        // Detect IE or Edge brower
        detectBrowser()

    }, [exams]);
    const detectBrowser = () => {
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        // Edge (based on chromium) detection
        var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
        if (isEdgeChromium) {
            setEdgeBrowser(true)
        }
    }
    const removeSelectedExam = (e, data) => {
        if (data.exam_id == routeParams.exam_id) {
            return
        }
        let exam = state.selectedExam.find(x => x == data.exam_id);
        if (exam) { //remove from list
            let exmaIndex = state.selectedExam.indexOf(data.exam_id);// get index 
            let disSelectedReport = selectedReports.filter(exam => exam.exam_id !== data.exam_id)
            console.log("disSelectedReport", disSelectedReport)
            state.selectedExam.splice(exmaIndex, 1)

            const examData = [...filteredData];
            examData.push(data);
            setFilteredData(examData);

            const filtered = selectedExamData.filter(f => f.exam_id !== data.exam_id);
            setSelectedExamData(filtered);

        }
        setState({...state, selectedExam: state.selectedExam})
    }
    const manageExam = (e, data) => {
        if (data.exam_id == routeParams.exam_id) {
            return
        }
        let exam = state.selectedExam.find(x => x == data.exam_id);
        if (exam) { //remove from list
            let exmaIndex = state.selectedExam.indexOf(data.exam_id);// get index 
            state.selectedExam.splice(exmaIndex, 1)
        }
        else {
            state.selectedExam.push(data.exam_id)
            const examData = [...selectedExamData];
            examData.push(data);
            setSelectedExamData(examData);

            const filtered = filteredData.filter(f => f.exam_id !== data.exam_id);
            setFilteredData(filtered);

        }
        setState({...state, selectedExam: state.selectedExam})
    }
    const manageCheckUncheckExam = (id) => {
        let exam = state.selectedExam.find(x => x == id);
        if (exam) {
            return true
        }
        else {
            return false
        }
    }
    const handleOpration = (e, type) => {
        console.log("Type", type, selectedDoc)
        if (selectedDoc.length === 0 && selectedReports.length === 0) {
            setError("Please select atleast one  docoment")
            return 0
        }
        if (type === 1) {
            selectedDoc && selectedDoc.map((item, index) => {
                handleDownload(item)

                return 0
            })

            selectedReports && selectedReports.map((item, index) => {
                getReportFile(item.link, item.attachment)
                return 0
            })
        } else if (type === 2) {
            setFaxField(true)
        } else {

        }
    }
    const getSelectedRecords = (selected) => {
        console.log("selected", selected)

        let tempArr = JSON.parse(JSON.stringify(selectedDoc))
        tempArr = [...tempArr, ...selected];
        tempArr = [...new Map(tempArr.map(item =>
            [item["id"], item])).values()];
        setSelectedDoc(tempArr)

    }
    useEffect(() => {
        if (base64Files.length > 0) {
            setFetchingFiles(false)
            sendFaxToNumber(base64Files)
        } else {
            setFetchingFiles(false)
        }
    }, [base64Files])
    const sendFaxToNumber = async (files) => {
        setIsSubmit(true)
        const date = new Date();
        // return 0
        const data = {
            faxno: faxNumber,
            // faxfiledata: files,
            // faxfilenames: filenames
        }

        return 0
        const result = await dispatch((sendFax(data)))
        console.log("result", result, selectedDoc)
        // if (option1) {

        //     selectedDoc.map(async (item, index) => {
        //         var auditData = {
        //             exam_id: props.exam_id,
        //             pid: props.patient.patient_id,
        //             comment: item.documnet_name + ' faxed on ' + faxNumber + ' at ' + date.getDate() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear(),
        //             type: 'fax',
        //             user_id: 0
        //         }
        //         const Auditresult = await dispatch((addAudit(auditData)))
        //     })
        // } else {
        //     var auditData = {
        //         exam_id: props.exam_id,
        //         pid: props.patient.patient_id,
        //         comment: 'final report  faxed on ' + faxNumber + ' at ' + date.getDate() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear(),
        //         type: 'fax',
        //         user_id: 0
        //     }
        //     const Auditresult = await dispatch((addAudit(auditData)))
        // }

        setIsSubmit(false)
    }


    const handlFax = () => {
        let fax_no12 = document.getElementById("fax_no12").value
        if (!showFaxField) {
            setIsSubmit(true)
            // handleFetchFinalReport()
            setIsSubmit(false)
        } else {
            setIsSubmit(true)
            // faxObject.faxNumber = faxNumber;
            getFileUrl(selectedDoc)
            setIsSubmit(false)
        }

    }
    function Uint8ToBase64(u8Arr) {
        var CHUNK_SIZE = 0x8000; //arbitrary number
        var index = 0;
        var length = u8Arr.length;
        var result = '';
        var slice;
        while (index < length) {
            slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
            result += String.fromCharCode.apply(null, slice);
            index += CHUNK_SIZE;
        }
        return window.btoa(result);
    }

    const getFileUrl = (doc) => {
        setFetchingFiles(true)
        if (doc.length > 0) {
            let tempBase64 = []
            doc.map((item, index) => {
                if (item.link) {
                    let linkArr = item.link.split('.')
                    let bucketArr = linkArr[0].split('/')
                    let s3bucket = bucketArr[2];
                    let ext = linkArr[4].split('?');
                    let s3key = linkArr[3].substring(4, linkArr[3].length - 1) + "." + ext[0];
                    let s33key = s3key.split('/');
                    let username = item.tran_user ? item.tran_user.displayname : "";
                    let filename = username + '_' + item.documnet_name + '_' + item.curr_date + "." + ext[0];
                    try {
                        let finalKey = s33key[0] + '/' + item.attachment
                        let url = filename;
                        let s3 = new AWS.S3({params: {Bucket: s3bucket}})
                        let params = {Bucket: s3bucket/* "pomrisdev"*/, Key: finalKey}// "ris/upload_technician/2402_195_2021-07-22 08:04:54_234.jpeg"

                        s3.getObject(params, (err, data) => {
                            if (err) return
                            let temp = Uint8ToBase64(data.Body)
                            tempBase64.push(temp)
                            setBase64Files(tempBase64)
                        });

                    } catch (ex) {
                        console.log("ex", ex)
                    }
                }
                return 0;
            })
            return tempBase64;
        }
    }
    let handleDownload = doc => {
        const date = new Date();
        if (doc.link) {
            let linkArr = doc.link.split('.')
            let bucketArr = linkArr[0].split('/')
            let s3bucket = bucketArr[2];
            let ext = linkArr[4].split('?');
            let s3key = linkArr[3].substring(4, linkArr[3].length - 1) + "." + ext[0];
            let s33key = s3key.split('/');
            let username = doc.tran_user ? doc.tran_user.displayname : "";
            let filename = username + '_' + doc.documnet_name + '_' + doc.curr_date + "." + ext[0];
            try {
                let finalKey = s33key[0] + '/' + doc.attachment
                let url = filename;
                let s3 = new AWS.S3({params: {Bucket: s3bucket}})
                let params = {Bucket: s3bucket/* "pomrisdev"*/, Key: finalKey}// "ris/upload_technician/2402_195_2021-07-22 08:04:54_234.jpeg"

                s3.getObject(params, async (err, data) => {
                    if (data) {
                        let blob = new Blob([data.Body], {type: data.ContentType});
                        let link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = url;
                        link.click();
                        var auditData = {
                            exam_id: routeParams.exam_id,
                            pid: routeParams.patient_id,
                            comment: doc.documnet_name + ' downloaded on ' + date.getDate() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear(),
                            type: 'fax',
                            user_id: 0
                        }
                        const Auditresult = await dispatch((addAudit(auditData)))
                    } else {
                        CustomNotify(" The specified file does not exist. " + filename, "error");
                    }
                })
            } catch (ex) {
                console.log("ex", ex)
            }
        }
    }

    const handleSelectedReports = (data) => {
        console.log("handleSelectedReports", data)
        let tempArr = JSON.parse(JSON.stringify(selectedReports))
        tempArr = [...tempArr, ...data];
        tempArr = [...new Map(tempArr.map(item =>
            [item["id"], item])).values()];
        console.log("tempArr", tempArr)
        setSelectedDoc(tempArr)
        setSelectedReports(data)
    }

    const getReportFile = (link, attachment) => {

        setFetchingFiles(true)

        let tempBase64 = []
        const date = new Date();
        if (link) {
            let linkArr = link.split('.')

            let bucketArr = linkArr[0].split('/')
            let s3bucket = bucketArr[2];
            let ext = linkArr[4].split('?');
            let s3key = linkArr[3].substring(4, linkArr[3].length - 1) + "." + ext[0];
            let s33key = s3key.split('/');
            let filename = "finalReport_" + routeParams.exam_id + "." + ext[0];
            try {
                let attach = attachment.split("/")
                let finalAtt = attach[1] + "/" + attach[2];
                let finalKey = s33key[0] + '/' + finalAtt
                let url = filename;
                let s3 = new AWS.S3({params: {Bucket: s3bucket}})
                let params = {Bucket: s3bucket/* "pomrisdev"*/, Key: finalKey}// "ris/upload_technician/2402_195_2021-07-22 08:04:54_234.jpeg"
                s3.getObject(params, async (err, data) => {
                    if (data) {
                        let blob = new Blob([data.Body], {type: data.ContentType});
                        let link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = url;
                        link.click();
                        var auditData = {
                            exam_id: routeParams.exam_id,
                            pid: routeParams.patient_id,
                            comment: 'final report downloaded on ' + date.getDate() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear(),
                            type: 'fax',
                            user_id: 0
                        }
                        const Auditresult = await dispatch((addAudit(auditData)))
                    } else {
                        CustomNotify(" The specified file does not exist. " + filename, "error");
                    }
                })
                // s3.getObject(params, (err, data) => {
                //     if (err) return
                //     let temp = Uint8ToBase64(data.Body)
                //     tempBase64.push(temp)
                //     setBase64Files(tempBase64)
                // });

            } catch (ex) {
                console.log("ex", ex)
            }
        }
        return 0;
    }

    return (
        <div className="flex flex-col flex-auto flex-shrink-0 w-full">
            <Typography style={{textAlign: "center", marginBottom: "10px"}} variant="h5">Please select the document you wish to download , fax or email.</Typography>
            <div style={{margin: "auto"}} className="flex justify-center sm:justify-start flex-wrap -mx-8">
                <label
                    onClick={(e) => {handleOpration(e, 1)}}
                    style={{background: "#f6f7f9"}}
                    title="Browse file"
                    htmlFor="button-file"
                    className={clsx(
                        classes.documentImageUpload,
                        'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
                    )}
                >
                    <div className="w-192 h-128 p-16 flex flex-col items-center justify-center" >
                        <CloudDownloadIcon size={55} />
                        <Typography style={{color: "#e75b5b", fontWeight: "900", fontSize: 16}} variant="caption" className="mt-4">
                            Download
                        </Typography>
                    </div>
                </label>
                <label
                    style={{background: "#f6f7f9"}}
                    id="container"

                    onClick={(e) => {handleOpration(e, 2)}}
                    className={clsx(
                        classes.documentImageUpload,
                        'flex items-center justify-center relative w-320 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
                    )}
                >
                    {
                        showFaxField ?
                            <div style={{disply: 'flex', justifyContent: 'center', width: '100%', padding: 10}}>
                                <TextField
                                    className="mb-24 mr-16"
                                    label={"Fax Number"}
                                    id="fax_no12"
                                    name={"Fax Number"}
                                    // value={faxNumber}
                                    onChange={(e) => {
                                        console.log("e.target.value", e.target.value)
                                        setFaxNumber(e.target.value)

                                    }}
                                    variant="outlined"
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setFaxField(false)
                                    }}
                                    style={{marginRight: 10}}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlFax}
                                    disabled={isLoading}
                                >
                                    {fetchingFiles ? "Fetching..." : "Fax"}
                                    {isSubmit && <CircularProgress className="ml-10" color="#fff" size={18} />}
                                </Button>



                            </div>
                            :
                            <div className="w-200 h-128 p-16 flex flex-col items-center justify-center" >
                                <ContactsIcon size={55} />
                                <Typography id="content" style={{color: "blue", fontWeight: "900", fontSize: 16}} variant="caption" className="mt-4">
                                    Fax
                                </Typography>
                            </div>
                    }

                </label>
                <label
                    style={{background: "#f6f7f9"}}
                
                    // htmlFor="button-file"
                    onClick={(e) => {handleOpration(e, 3)}}
                    className={clsx(
                        classes.documentImageUpload,
                        'flex items-center justify-center relative w-128  h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
                    )}
                >
                    <div className="w-192 h-128 p-16 flex flex-col items-center justify-center" >
                        <EmailIcon size={55} />
                        <Typography style={{fontWeight: "900", color: "rgba(0, 0, 0, 0.87)", fontSize: 16}} variant="caption" className="mt-4">
                            Email
                        </Typography>
                    </div>
                </label>
            </div>
            {error ? <p style={{color: 'red', marginTop: 10, textAlign: 'center'}}> {error}</p> : ""}
            {
                fetchingData ?
                    <div className="card-footer flex flex-column p-16">
                        <CircularStatic />
                    </div>
                    :

                    <div style={{margin: "auto", width: "100%"}} className="flex justify-center sm:justify-start flex-wrap -mx-8">
                        <div className="mb-12 flex justify-center" className={classes.scrollHrSelectedExam}>
                            {selectedExamData.map(exam =>
                                <div className={selectedExamData && selectedExamData.length <= 1 ? 'w-440 pt-8 pb-8 mr-8' : 'w-400 pt-8 pb-8 mr-8'} key={exam.exam_id}>
                                    <div style={{display: "flex", justifyContent: "center", height: "2.9rem"}}>
                                        {(manageCheckUncheckExam(exam.exam_id) || exam.exam_id == routeParams.exam_id) &&
                                            <CheckCircle className="block text-32 text-green-800 bg-white rounded-full" />
                                        }
                                        {exam.exam_id != routeParams.exam_id &&
                                            <Cancel className="block text-32 rounded-full cursor-pointer" onClick={(e) => removeSelectedExam(e, exam)} />
                                        }
                                    </div>
                                    <ExamCard
                                        patient={exam}
                                        isSelectedExam={manageCheckUncheckExam(exam.exam_id) || exam.exam_id == routeParams.exam_id}
                                        isShowAction={false}
                                        isShowClose={true}
                                        isPopper={true}
                                        isFaxDox={true}
                                        isCollapsed={false}
                                        openDocView={(data) => {setOpenDocView(data)}}
                                        isDocView={isDocView}
                                        documents={documents}
                                        s3Cred={upalodCred}
                                        isFaxExpanded={true}
                                        getSelectedRecords={getSelectedRecords}
                                        manageExam={(e) => {}}
                                        handleSelectedReports={handleSelectedReports}
                                        selectedDocs={selectedDoc}
                                        selectedReports={selectedReports}
                                    />
                                </div>
                            )}
                            <RefPopover open={open} anchorEl={anchorEl} refMenuClose={refMenuClose} refPopover={refPopover} />
                        </div>

                        <div className="mb-12" style={{width: '100%'}}>
                            <FuseAnimateGroup
                                enter={{
                                    animation: 'transition.slideUpBigIn'
                                }}
                                className={filteredData && filteredData.length <= 2 ? classes.scrollHrMin : classes.scrollHr}
                            >
                                {
                                    filteredData &&
                                    filteredData.map((item, index) => {
                                        return (
                                            <div className="w-400 pt-8 pb-8" key={item.exam_id} style={{margin: "auto"}}>
                                                <div style={{display: "flex", justifyContent: "center", height: "2.9rem"}}>
                                                    {(manageCheckUncheckExam(item.exam_id) || item.exam_id == routeParams.exam_id) &&
                                                        <CheckCircle className="block text-32 text-green-800 bg-white rounded-full" />
                                                    }
                                                    {(!manageCheckUncheckExam(item.exam_id) && item.exam_id !== routeParams.exam_id) &&
                                                        <CheckCircle className="block text-32 text-gray-500 bg-white rounded-full" />
                                                    }
                                                </div>
                                                <ExamCard
                                                    manageExam={(e) => manageExam(e, item)}
                                                    patient={item}
                                                    isShowAction={false}
                                                    isSelectedExam={1}
                                                    isShowClose={true}
                                                    isPopper={true}
                                                    isFaxDox={true}
                                                    isCollapsed={false}
                                                    openDocView={(data) => {setOpenDocView(data)}}
                                                    isDocView={isDocView}
                                                    documents={documents}
                                                    s3Cred={upalodCred}
                                                />

                                            </div>
                                        )
                                    })
                                }
                            </FuseAnimateGroup>
                        </div>
                    </div>
            }
        </div>

    )
}

export default FaxPage
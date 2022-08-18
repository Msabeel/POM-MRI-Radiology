import React, {useState, useRef, useEffect} from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import awsService from 'app/services/awsService';
import Visibility from '@material-ui/icons/Visibility';
import {green} from '@material-ui/core/colors';
import AWS from 'aws-sdk'
import history from '@history';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CancelIcon from "@material-ui/icons/Cancel";
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {getAllDocuments, getFaxageCred, sendFax, addAudit, getAuditFax, getFinalReport} from '../../main/apps/profile/store/ProfileSlice';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {getUploadCred} from '../../main/apps/profile/store/ProfileSlice';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PatientAccessDialog from 'app/fuse-layouts/shared-components/PatientAccessDialog';
import PatientAccessPrintDialog from 'app/fuse-layouts/shared-components/PatientAccessPrintDialog';
import {
    openPatientAccessDialog,
    openPatientAccessPrintPage,
    getRequestAlertsData,
    clearPatientAccessResponse
} from 'app/fuse-layouts/shared-components/quickPanel/store/dataSlice';
const useStyles = makeStyles({
    addButton: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        zIndex: 99
    },
    d_inline: {
        display: "inline-block"
    },
    table: {
        width: '100%',
        // height:'100%'
    },
    tableRow: {
        height: 30
    },
    tableCell: {
        padding: "0px 16px"
    },
    closeIcon: {
        position: 'absolute',
        top: '0%',
        right: ' 0%',
        color: '#fff'
    },
});
const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);
export const DocumentPreview = (props) => {
    const dispatch = useDispatch();
    const CustomNotify = useCustomNotify();
    const classes = useStyles(props);
    const pageLayout = useRef(null);
    const routeParams = useParams();
    const [base64Files, setBase64Files] = useState([]);
    const [fetchAdudit, setFetchAudut] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [faxHistory, setFaxHistory] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [faxNumber, setFaxNumber] = useState('');
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState(null);
    const [doc, setDoc] = useState(null);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [openDoc, setOpenDoc] = useState(false);
    const [fetchingFiles, setFetchingFiles] = useState(false);
    const [option1, setOption1] = React.useState(false);
    const [option2, setOption2] = React.useState(false);
    const [isDocOpen, setDocOpen] = React.useState(false);
    const [isFetch, setIsFetch] = useState(false);
    const [error, setError] = useState("");
    const [emailField, setEmailField] = useState(false);
    const [showFaxField, setFaxField] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [reportDatas, setReportDatas] = useState([]);
    const [isOpenFax, setIsFaxOpen] = useState(false);

    const {exam_id} = routeParams
    // const uploadCred = useSelector(({profilePageApp}) => profilePageApp.profile.uploadCred);

    let S3_BUCKET = 'pomrisdev';
    const REGION = 'us-east-1';

    var myBucket = new AWS.S3({
        params: {Bucket: S3_BUCKET},
        region: REGION,
    })
    var tempDoc = []

    useEffect(() => {
        const user = awsService.getUserDetail();
        // fetchFaxCred();
        // setReportDatas(props.selectedReportsList)
        // setSelectedDoc(props.selectedDocs)
        setUserData(user)
        if (props.isGrid) {
            fetchAllDocuments()
        } else {
            if (props.documents.length === 0 && props.isDocView) {
                // fetchAllDocuments()
            }
        }
    }, [])

    useEffect(() => {
        const user = awsService.getUserDetail();
        // fetchFaxCred();
        setUserData(user)
        if (isDocOpen) {
            if (props.patient) {
                if (props.patient.rafDetail)
                    setFaxNumber(props.patient.rafDetail.fax)
            }
            fetchAllDocuments()
        }
    }, [isDocOpen])


    useEffect(() => {
        const user = awsService.getUserDetail();
        // fetchFaxCred();
        setUserData(user)
        if (props.isFaxExpanded) {
            fetchAudit()
        }
    }, [props.isFaxExpanded])


    const fetchAllDocuments = async () => {
        setIsLoading(true)
        const data = {
            exam_id: props.exam_id
        }
        const result = await dispatch(getAllDocuments(data))
        if (result.payload) {
            if (props.isGrid) {
                // isExist(result.payload.data.data)
                setDocuments(result.payload.data.data)
            } else if (props.isFaxDox) {
                setDocuments(result.payload.data.data)
                let tempDocs = JSON.parse(JSON.stringify(selectedDoc))

                // result.payload.data.data.map((item, index) => {
                //     tempDocs.push(item)
                //     return 0;
                // })


                setChecked(true)
                setSelectedDoc(result.payload.data.data)
                props.getSelectedRecords(result.payload.data.data)
            }

        }
        setIsLoading(false)

    }

    const fetchAudit = async () => {
        setFetchAudut(true)
        const data = {
            id: props.exam_id
        }
        const result = await dispatch(getAuditFax(data));
        if (result.payload.data.data) {
            setFaxHistory(result.payload.data.data)
        }
        setFetchAudut(false)
    }

    if (props.s3Cred) {
        AWS.config.update({
            accessKeyId: props.s3Cred.plainKeyText,
            secretAccessKey: props.s3Cred.plainSecretText
        });
        S3_BUCKET = props.s3Cred.bucket;
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
                            exam_id: props.exam_id,
                            pid: props.patient.patient_id,
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
        var filesData = [];
        var filnames = [];
        files.map((item, index) => {
            filesData.push(item.data);
            filnames.push(item.filename)

        })
        const data = {
            faxno: faxNumber,
            faxfiledata: filesData,
            faxfilenames: filnames
        }
        // return 0
        const result = await dispatch(sendFax(data))

        const status = result
        if (status.payload.data.isFaxedError !== true) {
            if (status.payload.data.data) {
                if (option1) {

                    selectedDoc.map(async (item, index) => {
                        var auditData = {
                            exam_id: props.exam_id,
                            pid: props.patient.patient_id,
                            comment: item.documnet_name + ' faxed on ' + faxNumber + ' at ' + date.getDate() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear(),
                            type: 'fax',
                            user_id: 0
                        }
                        const Auditresult = await dispatch((addAudit(auditData)))
                    })
                } else {
                    var auditData = {
                        exam_id: props.exam_id,
                        pid: props.patient.patient_id,
                        comment: 'final report  faxed on ' + faxNumber + ' at ' + date.getDate() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear(),
                        type: 'fax',
                        user_id: 0
                    }
                    const Auditresult = await dispatch((addAudit(auditData)))
                }
            }
        }

        setIsSubmit(false)
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
                    let filename = item.documnet_name + '_' + item.curr_date + "." + ext[0];
                    try {
                        let finalKey = s33key[0] + '/' + item.attachment
                        let url = filename;
                        let s3 = new AWS.S3({params: {Bucket: s3bucket}})
                        let params = {Bucket: s3bucket/* "pomrisdev"*/, Key: finalKey}// "ris/upload_technician/2402_195_2021-07-22 08:04:54_234.jpeg"

                        s3.getObject(params, (err, data) => {
                            if (err) return
                            let temp = Uint8ToBase64(data.Body)
                            var file = {
                                filename: filename,
                                data: temp
                            }
                            tempBase64.push(file)
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
            let filename = "finalReport_" + props.exam_id + "." + ext[0];
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
                            exam_id: props.exam_id,
                            pid: props.patient.patient_id,
                            comment: 'final report  downloaded on ' + date.getDate() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getFullYear(),
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

    const handleAllSelect = (e) => {
        setChecked(e.target.checked)
        if (!props.isGrid) {

            if (e.target.checked === true) {
                let tempDocs = []
                props.documents.map((item, index) => {
                    var sel_Doc = {
                        attachment: item.attachment,
                        link: item.link,
                        documnet_name: item.documnet_name,
                        id: item.id,
                        curr_date: item.curr_date,
                        isSelected: true
                    }
                    tempDocs.push(sel_Doc);
                    return 0;
                })
                props.selectedDocFunc(tempDocs)

                setSelectedDoc(tempDocs)
            } else {

                let tempDocs = []
                props.documents.map((item, index) => {
                    var sel_Doc = {
                        attachment: item.attachment,
                        link: item.link,
                        documnet_name: item.documnet_name,
                        id: item.id,
                        curr_date: item.curr_date,
                        isSelected: false
                    }
                    tempDocs.push(sel_Doc);
                    return 0;
                })
                console.log("tempDocs",)
                props.selectedDocFunc(tempDocs)
                setSelectedDoc([])
            }

        } else {
            if (e.target.checked === true) {
                let tempDocs = []


                documents.map((item, index) => {
                    tempDocs.push(item)
                    return 0;
                })
                setSelectedDoc(tempDocs)
            } else {
                setSelectedDoc([])
                props.selectedDocFunc([])
            }
        }
    }

    let handleSingle = (doc) => {
        let temp2 = JSON.parse(JSON.stringify(selectedDoc));
        var tempIndex = temp2.findIndex(function (ele) {
            return ele.id == doc.id;
        });

        if (tempIndex > -1) {
            let temp1 = [];
            temp2.map((temp, index) => {
                var sel_Doc = {
                    attachment: temp.attachment,
                    link: temp.link,
                    documnet_name: temp.documnet_name,
                    id: temp.id,
                    curr_date: temp.curr_date,
                    isSelected: true
                }
                temp1.push(sel_Doc);
            })

            var tempd = temp1.filter(function (ele) {
                return ele.id != doc.id;
            });
            temp1.map((item, index) => {
                if (item.id === doc.id) {
                    item.isSelected = false
                }
            })
            setSelectedDoc([...tempd])
            props.selectedDocFunc([...temp1])
            // let temp1 = [];
            // // tempd.map((temp, index) => {
            // //     var sel_Doc = {
            // //         attachment: temp.attachment,
            // //         link: temp.link,
            // //         documnet_name: temp.documnet_name,
            // //         id: temp.id,
            // //         curr_date: temp.curr_date,
            // //         isSelected: true
            // //     }
            // //     temp1.push(sel_Doc);
            // // })

            // // let obj = [];
            // // var sel_Doc = {
            // //     attachment: doc.attachment,
            // //     link: doc.link,
            // //     documnet_name: doc.documnet_name,
            // //     id: doc.id,
            // //     curr_date: doc.curr_date,
            // //     isSelected: false
            // // }
            // // obj.push(sel_Doc);

        } else {
            let obj = [];
            var sel_Doc = {
                attachment: doc.attachment,
                link: doc.link,
                documnet_name: doc.documnet_name,
                id: doc.id,
                curr_date: doc.curr_date,
                isSelected: true
            }
            setSelectedDoc([...selectedDoc, sel_Doc])

            var sel_Doc = {
                attachment: doc.attachment,
                link: doc.link,
                documnet_name: doc.documnet_name,
                id: doc.id,
                curr_date: doc.curr_date,
                isSelected: true
            }
            obj.push(sel_Doc);
            props.selectedDocFunc(obj)
        }
    }

    const sendDocumentFax = async (docs) => {
        try {
            getFileUrl(docs)
            return 0
        } catch (ex) {
            console.log("ex", ex)
        }
    }

    const handleDownloadFax = (type) => {
        if (selectedDoc.length === 0 && type !== 4) {
            setError("Please select atleast one docoment")
            return 0
        }
        setError("")
        if (type === 1) {

            selectedDoc.map((item, index) => {
                handleDownload(item)
                return 0
            })

        } else if (type === 2) {
            setFaxField(true)
        } else if (type === 3) {
            setIsFaxOpen(true)
            var data = {
                id: props.patient.id,
                printAction: true,
                type: "documents",
                emailAction: true
            }
            dispatch(openPatientAccessDialog(data));
        } else if (type === 4) {
            history.push(`/apps/fax-page/${props.patient.patient_id}/${props.patient.access_no}`)
        } else {
            setEmailField(true)
            setFaxField(true)
            setFaxNumber("")
        }
    }

    const handlFax = () => {
        if (option1) {
            setIsSubmit(true)
            handleFetchFinalReport()
            setIsSubmit(false)
        } else {
            setIsSubmit(true)
            // faxObject.faxNumber = faxNumber;
            sendDocumentFax(selectedDoc)
            setIsSubmit(false)
        }

    }

    const openDocDialog = (e, doc) => {
        const data = {
            fileUrl: doc.link,
            fileExt: doc.attachment.split('.')[1],
            docName: doc.documnet_name,
            techsheet: doc.techsheet
        }
        setDoc(data)
        if (doc.techsheet) {
            window.open(doc.link, "_blank");
        }
        else {
            setIsOpenDialog(true)
            // dispatch(openPreivewDialog(data))
        }

    }

    const onCloseDialog = () => {
        setIsOpenDialog(false)
    }

    const onCloseDoc = () => {
        setOpenDoc(false)
        props.closeDocument()
    }

    const onOpenDoc = () => {
        setOpenDoc(false)
    }

    const handleOption1 = (event) => {
        setOption1(event.target.checked)
        if (event.target.checked) {
            handleFetchFinalReport()
        } else {

            let tempDocs = JSON.parse(JSON.stringify(reportDatas))
            tempDocs = tempDocs.filter(x => x.exam_id !== props.exam_id)
            props.handleSelectedReports(tempDocs)

        }
    }

    const handleOption2 = (event) => {
        setOption2(event.target.checked)
        setDocOpen(!isDocOpen);
        // if (option2 === false && option1 === false) {
        //     setSelectedDoc([])
        // }
    }

    const handleFetchFinalReport = async () => {
        setIsFetch(true)
        var data = {
            exam_access_no: props.exam_id
        }
        const result = await dispatch(getFinalReport(data));
        if (result.payload.getFinalReportError !== true) {

            setReportData(result.payload.data)
            // getReportFile(result.payload.data.link, result.payload.data.attachment)
            let tempDocs = JSON.parse(JSON.stringify(reportDatas))
            var report = {
                link: result.payload.data.link,
                attachment: result.payload.data.attachment,
                exam_id: props.exam_id
            }
            tempDocs.push(report)

            // setReportDatas(tempDocs)
            // props.handleSelectedReports(tempDocs)
        }
        setIsFetch(false)
        // langMenuClose();
    }


    const Buttons = () => {
        return (
            showFaxField ?
                <div style={{disply: 'flex', justifyContent: 'center', width: '50%'}}>
                    <TextField
                        className="mb-24 mr-16"
                        label="Fax No"
                        id="fax_no"
                        name="Fax Number"
                        value={faxNumber}
                        onChange={(e) => setFaxNumber(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {setFaxField(false)}}
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
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={selectedDoc.length === 0}
                        style={{marginRight: 10}}
                        onClick={() => handleDownloadFax(1)}

                    >
                        {
                            isSubmit ? <CircularProgress className="ml-10" color="#fff" size={18} /> : "Download"
                        }

                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{marginRight: 10}}
                        disabled={selectedDoc.length === 0}
                        onClick={() => handleDownloadFax(2)}
                    >
                        Fax
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={selectedDoc.length === 0}
                        onClick={() => handleDownloadFax(3)}
                    >
                        Email
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{position: 'absolute', right: 15, top: props.isGrid ? 80 : 22}}
                        onClick={() => handleDownloadFax(4)}
                    >
                        Multiple Exams
                    </Button>
                </>

        )
    }
    return (
        <>
            {
                !props.isGrid ?
                    <div>
                        {
                            props.isFaxDox &&
                            <div>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <div style={{width: "50%"}}>


                                        <FormControlLabel
                                            control={
                                                isFetch ?
                                                    <div className="card-footer flex flex-column p-16">
                                                        <CircularStatic />
                                                    </div>
                                                    :
                                                    <GreenCheckbox
                                                        checked={option1}
                                                        onChange={(e) => handleOption1(e)}
                                                    />

                                            }
                                            label="Report"
                                            style={{marginLeft: 10}}
                                        />

                                    </div>
                                    <div style={{width: "50%"}}>
                                        <FormControlLabel
                                            control={
                                                <GreenCheckbox
                                                    checked={option2}
                                                    onChange={(e) => handleOption2(e)}
                                                />

                                            }
                                            label="Documents"
                                            style={{marginLeft: 10}}
                                        />
                                    </div>

                                </div>
                                <div style={{
                                    padding: 15,
                                    borderBottomColor: '#999',
                                    borderBottomWidth: 1
                                }}>
                                    {
                                        showFaxField ?
                                            <div style={{disply: 'flex', justifyContent: 'center', width: '100%'}}>
                                                <TextField
                                                    className="mb-24 mr-16"
                                                    label={emailField ? "Email" : "Fax Number"}
                                                    id="fax_no"
                                                    name={emailField ? "Email" : "Fax Number"}
                                                    value={emailField ? email : faxNumber}
                                                    onChange={(e) => {
                                                        if (emailField) {
                                                            setEmail(e.target.value)
                                                        } else {
                                                            setFaxNumber(e.target.value)
                                                        }
                                                    }}
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {

                                                        setEmailField(false)

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
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handlFax}
                                                    type="submit"
                                                    // disabled={selectedDoc.length === 0}
                                                    style={{marginRight: 10}}
                                                    onClick={() => handleDownloadFax(1)}
                                                >
                                                    {
                                                        isSubmit ? <CircularProgress className="ml-10" color="#fff" size={18} /> : "Download"
                                                    }

                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    style={{marginRight: 10}}
                                                    // disabled={selectedDoc.length === 0}
                                                    onClick={() => handleDownloadFax(2)}
                                                >
                                                    Fax
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    // disabled={selectedDoc.length === 0}
                                                    onClick={() => handleDownloadFax(3)}
                                                >
                                                    Email
                                                </Button>
                                                {
                                                    error ? <p style={{color: 'red', marginTop: 10}}> {error}</p> : ""
                                                }
                                            </>
                                    }
                                </div>

                            </div>

                        }
                        {
                            props.isFaxDox ?
                                isDocOpen ? (
                                    isLoading === true ?
                                        <div className="card-footer flex flex-column p-16">
                                            <CircularStatic />
                                        </div>
                                        :
                                        documents.length > 0 ?
                                            <FuseScrollbars>
                                                <div style={{
                                                    height: 350,
                                                    width: '100%',
                                                    overflowY: 'auto',
                                                    scrollbarWidth: '1px'
                                                }}>
                                                    <TableContainer component={Paper}>
                                                        <Table stickyHeader className={classes.table} aria-label="simple table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <GreenCheckbox
                                                                            checked={checked}
                                                                            onChange={handleAllSelect}
                                                                        />

                                                                    </TableCell>
                                                                    <TableCell>Attachment</TableCell>
                                                                    <TableCell>Date</TableCell>
                                                                    <TableCell>User</TableCell>


                                                                    {/* <TableCell>Action</TableCell> */}

                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {
                                                                    documents.map((item, index) => {

                                                                        let isCheck = selectedDoc.find(x => x.id === item.id);
                                                                        var inputDate = new Date(item.curr_date);
                                                                        var todaysDate = new Date();
                                                                        let isDelete = false;
                                                                        if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                                                                            // Date equals today's date
                                                                            isDelete = true;
                                                                        }
                                                                        return (
                                                                            <TableRow className={classes.tableRow}>
                                                                                <TableCell className={classes.tableCell}>
                                                                                    <GreenCheckbox
                                                                                        checked={isCheck ? true : false}
                                                                                        onChange={() => {handleSingle(item)}}
                                                                                    />

                                                                                </TableCell>
                                                                                <TableCell className={classes.tableCell} component="th" scope="row">
                                                                                    <p style={{cursor: 'pointer', color: '#225de6'}}
                                                                                        onClick={(e) => openDocDialog(e, item)}
                                                                                    >{item.documnet_name ? item.documnet_name : '-'}</p>
                                                                                </TableCell>
                                                                                <TableCell className={classes.tableCell} style={{cursor: 'pointer'}}>
                                                                                    {item.curr_date}
                                                                                </TableCell>
                                                                                <TableCell className={classes.tableCell}>
                                                                                    {item.tran_user ? item.tran_user.displayname : "-"}
                                                                                </TableCell>

                                                                                {/* <TableCell className={classes.tableCell}>
                                                                                    {
                                                                                        userData && userData.data.userId === item.user_id ?
                                                                                            isDelete ?
                                                                                                <IconButton aria-label="delete" className={classes.margin}>
                                                                                                    <DeleteIcon />
                                                                                                </IconButton>
                                                                                                : '-'
                                                                                            : '-'
                                                                                    }

                                                                                </TableCell> */}



                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </FuseScrollbars>
                                            :
                                            <div style={{
                                                height: 340
                                            }}>
                                                <p style={{margin: 10}}>Records not found</p>
                                            </div>
                                ) :
                                    fetchAdudit === true ?
                                        <div className="card-footer flex flex-column p-16">
                                            <CircularStatic />
                                        </div>
                                        :
                                        faxHistory.length > 0 ?
                                            <FuseScrollbars>
                                                <div style={{
                                                    height: 350,
                                                    width: '100%',
                                                    overflowY: 'auto',
                                                    scrollbarWidth: '1px'
                                                }}>
                                                    <TableContainer component={Paper}>
                                                        <Table stickyHeader className={classes.table} aria-label="history table">
                                                            <TableHead>
                                                                <TableRow>

                                                                    <TableCell style={{width: 70}}>Sr.</TableCell>
                                                                    <TableCell>Comment</TableCell>
                                                                    <TableCell>By</TableCell>


                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {
                                                                    faxHistory.map((item, index) => {


                                                                        return (
                                                                            <TableRow className={classes.tableRow}>

                                                                                <TableCell className={classes.tableCell}>{++index}</TableCell>


                                                                                <TableCell className={classes.tableCell} component="th" scope="row">
                                                                                    <p>{item.comment ? item.comment : '-'}</p>
                                                                                </TableCell>

                                                                                <TableCell className={classes.tableCell} component="th" scope="row">
                                                                                    <p>{item.displayname ? item.displayname : '-'}</p>
                                                                                </TableCell>





                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </div>
                                            </FuseScrollbars>
                                            :
                                            <div style={{
                                                height: 340
                                            }}> <p style={{margin: 10}}>Records not found</p>
                                            </div>
                                :
                                <>
                                    <div style={{
                                        padding: 15,
                                        borderBottomColor: '#999',
                                        borderBottomWidth: 1
                                    }}>
                                        {!props.isDownloadbutton && Buttons()}
                                    </div>
                                    {props.isLoading === true ?

                                        <div className="card-footer flex flex-column p-16">
                                            <CircularStatic />
                                        </div>
                                        :
                                        props.documents && props.documents.length > 0 ?
                                            <TableContainer component={Paper}>
                                                <Table stickyHeader className={classes.table} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                <GreenCheckbox
                                                                    checked={checked}
                                                                    onChange={handleAllSelect}
                                                                />

                                                            </TableCell>
                                                            <TableCell>User</TableCell>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell>Attachment</TableCell>
                                                            {!props.isDownloadbutton && <TableCell>Action</TableCell>}

                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            props.documents.map((item, index) => {

                                                                let isCheck = selectedDoc.find(x => x.id === item.id);
                                                                var inputDate = new Date(item.curr_date);
                                                                var todaysDate = new Date();
                                                                let isDelete = false;
                                                                if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                                                                    // Date equals today's date
                                                                    isDelete = true;
                                                                }
                                                                return (
                                                                    <TableRow className={classes.tableRow}>
                                                                        <TableCell className={classes.tableCell}>
                                                                            <GreenCheckbox
                                                                                checked={isCheck ? true : false}
                                                                                onChange={() => {handleSingle(item)}}
                                                                            />

                                                                        </TableCell>
                                                                        <TableCell className={classes.tableCell}>
                                                                            {item.tran_user ? item.tran_user.displayname : "-"}</TableCell>

                                                                        <TableCell className={classes.tableCell} style={{cursor: 'pointer'}}>
                                                                            {item.curr_date}
                                                                        </TableCell>
                                                                        <TableCell className={classes.tableCell} component="th" scope="row">
                                                                            <p style={{cursor: 'pointer', color: '#225de6'}}//,225de6
                                                                                onClick={(e) => openDocDialog(e, item)}
                                                                            >{item.documnet_name ? item.documnet_name : '-'}</p>
                                                                        </TableCell>
                                                                        {
                                                                            !props.isDownloadbutton &&

                                                                            <TableCell className={classes.tableCell}>
                                                                                {
                                                                                    userData && userData.data.userId === item.user_id ?
                                                                                        isDelete ?
                                                                                            <IconButton aria-label="delete" className={classes.margin}>
                                                                                                <DeleteIcon />
                                                                                            </IconButton>
                                                                                            : '-'
                                                                                        : '-'
                                                                                }

                                                                            </TableCell>
                                                                        }



                                                                    </TableRow>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            : <p style={{margin: 10}}>Records not found</p>}
                                </>
                        }

                    </div>
                    :
                    <Dialog
                        classes={{
                            paper: 'm-24 rounded-8'
                        }}
                        onClose={onCloseDoc}
                        open={props.isDocOpen}
                        fullWidth
                        maxWidth="md"
                    >
                        <AppBar position="static" elevation={1}>
                            <Toolbar className="flex w-full">
                                <Typography variant="subtitle1" color="inherit">
                                    Acc# {props.access_no}
                                </Typography>
                                <IconButton onClick={onCloseDoc} className={classes.closeIcon} >
                                    <CancelIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>



                        <TableContainer component={Paper}>
                            <div style={{
                                padding: 15, borderBottomColor: '#999',
                                borderBottomWidth: 1
                            }}>

                                {!props.isDownloadbutton && Buttons()}

                            </div>
                            {isLoading === true ?

                                <div className="card-footer flex flex-column p-16">
                                    <CircularStatic />
                                </div>
                                :
                                documents.length > 0 ?
                                    <Table stickyHeader className={classes.table} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <GreenCheckbox
                                                        checked={checked}
                                                        onChange={handleAllSelect}
                                                    />

                                                </TableCell>
                                                <TableCell>User</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Attachment</TableCell>
                                                <TableCell>Action</TableCell>

                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {
                                                documents.map((item, index) => {
                                                    let isCheck = selectedDoc.find(x => x.id === item.id);
                                                    var inputDate = new Date(item.curr_date);
                                                    var todaysDate = new Date();
                                                    let isDelete = false;
                                                    if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                                                        // Date equals today's date
                                                        isDelete = true;
                                                    }
                                                    // if (isPresent > -1) {
                                                    return (
                                                        <TableRow className={classes.tableRow}>
                                                            <TableCell className={classes.tableCell}>
                                                                <GreenCheckbox
                                                                    checked={isCheck ? true : false}
                                                                    onChange={() => {handleSingle(item)}}
                                                                />

                                                            </TableCell>
                                                            <TableCell className={classes.tableCell}>
                                                                {item.tran_user ? item.tran_user.displayname : "-"}</TableCell>

                                                            <TableCell className={classes.tableCell} style={{cursor: 'pointer'}}>
                                                                {item.curr_date}
                                                            </TableCell>
                                                            <TableCell className={classes.tableCell} component="th" scope="row">
                                                                <p style={{cursor: 'pointer', color: '#225de6'}}
                                                                    onClick={(e) => openDocDialog(e, item)}
                                                                >{item.documnet_name ? item.documnet_name : '-'}</p>
                                                            </TableCell>

                                                            <TableCell className={classes.tableCell}>
                                                                {
                                                                    userData && userData.data.userId === item.user_id ?
                                                                        isDelete ?
                                                                            <IconButton aria-label="delete" className={classes.margin}>
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                            : '-'
                                                                        : '-'
                                                                }

                                                            </TableCell>



                                                        </TableRow>
                                                    )
                                                    // } else {
                                                    //     return null;
                                                    // }
                                                })
                                            }
                                        </TableBody>

                                    </Table>
                                    : <p style={{margin: 10}}>Records not found</p>}
                        </TableContainer>

                    </Dialog>
            }
            {/* </DialogContent> */}
            <Dialog
                classes={{
                    paper: 'm-24 rounded-8'
                }}
                onClose={onCloseDialog}
                open={isOpenDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="alert-dialog-title">{doc ? doc.docName : ''}</DialogTitle>

                <IconButton onClick={onCloseDialog} className={classes.closeIcon} >
                    <CancelIcon />
                </IconButton>
                {
                    doc &&

                    <>

                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {doc.fileExt === 'pdf' ? <iframe src={doc.fileUrl} width="900" height="400"></iframe> :
                                    <div style={{textAlign: "center"}}>
                                        <img style={{display: "inline", height: "auto"}} src={doc.fileUrl} />

                                    </div>}

                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        </DialogActions>
                    </>
                }
            </Dialog>
            {
                isOpenFax &&
                <>
                    <PatientAccessDialog />
                    <PatientAccessPrintDialog />
                </>
            }


        </>
    );
}



import React, {useState, useRef, useEffect} from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import {makeStyles} from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AWS from 'aws-sdk'
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CancelIcon from "@material-ui/icons/Cancel";
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {openPreivewDialog} from '../../main/apps/profile/store/ProfileSlice';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {getAllAudit} from '../../main/apps/profile/store/ProfileSlice';
import awsService from 'app/services/awsService';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {getAllDocuments, getFaxageCred, sendFax} from '../../main/apps/profile/store/ProfileSlice';

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
        // minWidth: 650,
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

export const AuditPreview = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles(props);
    const pageLayout = useRef(null);
    const routeParams = useParams();
    const [checked, setChecked] = React.useState(false);
    const [userData, setUserData] = useState(null);
    const [doc, setDoc] = useState(null);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [openDoc, setOpenDoc] = useState(false);
    const [selectedAudit, setSelectedAudit] = useState([]);
    const [base64Files, setBase64Files] = useState([]);

    const [audit, setAudit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [audits, setAudits] = useState([]);
    const [faxNumber, setFaxNumber] = useState('');
    const [showFaxField, setFaxField] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState([]);
    const [faxObject, setFaxObject] = useState(null);
    const [fetchingFiles, setFetchingFiles] = useState(false)

    const CustomNotify = useCustomNotify();

    const {exam_id} = routeParams
    // const uploadCred = useSelector(({profilePageApp}) => profilePageApp.profile.uploadCred);

    let S3_BUCKET = 'pomrisdev';
    const REGION = 'us-east-1';

    var myBucket = new AWS.S3({
        params: {Bucket: S3_BUCKET},
        region: REGION,
    })

    useEffect(() => {

        const user = awsService.getUserDetail();
        setUserData(user)
        if (props.isGrid) {
            fetchAllDocuments()
        }
    }, [])

    const fetchAllDocuments = async () => {
        setIsLoading(true)
        const data = {
            exam_id: props.exam_id
        }
        const result = await dispatch(getAllAudit(data))
        if (result.payload) {
            if (props.isGrid) {
                setAudits(result.payload.data.data)
            } else {
                props.setAudits(result.payload.data.data)
            }
        }
        setIsLoading(false)
    }

    let lengthIndex;
    if (!props.isGrid) {
        if ((props.exam)) {
            if (props.audits.length > 0) {
                lengthIndex = props.audits.length;
            }
        }
    } else {
        if ((audits)) {
            if (audits.length > 0) {
                lengthIndex = audits.length;
            }
        }
    }
    if (props.s3Cred) {
        AWS.config.update({
            accessKeyId: props.s3Cred.plainKeyText,
            secretAccessKey: props.s3Cred.plainSecretText
        });
        S3_BUCKET = props.s3Cred.bucket;
    }

    const handleAllSelect = (e) => {
        setChecked(e.target.checked)
        if (!props.isGrid) {
            if (e.target.checked === true) {

                let tempDocs = [];
                let tempFiles = [];
                props.audits.map((item, index) => {
                    tempDocs.push(item.id)
                    if (item.tran_attachment) {
                        tempFiles.push(item)
                    }
                    return 0;
                })
                setSelectedDoc(tempFiles)
                setSelectedAudit(tempDocs)
            } else {
                setSelectedAudit([])
            }
        } else {
            if (e.target.checked === true) {

                let tempDocs = [];
                let tempFiles = [];
                audits.map((item, index) => {
                    tempDocs.push(item.id)
                    if (item.tran_attachment) {
                        tempFiles.push(item)
                    }
                    return 0;
                })
                setSelectedDoc(tempFiles)
                setSelectedAudit(tempDocs)
            } else {
                setSelectedAudit([])
            }
        }
    }

    const onCloseDialog = () => {
        setIsOpenDialog(false)
    }
    let handleSingle = (doc) => {
        let temp2 = JSON.parse(JSON.stringify(selectedAudit));
        let temp3 = JSON.parse(JSON.stringify(selectedDoc));
        let index = temp2.indexOf(doc.id);
        if (index > -1) {
            // var tempd = temp2.splice(index, 1);
            var tempd = temp2.filter(function (ele) {
                return ele != doc.id;
            });
            var tempd1 = temp3.filter(function (ele) {
                return ele != doc.id;
            });
            if (doc.tran_attachment) {
                setSelectedDoc([...tempd1])
            }
            setSelectedAudit([...tempd])
        } else {
            if (doc.tran_attachment) {
                setSelectedDoc([...selectedDoc, doc])
            }

            setSelectedAudit([...selectedAudit, doc.id])
        }
    }
    let handleDownload = doc => {
        let link = doc.tran_attachment.image_link
        if (link) {
            let linkArr = link.split('.')
            let bucketArr = linkArr[0].split('/')
            let s3bucket = bucketArr[2];
            let ext = linkArr[4].split('?');
            let s3key = linkArr[3].substring(4, linkArr[3].length - 1) + "." + ext[0];
            let s33key = s3key.split('/');
            let username = doc.tran_user ? doc.tran_user.displayname : "";
            let filename = username + '_' + doc.date_time + "." + ext[0];
            try {
                let finalKey = s33key[0] + '/' + doc.tran_attachment.attachment
                let url = filename;// doc.link
                // let urlArray = url.split("/")
                // let bucket = urlArray[3]
                // let key = `${urlArray[4]}/${urlArray[5]}`
                let s3 = new AWS.S3({params: {Bucket: s3bucket}})
                let params = {Bucket: s3bucket/* "pomrisdev"*/, Key: finalKey}// "ris/upload_technician/2402_195_2021-07-22 08:04:54_234.jpeg"

                s3.getObject(params, (err, data) => {
                    if (data) {
                        let blob = new Blob([data.Body], {type: data.ContentType});
                        let link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = url;
                        link.click();
                    } else {
                        CustomNotify("The specified key does not exist. " + filename, "error");
                        // CustomNotify("The specified key does not exist. " + filename, "error");
                    }
                })
            } catch (ex) {


                console.log("ex", ex)
            }
        }
    }
    const handlePrint = () => {
        if (selectedAudit.length > 0) {
            var content = document.getElementById("printArea");
            var w = window.open();
            w.document.write('<html><head><title></title><style>* {color: #fff} img {display:none} .no-print{display:none;} .font-bold{font-size: 18px; font-weight: bold;} @media print{ * {color: #000 } .print-card{padding-bottom: 10px; border-bottom: 1px solid #000} img {display:block; max-width: 100%}}			</style></head><body>');
            w.document.write(content.innerHTML);
            w.document.write('</body></html>');
            w.print();
            w.close();
        }
    }
    const handlFax = () => {
        setIsSubmit(true)
        // faxObject.faxNumber = faxNumber;
        sendDocumentFax(selectedDoc)
        setIsSubmit(false)

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
        const result1 = await dispatch(getFaxageCred());
     
        const faxCred1 = result1.payload.data.data;
        const data = {
            username: faxCred1.username,
            password: faxCred1.password,
            callerid: faxCred1.centername,
            faxno: faxNumber,
            recipname: faxCred1.recipName,
            operation: 'sendfax',
            tagname: faxCred1.tagname,
            url_notify: 'https://dhb8twzrwj.execute-api.us-east-1.amazonaws.com/Prod/savefaxData?type=4',
            tagnumber: faxCred1.tagnumber,
            faxfilenames: files

        }
        const result = await dispatch((sendFax(data)));
        setIsSubmit(false)
    }
    const getFileUrl = (doc) => {
        setFetchingFiles(true)
        if (doc.length > 0) {
            let tempBase64 = []
            doc.map((item, index) => {
                let link = item.tran_attachment.image_link
                if (link) {
                    let linkArr = link.split('.')
                    let bucketArr = linkArr[0].split('/')
                    let s3bucket = bucketArr[2];
                    let ext = linkArr[4].split('?');
                    let s3key = linkArr[3].substring(4, linkArr[3].length - 1) + "." + ext[0];
                    let s33key = s3key.split('/');
                    let username = item.tran_user ? item.tran_user.displayname : "";
                    let filename = username + '_'+ item.date_time + "." + ext[0];
                    try {
                        let finalKey = s33key[0] + '/' + item.tran_attachment.attachment
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
    const sendDocumentFax = async (docs) => {
        try {


            const urls = getFileUrl(docs)
            return 0

        } catch (ex) {
            console.log("ex", ex)
        }
    }
    const openAuditDialog = (e, doc) => {
        const data = {
            fileUrl: doc.image_link,
            fileExt: doc.image_link.split('.')[1],
            docName: doc.documnet_name,
        };
        setAudit(data)
        // dispatch(openPreivewDialog(data))
        setIsOpenDialog(true)
    }

    const onCloseAudit = () => {
        setOpenDoc(false)
        props.closeDocument()
    }

    const onOpen = () => {
        setOpenDoc(false)
    }
    function getStatusText(status, status_insert) {
        return ' ' + status;
    }

    const createFullPostMarkup = (status, status_insert) => {
        return {__html: getStatusText(status, status_insert)}
    }

    const handleDownloadFax = (type) => {
        let tempdata = []

        let data = {
            key: type === 1 ? 'download' : 'fax',
            ids: selectedDoc
        }
        if (type === 1) {
            if (selectedDoc.length > 0) {
                selectedDoc.map((item, index) => {
                    handleDownload(item)
                    return 0
                })
            }
            setIsSubmit(true)
            setIsSubmit(false)
        } else {

            setFaxObject(data)
            setFaxField(true)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
        }}>

            {
                !props.isGrid ?
                    <div style={{width: '100%'}}>
                          <div style={{
                                    padding: 15,
                                    borderBottomColor: '#999',
                                    borderBottomWidth: 1
                                }}>
                                    {
                                        showFaxField ?
                                            <div style={{disply: 'flex', justifyContent: 'center',flexDirection:'row', width: '50%'}}>
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
                                                    onClick={handlFax}
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
                                                    disabled={selectedDoc.length === 0}
                                                    onClick={() => handleDownloadFax(2)}
                                                >
                                                    Fax
                                                </Button>
                                            </>
                                    }
                                    {
                                        !showFaxField &&
                                        <>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                onClick={handlePrint}
                                                style={{marginLeft: 10}}
                                                disabled={selectedAudit.length === 0}
                                            >
                                                Print
                                            </Button>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={checked}
                                                        onChange={(e) => handleAllSelect(e)}
                                                        color="primary"
                                                        style={{
                                                        }}
                                                    />
                                                }
                                                label="Select All"
                                                style={{marginLeft: 10}}
                                            />
                                        </>
                                    }
                                </div>

                        {props.isLoading === true ?
                            <div className="card-footer flex flex-column p-16">
                                <CircularStatic />
                            </div>
                            :
                            <FuseScrollbars className="flex flex-1 overflow-y-auto max-h-640">
                                <iframe id={"ifmcontentstoprint"} style={{height: 0, width: 0, position: 'absolute'}}></iframe>
                                <div style={{width: '95%', display: 'flex',/* alignItems: 'center',*/ flexDirection: 'column'}}>

                                    <div id={'printArea'}>
                                        {props.audits && props.audits.length > 0 ?
                                            props.audits.map((audit) => {
                                                let isCheck = selectedAudit.find(x => x === audit.id);
                                                return (
                                                    <Card key={audit.id} style={{width: '100%', padding: 5}} className={isCheck ? "m-16 overflow-hidden rounded-8 print-card" : "m-16 overflow-hidden rounded-8 no-print"}>
                                                        <Typography className={classes.indexing}>
                                                            #{lengthIndex--}
                                                        </Typography>
                                                        <CardHeader
                                                            avatar={<Avatar className={'no-print'} aria-label="Recipe" src={audit.tran_user && audit.tran_user.profile_image} />}
                                                            classes={{
                                                                avatar: classes.avatarPos,
                                                            }}
                                                            action={
                                                                <>
                                                                    <Checkbox
                                                                        checked={isCheck ? true : false}
                                                                        onChange={() => handleSingle(audit)}
                                                                        color="primary"
                                                                        className={'no-print'}
                                                                    />
                                                                    <IconButton aria-label="more" className={'no-print'}>
                                                                        <Icon>more_vert</Icon>
                                                                    </IconButton>
                                                                </>
                                                            }
                                                            title={
                                                                <span className="flex">
                                                                    <Typography className="font-medium font-bold" color="primary" paragraph={false}>
                                                                        {`${audit.tran_user ? audit.tran_user.displayname : audit.uploadedy_user ? audit.uploadedy_user.lastname + ', ' + audit.uploadedy_user.firstname : ''}`}
                                                                    </Typography>
                                                                    <span className="mx-4" dangerouslySetInnerHTML={createFullPostMarkup(audit.status, audit.status_insert)} />
                                                                </span>
                                                            }
                                                            subheader={audit.date_time}
                                                        />
                                                        <CardContent className="py-0">
                                                            {audit.comment && (
                                                                <Typography component="p" className="mb-16">
                                                                    {audit.comment}
                                                                </Typography>
                                                            )}
                                                            <div className="flex justify-center cursor-pointer" onClick={(e) => openAuditDialog(e, audit.tran_attachment)}>
                                                                {audit.tran_attachment && <img style={{maxHeight: '400px'}} src={audit.tran_attachment.image_link} alt="Attached document" />}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })
                                            : <p style={{margin: 10}}>Records not found</p>
                                        }
                                    </div>
                                </div>
                            </FuseScrollbars>

                        }
                    </div>
                    :
                    <Dialog
                        classes={{
                            paper: 'm-24 rounded-8'
                        }}
                        onClose={onCloseAudit}
                        open={props.isAuditOpen}
                        fullWidth
                        maxWidth="md"
                    // fullWidth
                    >
                        <AppBar position="static" elevation={1}>
                            <Toolbar className="flex w-full">
                                <Typography variant="subtitle1" color="inherit">
                                    Acc# {props.access_no}
                                </Typography>
                                <IconButton onClick={onCloseAudit} className={classes.closeIcon} >
                                    <CancelIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>


                        <div style={{width: '100%'}}>
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'flex-end',
                                padding: 20,
                                borderBottomColor: '#999',
                                borderBottomWidth: 1
                            }}>
                                <div style={{
                                    padding: 15,
                                    borderBottomColor: '#999',
                                    borderBottomWidth: 1
                                }}>
                                    {
                                        showFaxField ?
                                            <div style={{disply: 'flex', justifyContent: 'center',flexDirection:'row', width: '100%'}}>
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
                                                    onClick={handlFax}
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
                                                    disabled={selectedDoc.length === 0}
                                                    onClick={() => handleDownloadFax(2)}
                                                >
                                                    Fax
                                                </Button>
                                            </>
                                    }
                                    {
                                        !showFaxField &&
                                        <>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                onClick={handlePrint}
                                                style={{marginLeft: 10}}
                                                disabled={selectedAudit.length === 0}
                                            >
                                                Print
                                            </Button>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={checked}
                                                        onChange={(e) => handleAllSelect(e)}
                                                        color="primary"
                                                        style={{
                                                        }}
                                                    />
                                                }
                                                label="Select All"
                                                style={{marginLeft: 10}}
                                            />
                                        </>
                                    }
                                </div>




                            </div>
                            {isLoading === true ?

                                <div className="card-footer flex flex-column p-16">
                                    <CircularStatic />
                                </div>
                                :
                                <FuseScrollbars className="flex flex-1 overflow-y-auto max-h-640">
                                    <iframe id={"ifmcontentstoprint"} style={{height: 0, width: 0, position: 'absolute'}}></iframe>
                                    <div style={{width: '95%', display: 'flex',/* alignItems: 'center',*/ flexDirection: 'column'}}>

                                        <div id={'printArea'}>
                                            {audits && audits.length > 0 ?
                                                audits.map((audit, index) => {
                                                    let isCheck = selectedAudit.find(x => x === audit.id);

                                                    return (
                                                        <Card key={audit.id} style={{width: '100%', padding: 5}} className={isCheck ? "m-16 overflow-hidden rounded-8 print-card" : "m-16 overflow-hidden rounded-8 no-print"}>
                                                            <Typography className={classes.indexing}>
                                                                #{lengthIndex--}
                                                            </Typography>
                                                            <CardHeader
                                                                avatar={<Avatar className={'no-print'} aria-label="Recipe" src={audit.tran_user && audit.tran_user.profile_image} />}
                                                                classes={{
                                                                    avatar: classes.avatarPos,
                                                                }}
                                                                action={
                                                                    <>
                                                                        <Checkbox
                                                                            checked={isCheck ? true : false}
                                                                            onChange={() => handleSingle(audit)}
                                                                            color="primary"
                                                                            className={'no-print'}
                                                                        />
                                                                        <IconButton aria-label="more" className={'no-print'}>
                                                                            <Icon>more_vert</Icon>
                                                                        </IconButton>
                                                                    </>
                                                                }
                                                                title={
                                                                    <span className="flex">
                                                                        <Typography className="font-medium font-bold" color="primary" paragraph={false}>
                                                                            {`${audit.tran_user ? audit.tran_user.displayname : audit.uploadedy_user ? audit.uploadedy_user.lastname + ', ' + audit.uploadedy_user.firstname : ''}`}
                                                                        </Typography>
                                                                        <span className="mx-4" dangerouslySetInnerHTML={createFullPostMarkup(audit.status, audit.status_insert)} />
                                                                    </span>
                                                                }
                                                                subheader={audit.date_time}
                                                            />
                                                            <CardContent className="py-0">
                                                                {audit.comment && (
                                                                    <Typography component="p" className="mb-16">
                                                                        {audit.comment}
                                                                    </Typography>
                                                                )}
                                                                <div className="flex justify-center cursor-pointer" onClick={(e) => openAuditDialog(e, audit.tran_attachment)}>
                                                                    {audit.tran_attachment && <img style={{maxHeight: '400px'}} src={audit.tran_attachment.image_link} alt="Attched document" />}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )
                                                })
                                                :
                                                <p style={{margin: 10}}>Records not found</p>
                                            }
                                        </div>
                                    </div>
                                </FuseScrollbars>

                            }
                        </div>

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
                    audit &&

                    <>

                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {audit.fileExt === 'pdf' ? <iframe src={audit.fileUrl} width="900" height="400"></iframe> :
                                    <div style={{textAlign: "center"}}>
                                        <img style={{display: "inline", height: "auto"}} src={audit.fileUrl} />

                                    </div>}

                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        </DialogActions>
                    </>
                }
            </Dialog>

        </div>
    );
}



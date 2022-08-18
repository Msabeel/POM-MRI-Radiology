import React, {useState, useRef, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import reducer from './store';
import {getAllDocuments} from './store/documentAttachSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {openPreivewDialog} from '../profile/store/ProfileSlice';
import Visibility from '@material-ui/icons/Visibility';

import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CancelIcon from "@material-ui/icons/Cancel";
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AWS from 'aws-sdk'
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import {getUploadCred} from '../profile/store/ProfileSlice';

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
	},
});

function DocumentAttach(props) {
	const dispatch = useDispatch();
	const CustomNotify = useCustomNotify();

	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
	const [documents, setDocuments] = useState([]);
	const [selectedDoc, setSelectedDoc] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmit, setIsSubmit] = useState(false);
	const [checked, setChecked] = React.useState(false);
	const [showFaxField, setFaxField] = useState(false);
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const [faxObject, setFaxObject] = useState(null);
	const [faxNumber, setFaxNumber] = useState('');
	const [userData, setUserData] = useState(null);
	const [doc, setDoc] = useState(null);
	const {exam_id} = routeParams


	useEffect(() => {
		const user = awsService.getUserDetail();
		setUserData(user)
		fetchAllDocuments();
	}, [])

	useEffect(() => {
        async function fetchCred() {
            const result = await dispatch(getUploadCred())
            AWS.config.update({
                accessKeyId: result.payload.data.plainKeyText,
                secretAccessKey: result.payload.data.plainSecretText
            });
        }
        fetchCred();
    }, []);
	const fetchAllDocuments = async () => {
		setIsLoading(true)
		const data = {
			exam_id: exam_id
		}
		const result = await dispatch(getAllDocuments(data))
		if (result.payload) {
			setDocuments(result.payload.data.data)
		}
		setIsLoading(false)

	}
	const handleAllSelect = (e) => {
		setChecked(e.target.checked)

		if (e.target.checked === true) {
			let tempDocs = []


			documents.map((item, index) => {
				tempDocs.push(item)
				return 0;
			})
			setSelectedDoc(tempDocs)
		} else {
			setSelectedDoc([])
		}

	}


	let handleSingle = (doc) => {
		let temp2 = JSON.parse(JSON.stringify(selectedDoc));
		// let index = temp2.indexOf(doc);
		var tempIndex = temp2.filter(function (ele) {
			return ele.id == doc.id;
		});

		if (tempIndex.length > 0) {
			// var tempd = temp2.splice(index, 1);
			var tempd = temp2.filter(function (ele) {
				return ele.id != doc.id;
			});
			setSelectedDoc([...tempd])
		} else {
			setSelectedDoc([...selectedDoc, doc])
		}
	}

	let handleDownload = doc => {
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
					}
				})
			} catch (ex) {


				console.log("ex", ex)
			}
		}
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
	const handlFax = () => {
		setIsSubmit(true)

		faxObject.faxNumber = faxNumber;
		setIsSubmit(false)

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

	return (
		<>

			<Dialog
				onClose={() => {
					setDocumentDialogOpen(false)
				}}
				fullWidth={true}
				fullScreen={true}
				maxWidth={'md'}
				aria-labelledby="simple-dialog-title"
				className="p-15" open={true}>
				<AppBar position="static" elevation={1}>
					<Toolbar className="flex w-full">
						<Typography variant="subtitle1" color="inherit">
							Acc# {exam_id}
						</Typography>
					</Toolbar>
				</AppBar>
				{/* <DialogTitle id="simple-dialog-title">Documents</DialogTitle> */}
				<div style={{padding: 15}}>
					{
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
									Fax
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
				</div>

				{/* <DialogContent className="justify-center p-8"> */}
				<TableContainer component={Paper}>
					<Table stickyHeader className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>
									<Checkbox
										checked={checked}
										onChange={handleAllSelect}
										color="primary"
									/>
								</TableCell>
								<TableCell className={classes.tableCell}>
									Sr. No.
								</TableCell>
								<TableCell>User</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Attachments</TableCell>
								<TableCell>Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isLoading === true ?
								<div style={{margin: 10}}>
									<CircularProgress size={18} />
								</div>
								:
								documents.length > 0 ?
									documents.map((item, index) => {
										let isCheck = selectedDoc.find(x => x.id === item.id);
										var inputDate = new Date(item.curr_date);
										var todaysDate = new Date();
										let isDelete = false;
										if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
											// Date equals today's date
											isDelete = true;
										}
										let count = index + 1;
										return (
											<TableRow className={classes.tableRow}>
												<TableCell className={classes.tableCell}>
													<Checkbox
														checked={isCheck ? true : false}
														onChange={() => {handleSingle(item)}}
														color="primary"
														inputProps={{'aria-label': 'secondary checkbox'}}
													/>
												</TableCell>

												<TableCell className={classes.tableCell} component="th" scope="row">
													{count}
												</TableCell>
												{/* <TableCell className={classes.tableCell} style={{cursor: 'pointer'}}>
													<Visibility
														onClick={(e) => openDocDialog(e, item)} />
												</TableCell> */}
												<TableCell className={classes.tableCell}>{item.tran_user ? item.tran_user.displayname : '-'}</TableCell>

												<TableCell className={classes.tableCell} component="th" scope="row">

													<p style={{cursor: 'pointer', color: '#61dafb'}}
														onClick={(e) => openDocDialog(e, item)}
													>	{item.documnet_name ? item.documnet_name : '-'}</p>
												</TableCell>
												<TableCell className={classes.tableCell}>{item.curr_date}</TableCell>
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
									})
									:
									<p style={{margin: 10}}>Records not found</p>
							}


						</TableBody>
					</Table>
				</TableContainer>


				{/* </DialogContent> */}
			</Dialog>

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

		</>
	);
}

export default withReducer('documentAttach', reducer)(DocumentAttach);

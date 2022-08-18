import Formsy from 'formsy-react';
import _ from '@lodash';
import { useForm } from '@fuse/hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeConfirmationDialog,
	generateReports, generateImages,
} from './store/patientPortalSlice';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function ConfirmationView(props) {
	const dispatch = useDispatch();
	const confirmationDialog = useSelector(({ patientPortalApp }) => patientPortalApp.patientPortal.confirmationDialog);
	const patientDetails = useSelector(({ patientPortalApp }) => patientPortalApp.patientPortal.patientDetails);
	const [downloadDetail, setDownloadDetail] = useState({});
	const [selectedExams, setSelectedExams] = useState([]);
	const [loading, setLoading] = useState(false);
    const initDialog = useCallback(async () => {
		if (confirmationDialog.data) {
			if(confirmationDialog.data.isDownloadReport) {
				const selectedExams = _.filter(patientDetails.Allexams, item => {
					return item.exam && confirmationDialog.data.examIDs.indexOf(item.exam_id) >= 0 && item.status == "rad final report"; 
				});
				setSelectedExams(selectedExams);
			}
			else {
				const selectedExams = _.filter(patientDetails.Allexams, item => {
					return item.exam && confirmationDialog.data.examIDs.indexOf(item.exam_id) >= 0; 
				});
				setSelectedExams(selectedExams);
			}
			setDownloadDetail({ ...confirmationDialog.data });
		}
	}, [confirmationDialog.data, setDownloadDetail]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (confirmationDialog.props.open) {
			initDialog();
		}
	}, [confirmationDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeConfirmationDialog());
	}

	async function handleSubmit(event) {
		setLoading(true);
		if(downloadDetail.isDownloadReport) {
			const result = await dispatch(generateReports(downloadDetail));
			if(!result.payload.data.error)
				window.open(result.payload.data, "_blank");
			else 
				dispatch(closeConfirmationDialog({error: 'Reports not available.'}));
		}
		else {
			const result = await dispatch(generateImages(downloadDetail));
			if(!result.payload.data.error)
				window.open(result.payload.data, "_blank");
			else 
				dispatch(closeConfirmationDialog({error: 'Images not available.'}));
		}
		setLoading(false);
		dispatch(closeConfirmationDialog({ isSuccess: true, isDownloadImage: downloadDetail.isDownloadImage}));
	}
	
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...confirmationDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Confirm Download
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                // onValidSubmit={handleSubmit}
                // ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						{downloadDetail.isDownloadReport && 
						<Typography variant="subtitle1" className="mb-16">
							You will be download reports for following exams have final reports.
						</Typography>}
						{downloadDetail.isDownloadImage && 
						<Typography variant="subtitle1" className="mb-16">
							Please click confirm to begin your download request. You will receive an email when all of your images are ready.
						</Typography>}
					</div>
					<div className="flex flex-col h-200 w-full">
						<div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
							<div className="ag-theme-alpine" style={ { height: '100%', width: '100%', lineHeight: '30px' } }>
								<AgGridReact 
									rowData={selectedExams} 
									pagination={true} 
									rowHeight={38}
									rowStyle={{ textAlign: 'left' }}>
									<AgGridColumn width={100} sortable={true} field="acc_number" headerName="Acc#"></AgGridColumn>
									<AgGridColumn width={200} sortable={true} field="exam" headerName="Exam"></AgGridColumn>
									<AgGridColumn width={110} sortable={true} field="scheduling_date" headerName="DOS"></AgGridColumn>
									<AgGridColumn sortable={true} field="status" headerName="Status"></AgGridColumn>
									{/* <AgGridColumn width={100} sortable={true} field="modality" headerName="Modality"></AgGridColumn>
									<AgGridColumn width={110} sortable={true} field="location" headerName="Location"></AgGridColumn> */}
								</AgGridReact>
							</div>
						</div>
					</div> 
				</DialogContent>	
					<DialogActions className="justify-end p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={closeComposeDialog}
							>
								Cancel
							</Button>
						</div>
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
								disabled={selectedExams.length === 0}
							>
								Confirm
								{loading && <CircularProgress className="ml-10" style={{ color: 'white' }} size={18}/>}
							</Button>
						</div>
					</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default ConfirmationView;

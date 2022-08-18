import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { Permissions } from 'app/config';
import { useDispatch, useSelector } from 'react-redux';
import { getDocument, getAllCity, setRecentSearchedPatient } from '../../../../app/main/apps/contacts/store/contactsSlice';
import { setImageData } from '../../../../app/main/apps/uploads-document/store/uploadDocumentSlice';
import PatientAccessDialog from 'app/fuse-layouts/shared-components/PatientAccessDialog';
import PatientAccessPrintDialog from 'app/fuse-layouts/shared-components/PatientAccessPrintDialog';
import {
	openPatientAccessDialog,
	openPatientAccessPrintPage,
	getRequestAlertsData,
	clearPatientAccessResponse
} from 'app/fuse-layouts/shared-components/quickPanel/store/dataSlice';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';

const useStyles = makeStyles(theme => ({
	layoutHeader: {
		height: 200,
		minHeight: 200,
		[theme.breakpoints.down('md')]: {
			height: 240,
			minHeight: 240
		}
	}
}));

function PatientAccessPage() {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const { accessid, name, tab } = useParams()
	const data = useSelector(({ quickPanel }) => quickPanel.data);
	const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);
	useEffect(() => {
		dispatch(openPatientAccessDialog({ id: accessid }));
	}, [accessid]);

	useEffect(() => {
		if(data && data.patientAccessResponse) {
			const { patientAccessResponse } = data;
			if(patientAccessResponse.maildata && patientAccessResponse.maildata.length > 0) {
				setOpenPatientAccessMailSent(true);
				//this api is used to get alerts of patients who are requesting additional access time on their patient portal
				//dispatch(getRequestAlertsData());
			}
			if(patientAccessResponse.PrintPage && patientAccessResponse.PrintPage.length > 0) {
				dispatch(openPatientAccessPrintPage(patientAccessResponse.PrintPage));
				//this api is used to get alerts of patients who are requesting additional access time on their patient portal
				//dispatch(getRequestAlertsData());
			}
			dispatch(clearPatientAccessResponse());
		}
	}, [data]);

	const handleClosePatientAccessMailSent = (event, reason) => {
		setOpenPatientAccessMailSent(false);
	};

	return (
		<>
			<FusePageSimple
				classes={{
					header: classes.layoutHeader,
					toolbar: 'px-16 sm:px-24'
				}}
				content={
					<div className="p-16 sm:p-24">
						<PatientAccessDialog />
					</div>
				}

			/>
			<PatientAccessPrintDialog />
			<SnackBarAlert snackOpen={openPatientAccessMailSent} onClose={handleClosePatientAccessMailSent} text="Patient portal access mail sent successfully." />
		</>
	);
}

export default withReducer('PatientAccessPageApp', reducer)(PatientAccessPage);


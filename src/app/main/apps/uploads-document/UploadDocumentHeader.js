import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, {useCallback, useEffect, useRef, useState, useDeepCompareEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { Link, useParams, useLocation } from 'react-router-dom';

function UploadDocumentHeader(props) {
	const dispatch = useDispatch();
	const mainTheme = useSelector(selectMainTheme);
	const {patient_id, name} = useParams();
	const location = useLocation();
	const { pathname } = location;
	const [patientId, setPatientId] = useState('');
	const examData = useSelector(({ uploadDocumentApp }) => uploadDocumentApp.uploadDocument.examData);
	useEffect(() => {
		if (examData && examData.length > 0) {
			setPatientId(examData[0].patient_id)
		}
	}, [examData]);

	return (
		<div className="flex flex-1 flex-col">
			<div className="p-12 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
					<div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
					<Hidden lgUp>
						<IconButton
							onClick={ev => {
								props.pageLayout.current.toggleLeftSidebar();
							}}
							aria-label="open left sidebar"
						>
							<Icon>menu</Icon>
						</IconButton>
					</Hidden>

						<FuseAnimate animation="transition.expandIn" delay={300}>
							<Icon className="text-32">cloud_upload</Icon>
						</FuseAnimate>
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography  variant="h6" className="mx-16 hidden sm:flex" >
								Upload  Document, {name}
							</Typography>
						</FuseAnimate>
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography  variant="h6" className="mx-16 hidden sm:flex" >
								{patientId}
							</Typography>
						</FuseAnimate>
					</div>
					{pathname.indexOf('uploads-document') >=0 &&(
					<div className="flex items-center justify-end">
						<Button to={`/apps/profile/${patient_id}/${name}/0`} component={Link} className="mx-8 normal-case" variant="contained" color="secondary" aria-label="Follow">
							Back
						</Button>
					</div>)}
				</div>

			
		</div>
	);
}

export default UploadDocumentHeader;

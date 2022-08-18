import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import React, {useEffect, useState, useRef} from 'react';
import {Link, useParams, useLocation} from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import {useDispatch, useSelector} from 'react-redux';
import {getDocument, setRecentSearchedPatient} from '../../../../app/main/apps/contacts/store/contactsSlice';
import {setImageData} from '../../../../app/main/apps/uploads-document/store/uploadDocumentSlice';
import PreviewDialog from './PreviewDialog';
import history from '@history';
import {setContactsSearchText} from '../contacts/store/contactsSlice';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import {setExamsForFax, setPatientInfo, removePatientInfo} from './store/ProfileSlice'
import {ProfileContent} from './profileContent';
const useStyles = makeStyles(theme => ({
	layoutHeader: {
		height: 100,
		minHeight: 100,
		[theme.breakpoints.down('md')]: {
			height: 150,
			minHeight: 150
		}
	}
}));

function ProfilePage() {
	const myref = useRef();
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const {id, name, tab} = useParams()
	const routeParams = useParams()
	const PatientInfoArr = useSelector(({profilePageApp}) => profilePageApp.profile.patientInfoArray);
	const [selectedAcc, setSelectedAcc] = useState([])
	const [tabedAcc, setTabedAcc] = useState('')
	const location = useLocation();
	const filterOptions = useSelector((state) => {
		if (state.contactsApp) {
			return state.contactsApp.contacts.filterOptions
		}
	});
	const [whereOperator, setWhereOperator] = React.useState('AND');
	const [selectedTab, setSelectedTab] = useState(+tab);
	const [isEmpty, setEmpty] = useState(false);
	const [patientData, setPatientData] = useState({
		document: null,
		exams: null,
		patientInfo: null,
		familysData: null,
		allCity: []
	});
	useEffect(() => {
		localStorage.setItem('routeParams', JSON.stringify(routeParams));
	}, [routeParams]);
	useEffect(() => {
		async function fetchPatientDocument() {
			const result = await dispatch(getDocument({patient_id: +id}));
			const data = result.payload.data
			dispatch(setExamsForFax(data.documnets))
			if (data.length == undefined && result.payload.data.familyData) {
				if (result.payload.data.familyData.length > 0) {
					let selfData = result.payload.data.familyData.find(x => x.id == id)// fine self data 
					result.payload.data.familyData.splice(result.payload.data.familyData.indexOf(selfData), 1)
				}
				const p_data = {...patientData, id: id, document: data.documnets, exams: data.documnets, patientInfo: data.patient_data, familysData: data.familyData, allCity: [], lastAudits: data.lastAudits, insuranceInfo: data.insuranceInfo, allAttorney: []}
				// Commented below line because called from eye icon from Patient lookup
				// dispatch(setRecentSearchedPatient({id: id}))
				dispatch(setPatientInfo(p_data))
				return setPatientData(p_data);
			}
			else {
				return setPatientData({...patientData, document: [], exams: [], patientInfo: {}, familysData: [], allCity: [], lastAudits: [], insuranceInfo: [], allAttorney: []});
			}

		}
		
			if (PatientInfoArr.length === 0 || PatientInfoArr === undefined || PatientInfoArr === null) {
				fetchPatientDocument();
			} else {
				let selectedPatient = PatientInfoArr.find(x => x.id === id);
				if (selectedPatient) {
					setPatientData(selectedPatient);
				}
				else {
					fetchPatientDocument();
				}
				// 
			}

		

	}, [id]);


	function handleTabChange(value, isCore = false) {
		if (isCore) {
			setSelectedTab(value);
		} else {
			setTabedAcc(value)

		}
	}


	useEffect(() => {
		const image = ''
		dispatch(setImageData(image))// clear image 
		if (filterOptions) {
			var fields = [];
			filterOptions.map((value, key) => {
				let row = {filedname: value.value, value: value.match, operator: ''};
				if (filterOptions.length > 1 && key == 0) {
					row.operator = ''
				}
				if (filterOptions.length > 1 && key > 0) {
					row.operator = whereOperator
				}
				if (value.type === 'date') {
					row.value = moment(row.value).format('YYYY-MM-DD')
				}
				fields.push(row);
			})
			let params = {fields: fields};
			dispatch(setContactsSearchText(params))
		}
	}, []);

	const handleSelectedAcc = (acc) => {
		var index = selectedAcc.indexOf(acc)
		var tempArr = selectedAcc;
		if (index === -1) {
			tempArr.push(acc)
			setSelectedAcc(tempArr);
			setEmpty(false)
		}
		history.push(location.pathname);
	}


	const handleCloseReturn = (data) => {
		setSelectedAcc(data);
	}
	return (
		<>
			<FusePageSimple
				classes={{
					header: classes.layoutHeader,
					toolbar: 'px-16 sm:px-24'
				}}
				header={
					<div className="flex flex-1 flex-col">
						{/* <div className="">
							<div className="flex items-center justify-start">
								<IconButton to="/apps/patient/all" component={Link}>
									<Icon>{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}</Icon>
								</IconButton>
								<Typography className="flex-1 text-20 mx-16">Back</Typography>
							</div>
						</div> */}
						<div className="p-12 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
							<div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">

								<FuseAnimate animation="transition.expandIn" delay={300}>
									<Avatar className="w-72 h-72" src="assets/images/avatars/profile.jpg" />
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography className="md:mx-24" variant="h4" color="inherit">
										{name}
									</Typography>
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography className="md:mx-12" variant="h4" color="inherit">
										{patientData.patientInfo && patientData.patientInfo.patient_id}
									</Typography>
								</FuseAnimate>
							</div>

							{/* <div className="flex items-center justify-end">
								<Button to="/apps/patient/all" component={Link} className="mx-8 normal-case" variant="contained" color="secondary" aria-label="Follow">
									Back
								</Button>
							</div> */}
						</div>

					</div>
				}
				// contentToolbar={
				// 	<ProfileTabs
				// 		selectedTab={selectedTab}
				// 		handleTabChange={handleTabChange}
				// 		selectedAcc={selectedAcc}
				// 		updateAcc={selectedAcc}
				// 		handleCloseReturn={handleCloseReturn}

				// 	/>
				// }
				content={
					<>

						<div>

							<ProfileContent
								tabedAcc={tabedAcc}
								patientData={patientData}
								selectedTab={selectedTab}
								selectedAcc={selectedAcc}
								handleSelectedAcc={handleSelectedAcc}
								tab={tab}
							/>

						</div>
					</>
				}

			/>
			<PreviewDialog />
		</>
	);
}

export default withReducer('profilePageApp', reducer)(ProfilePage);


import Formsy from 'formsy-react';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import _ from '@lodash';
import history from '@history';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import { Link } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '@fuse/hooks';
import { useParams, Prompt } from 'react-router-dom';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import moment from 'moment';
import {
	updateNavigationBlocked,
	getInsurancePageFormsData,
	getAttorney,
	getInsurancePageDataByPId,
	saveInsuranceData,
	openCommercialDialog,
	openCoverageDialog,
	openCoPayDialog,
	openDeductibleDialog,
	openReferenceDialog,
	openSICommercialDialog,
	openSICoverageDialog,
	openSICoPayDialog,
	openSIDeductibleDialog,
	openSIReferenceDialog,
	openTICommercialDialog,
	openTICoverageDialog,
	openTICoPayDialog,
	openTIDeductibleDialog,
	openTIReferenceDialog,
	openGIContactInfoDialog,
	openGIGeneralInfoDialog,
	openLOPCommercialDialog,
	openLOPCoverageDialog,
	openLOPCoPayDialog,
	openLOPDeductibleDialog,
	openLOPReferenceDialog,
	openLOPAttorneyDialog,
	openWorkersCommercialDialog,
	openWorkersCoverageDialog,
	openWorkersReferenceDialog,
	openAutoCommercialDialog,
	openAutoCoverageDialog,
	openAutoReferenceDialog,
	openAutoAttorneyDialog
} from './store/InsuranceInfoSlice';
import { getAllCity } from '../../../../app/main/apps/contacts/store/contactsSlice';
import CommercialInfoDialog from './CommercialInfo/CommercialInfoDialog';
import CoverageInfo from './CommercialInfo/CoverageInfo';
import CoPayInfo from './CommercialInfo/CoPayInfo';
import DeductibleInfo from './CommercialInfo/DeductibleInfo';
import ReferenceInfo from './CommercialInfo/ReferenceInfo';
import SICommercialInfoDialog from './SecondaryInsuInfo/CommercialInfoDialog';
import SICoverageInfo from './SecondaryInsuInfo/CoverageInfo';
import SICoPayInfo from './SecondaryInsuInfo/CoPayInfo';
import SIDeductibleInfo from './SecondaryInsuInfo/DeductibleInfo';
import SIReferenceInfo from './SecondaryInsuInfo/ReferenceInfo';
import TICommercialInfoDialog from './TertiaryInsuInfo/CommercialInfoDialog';
import TICoverageInfo from './TertiaryInsuInfo/CoverageInfo';
import TICoPayInfo from './TertiaryInsuInfo/CoPayInfo';
import TIDeductibleInfo from './TertiaryInsuInfo/DeductibleInfo';
import TIReferenceInfo from './TertiaryInsuInfo/ReferenceInfo';
import GeneralInfo from './GurantorInfo/GeneralInfo';
import ContactInfo from './GurantorInfo/ContactInfo';
import LOPCommercialInfoDialog from './LOPInfo/CommercialInfoDialog';
import LOPCoverageInfo from './LOPInfo/CoverageInfo';
import LOPCoPayInfo from './LOPInfo/CoPayInfo';
import LOPDeductibleInfo from './LOPInfo/DeductibleInfo';
import LOPReferenceInfo from './LOPInfo/ReferenceInfo';
import LOPAttorneyInfo from './LOPInfo/AttorneyInfo';
import WorkersCommercialInfoDialog from './WorkerInfo/CommercialInfoDialog';
import WorkersCoverageInfo from './WorkerInfo/CoverageInfo';
import WorkersReferenceInfo from './WorkerInfo/ReferenceInfo';
import AutoCommercialInfoDialog from './AutoInsuranceInfo/CommercialInfoDialog';
import AutoCoverageInfo from './AutoInsuranceInfo/CoverageInfo';
import AutoReferenceInfo from './AutoInsuranceInfo/ReferenceInfo';
import AutoAttorneyInfo from './AutoInsuranceInfo/AttorneyInfo';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import reducer from './store';

const AccordionSummary = withStyles({
	content: {
		margin: '0px !important'
	}
})(MuiAccordionSummary);

const useStyles = makeStyles(theme => ({
	selectedButton: {
		backgroundColor: 'rgb(76, 175, 80)',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80)',
		},
	},
	heading: {
		backgroundColor: '#192d3e',
		margin: '0px'
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
}));

const StyledToggleButton = withStyles({
	root: {
		lineHeight: '12px',
		letterSpacing: '0.25px',
		color: 'rgba(0, 0, 0, 0.87)',
		padding: '15px 15px',
		textTransform: 'none',
		borderColor: 'black',
		width: '100%',
		'&$selected': {
			backgroundColor: 'rgb(76, 175, 80)',
			fontWeight: 'bold',
			color: 'black',
			'&:hover': {
				backgroundColor: 'rgb(76, 175, 80)',
			},
		},
	},
	selected: {},
})(ToggleButton);

const StyledGroupButton = withStyles({
	root: {
		padding: '2px 30px',
		width: '100%',
	},
})(ToggleButtonGroup);

const NavigationBlocker = (props) => {
	if (props.navigationBlocked) {
		window.onbeforeunload = () => true
	} else {
		window.onbeforeunload = null
	}
	return (
		<Prompt
			when={props.navigationBlocked}
			message="Your data is unsaved. Are you sure you want to leave? "
		/>
	)
}

function InsuranceInfo(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { name, patient_id, id, exam_id } = useParams()
	const routeParams = useParams();
	const formRef = useRef(null);
	const { form, handleChange, setForm } = useForm({
		insurance_company_name1_name: '',
		secondary_insurance: 'No',
		tertairy_insurance: 'No'
	});
	const [attorney, setAttorney] = useState({ name: '', phone: '', address1: '', address2: '', att_email: '', att_notes: '' });
	const attorneyData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.attorneyData);
	const insuranceFormData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceFormData);
	const insuranceData = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.insuranceData);
	const isNavigationBlocked = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.isNavigationBlocked);
	const [filteredData, setFilteredData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isEdge, setEdgeBrowser] = useState(false)
	const [isFormValid, setIsFormValid] = useState(false);
	const [selectedExam, setSelectedExam] = useState(false);
	const [allCity, setAllCity] = useState([]);
	const [validationGroupErrors, setValidationGroupErrors] = useState([]);
	const [state, setState] = useState({
		selectedExam: []
	});
	const [insuranceType, setInsuranceType] = useState('');
	const [primaryType, setPrimaryType] = useState('panel1');
	const [validationErrors, setValidationErrors] = useState({});
	const CustomNotify = useCustomNotify();

	const commercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.commercialInfoDialog);
	const coverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.coverageInfoDialog);
	const coPayInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.coPayInfoDialog);
	const deductibleInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.deductibleInfoDialog);
	const referenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.referenceInfoDialog);

	const siCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.siCommercialInfoDialog);
	const siCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.siCoverageInfoDialog);
	const siCoPayInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.siCoPayInfoDialog);
	const siDeductibleInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.siDeductibleInfoDialog);
	const siReferenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.siReferenceInfoDialog);

	const tiCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiCommercialInfoDialog);
	const tiCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiCoverageInfoDialog);
	const tiCoPayInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiCoPayInfoDialog);
	const tiDeductibleInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiDeductibleInfoDialog);
	const tiReferenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.tiReferenceInfoDialog);

	const giGeneralInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.giGeneralInfoDialog);
	const giContactInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.giContactInfoDialog);

	const lopCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.lopCommercialInfoDialog);
	const lopCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.lopCoverageInfoDialog);
	const lopCoPayInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.lopCoPayInfoDialog);
	const lopDeductibleInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.lopDeductibleInfoDialog);
	const lopReferenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.lopReferenceInfoDialog);
	const lopAttorneyInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.lopAttorneyInfoDialog);

	const workersCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.workersCommercialInfoDialog);
	const workersCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.workersCoverageInfoDialog);
	const workersReferenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.workersReferenceInfoDialog);

	const autoCommercialInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoCommercialInfoDialog);
	const autoCoverageInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoCoverageInfoDialog);
	const autoReferenceInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoReferenceInfoDialog);
	const autoAttorneyInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.autoAttorneyInfoDialog);

	useEffect(() => {
		async function fetchAllCity() {
			const CityResult = await dispatch(getAllCity());
			setAllCity(CityResult.payload.data);
		}
		if (allCity.length === 0) {
			fetchAllCity();
		}
		if (Object.keys(insuranceFormData).length === 0) {
			dispatch(getInsurancePageFormsData());
		}
		if (attorneyData && attorneyData.length === 0) {
			dispatch(getAttorney());
		}
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (props.exam_id > 0 && id) {
			dispatch(getInsurancePageDataByPId({ exam_id: props.exam_id, patient_id: id }));
		}
	}, [props.exam_id, id]);

	// Commercial Insurance
	useEffect(() => {
		if (commercialInfoDialog.props.open === false) {
			setForm({ ...commercialInfoDialog.data });
		}
	}, [commercialInfoDialog.props.open]);

	useEffect(() => {
		if (coverageInfoDialog.props.open === false) {
			setForm({ ...coverageInfoDialog.data });
		}
	}, [coverageInfoDialog.props.open]);

	useEffect(() => {
		if (coPayInfoDialog.props.open === false) {
			setForm({ ...coPayInfoDialog.data });
			setIsFormValid(coPayInfoDialog.data.isFormValid);
			if (coPayInfoDialog.data.isFormValid === false) {
				setValidationGroupErrors([...validationGroupErrors, coPayInfoDialog.data.formName]);
			}
			else {
				removeFromValidationGroup(coPayInfoDialog.data.formName);
			}
		}
	}, [coPayInfoDialog.props.open]);

	useEffect(() => {
		if (deductibleInfoDialog.props.open === false) {
			setForm({ ...deductibleInfoDialog.data });
			setIsFormValid(deductibleInfoDialog.data.isFormValid);
			if (deductibleInfoDialog.data.isFormValid === false) {
				setValidationGroupErrors([...validationGroupErrors, deductibleInfoDialog.data.formName]);
			}
			else {
				removeFromValidationGroup(deductibleInfoDialog.data.formName);
			}
		}
	}, [deductibleInfoDialog.props.open]);

	useEffect(() => {
		if (referenceInfoDialog.props.open === false) {
			setForm({ ...referenceInfoDialog.data });
		}
	}, [referenceInfoDialog.props.open]);

	// Secondary Insurance
	useEffect(() => {
		if (siCommercialInfoDialog.props.open === false) {
			setForm({ ...siCommercialInfoDialog.data });
		}
	}, [siCommercialInfoDialog.props.open]);

	useEffect(() => {
		if (siCoverageInfoDialog.props.open === false) {
			setForm({ ...siCoverageInfoDialog.data });
		}
	}, [siCoverageInfoDialog.props.open]);

	useEffect(() => {
		if (siCoPayInfoDialog.props.open === false) {
			setForm({ ...siCoPayInfoDialog.data });
			setIsFormValid(siCoPayInfoDialog.data.isFormValid);
			if (siCoPayInfoDialog.data.isFormValid === false) {
				setValidationGroupErrors([...validationGroupErrors, siCoPayInfoDialog.data.formName]);
			}
			else {
				removeFromValidationGroup(siCoPayInfoDialog.data.formName);
			}
		}
	}, [siCoPayInfoDialog.props.open]);

	useEffect(() => {
		if (siDeductibleInfoDialog.props.open === false) {
			setForm({ ...siDeductibleInfoDialog.data });
		}
	}, [siDeductibleInfoDialog.props.open]);

	useEffect(() => {
		if (siReferenceInfoDialog.props.open === false) {
			setForm({ ...siReferenceInfoDialog.data });
		}
	}, [siReferenceInfoDialog.props.open]);

	function removeFromValidationGroup(formName) {
		const index = validationGroupErrors.indexOf(formName);
		if (index >= 0) {
			validationGroupErrors.splice(index, 1);
			setValidationGroupErrors([...validationGroupErrors]);
		}
	}

	// Tertiray Insurance
	useEffect(() => {
		if (tiCommercialInfoDialog.props.open === false) {
			setForm({ ...tiCommercialInfoDialog.data });
		}
	}, [tiCommercialInfoDialog.props.open]);

	useEffect(() => {
		if (tiCoverageInfoDialog.props.open === false) {
			setForm({ ...tiCoverageInfoDialog.data });
		}
	}, [tiCoverageInfoDialog.props.open]);

	useEffect(() => {
		if (tiCoPayInfoDialog.props.open === false) {
			setForm({ ...tiCoPayInfoDialog.data });
			setIsFormValid(tiCoPayInfoDialog.data.isFormValid);
			if (tiCoPayInfoDialog.data.isFormValid === false) {
				setValidationGroupErrors([...validationGroupErrors, tiCoPayInfoDialog.data.formName]);
			}
			else {
				removeFromValidationGroup(tiCoPayInfoDialog.data.formName);
			}
		}
	}, [tiCoPayInfoDialog.props.open]);

	useEffect(() => {
		if (tiDeductibleInfoDialog.props.open === false) {
			setForm({ ...tiDeductibleInfoDialog.data });
		}
	}, [tiDeductibleInfoDialog.props.open]);

	useEffect(() => {
		if (tiReferenceInfoDialog.props.open === false) {
			setForm({ ...tiReferenceInfoDialog.data });
		}
	}, [tiReferenceInfoDialog.props.open]);

	// Gurantor Insurance
	useEffect(() => {
		if (giContactInfoDialog.props.open === false) {
			setForm({ ...giContactInfoDialog.data });
		}
	}, [giContactInfoDialog.props.open]);

	useEffect(() => {
		if (giGeneralInfoDialog.props.open === false) {
			setForm({ ...giGeneralInfoDialog.data });
		}
	}, [giGeneralInfoDialog.props.open]);

	// LOP Insurance
	useEffect(() => {
		if (lopCommercialInfoDialog.props.open === false) {
			setForm({ ...lopCommercialInfoDialog.data });
		}
	}, [lopCommercialInfoDialog.props.open]);

	useEffect(() => {
		if (lopCoverageInfoDialog.props.open === false) {
			setForm({ ...lopCoverageInfoDialog.data });
		}
	}, [lopCoverageInfoDialog.props.open]);

	useEffect(() => {
		if (lopCoPayInfoDialog.props.open === false) {
			setForm({ ...lopCoPayInfoDialog.data });
			setIsFormValid(lopCoPayInfoDialog.data.isFormValid);
			if (lopCoPayInfoDialog.data.isFormValid === false) {
				setValidationGroupErrors([...validationGroupErrors, lopCoPayInfoDialog.data.formName]);
			}
			else {
				removeFromValidationGroup(lopCoPayInfoDialog.data.formName);
			}
		}
	}, [lopCoPayInfoDialog.props.open]);

	useEffect(() => {
		if (lopDeductibleInfoDialog.props.open === false) {
			setForm({ ...lopDeductibleInfoDialog.data });
		}
	}, [lopDeductibleInfoDialog.props.open]);

	useEffect(() => {
		if (lopReferenceInfoDialog.props.open === false) {
			setForm({ ...lopReferenceInfoDialog.data });
		}
	}, [lopReferenceInfoDialog.props.open]);

	useEffect(() => {
		if (lopAttorneyInfoDialog.props.open === false) {
			const attorney = attorneyData.find(c => c.id === parseInt(lopAttorneyInfoDialog.data.lop_attorney_name1));
			setAttorney(attorney);
			setForm({ ...lopAttorneyInfoDialog.data });
		}
	}, [lopAttorneyInfoDialog.props.open]);

	// Workers Insurance
	useEffect(() => {
		if (workersCommercialInfoDialog.props.open === false) {
			setForm({ ...workersCommercialInfoDialog.data });
		}
	}, [workersCommercialInfoDialog.props.open]);

	useEffect(() => {
		if (workersReferenceInfoDialog.props.open === false) {
			setForm({ ...workersReferenceInfoDialog.data });
		}
	}, [workersReferenceInfoDialog.props.open]);

	useEffect(() => {
		if (workersCoverageInfoDialog.props.open === false) {
			setForm({ ...workersCoverageInfoDialog.data });
			setIsFormValid(workersCoverageInfoDialog.data.isFormValid);
			if (workersCoverageInfoDialog.data.isFormValid === false) {
				setValidationGroupErrors([...validationGroupErrors, workersCoverageInfoDialog.data.formName]);
			}
			else {
				removeFromValidationGroup(workersCoverageInfoDialog.data.formName);
			}
		}
	}, [workersCoverageInfoDialog.props.open]);

	// Auto Insurance
	useEffect(() => {
		if (autoCommercialInfoDialog.props.open === false) {
			setForm({ ...autoCommercialInfoDialog.data });
		}
	}, [autoCommercialInfoDialog.props.open]);

	useEffect(() => {
		if (autoReferenceInfoDialog.props.open === false) {
			setForm({ ...autoReferenceInfoDialog.data });
		}
	}, [autoReferenceInfoDialog.props.open]);

	useEffect(() => {
		if (autoCoverageInfoDialog.props.open === false) {
			setForm({ ...autoCoverageInfoDialog.data });
			setIsFormValid(autoCoverageInfoDialog.data.isFormValid);
			if (autoCoverageInfoDialog.data.isFormValid === false) {
				setValidationGroupErrors([...validationGroupErrors, autoCoverageInfoDialog.data.formName]);
			}
			else {
				removeFromValidationGroup(autoCoverageInfoDialog.data.formName);
			}
		}
	}, [autoCoverageInfoDialog.props.open]);

	useEffect(() => {
		if (autoAttorneyInfoDialog.props.open === false) {
			const attorney = attorneyData.find(c => c.id === parseInt(autoAttorneyInfoDialog.data.attorney_name1));
			setAttorney(attorney);
			setForm({ ...autoAttorneyInfoDialog.data });
		}
	}, [autoAttorneyInfoDialog.props.open]);

	function removeFromValidationGroup(formName) {
		const index = validationGroupErrors.indexOf(formName);
		if (index >= 0) {
			validationGroupErrors.splice(index, 1);
			setValidationGroupErrors([...validationGroupErrors]);
		}
	}

	useEffect(() => {
		function setSelectedExam() {
			const selectedExam = [];
			insuranceData.insuranceData.map(item => {
				selectedExam.push(item.exam_id);
			});
			setState({ ...state, selectedExam: selectedExam })
		}
		if (insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			setSelectedExam();
		}
		if (insuranceData.insuranceData && insuranceData.insuranceData.length > 0) {
			let city_name = '', state_name = '', country_name = '';
			if (allCity.length > 0 && insuranceData.insuranceData[0].city_p > 0) {
				const cityObj = allCity.find(c => c.id === insuranceData.insuranceData[0].city_p);
				city_name = cityObj.name;
				state_name = cityObj.state_name;
				country_name = cityObj.country_name;
			}

			let formData = { 
				...insuranceData.insuranceData[0], 
				insurance_company_name1_name: insuranceData.companydata.insurance_company_name1,
				insurance_company_name2_name: insuranceData.companydata.insurance_company_name2,
				insurance_company_name3_name: insuranceData.companydata.insurance_company_name3,
				company_accident_name1_name: insuranceData.companydata.company_accident_name1,
				auto_insurance_company_name1_name: insuranceData.companydata.auto_insurance_company_name1,
				insurance_company_address1_name: insuranceData.companydata.insurance_company_address1,
				insurance_company_address2_name: insuranceData.companydata.insurance_company_address2,
				insurance_company_address3_name: insuranceData.companydata.insurance_company_address3,
				auto_insurance_company_address1_name: insuranceData.companydata.auto_insurance_company_address1,
				city_name,
				state_name,
				country_name
			};
			if(insuranceData.insuranceData[0].gurantor_p === "") {
				formData = {
					...formData,
					gurantor_p: 'Self',
					fname_p: insuranceData.patientdata.fname,
					lname_p: insuranceData.patientdata.lname,
					mname_p: insuranceData.patientdata.mname,
					dob_p: insuranceData.patientdata.dob,
					gender_p: insuranceData.patientdata.gender === 'F' ? 'female': insuranceData.patientdata.gender === 'M' ? 'male' : '',
					ssn_p: insuranceData.patientdata.ssn,
					address1_p: insuranceData.patientdata.address1,
					address2_p: insuranceData.patientdata.address2,
					city_p: insuranceData.patientdata.city,
					city_name: insuranceData.patientdata.city_name,
					state_p: insuranceData.patientdata.state,
					state_name: insuranceData.patientdata.state_name,
					country_p: insuranceData.patientdata.country,
					country_name: insuranceData.patientdata.country_name,
					zip_p: insuranceData.patientdata.zip,
					phone_p: insuranceData.patientdata.phone_home,
					mobile_p: insuranceData.patientdata.mobile,
					email_p: insuranceData.patientdata.email,
				}
			}

			setForm(formData);
			
			if(insuranceData.insuranceData[0].self_pay1 === "Yes") {
				setInsuranceType('Self Pay');
				setPrimaryType('Self Pay');
				setExpanded('Self Pay');
			}
			else if (insuranceData.insuranceData[0].company_accident1 === "Yes") {
				setInsuranceType("Worker's Compensation");
				setExpanded("Worker's Compensation");
			}
			else if (insuranceData.insuranceData[0].auto_accident1 === "Yes") {
				setInsuranceType('Auto Insurance');
				setExpanded('Auto Insurance');
			}
			else if (insuranceData.insuranceData[0].lop_accident1 === "Yes") {
				setInsuranceType('LOP');
				setExpanded('LOP');
			}
			else if (insuranceData.insuranceData[0].primary_insurance === "Yes") {
				setInsuranceType('Commercial Health Insurance');
				setExpanded('Commercial Health Insurance');
			}
		}
	}, [insuranceData, allCity]);

	useEffect(() => {
		if (insuranceData.insuranceData && insuranceData.insuranceData.length > 0 && attorneyData && attorneyData.length > 0) {
			if (insuranceData.insuranceData[0].auto_accident1 === "Yes" && insuranceData.insuranceData[0].attorney_name1 === "Yes") {
				const attorney = attorneyData.find(c => c.id === parseInt(insuranceData.insuranceData[0].attorney_name1));
				setAttorney(attorney);
			}
			else if (insuranceData.insuranceData[0].lop_accident1 === "Yes" && insuranceData.insuranceData[0].lop_attorney_name1 === "Yes") {
				const attorney = attorneyData.find(c => c.id === parseInt(insuranceData.insuranceData[0].lop_attorney_name1));
				setAttorney(attorney);
			}
		}
	}, [insuranceData, attorneyData]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleAction(event, data) {
		if (data.exam_id == props.exam_id) {
			return
		}
		const str = event.target.checked;
		setSelectedExam(str);
		let exam = state.selectedExam.find(x => x == data.exam_id);
		if (exam) { //remove from list
			const tempExams = [...state.selectedExam];
			let exmaIndex = tempExams.indexOf(data.exam_id);// get index 
			tempExams.splice(exmaIndex, 1);
			setState({ ...state, selectedExam: tempExams });
		}
		else {
			const tempExams = [...state.selectedExam];
			tempExams.push(data.exam_id);
			setState({ ...state, selectedExam: tempExams });
		}
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

	function handleSelected(event, name) {
		const val = form[name] == "Yes" ? "No" : "Yes";
		if (name == "self_pay1" && val === "Yes") {
			form.primary_insurance = 'No';
			form.auto_accident1 = 'No';
			form.lop_accident1 = 'No';
			form.company_accident1 = 'No';
			setInsuranceType('Self Pay');
		}
		else if (name == "primary_insurance") {  //&& val === "Yes") {
			form.self_pay1 = 'No';
			form.auto_accident1 = 'No';
			form.lop_accident1 = 'No';
			form.company_accident1 = 'No';
			setInsuranceType('Commercial Health Insurance');
			setForm({ ...form, [name]: 'Yes' });
			return;
		}
		else if (name == "auto_accident1" && val === "Yes") {
			form.auto_insurance_type = "AUTO";
			form.self_pay1 = 'No';
			form.lop_accident1 = 'No';
			form.company_accident1 = 'No';
			form.primary_insurance = 'No';
			setInsuranceType('Auto Insurance');
		}
		else if (name == "lop_accident1" && val === "Yes") {
			form.primary_insurance = 'No';
			form.self_pay1 = 'No';
			form.auto_accident1 = 'No';
			form.company_accident1 = 'No';
			setInsuranceType('LOP');
		}
		else if (name == "company_accident1" && val === "Yes") {
			form.primary_insurance = 'No';
			form.self_pay1 = 'No';
			form.auto_accident1 = 'No';
			form.lop_accident1 = 'No';
			setInsuranceType("Worker's Compensation");
		}
		setForm({ ...form, [name]: val });
	}

	function handleSecondaryInsurance(event, newValue) {
		setForm({
			...form,
			secondary_insurance: newValue
		});
	}

	function handleTertairyInsurance(event, newValue) {
		setForm({
			...form,
			tertairy_insurance: newValue
		});
	}

	async function handleSubmit(event) {
		// event.preventDefault();
		setLoading(true);
		const result = await dispatch(saveInsuranceData({ data: { ...form }, exam_id: state.selectedExam }));
		setLoading(false);
		if (result.payload.isUpdateSuccess) {
			CustomNotify("Insurance information updated successfully.", "success");
		}
		else {
			CustomNotify("Something went wrong. Please try again.", "error");
		}
		dispatch(updateNavigationBlocked(false));
	}

	function handleCIEdit() {
		dispatch(openCommercialDialog(form));
	}

	function handleCoverageEdit() {
		dispatch(openCoverageDialog(form));
	}
	function handleCoPayEdit() {
		dispatch(openCoPayDialog(form));
	}
	function handleDeductibleEdit() {
		dispatch(openDeductibleDialog(form));
	}
	function handleReferenceEdit() {
		dispatch(openReferenceDialog(form));
	}

	function handleSICIEdit() {
		dispatch(openSICommercialDialog(form));
	}
	function handleSICoverageEdit() {
		dispatch(openSICoverageDialog(form));
	}
	function handleSICoPayEdit() {
		dispatch(openSICoPayDialog(form));
	}
	function handleSIDeductibleEdit() {
		dispatch(openSIDeductibleDialog(form));
	}
	function handleSIReferenceEdit() {
		dispatch(openSIReferenceDialog(form));
	}

	function handleTICIEdit() {
		dispatch(openTICommercialDialog(form));
	}
	function handleTICoverageEdit() {
		dispatch(openTICoverageDialog(form));
	}
	function handleTICoPayEdit() {
		dispatch(openTICoPayDialog(form));
	}
	function handleTIDeductibleEdit() {
		dispatch(openTIDeductibleDialog(form));
	}
	function handleTIReferenceEdit() {
		dispatch(openTIReferenceDialog(form));
	}
	function handleGIGeneralInfoEdit() {
		dispatch(openGIGeneralInfoDialog(form));
	}
	function handleGIContactEdit() {
		dispatch(openGIContactInfoDialog(form));
	}
	function handleLOPCIEdit() {
		dispatch(openLOPCommercialDialog(form));
	}
	function handleLOPCoverageEdit() {
		dispatch(openLOPCoverageDialog(form));
	}
	function handleLOPCoPayEdit() {
		dispatch(openLOPCoPayDialog(form));
	}
	function handleLOPDeductibleEdit() {
		dispatch(openLOPDeductibleDialog(form));
	}
	function handleLOPReferenceEdit() {
		dispatch(openLOPReferenceDialog(form));
	}
	function handleLOPAttorneyEdit() {
		dispatch(openLOPAttorneyDialog(form));
	}

	function handleWorkersCIEdit() {
		dispatch(openWorkersCommercialDialog(form));
	}
	function handleWorkersCoverageEdit() {
		dispatch(openWorkersCoverageDialog(form));
	}
	function handleWorkersReferenceEdit() {
		dispatch(openWorkersReferenceDialog(form));
	}

	function handleAutoCIEdit() {
		dispatch(openAutoCommercialDialog(form));
	}
	function handleAutoCoverageEdit() {
		dispatch(openAutoCoverageDialog(form));
	}
	function handleAutoReferenceEdit() {
		dispatch(openAutoReferenceDialog(form));
	}
	function handleAutoAttorneyEdit() {
		dispatch(openAutoAttorneyDialog(form));
	}

	const [expanded, setExpanded] = React.useState('commercial');

	const handleAChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	function handleOpenInsuarance(event, exam) {
		history.push(`/apps/insuranceInfo/${patient_id}/${exam.exam_id}/${name}`)
		event.stopPropagation();
		event.preventDefault();
	}
	if (!insuranceData || Object.keys(insuranceData).length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularStatic />
			</div>
		);
	}

	console.log(insuranceType);

	return (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<Formsy
					// onValidSubmit={handleSubmit}
					onValid={enableButton}
					onInvalid={disableButton}
					ref={formRef}
					validationErrors={validationErrors}
					// className="flex flex-col justify-center"
					className="flex flex-col md:overflow-hidden"
				>
					<FuseAnimateGroup
						enter={{
							animation: 'transition.slideUpBigIn'
						}}
					>
						<Card className="w-full mb-16 rounded-8">
							<Accordion expanded={expanded === 'Self Pay'} onChange={handleAChange('Self Pay')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
									aria-controls="panel1bh-content"
									className={classes.heading}
									id="panel1bh-header"
								>
									<AppBar position="static" elevation={0}>
										<Toolbar className="px-8">
											<Typography variant="subtitle1" color="inherit" className="px-12 w-4/5">
												Primary Payment Method : {insuranceType}
											</Typography>
											<Typography variant="subtitle1" color="inherit" className="px-12 w-1/5 text-right">
												#: {props.exam_id}
											</Typography>
										</Toolbar>
									</AppBar>
								</AccordionSummary>
								<AccordionDetails className="justify-center">
									<CardContent>
										<div className="flex flex-col">
											<div className="flex justify-center w-full mb-24">
												<Button
													variant="contained"
													color={form.primary_insurance === "Yes" && form.company_accident1 === "No" && form.auto_accident1 === "No" && form.lop_accident1 === "No" && form.self_pay1 === "No" ? "primary" : "default"}
													type="submit"
													className={clsx(
														form.primary_insurance === "Yes" && form.company_accident1 === "No" && form.auto_accident1 === "No" && form.lop_accident1 === "No" && form.self_pay1 === "No" ? classes.selectedButton : '',
														'mr-10'
													)}
													onClick={(e) => handleSelected(e, 'primary_insurance')}
												>
													Commercial Health Insurance
												</Button>
												<Button
													variant="contained"
													color={form.company_accident1 === "Yes" ? "primary" : "default"}
													className={clsx(
														form.company_accident1 === "Yes" ? classes.selectedButton : '',
														'mr-10'
													)}
													type="submit"
													onClick={(e) => handleSelected(e, 'company_accident1')}
												>
													Worker's Compensation
												</Button>
											</div>
											<div className="flex justify-center w-full mb-24">
												<Button
													variant="contained"
													color={form.auto_accident1 === "Yes" ? "primary" : "default"}
													type="submit"
													className={clsx(
														form.auto_accident1 === "Yes" ? classes.selectedButton : '',
														'mr-10'
													)}
													onClick={(e) => handleSelected(e, 'auto_accident1')}
												>
													Auto Insurance
												</Button>
												<Button
													variant="contained"
													color={form.lop_accident1 === "Yes" ? "primary" : "default"}
													type="submit"
													className={clsx(
														form.lop_accident1 === "Yes" ? classes.selectedButton : '',
														'mr-10'
													)}
													onClick={(e) => handleSelected(e, 'lop_accident1')}
												>
													LOP
												</Button>
												<Button
													variant="contained"
													color={form.self_pay1 === "Yes" ? "primary" : "default"}
													type="submit"
													className={clsx(
														form.self_pay1 === "Yes" ? classes.selectedButton : '',
														'mr-10'
													)}
													onClick={(e) => handleSelected(e, 'self_pay1')}
												>
													Self Pay
												</Button>
											</div>
										</div>
									</CardContent>
								</AccordionDetails>
							</Accordion>
						</Card>
						<div className="flex flex-col">
							{form.company_accident1 === "Yes" ?
								<Card className="w-full mb-16 mr-16 rounded-8">
									<Accordion expanded={expanded === insuranceType} onChange={handleAChange(insuranceType)}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
											aria-controls="panel1bh-content"
											className={classes.heading}
											id="panel1bh-header"
										>
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-8">
													<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
														Worker's Compensation Information
													</Typography>
												</Toolbar>
											</AppBar>
										</AccordionSummary>
										<AccordionDetails className="justify-center">
											<CardContent className="w-full">
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Company Name</Typography>
															<Typography>{form.company_accident_name1_name}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Address</Typography>
															<Typography>{form.company_accident_address1}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleWorkersCIEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Phone</Typography>
															<Typography>{form.company_accident_phone1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Authorization No</Typography>
															<Typography>{form.company_accident_policy_no1}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Claim</Typography>
															<Typography>{form.company_accident_clam1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Date of Accident</Typography>
															<Typography>{form.company_accident_date1 === '' ? '' : moment(form.company_accident_date1).format("MM-DD-YYYY")}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Active Coverage</Typography>
															<Typography>{form.active_coverage3}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Coverage Terminated Date</Typography>
															<Typography>{form.coverage_terminated_date3 === '' ? '' : moment(form.coverage_terminated_date3).format("MM-DD-YYYY")}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton disableRipple className={clsx(
																validationGroupErrors.indexOf('WorkersCoverage') >= 0 ? 'text-red-900' : 'text-green-900',
																'w-16 h-16 rtl:mr-4 p-0 ml-20'
															)} color="inherit" onClick={handleWorkersCoverageEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Deductible Amount</Typography>
															<Typography>{form.worker_deductable_amount}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Deductible Met</Typography>
															<Typography>{form.worker_deductable_meet}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Deductible Met Amount</Typography>
															<Typography>{form.worker_deductable_meet_amount}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Deductible Due Amount</Typography>
															<Typography>{form.worker_deductable_amount - form.worker_deductable_meet_amount}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Med Pay</Typography>
															<Typography>{form.worker_med_pay}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Benefits Remaining</Typography>
															<Typography>{form.worker_benefit_remaining}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">How Much Does Plan Pay(%)</Typography>
															<Typography>{form.worker_plan_pay}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Adjuster Name</Typography>
															<Typography>{form.worker_adjuster_name}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Adjuster Phone</Typography>
															<Typography>{form.worker_adjuster_phone}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleWorkersReferenceEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Adjuster Fax</Typography>
															<Typography>{form.worker_adjuster_fax}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Comments</Typography>
															<Typography>{form.company_accident_comment1}</Typography>
														</div>
													</div>
												</CardContent>
											</CardContent>
										</AccordionDetails>
									</Accordion>
								</Card> : null}
							{form.auto_accident1 === "Yes" ?
								<Card className="w-full mb-16 mr-16 rounded-8">
									<Accordion expanded={expanded === insuranceType} onChange={handleAChange(insuranceType)}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
											aria-controls="panel1bh-content"
											className={classes.heading}
											id="panel1bh-header"
										>
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-8">
													<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
														Auto Insurance Information
													</Typography>
												</Toolbar>
											</AppBar>
										</AccordionSummary>
										<AccordionDetails className="justify-center">
											<CardContent className="w-full">
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Auto Insurance Company Name</Typography>
															<Typography>{form.auto_insurance_company_name1_name}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Auto Insurance Company Address</Typography>
															<Typography>{form.auto_insurance_company_address1_name}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleAutoCIEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Phone</Typography>
															<Typography>{form.auto_insurance_phone1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Policy No</Typography>
															<Typography>{form.auto_insurance_policy_no1}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Claim</Typography>
															<Typography>{form.auto_insurance_clam1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Date of Accident</Typography>
															<Typography>{form.auto_accident_date1 === '' ? '' : moment(form.auto_accident_date1).format("MM-DD-YYYY")}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Active Coverage</Typography>
															<Typography>{form.active_coverage1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Coverage Terminated Date</Typography>
															<Typography>{form.coverage_terminated_date1 === '' ? '' : moment(form.coverage_terminated_date1).format("MM-DD-YYYY")}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton disableRipple className={clsx(
																validationGroupErrors.indexOf('AutoCoverage') >= 0 ? 'text-red-900' : 'text-green-900',
																'w-16 h-16 rtl:mr-4 p-0 ml-20'
															)} color="inherit" onClick={handleAutoCoverageEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Deductible Amount</Typography>
															<Typography>{form.auto_deductable_amount}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Deductible Met</Typography>
															<Typography>{form.auto_deductable_meet}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Deductible Met Amount</Typography>
															<Typography>{form.auto_deductable_meet_amount}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Deductible Due Amount</Typography>
															<Typography>{form.auto_deductable_amount - form.auto_deductable_meet_amount}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Med Pay</Typography>
															<Typography>{form.auto_med_pay}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Benefits Remaining</Typography>
															<Typography>{form.auto_benefit_remaining}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">How Much Does Plan Pay(%)</Typography>
															<Typography>{form.auto_plan_pay}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Adjuster Name</Typography>
															<Typography>{form.auto_adjuster_name}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Adjuster Phone</Typography>
															<Typography>{form.auto_adjuster_phone}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleAutoReferenceEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Adjuster Fax</Typography>
															<Typography>{form.auto_adjuster_fax}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Comments</Typography>
															<Typography>{form.auto_accident_comment1}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Does the patient have an attorney</Typography>
															<Typography>{form.auto_attorney}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Attorney Name</Typography>
															<Typography>{attorney && attorney.name}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleAutoAttorneyEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Address1</Typography>
															<Typography>{attorney && attorney.address1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Address2</Typography>
															<Typography>{attorney && attorney.address2}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Phone</Typography>
															<Typography>{attorney && attorney.phone}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Email</Typography>
															<Typography>{attorney && attorney.att_email}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Notes</Typography>
															<Typography>{attorney && attorney.att_notes}</Typography>
														</div>
													</div>
												</CardContent>
											</CardContent>
										</AccordionDetails>
									</Accordion>
								</Card> : null}
							{form.lop_accident1 === "Yes" ?
								<Card className="w-full mb-16 mr-16 rounded-8">
									<Accordion expanded={expanded === insuranceType} onChange={handleAChange(insuranceType)}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
											aria-controls="panel1bh-content"
											className={classes.heading}
											id="panel1bh-header"
										>
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-8">
													<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
														LOP Information
													</Typography>
												</Toolbar>
											</AppBar>
										</AccordionSummary>
										<AccordionDetails className="justify-center">
											<CardContent className="w-full">
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Claim</Typography>
															<Typography>{form.lop_insurance_clam1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Date of Accident</Typography>
															<Typography>{form.lop_accident_date1 === '' ? '' : moment(form.lop_accident_date1).format("MM-DD-YYYY")}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleLOPCIEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Does the patient have an attorney</Typography>
															<Typography>{form.lop_attorney}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Attorney Name</Typography>
															<Typography>{attorney.name}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleLOPAttorneyEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Address1</Typography>
															<Typography>{attorney.address1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Address2</Typography>
															<Typography>{attorney.address2}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Phone</Typography>
															<Typography>{attorney.phone}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Email</Typography>
															<Typography>{attorney.att_email}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-full">
															<Typography className="font-bold text-15">Is The Attorney Willing to Sign The LOP to Conver any Outstanding Bill</Typography>
															<Typography>{form.lop_attorney_outstanding}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Active Coverage</Typography>
															<Typography>{form.active_coverage2}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Coverage Terminated Date</Typography>
															<Typography>{form.coverage_terminated_date2 === '' ? '' : moment(form.coverage_terminated_date2).format("MM-DD-YYYY")}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton disableRipple className={clsx(
																validationGroupErrors.indexOf('LOPCoverage') >= 0 ? 'text-red-900' : 'text-green-900',
																'w-16 h-16 rtl:mr-4 p-0 ml-20'
															)} color="inherit" onClick={handleLOPCoverageEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Deductible Amount</Typography>
															<Typography>{form.lop_deductable_amount}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Deductible Met</Typography>
															<Typography>{form.lop_deductable_meet}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Deductible Met Amount</Typography>
															<Typography>{form.lop_deductable_meet_amount}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Deductible Due Amount</Typography>
															<Typography>{form.lop_deductable_amount - form.lop_deductable_meet_amount}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Med Pay</Typography>
															<Typography>{form.lop_med_pay}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Benefits Remaining</Typography>
															<Typography>{form.lop_benefit_remaining}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">How Much Does Plan Pay(%)</Typography>
															<Typography>{form.lop_plan_pay}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Adjuster Name</Typography>
															<Typography>{form.lop_adjuster_name}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Adjuster Phone</Typography>
															<Typography>{form.lop_adjuster_phone}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleLOPReferenceEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Adjuster Fax</Typography>
															<Typography>{form.lop_adjuster_fax}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Comments</Typography>
															<Typography>{form.lop_accident_comment1}</Typography>
														</div>
													</div>
												</CardContent>
											</CardContent>
										</AccordionDetails>
									</Accordion>
								</Card> : null}
							{form.primary_insurance === "Yes" && form.auto_accident1 === "No" && form.lop_accident1 === "No" && form.company_accident1 === "No" && form.self_pay1 === "No" ?
								<Card className="w-full mb-16 rounded-8">
									<Accordion expanded={expanded === insuranceType} onChange={handleAChange(insuranceType)}>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
											aria-controls="panel1bh-content"
											className={classes.heading}
											id="panel1bh-header"
										>
											<AppBar position="static" elevation={0}>
												<Toolbar className="px-8">
													<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
														Commercial Health Insurance
													</Typography>
												</Toolbar>
											</AppBar>
										</AccordionSummary>
										<AccordionDetails className="justify-center">
											<CardContent className="w-full">
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Insurance Company Name</Typography>
															<Typography>{form.insurance_company_name1_name}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Insurance Company Add</Typography>
															<Typography>{form.insurance_company_address1_name}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleCIEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Member ID</Typography>
															<Typography>{form.member_id1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Group No</Typography>
															<Typography>{form.group_id1}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													{form.active_coverage4 === "Yes" && (
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Active Coverage</Typography>
																<Typography>{form.active_coverage4}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Coverage Terminated Date</Typography>
																<Typography>{form.coverage_terminated_date4 === '' ? '' : moment(form.coverage_terminated_date4).format("MM-DD-YYYY")}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleCoverageEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>)}
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Policy Expired</Typography>
															<Typography>{form.policy_expire1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">End Date</Typography>
															<Typography>{form.policy_expire_end_date1 === '' ? '' : moment(form.policy_expire_end_date1).format("MM-DD-YYYY")}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-1/2">
															<Typography className="font-bold text-15">Effective Date</Typography>
															<Typography>{form.effective_date1 === '' ? '' : moment(form.effective_date1).format("MM-DD-YYYY")}</Typography>
														</div>
														<div className="w-1/2">
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Co Insurance(%)</Typography>
															<Typography>{form.co_insurance1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Co Pay</Typography>
															<Typography>{form.co_pay1}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton disableRipple className={clsx(
																validationGroupErrors.indexOf('CICoPay') >= 0 ? 'text-red-900' : 'text-green-900',
																'w-16 h-16 rtl:mr-4 p-0 ml-20'
															)} color="inherit" onClick={handleCoPayEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Co Pay Amount</Typography>
															<Typography>{form.co_pay_amount1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Out of Network</Typography>
															<Typography>{form.out_of_network1}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md mb-8">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Deductible</Typography>
															<Typography>{form.deductable1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Plan Deductible Amount</Typography>
															<Typography>{form.deductable_amount1}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton disableRipple className={clsx(
																validationGroupErrors.indexOf('CIDeductible') >= 0 ? 'text-red-900' : 'text-green-900',
																'w-16 h-16 rtl:mr-4 p-0 ml-20'
															)} color="inherit" onClick={handleDeductibleEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-1/2">
															<Typography className="font-bold text-15">Has the patient paid the full deductible amount?</Typography>
															<Typography>{form.deductable_meet1}</Typography>
														</div>
														<div className="w-1/2">
															<Typography className="font-bold text-15">Deductible Paid</Typography>
															<Typography>{form.deductable_meet_amount1}</Typography>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-1/2">
															<Typography className="font-bold text-15">Remaining Deductible</Typography>
															<Typography>{form.deductable_amount1 - form.deductable_meet_amount1}</Typography>
														</div>
														<div className="w-1/2">
															<Typography className="font-bold text-15">Exam Allowable Amount</Typography>
															<Typography>{form.allowed_amount1}</Typography>
														</div>
													</div>
													<div className="flex">
														<div className="w-1/2">
															<Typography className="font-bold text-15">Collect From Patient</Typography>
															<Typography>{form.collect_from_patient}</Typography>
														</div>
													</div>
												</CardContent>
												<CardContent className="w-full border rounded-md">
													<div className="flex mb-8">
														<div className="w-6/12">
															<Typography className="font-bold text-15">Authorization/ Referral Required</Typography>
															<Typography>{form.authorization_referral_required1}</Typography>
														</div>
														<div className="w-5/12">
															<Typography className="font-bold text-15">Authorization/ Referral</Typography>
															<Typography>{form.authorization_referral1}</Typography>
														</div>
														<div className="w-1/12 flex justify-end">
															<IconButton disableRipple className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleReferenceEdit}>
																<Icon>edit</Icon>
															</IconButton>
														</div>
													</div>
													<div className="flex mb-8">
														<div className="w-1/2">
															<Typography className="font-bold text-15">Authorization Date</Typography>
															<Typography>{form.authorization_referral1_date === '' ? '' : moment(form.authorization_referral1_date).format("MM-DD-YYYY")}</Typography>
														</div>
														<div className="w-1/2">
															<Typography className="font-bold text-15">Spoke To/ Reference</Typography>
															<Typography>{form.spoke_to_reference1}</Typography>
														</div>
													</div>
												</CardContent>
											</CardContent>
										</AccordionDetails>
									</Accordion>
								</Card> : null}
							<Card className="w-full mb-16 rounded-8">
								<Accordion expanded={expanded === 'secondary'} onChange={handleAChange('secondary')}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
										aria-controls="panel1bh-content"
										className={classes.heading}
										id="panel1bh-header"
									>
										<AppBar position="static" elevation={0}>
											<Toolbar className="px-8">
												<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
													Secondary Insurance Information
												</Typography>
											</Toolbar>
										</AppBar>
									</AccordionSummary>
									<AccordionDetails className="justify-center">
										<CardContent className="w-full">
											<div className="flex">
												<div className="flex flex-row w-full mb-24">
													<div className="flex justify-start items-start w-1/3">
														<Typography className="font-bold text-15">Secondary Insurance</Typography>
													</div>
													<div className="w-2/3">
														<StyledGroupButton
															value={form.secondary_insurance}
															id="secondary_insurance"
															name="secondary_insurance"
															exclusive
															onChange={handleSecondaryInsurance}
															aria-label="secondary_insurance"
														>
															<StyledToggleButton value="Yes" aria-label="left aligned">
																Yes
															</StyledToggleButton>
															<StyledToggleButton value="No" aria-label="centered">
																No
															</StyledToggleButton>
														</StyledGroupButton>
													</div>
												</div>
											</div>
											{form.secondary_insurance === "Yes" ?
												<div>
													<CardContent className="w-full border rounded-md mb-8">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Insurance Company Name</Typography>
																<Typography>{form.insurance_company_name2_name}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Insurance Company Add</Typography>
																<Typography>{form.insurance_company_address2_name}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleSICIEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Member ID</Typography>
																<Typography>{form.member_id2}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Group No</Typography>
																<Typography>{form.group_id2}</Typography>
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md mb-8">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Active Coverage</Typography>
																<Typography>{form.active_coverage5}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Coverage Terminated Date</Typography>
																<Typography>{form.coverage_terminated_date5 === '' ? '' : moment(form.coverage_terminated_date5).format("MM-DD-YYYY")}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleSICoverageEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Policy Expired</Typography>
																<Typography>{form.policy_expire2}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">End Date</Typography>
																<Typography>{form.policy_expire_end_date2 === '' ? '' : moment(form.policy_expire_end_date2).format("MM-DD-YYYY")}</Typography>
															</div>
														</div>
														<div className="flex">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Effective Date</Typography>
																<Typography>{form.effective_date2 === '' ? '' : moment(form.effective_date2).format("MM-DD-YYYY")}</Typography>
															</div>
															<div className="w-1/2">
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md mb-8">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Co Pay</Typography>
																<Typography>{form.co_pay2}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Co Pay Amount</Typography>
																<Typography>{form.co_pay_amount2}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton disableRipple className={clsx(
																	validationGroupErrors.indexOf('SICoPay') >= 0 ? 'text-red-900' : 'text-green-900',
																	'w-16 h-16 rtl:mr-4 p-0 ml-20'
																)} color="inherit" onClick={handleSICoPayEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Co Insurance(%)</Typography>
																<Typography>{form.co_insurance2}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Out of Network</Typography>
																<Typography>{form.out_of_network2}</Typography>
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md mb-8">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Deductible</Typography>
																<Typography>{form.deductable2}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Deductible Amount</Typography>
																<Typography>{form.deductable_amount2}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton disableRipple className={clsx(
																	validationGroupErrors.indexOf('SIDeductible') >= 0 ? 'text-red-900' : 'text-green-900',
																	'w-16 h-16 rtl:mr-4 p-0 ml-20'
																)} color="inherit" onClick={handleSIDeductibleEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex mb-8">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Deductible Met</Typography>
																<Typography>{form.deductable_meet2}</Typography>
															</div>
															<div className="w-1/2">
																<Typography className="font-bold text-15">Deductible Met Amount</Typography>
																<Typography>{form.deductable_meet_amount2}</Typography>
															</div>
														</div>
														<div className="flex mb-8">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Deductible Due Amount</Typography>
																<Typography>{form.deductable_amount2 - form.deductable_meet_amount2}</Typography>
															</div>
															<div className="w-1/2">
																<Typography className="font-bold text-15">Allowable Amount</Typography>
																<Typography>{form.allowed_amount2}</Typography>
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Authorization/ Referral Required</Typography>
																<Typography>{form.authorization_referral_required2}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Authorization/ Referral</Typography>
																<Typography>{form.authorization_referral2}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton disableRipple className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleSIReferenceEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex mb-8">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Authorization Date</Typography>
																<Typography>{form.authorization_referral2_date === '' ? '' : moment(form.authorization_referral2_date).format("MM-DD-YYYY")}</Typography>
															</div>
															<div className="w-1/2">
																<Typography className="font-bold text-15">Spoke To/ Reference</Typography>
																<Typography>{form.spoke_to_reference2}</Typography>
															</div>
														</div>
													</CardContent>
												</div> : null}
										</CardContent>
									</AccordionDetails>
								</Accordion>
							</Card>
						</div>
						<div className="flex flex-col">
							<Card className="w-full mb-16 mr-16 rounded-8">
								<Accordion expanded={expanded === 'tertiary'} onChange={handleAChange('tertiary')}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
										aria-controls="panel1bh-content"
										className={classes.heading}
										id="panel1bh-header"
									>
										<AppBar position="static" elevation={0}>
											<Toolbar className="px-8">
												<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
													Tertiary Insurance Information
												</Typography>
											</Toolbar>
										</AppBar>
									</AccordionSummary>
									<AccordionDetails className="justify-center">
										<CardContent className="w-full">
											<div className="flex">
												<div className="flex flex-row w-full mb-24 mr-16">
													<div className="flex justify-start items-start w-1/3">
														<Typography className="font-bold text-15">Tertiary Insurance Information</Typography>
													</div>
													<div className="w-2/3">
														<StyledGroupButton
															value={form.tertairy_insurance}
															id="tertairy_insurance"
															name="tertairy_insurance"
															exclusive
															onChange={handleTertairyInsurance}
															aria-label="tertairy_insurance"
														>
															<StyledToggleButton value="Yes" aria-label="left aligned">
																Yes
															</StyledToggleButton>
															<StyledToggleButton value="No" aria-label="centered">
																No
															</StyledToggleButton>
														</StyledGroupButton>
													</div>
												</div>
											</div>
											{form.tertairy_insurance === "Yes" ?
												<div>
													<CardContent className="w-full border rounded-md mb-8">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Insurance Company Name</Typography>
																<Typography>{form.insurance_company_name3_name}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Insurance Company Add</Typography>
																<Typography>{form.insurance_company_address3_name}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleTICIEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Member ID</Typography>
																<Typography>{form.member_id3}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Group No</Typography>
																<Typography>{form.group_id3}</Typography>
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md mb-8">
														{form.active_coverage4 === "Yes" && (
															<div className="flex mb-8">
																<div className="w-6/12">
																	<Typography className="font-bold text-15">Active Coverage</Typography>
																	<Typography>{form.active_coverage6}</Typography>
																</div>
																<div className="w-5/12">
																	<Typography className="font-bold text-15">Coverage Terminated Date</Typography>
																	<Typography>{form.coverage_terminated_date6 === '' ? '' : moment(form.coverage_terminated_date6).format("MM-DD-YYYY")}</Typography>
																</div>
																<div className="w-1/12 flex justify-end">
																	<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleTICoverageEdit}>
																		<Icon>edit</Icon>
																	</IconButton>
																</div>
															</div>)}
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Policy Expired</Typography>
																<Typography>{form.policy_expire3}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">End Date</Typography>
																<Typography>{form.policy_expire_end_date3 === '' ? '' : moment(form.policy_expire_end_date3).format("MM-DD-YYYY")}</Typography>
															</div>
														</div>
														<div className="flex">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Effective Date</Typography>
																<Typography>{form.effective_date3 === '' ? '' : moment(form.effective_date3).format("MM-DD-YYYY")}</Typography>
															</div>
															<div className="w-1/2">
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md mb-8">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Co Pay</Typography>
																<Typography>{form.co_pay3}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Co Pay Amount</Typography>
																<Typography>{form.co_pay_amount3}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton disableRipple className={clsx(
																	validationGroupErrors.indexOf('TICoPay') >= 0 ? 'text-red-900' : 'text-green-900',
																	'w-16 h-16 rtl:mr-4 p-0 ml-20'
																)} color="inherit" onClick={handleTICoPayEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Co Insurance(%)</Typography>
																<Typography>{form.co_insurance3}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Out of Network</Typography>
																<Typography>{form.out_of_network3}</Typography>
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md mb-8">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Deductible</Typography>
																<Typography>{form.deductable3}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Deductible Amount</Typography>
																<Typography>{form.deductable_amount3}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton disableRipple className={clsx(
																	validationGroupErrors.indexOf('TIDeductible') >= 0 ? 'text-red-900' : 'text-green-900',
																	'w-16 h-16 rtl:mr-4 p-0 ml-20'
																)} color="inherit" onClick={handleTIDeductibleEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex mb-8">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Deductible Met</Typography>
																<Typography>{form.deductable_meet3}</Typography>
															</div>
															<div className="w-1/2">
																<Typography className="font-bold text-15">Deductible Met Amount</Typography>
																<Typography>{form.deductable_meet_amount3}</Typography>
															</div>
														</div>
														<div className="flex mb-8">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Deductible Due Amount</Typography>
																<Typography>{form.deductable_amount3 - form.deductable_meet_amount3}</Typography>
															</div>
															<div className="w-1/2">
																<Typography className="font-bold text-15">Allowable Amount</Typography>
																<Typography>{form.allowed_amount3}</Typography>
															</div>
														</div>
													</CardContent>
													<CardContent className="w-full border rounded-md">
														<div className="flex mb-8">
															<div className="w-6/12">
																<Typography className="font-bold text-15">Authorization/ Referral Required</Typography>
																<Typography>{form.authorization_referral_required3}</Typography>
															</div>
															<div className="w-5/12">
																<Typography className="font-bold text-15">Authorization/ Referral</Typography>
																<Typography>{form.authorization_referral3}</Typography>
															</div>
															<div className="w-1/12 flex justify-end">
																<IconButton disableRipple className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleTIReferenceEdit}>
																	<Icon>edit</Icon>
																</IconButton>
															</div>
														</div>
														<div className="flex mb-8">
															<div className="w-1/2">
																<Typography className="font-bold text-15">Authorization Date</Typography>
																<Typography>{form.authorization_referral3_date === '' ? '' : moment(form.authorization_referral3_date).format("MM-DD-YYYY")}</Typography>
															</div>
															<div className="w-1/2">
																<Typography className="font-bold text-15">Spoke To/ Reference</Typography>
																<Typography>{form.spoke_to_reference3}</Typography>
															</div>
														</div>
													</CardContent>
												</div> : null}
										</CardContent>
									</AccordionDetails>
								</Accordion>
							</Card>
							<Card className="w-full mb-16 rounded-8">
								<Accordion expanded={expanded === 'gurantor'} onChange={handleAChange('gurantor')}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
										aria-controls="panel1bh-content"
										className={classes.heading}
										id="panel1bh-header"
									>
										<AppBar position="static" elevation={0}>
											<Toolbar className="px-8">
												<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
													Gurantor Information
												</Typography>
											</Toolbar>
										</AppBar>
									</AccordionSummary>
									<AccordionDetails className="justify-center">
										<CardContent className="w-full">
											<CardContent className="w-full border rounded-md mb-8">
												<div className="flex mb-8">
													<div className="w-6/12">
														<Typography className="font-bold text-15">Gurantor</Typography>
														<Typography>{form.gurantor_p}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">First Name</Typography>
														<Typography>{form.fname_p}</Typography>
													</div>
													<div className="w-1/12 flex justify-end">
														<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleGIGeneralInfoEdit}>
															<Icon>edit</Icon>
														</IconButton>
													</div>
												</div>
												<div className="flex">
													<div className="w-6/12">
														<Typography className="font-bold text-15">Middle Name</Typography>
														<Typography>{form.mname_p}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">Last Name</Typography>
														<Typography>{form.lname_p}</Typography>
													</div>
												</div>
												<div className="flex">
													<div className="w-6/12">
														<Typography className="font-bold text-15">Date of Birth</Typography>
														<Typography>{form.dob_p === '' || form.dob_p === '--' ? '' : moment(form.dob_p).format("MM-DD-YYYY")}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">Gender</Typography>
														<Typography>{form.gender_p}</Typography>
													</div>
												</div>
											</CardContent>
											<CardContent className="w-full border rounded-md mb-8">
												<div className="flex mb-8">
													<div className="w-6/12">
														<Typography className="font-bold text-15">SSN</Typography>
														<Typography>{form.ssn_p}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">Address1</Typography>
														<Typography>{form.address1_p}</Typography>
													</div>
													<div className="w-1/12 flex justify-end">
														<IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20 text-green-900" color="inherit" onClick={handleGIContactEdit}>
															<Icon>edit</Icon>
														</IconButton>
													</div>
												</div>
												<div className="flex">
													<div className="w-6/12">
														<Typography className="font-bold text-15">Address2</Typography>
														<Typography>{form.address2_p}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">City</Typography>
														<Typography>{form.city_name}</Typography>
													</div>
												</div>
												<div className="flex">
													<div className="w-6/12">
														<Typography className="font-bold text-15">State</Typography>
														<Typography>{form.state_name}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">Country</Typography>
														<Typography>{form.country_name}</Typography>
													</div>
												</div>
												<div className="flex">
													<div className="w-6/12">
														<Typography className="font-bold text-15">Zip</Typography>
														<Typography>{form.zip_p}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">Phone</Typography>
														<Typography>{form.phone_p}</Typography>
													</div>
												</div>
												<div className="flex">
													<div className="w-6/12">
														<Typography className="font-bold text-15">Mobile</Typography>
														<Typography>{form.mobile_p}</Typography>
													</div>
													<div className="w-5/12">
														<Typography className="font-bold text-15">Email</Typography>
														<Typography>{form.email_p}</Typography>
													</div>
												</div>
											</CardContent>
										</CardContent>
									</AccordionDetails>
								</Accordion>
							</Card>
						</div>
					</FuseAnimateGroup>
				</Formsy>
			</div>
			<div className="flex flex-col md:w-320">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Save Insuarance
								</Typography>
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<div className="flex justify-evenly pt-24">
								<Button
									variant="contained"
									style={{ float: 'right' }}
									className={classes.selectedButton}
									color="primary"
									type="submit"
									onClick={handleSubmit}
									// disabled={!canBeSubmitted()}
									disabled={!isFormValid || loading}
								>
									Save Insurance
									{loading && <CircularProgress className="ml-10" size={18} />}
								</Button>
								{/* <Link style={{ textDecoration: "none" }} to={`/apps/profile/${routeParams.patient_id}/${routeParams.name}/0`}>
								<Button
									variant="contained"
									style={{ float: 'right'}}
									color="primary"
									type="submit"
									// onClick={handleSubmit}
									// disabled={!canBeSubmitted()}
									// disabled={!isFormValid || loading}
								>
									Back
									{loading && <CircularProgress className="ml-10" size={18}/>}
								</Button>
								</Link> */}
							</div>
						</CardContent>
					</Card>
					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Exam List
									{/* ACCESSION NUMBER = {exam.exam_id} */}
								</Typography>
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<List className="p-0">
								{insuranceData.examList && insuranceData.examList.map(exam => (
									<ListItem key={exam.exam_id} className="px-8">
										<Checkbox
											className="p-10"
											disableRipple
											// labelStyle={{color: 'white'}}
											// iconStyle={{fill: 'white'}}
											// inputStyle={{color:'white'}}
											// style={{color:'white'}}
											checked={manageCheckUncheckExam(exam.exam_id)}
											tabIndex={-1}
											name="selectedExam"
											onChange={(e) => handleAction(e, exam)}
											label="Fax"
										/>
										<ListItemText
											primary={
												<div>
													<div className="flex">
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															Accession #:
														</Typography>

														{/* <Typography onClick={(e) => handleOpenInsuarance(e, exam)} className="mx-4" color="secondary" paragraph={false}>
														<a href="#">{exam.exam_id}</a>
													</Typography> */}
														<Typography className="mx-4 font-bold" paragraph={false}>
															{exam.exam_id}
														</Typography>
													</div>
													<div className="flex">
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															Modality:
														</Typography>

														<Typography className="mx-4" paragraph={false}>
															{exam.modality}
														</Typography>
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															Exam:
														</Typography>

														<Typography title={exam.exam} className="mx-4 truncate md:overflow-clip" paragraph={false}>
															{exam.exam}
														</Typography>

													</div>
													<div className="flex">
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															Location:
														</Typography>

														<Typography className="mx-4" paragraph={false}>
															{exam.location}
														</Typography>
													</div>
													<div className="flex">
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															DOS:
														</Typography>

														<Typography className="mx-4" paragraph={false}>
															{moment(exam.scheduling_date).format("MM/DD/YYYY")}
														</Typography>
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															Sch.Time:
														</Typography>

														<Typography className="mx-4" paragraph={false}>
															{exam.time_from}
														</Typography>
													</div>
													<div className="flex">
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															Referrer:
														</Typography>

														<Typography title={exam.ref} className="mx-4 truncate md:overflow-clip" paragraph={false}>
															{exam.ref}
														</Typography>
													</div>
													<div className="flex">
														<Typography
															className="font-medium italic"
															paragraph={false}
														>
															Status:
														</Typography>

														<Typography className="mx-4" paragraph={false}>
															{exam.status}
														</Typography>
													</div>
												</div>
											}
										// secondary={`${exam.exam} ${exam.location}`} 

										/>
									</ListItem>
								))}
							</List>
						</CardContent>
					</Card>
				</FuseAnimateGroup>
				<CommercialInfoDialog />
				<CoverageInfo />
				<CoPayInfo />
				<DeductibleInfo />
				<ReferenceInfo />

				<SICommercialInfoDialog />
				<SICoverageInfo />
				<SICoPayInfo />
				<SIDeductibleInfo />
				<SIReferenceInfo />

				<TICommercialInfoDialog />
				<TICoverageInfo />
				<TICoPayInfo />
				<TIDeductibleInfo />
				<TIReferenceInfo />

				<GeneralInfo insuranceData={insuranceData}/>
				<ContactInfo allCity={allCity} />

				<LOPCommercialInfoDialog />
				<LOPCoverageInfo />
				<LOPCoPayInfo />
				<LOPDeductibleInfo />
				<LOPReferenceInfo />
				<LOPAttorneyInfo />

				<WorkersCommercialInfoDialog />
				<WorkersCoverageInfo />
				<WorkersReferenceInfo />

				<AutoCommercialInfoDialog />
				<AutoCoverageInfo />
				<AutoReferenceInfo />
				<AutoAttorneyInfo />
				<NavigationBlocker navigationBlocked={isNavigationBlocked} />
			</div>
		</div>
	);
}

// export default InsuranceInfo
export default withReducer('insuranceInfoApp', reducer)(InsuranceInfo);



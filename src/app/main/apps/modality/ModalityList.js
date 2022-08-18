import FuseAnimate from '@fuse/core/FuseAnimate';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MobilityTable from './ModalityTable';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {
	getModality,
	selectModality,
	getLocations,
	getModalityForDropDown,
	setAttorneySearchText,
	clearFilterOptions
} from './store/modalitySlice';
import Backdrop from '@material-ui/core/Backdrop';
import {makeStyles} from '@material-ui/core/styles';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';

const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function ModalityList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const CustomNotify = useCustomNotify();
	const dispatch = useDispatch();
	const modality = useSelector(selectModality);
	const isSearching = useSelector(({modalityApp}) => modalityApp.modality.isSearching);
	const confirmationDialog = useSelector(({modalityApp}) => modalityApp.modality.confirmationDialog);
	const modalityResponse = useSelector(({modalityApp}) => modalityApp.modality)
	const [filteredData, setFilteredData] = useState(null);
	const [isSearchingState, setIsSearching] = useState(false);
	const [clearScreen, setClearScreen] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false)
	const [updateFailed, setUpdateFailed] = useState(false)
	
	useEffect(() => {
		dispatch(setAttorneySearchText(''));
		dispatch(clearFilterOptions(''));
		setClearScreen(true)
	}, []);

	async function fetchData() {
		const result = await dispatch(getModality(""));

		if (result.payload.data) {
			setFilteredData(result.payload.data)
		}
		setIsSearching(false);
	}

	async function fetchLocation() {
		await dispatch(getLocations(""));
	}
	async function fecthModalityForDropDown() {
		await dispatch(getModalityForDropDown(""));
	}

	useEffect(() => {
		let ignore = false;
		// if (clearScreen && confirmationDialog.data === null) {
		setIsSearching(true);
		fetchData();
		fetchLocation();
		fecthModalityForDropDown()
		// }
		return () => {ignore = true;}
	}, [modalityResponse.isStatusChange, modalityResponse.isModalityDeleted,modalityResponse.isModalityCreated]);

	useEffect(() => {
		if (modality) {
			setFilteredData(modality);
		}
	}, [modality]);
	
	useEffect(() => {
		if (modalityResponse.isModalityUpdated) {
			//setUpdateSuccess(true)
			CustomNotify("Exam has been updated!", "success");
		}
	}, [modalityResponse.isModalityUpdated]);

	useEffect(() => {
		if (modalityResponse.isModalityUpdatedError) {
			//setUpdateFailed(true)
			CustomNotify("Something went wrong, please try after some time.", "error");
		}
	}, [modalityResponse.isModalityUpdatedError]);

	if (isSearchingState) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}

	if (!filteredData || filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no modality. Please search for it!
				</Typography>
			</div>
		);
	}
	return (
		<div className="makeStyles-content-414 flex flex-col h-full">

			{/* <SnackBarAlert snackOpen={updateSuccess} onClose={() => {
					setUpdateSuccess(false)
				}} text="Modality has been updated!" />	
			<SnackBarAlert snackOpen={updateFailed} onClose={() => {
					setUpdateFailed(false)
				}} text="Something went wrong, please try after some time." error={true} /> */}


			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<MobilityTable
					data={filteredData}

				/>
			</FuseAnimate>
		</div>
	);
}

export default ModalityList;

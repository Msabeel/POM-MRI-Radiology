import FuseAnimate from '@fuse/core/FuseAnimate';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ExamTable from './ExamTable';
import {
	getExams,
	getLocations,
	setexamSearchText,
	selectExam,
	clearFilterOptions,
	getModalityForDropDown
} from './store/examSlice';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
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

function ExamList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();
	const exam = useSelector(selectExam);
	const isSearching = useSelector(({examApp}) => examApp.exam.isSearching);
	const confirmationDialog = useSelector(({examApp}) => examApp.exam.confirmationDialog);
	// const confirmationDialog = useSelector(({examApp}) => examApp.exam.confirmationDialog);
	const examResponse = useSelector(({examApp}) => examApp.exam)
	const [filteredData, setFilteredData] = useState(null);
	const [isSearchingState, setIsSearching] = useState(false);
	const [clearScreen, setClearScreen] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false)
	const [updateFailed, setUpdateFailed] = useState(false)
	const CustomNotify = useCustomNotify();
	useEffect(() => {
		dispatch(setexamSearchText(''));
		dispatch(clearFilterOptions(''));
		setClearScreen(true)
	}, []);

	async function fetchData() {
		const result = await dispatch(getExams(""));

		if (result.payload.data) {
			setFilteredData(result.payload.data)
		}
		setIsSearching(false);
	}

	async function fetchModalities() {
		await dispatch(getModalityForDropDown(""));
	}

	async function fetchLocation() {
		await dispatch(getLocations(""));
	}
	useEffect(() => {
		let ignore = false;
		// if (clearScreen && confirmationDialog.data === null) {
		setIsSearching(true);
		fetchData();
		fetchLocation();
		fetchModalities();
		// }
		return () => {ignore = true;}
	}, [examResponse.isStatusChange, examResponse.isExamDeleted,examResponse.isExamCreated]);

	useEffect(() => {
		if (exam) {
			setFilteredData(exam);
		}
	}, [exam]);


	useEffect(() => {
		if (examResponse.isUpdateSuccess) {
			//setUpdateSuccess(true);
			CustomNotify("Exam has been updated!", "success");
		}
	}, [examResponse.isUpdateSuccess]);

	useEffect(() => {
		if (examResponse.isUpdateError) {
			//setUpdateFailed(true);
			CustomNotify("Something went wrong, please try after some time.", "error");
		}
	}, [examResponse.isUpdateError]);

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
					There are no Exam. Please search for it!
				</Typography>
			</div>
		);
	}
	return (
		<div className="makeStyles-content-414 flex flex-col h-full">
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
			{/* <SnackBarAlert snackOpen={updateSuccess} onClose={() => {
				setUpdateSuccess(false)
			}} text="Exam has been updated!" />	
			<SnackBarAlert snackOpen={updateFailed} onClose={() => {
				setUpdateFailed(false)
			}} text="Something went wrong, please try after some time." error={true} /> */}
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<ExamTable
					data={filteredData}

				/>
			</FuseAnimate>
		</div>
	);
}

export default ExamList;

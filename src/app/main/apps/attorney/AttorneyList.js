import FuseAnimate from '@fuse/core/FuseAnimate';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AttorneyTable from './AttorneyTable';
import AttorneyEdit from './AttorneyEdit';
import { getAttorney, selectAttorney,setAttorneySearchText,clearFilterOptions} from './store/attorneySlice';

import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function AttorneyList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();
	const attorney = useSelector(selectAttorney);
	const searchText = useSelector(({ attorneyApp }) => attorneyApp.attorney.searchText);
	const isSearching = useSelector(({ attorneyApp }) => attorneyApp.attorney.isSearching);

	//const user = useSelector(({ attorneyApp }) => attorneyApp.user);
	const confirmationDialog = useSelector(({ attorneyApp }) => attorneyApp.attorney.confirmationDialog);

	const [filteredData, setFilteredData] = useState(null);
	const [isSearchingState, setIsSearching] = useState(false);
	const [clearScreen,setClearScreen]= useState(false);

	useEffect(() => {
		dispatch(setAttorneySearchText(''));
		dispatch(clearFilterOptions(''));
		setClearScreen(true)
	}, []);

	async function fetchData() {
			
		const result = await dispatch(getAttorney(searchText));
		if(result.payload.data){
			setFilteredData(result.payload.data)
		}			
		setIsSearching(false);
	}
	
	useEffect(() => {
		let ignore = false;
	
		if (searchText && clearScreen && confirmationDialog.data === null) {
			setIsSearching(true);
			fetchData();
		}
		return () => { ignore = true; }
	}, [searchText,confirmationDialog.data]);

	useEffect(() => {
		
		if (attorney) {
			setFilteredData(attorney);
		}
	}, [attorney]);

	
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
					There are no attorney. Please search for it!
				</Typography>
			</div>
		);
	}
	return (
		<div class="makeStyles-content-414 flex flex-col h-full">
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<AttorneyTable
					data={filteredData}
				/>
			</FuseAnimate>
		</div>
	);
}

export default AttorneyList;

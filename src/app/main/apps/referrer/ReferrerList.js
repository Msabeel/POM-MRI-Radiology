import FuseAnimate from '@fuse/core/FuseAnimate';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReferrerTable from './ReferrerTable';
import { getReferrer, selectReferrer, showPassword } from './store/referrerSlice';

import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function ReferrerList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();
	const contacts = useSelector(selectReferrer);
	const searchText = useSelector(({ referrerApp }) => referrerApp.referrer.searchText);
	const isSearching = useSelector(({ referrerApp }) => referrerApp.referrer.isSearching);
	//const user = useSelector(({ referrerApp }) => referrerApp.user);

	const [filteredData, setFilteredData] = useState(null);
	const [isSearchingState, setIsSearching] = useState(false);

	useEffect(() => {
		let ignore = false;
		async function fetchData() {
			if(searchText.fields.length > 0){
				const result = await dispatch(getReferrer(searchText));
			}else{
				setFilteredData([]);
			}
			setIsSearching(false);

		}
		if (searchText) {
			setIsSearching(true);
			fetchData();
		}
		return () => { ignore = true; }
	}, [searchText]);

	useEffect(() => {
		if (contacts) {
			setFilteredData(contacts);
		}
	}, [contacts]);


	const getPassword = async (e) => {
		if(e.data.decrypt_password && e.data.decrypt_password !== ''){
			let filterDataCopy = JSON.parse(JSON.stringify(filteredData));
				filterDataCopy[e.rowIndex]['show_password'] = false;
				setFilteredData(filterDataCopy)
		}else{
			let res = await dispatch(showPassword({'password': e.data.password}))
			if(res.payload && res.payload.success){
				
				let filterDataCopy = JSON.parse(JSON.stringify(filteredData));
				filterDataCopy[e.rowIndex]['decrypt_password'] = res.payload.password;
				filterDataCopy[e.rowIndex]['show_password'] = true;
				setFilteredData(filterDataCopy)
				
			}
		}
		
		
		// data[0].password = 'password';
	};

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
					There are no referrer. Please search for it!
				</Typography>
			</div>
		);
	}

	return (
		<div className="makeStyles-content-414 flex flex-col h-full">
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<FuseAnimate animation="transition.slideUpIn" delay={300}>

				<ReferrerTable
					data={filteredData}
					onViewPasswordClick={(ev) => {
						getPassword(ev)
					}}
				/>
			</FuseAnimate>
		</div>
	);
}

export default ReferrerList;

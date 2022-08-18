import React, {useEffect, useState} from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import Typography from '@material-ui/core/Typography';
import CancelExamManagementTable from './CancelExamManagementTable';
import {getCancelExamManagementData} from './store/CancelExamManagementSlice';

const CancelExamManagementList = () => {
	const dispatch = useDispatch();
	const storeData = useSelector(({CancelExamManagementApp}) => CancelExamManagementApp.CancelExamManagement);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		fetchData()
	}, []);

	useEffect(() => {
		if (storeData.isCreatedSuccess === true) {
			fetchData()
		}
	}, [storeData.isCreatedSuccess]);

	useEffect(() => {
		if (storeData.isUpdateSuccess) {
			fetchData()
		}
	}, [storeData.isUpdateSuccess]);

	const fetchData = async () => {
		setLoading(true);
		const result = await dispatch(getCancelExamManagementData());
		setFilteredData(result.payload.data);
		setLoading(result.payload.isLoading);
	}
	if (loading) {
		return (
			<div style={{
				marginTop: 300
			}}>
				<CircularStatic />
			</div>
		)
	}
	if (!filteredData || filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					There are no Insurance Company. Please search for it!
				</Typography>
			</div>
		);
	}
	return (
		<div className="makeStyles-content-414 flex flex-col h-full">
			{/* <Backdrop open={open}>
				<CircularProgress color="inherit" />
			</Backdrop> */}

			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<CancelExamManagementTable
					data={filteredData}
				/>
			</FuseAnimate>
		</div>
	);
}
export default CancelExamManagementList;
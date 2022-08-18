import FuseAnimate from '@fuse/core/FuseAnimate';
import CircularProgress from '@material-ui/core/CircularProgress';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuditTable from './AuditTable';
import SingleAuditDetailTable from './SingleAuditDetailTable';
import PatientAuditDetailTable from './PatientAuditDetailTable';
import UserAuditsTable from './UserAuditsTable';
//import AttorneyEdit from '../../attorney/AttorneyEdit';
import { clearData, getSingleAuditDetails, setIsSearching, setTableNumber, getAuditsForUser,searchPatientsDetail, getAudit, selectAudit, setFilterOptions, setAuditSearchText, clearFilterOptions, removErrorMessage, removeFilterOptions } from './store/auditSlice';
import Paper from '@material-ui/core/Paper';
import Searchbar from '../referrer/Searchbar';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import ClearIcon from '@material-ui/icons/Clear';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';


const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function AuditList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const dispatch = useDispatch();
	const audit = useSelector(selectAudit);


	const searchText = useSelector(({ auditApp }) => auditApp.audit.searchText);
	const isSearching = useSelector(({ auditApp }) => auditApp.audit.isSearching);
	const auditType = useSelector(({ auditApp }) => auditApp.audit.auditType);
	const filterOptions = useSelector(({ auditApp }) => auditApp.audit.filterOptions);
	const tableNo = useSelector(({ auditApp }) => auditApp.audit.tableNo);
	//const user = useSelector(({ attorneyApp }) => attorneyApp.user);
	const confirmationDialog = useSelector(({ auditApp }) => auditApp.audit.confirmationDialog);
	const thirdTableSearchData = useSelector(({ auditApp }) => auditApp.audit.thirdTableSearchData);
	const secondTableSearchData = useSelector(({ auditApp }) => auditApp.audit.secondTableSearchData);
	const userAuditsData = useSelector(({ auditApp }) => auditApp.audit.userAuditsData);
	
	
	const [filteredData, setFilteredData] = useState([]);
	//const [isSearchingState, setIsSearching] = useState(false);
	const [clearScreen, setClearScreen] = useState(false);
	const mainTheme = useSelector(selectMainTheme);


	const defaultOptions= useSelector(({ auditApp }) => auditApp.audit.defaultOptions);
	


	const [whereOperator, setWhereOperator] = React.useState('AND');

	const removeFilterOption = (index) => {
		dispatch(clearData())
		dispatch(removeFilterOptions(index));

		dispatch(setTableNumber({ tableNo: 0 }))

	}


	const handleFilterOption = async (value) => {
		
		dispatch(setFilterOptions(value));
	}

	const clearFilterOption = (index) => {
		setFilteredData([])
		dispatch(clearData())

		dispatch(setTableNumber({ tableNo: 0 }))
		dispatch(clearFilterOptions(''));

	}

	useEffect(() => {


		var fields = [];
		filterOptions.map((value, key) => {
			let row = { filedname: value.value, value: value.match, operator: '', name: value.name };
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

		let params = { fields: fields, action: 'FIELDS' };

		let search = dispatch(setAuditSearchText(params));
		if (fields.length == 0) {
			setFilteredData([])
			dispatch(clearData([]))

		}


	}, [filterOptions, whereOperator]);


	async function fetchData() {
		const result = await dispatch(searchPatientsDetail(searchText));
		
		if (result.payload.data) {
			if (tableNo == 0)
				setFilteredData(result.payload.data)
			dispatch(setIsSearching(false));
		}
	}

	async function fetchSingleAuditData() {
		
		const result = await dispatch(getSingleAuditDetails(searchText))

		if (result.payload.data) {
			dispatch(setIsSearching(false));
		}
	}

	async function fetchAuditForUser() {
		const result = await dispatch(getAuditsForUser(searchText))

		if (result.payload.data) {
			dispatch(setIsSearching(false));
		}
	}

	useEffect(() => {
		let ignore = false;

		if(auditType=='Patient'){

			if (searchText.fields.length > 0 && searchText.type && (tableNo == 0 || tableNo == 1)) {
				dispatch(setIsSearching(true));
				fetchData();
			}
			else if (searchText.fields.length > 0 && searchText.type && tableNo == 2) {
				fetchSingleAuditData()
			}
		}
		else if(auditType=='User'){
			 if (searchText.fields.length > 0 && searchText.type) {
				dispatch(setIsSearching(true));
				fetchAuditForUser();
			 }
		}

		return () => { ignore = true; }
	}, [searchText.fields, searchText.type]);


	return (
		<div>
			{(auditType != '') ?
				<div className="flex flex-1 items-center justify-between rs-top-filter">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<ThemeProvider theme={mainTheme}>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Paper
										className="flex p-4 items-center w-full max-w-512 h-40 px-8 py-4 rounded-8"
										elevation={1}
									>
										<Icon color="action">search</Icon>

										<Searchbar setFilterOption={handleFilterOption} defaultOptions={defaultOptions} />

									</Paper>
								</FuseAnimate>
							</ThemeProvider>
						</Grid>
						{(filterOptions.length > 0) ?
							<Grid item xs={12} className="py-0">
								<div className="filter-item-container">
									{filterOptions.map((option, index) => (
										<div className="filter-item" key={index + '-' + Math.floor(Math.random() * 100)}>
											{(index > 0) ? <select className="filter-operator" onChange={(e) => setWhereOperator(e.target.value)} value={whereOperator}  >
												<option value="AND">AND</option>
												<option value="OR">OR</option>
											</select> : null}
											<Button className="filter-content" variant="outlined">
												{(option.value !== 'keyword') ? (<b>{option.title}:</b>) : null}&nbsp; {option.showMatch || option.match}
												<span style={{ marginLeft: '5px' }} onClick={() => removeFilterOption(index)} >
													<ClearIcon />
												</span>
											</Button>
										</div>
									))}
									{(filterOptions.length > 0) ? <div className="filter-button"><Button className="clear-filter" variant="outlined" onClick={() => clearFilterOption()}>Clear Filters</Button></div> : null}
								</div>
							</Grid> : null}

					</Grid>
				</div> : null}



			{((filteredData.length == 0 || filterOptions.length == 0) && !isSearching && tableNo==0) ?
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5" className="mt-32">
						Please search for Audit Details by selecting the type first and then use the filters !!
					</Typography>
				</div> : null
			}

			{((thirdTableSearchData.length == 0 || filterOptions.length == 0) && !isSearching && tableNo==2) ?
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5" className="mt-32">
						Please search for Audit Details by selecting the type first and then use the filters !!
					</Typography>
				</div> : null
			}
			{((secondTableSearchData.length == 0 || filterOptions.length == 0) && !isSearching && tableNo==1) ?
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5" className="mt-32">
						Please search for Audit Details by selecting the type first and then use the filters !!
					</Typography>
				</div> : null
			}

			{((userAuditsData.length == 0 || filterOptions.length == 0) && !isSearching && tableNo==null) ?
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5" className="mt-32">
						Please search for Audit Details by selecting the type first and then use the filters !!
					</Typography>
				</div> : null
			}

			<div>
				{(isSearching) ?
					<div style={{
						marginTop: 300
					}}>
						<CircularStatic />
					</div>
					: null}


				{((filteredData.length > 0 && tableNo == 0) && !isSearching) ?
					<div className="makeStyles-content-414 flex flex-col">
						<Backdrop className={classes.backdrop} open={open}>
							<CircularStatic color="inherit" />
						</Backdrop>

						<FuseAnimate animation="transition.slideUpIn" delay={300}>
							<AuditTable
								data={filteredData}
							/>
						</FuseAnimate>
					</div> : null
				}
				{((thirdTableSearchData.length > 0 && tableNo == 2) && !isSearching) ?
					<div className="makeStyles-content-414 flex flex-col">
						<Backdrop className={classes.backdrop} open={open}>
							<CircularStatic color="inherit" />
						</Backdrop>

						<FuseAnimate animation="transition.slideUpIn" delay={300}>
							<SingleAuditDetailTable
								data={thirdTableSearchData}
							/>
						</FuseAnimate>
					</div> : null
				}

				{((secondTableSearchData.length > 0 && tableNo == 1) && !isSearching) ?
					<div className="makeStyles-content-414 flex flex-col">
						<Backdrop className={classes.backdrop} open={open}>
							<CircularStatic color="inherit" />
						</Backdrop>

						<FuseAnimate animation="transition.slideUpIn" delay={300}>
							<PatientAuditDetailTable
								data={secondTableSearchData}
							/>
						</FuseAnimate>
					</div> : null
				}

				{(userAuditsData.length > 0  && !isSearching) ?
					<div className="makeStyles-content-414 flex flex-col">
						<Backdrop className={classes.backdrop} open={open}>
							<CircularStatic color="inherit" />
						</Backdrop>

						<FuseAnimate animation="transition.slideUpIn" delay={300}>
							<UserAuditsTable
								data={userAuditsData}
							/>
						</FuseAnimate>
					</div> : null
				}
			</div>
		</div>
	);
}



export default AuditList;

import FuseAnimate from '@fuse/core/FuseAnimate';
// import CircularProgress from '@material-ui/core/CircularProgress';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import Fade from '@material-ui/core/Fade';
import Searchbar from '../referrer/Searchbar';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import { setIsSearching,searchingInsuranceCompany, setInsuranceSearchText, setFilterOptions, removeFilterOptions, clearFilterOptions, removErrorMessage } from './store/insuranceSlice';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Insurancetable from './InsuranceTable';
//import AttorneyEdit from './AttorneyEdit';
import { getInsurance, selectInsurance } from './store/insuranceSlice';
import moment from 'moment';

import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function InsuranceLookUpList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [whereOperator, setWhereOperator] = React.useState('AND');
	const dispatch = useDispatch();
	const filterOptions = useSelector(({ insuranceApp }) => insuranceApp.insurance.filterOptions);
	const insuranceType = useSelector(({ insuranceApp }) => insuranceApp.insurance.insuranceType);
	const insurance = useSelector(selectInsurance);
	const searchText = useSelector(({ insuranceApp }) => insuranceApp.insurance.searchText);
	const isSearching = useSelector(({ insuranceApp }) => insuranceApp.insurance.isSearching);
	

	//const user = useSelector(({ attorneyApp }) => attorneyApp.user);
	const confirmationDialog = useSelector(({ insuranceApp }) => insuranceApp.insurance.confirmationDialog);
	const mainTheme = useSelector(selectMainTheme);
	const [filteredData, setFilteredData] = useState([]);

	const [clearScreen, setClearScreen] = useState(false);



	const [defaultOptions, setDefaultOptions] = React.useState([
		{ title: 'Insurance Company Name', value: 'name', match: '', type: 'string', name: 'name' },
		{ title: 'Phone', value: 'phone', match: '', type: 'string', name: 'phone' },
		{ title: 'Fax', value: 'fax', match: '', type: 'string', name: 'fax' },

	]);

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
		let search = dispatch(setInsuranceSearchText(params));

		if (fields.length == 0) {
			setFilteredData([])
		}


	}, [filterOptions, whereOperator]);



	const handleFilterOption = async (value) => {
		dispatch(setIsSearching(true));
		const data = await dispatch(setFilterOptions(value));

		//	fetchData()


	}
	useEffect(() => {
		//dispatch(setInsuranceSearchText(''));
		//	dispatch(clearFilterOptions(''));
		//	setClearScreen(true)
	}, []);

	// useEffect( () => {

	// },[insuranceType]);

	async function fetchData() {
		const result = await dispatch(searchingInsuranceCompany(searchText));

		if (result.payload.data) {
			setFilteredData(result.payload.data)
			dispatch(setIsSearching(false));
		}

	}
	const removeFilterOption = (index) => {
		dispatch(removeFilterOptions(index));

	}
	const clearFilterOption = (index) => {
		setFilteredData([])
		dispatch(clearFilterOptions(''));
		
	}



	useEffect(() => {
		let ignore = false;

		if (searchText.fields.length > 0 && searchText.type) {
			dispatch(setIsSearching(true));
			fetchData();
		}
		return () => { ignore = true; }
	}, [searchText.fields, searchText.type]);




	


	//if (!filteredData || filteredData.length === 0) {
	return (
		<div>
			{(insuranceType != '') ?
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
						{(filterOptions.length > 0 ) ?
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
			{((filteredData.length == 0 || filterOptions.length == 0) && !isSearching) ?
				<div className="flex flex-1 items-center justify-center h-full">
					<Typography color="textSecondary" variant="h5" className="mt-32">
						Please search for Insurance Company by selecting the type first and then use the filters !!
					</Typography>
				</div> : null
			}
			{(filteredData.length > 0 || isSearching) ?
				<div className="makeStyles-content-414 flex flex-col">
					<Backdrop className={classes.backdrop} open={open}>
						<CircularStatic color="inherit" />
					</Backdrop>

					<FuseAnimate animation="transition.slideUpIn" delay={300}>
						<Insurancetable
							data={filteredData}
						/>
					</FuseAnimate>
				</div> : null
			}

		</div>
	);
	//}
	// return (
	// 	<div class="makeStyles-content-414 flex flex-col h-full">
	// 		<Backdrop className={classes.backdrop} open={open}>
	// 			<CircularProgress color="inherit" />
	// 		</Backdrop>

	// 		<FuseAnimate animation="transition.slideUpIn" delay={300}>
	// 			<Insurancetable
	// 				data={filteredData}
	// 			/>
	// 		</FuseAnimate>
	// 	</div>
	// );
}

export default InsuranceLookUpList;

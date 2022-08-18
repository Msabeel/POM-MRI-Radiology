import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setexamSearchText,setFilterOptions,removeFilterOptions, clearFilterOptions  } from './store/examSlice';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import Searchbar from '../referrer/Searchbar';

function ExamHeader(props) {
	const dispatch = useDispatch();
	// const searchText = useSelector(({ modalityApp }) => modalityApp.attorney.searchText);
	const mainTheme = useSelector(selectMainTheme);
	const [open, setOpen] = React.useState(false);
	const [openError, setOpenError] = React.useState(false);
	const filterOptions = useSelector(({ examApp }) => examApp.exam.filterOptions);
	const [whereOperator, setWhereOperator] = React.useState('AND');

	useEffect(() => {
		var fields = [];
		filterOptions.map((value, key) => {
			let row = { filedname: value.value, value: value.match, operator: '' };
			if(filterOptions.length > 1 && key == 0){
				row.operator = ''
			}
			if(filterOptions.length > 1 && key > 0){
				row.operator = whereOperator
			}
			if(value.type === 'date') {
				row.value = moment(row.value).format('YYYY-MM-DD')
			}

			fields.push(row);
		})
		let params = {fields: fields};
		dispatch(setexamSearchText(params));
	 }, [filterOptions, whereOperator]);


	const handleFilterOption = (value) => {
		dispatch(setFilterOptions(value));
	}


	const removeFilterOption = (index) => {
		dispatch(removeFilterOptions(index));
	}

	const handleClose = (event, reason) => {
		setOpen(false);
	};
	const handleCloseError = (event, reason) => {
		setOpenError(false);
	};

	const [defaultOptions, setDefaultOptions] = React.useState([
		{ title: 'SRNO.', value: '', match: '', type:'string' },
		{ title: 'Exam', value: 'exam', match: '', type:'string' },
		{ title: 'Cpt1', value: 'c[t1', match: '', type:'string' },
		{ title: 'Location', value: 'location', match: '', type:'string' },
		{ title: 'Modality', value: 'modality', match: '', type:'string' },
		
	  ]); 

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-224">
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

				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">account_box</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-12 hidden sm:flex">
							Exam Management
						</Typography>
					</FuseAnimate>
				</div>
			</div>
			<div className="flex flex-1 items-center justify-between px-8 sm:px-12 rs-top-filter">
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<ThemeProvider theme={mainTheme}>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Paper
									className="flex p-4 items-center w-full max-w-512 h-40 px-8 py-4 rounded-8"
									elevation={1}
								>
									<Icon color="action">search</Icon>

									<Searchbar setFilterOption={handleFilterOption} defaultOptions={defaultOptions}/> 
									
								</Paper>
							</FuseAnimate>
						</ThemeProvider>
					</Grid>
					
					{(filterOptions.length > 0) ? 
						<Grid item xs={12} className="py-0">
							<div className="filter-item-container">
								{filterOptions.map((option, index) => (
									<div className="filter-item"  key={index + '-' + Math.floor(Math.random() * 100)}>
									{(index > 0) ? <select className="filter-operator" value={whereOperator} onChange={(e) => setWhereOperator(e.target.value)} >
										<option value="AND">AND</option>
										<option value="OR">OR</option>
									</select> : null }
									<Button className="filter-content" variant="outlined">
									 {(option.value !== 'keyword')? (<b>{option.title}:</b>) : null}&nbsp; {option.showMatch || option.match} 
										<span style={{ marginLeft: '5px' }} onClick={() => removeFilterOption(index)} >
											<ClearIcon />
										</span>
									</Button>
									</div>
								))}
								{(filterOptions.length > 0) ? <div className="filter-button"><Button className="clear-filter" variant="outlined" onClick={() => dispatch(clearFilterOptions(''))}>Clear Filters</Button></div> : null}
							</div>
						</Grid>: null}
					
				</Grid>
			</div>
			<PermissionSwitch permission="attorney_lookup" />
			
		</div>
	);
}

export default ExamHeader;

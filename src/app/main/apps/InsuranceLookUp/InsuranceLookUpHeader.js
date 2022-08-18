import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import { setInsuranceTypeinState, insuranceCompanyTypes, setInsuranceSearchText, setFilterOptions, removeFilterOptions, clearFilterOptions, removErrorMessage } from './store/insuranceSlice';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import AlertDialog from 'app/fuse-layouts/shared-components/AlertDialog';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from 'react-bootstrap-slider';
import Card from "react-bootstrap-slider";
import { Accordion, AccordionSummary } from 'react-bootstrap-slider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppBar from '@material-ui/core/AppBar';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import CardContent from '@material-ui/core/CardContent';
import { useForm } from '@fuse/hooks';
import clsx from 'clsx';
import { ImportantDevices } from '@material-ui/icons';


const head = {
	color: '#fff',
	
	paddingTop: '22px',
	display: ' flex',
	// background: 'linear-gradient(to left, #122230 0%, #192d3e 100%)',
	minHeight: ' 60px',
	backgroundSize: 'cover',
	alignItems: 'center'
	//backgroundColor: '#122230'
},
	head1 = {
		color: '#fff',
		
		paddingTop: '22px',
		display: ' flex',
		// background: 'linear-gradient(to left, #122230 0%, #192d3e 100%)',
		minHeight: ' 60px',
		backgroundSize: 'cover',
		width: '100%',
		float: 'left',
		alignItems: 'center'
	},
	active = {
		color: "red",
	}
	 

const useStyles = makeStyles(theme => ({
	selectedButton: {
		backgroundColor: 'rgb(76, 175, 80) !important',
		fontSize: '12px',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80) !important',
		},
	},
	button: {
		fontSize: '11px',
		fontWeight: '700'
	},
	padding_0 : {
		paddingBottom:'0px !important'
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


const button = {
	fontSize: '11px',
	fontWeight: '700'
}


function InsuranceLookUpHeader(props) {


	function handleClick(e) {
		// modify the state, this will automatically recall render() below.
		this.setState((prevState) => {
			return { animate: !prevState.animate }
		});
	}

	const classes = useStyles();
	const card = '';


	const dispatch = useDispatch();
	const searchText = useSelector(({ insuranceApp }) => insuranceApp.insurance.searchText);
	const mainTheme = useSelector(selectMainTheme);
	const [open, setOpen] = React.useState(false);
	const [openError, setOpenError] = React.useState(false);
	//	const filterOptions = useSelector(({ insuranceApp }) => insuranceApp.insurance.filterOptions);

	//	const err_msg = useSelector(({ insuranceApp }) => insuranceApp.insurance.err_msg);
	const err_msg = '';
	const [whereOperator, setWhereOperator] = React.useState('AND');

	const insuranceType = useSelector(({ insuranceApp }) => insuranceApp.insurance.insuranceType);
	//const insuranceType = useSelector(({ insuranceApp }) => insuranceApp.insurance.insuranceType);
	const [insuranceTypes, setInsuranceTypes] = useState([]);
	const [isSearchingState, setIsSearching] = useState(true);



	async function fetchInsuranceCompanyTypes() {
		const result = await dispatch(insuranceCompanyTypes());
		setInsuranceTypes(result.payload.data)
		setIsSearching(false)
		// if(result.payload.data){
		// 	setFilteredData(result.payload.data)
		// }			
		// setIsSearching(false);
	}

	useEffect(() => {
		fetchInsuranceCompanyTypes()
	}, []);




	const handleSelected = (event, name) => {

		//setInsuranceType(name);
		dispatch(setInsuranceTypeinState(name));
		dispatch(setInsuranceSearchText({ type: name, action: 'TYPE' }))

	}





	if (isSearchingState) {
		return (
			<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
				<div style={head1} className=" head  p-12">
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-12 hidden sm:flex">
							<Icon className="text-32 mr-12">account_box</Icon>
							Insurance LookUp
						</Typography>

					</FuseAnimate>

					<div style={{
						textAlign: 'center',
						width: '50%',
						marginTop: '0px'
					}}>
						<CircularStatic color="inherit" />
					</div>
				</div>
			</div>
		);
	}



	return (

		<div >

			<div style={head} className=" head  p-12">

				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography variant="h6" className="mx-12 hidden sm:flex">
						<Icon className="text-32 mr-12">account_box</Icon>
						Insurance LookUp
					</Typography>

				</FuseAnimate>


				{

					insuranceTypes.map((item, i) =>
						(item.type != 'Self Pay') ?
							<AccordionDetails key={item.id} className="justify-center p-0 ">
								<CardContent   className={"p-0 "+classes.padding_0}>
									<div className="flex justify-center w-full ">
										<Button
											style={button}
											variant="contained"
											color={insuranceType === item.type ? "primary" : "default"}
											type="submit"
											className={clsx(
												insuranceType === item.type ? classes.selectedButton : '',
												'mr-10'
											)}
											// onClick={this.handleClick}

											onClick={(e) => handleSelected(e, item.type)}
										>
											{item.type}

										</Button>

									</div>
								</CardContent>
							</AccordionDetails> : null


					)
				}


			</div>







			<div className="flex flex-1 items-center justify-between p-8 ">

				<div className="flex flex-shrink items-center ">
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

				</div>
				<PermissionSwitch permission="attorney_lookup" />


				{/* <div>{err_msg && <AlertDialog isOpen={true} alertType="error" alertMessage={err_msg}</div> */}
			</div>



		</div>


	);
}


export default InsuranceLookUpHeader;

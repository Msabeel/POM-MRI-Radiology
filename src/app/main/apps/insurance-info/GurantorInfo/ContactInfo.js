import {
	ISelectSearchFormsy,
	SelectSearchFormsy,
	SelectFormsy,
    TextFieldFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import MenuItem from '@material-ui/core/MenuItem';
import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createStyles, makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeGIContactInfoDialog,
	updateNavigationBlocked
} from '../store/InsuranceInfoSlice';
const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
const floatRegExpMessage = 'Please enter number only';

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

function ContactInfo(props) {
	const dispatch = useDispatch();
	const giContactInfoDialog = useSelector(({ insuranceInfoApp }) => insuranceInfoApp.insuranceInfo.giContactInfoDialog);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredStates, setFilteredStates] = useState([]);
	const [filteredCountries, setFilteredCountries] = useState([]);

    const initDialog = useCallback(async () => {
		if (giContactInfoDialog.data) {
			if(giContactInfoDialog.data.city_p > 0) {
				const cityObj = props.allCity.find(c=> c.id === giContactInfoDialog.data.city_p);
				const states = [{ id: cityObj.state_id, name: cityObj.state_name }];
				const countries = [{ id: cityObj.country_id, name: cityObj.country_name }];
				setFilteredStates(states);
				setFilteredCountries(countries);
				setForm({ ...giContactInfoDialog.data, city_name: cityObj.name });
			}
			else {
				setForm({ ...giContactInfoDialog.data });
			}
		}
	}, [giContactInfoDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (giContactInfoDialog.props.open) {
			initDialog();
		}
	}, [giContactInfoDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closeGIContactInfoDialog(form));
	}
	
	function handleCityChange(event, cityObj) {
		if(cityObj && cityObj.id > 0) {
			const states = [{ id: cityObj.state_id, name: cityObj.state_name }];
			const countries = [{ id: cityObj.country_id, name: cityObj.country_name }];
			setFilteredStates(states);
			setFilteredCountries(countries);
			setForm({ 
				...form, 
				city_p: cityObj.id,
				city_name: cityObj.name,
				state_p: cityObj.state_id,
				state_name: cityObj.state_name,
				country_p: cityObj.country_id,
				country_name: cityObj.country_name,
			});
		}
		else {
			setForm({ 
				...form, 
				city: null,
				city_name: null
			});
		}
	}

	function handlePhoneChange(event) {
		const name = event.target.name;
		const str = event.target.value;
		//Filter only numbers from the input
		let cleaned = ('' + str).replace(/\D/g, '');
		
		//Check if the input is of correct length
		let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
	  
		if (match) {
			setForm({ 
				...form, 
				[name]: '(' + match[1] + ')' + match[2] + '-' + match[3]
			});
		};
		return null
	};

	function handleChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		form[name] = value;
		setForm({ ...form });
		dispatch(updateNavigationBlocked(true));
	}

	function handleSubmit(event) {
		event.preventDefault();
		closeComposeDialog();
	}
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...giContactInfoDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="sm"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Gurantor Information {'>'} Contact Detail
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="ssn_p"
							id="ssn_p"
							value={form.ssn_p}
							onChange={handleChange}
							label="SSN"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="address1_p"
							id="address1_p"
							value={form.address1_p}
							onChange={handleChange}
							label="Address1"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="address2_p"
							id="address2_p"
							value={form.address2_p}
							onChange={handleChange}
							label="Address2"
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<SelectSearchFormsy
							id="city_p"
							name="city_p"
							label="Select City"
							style={{ width: '100%' }}
							onChange={handleCityChange}
							value={form.city_name}
							allCity={props.allCity}
							required
						/>
					</div>
					<div className="flex mb-24">
						<SelectFormsy
							id="state_p"
							name="state_p"
							label="State"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleChange}
							value={form.state_p}
							>
							<MenuItem value="">Select States
							</MenuItem>
							{filteredStates && filteredStates.map(item =>
								<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
							)}
						</SelectFormsy>
					</div>
					<div className="flex mb-24">
						<SelectFormsy
							id="country_p"
							name="country_p"
							label="Country"
							variant="outlined" 
							style={{ width: '100%' }}
							onChange={handleChange}
							value={form.country_p}
							>
							<MenuItem value="">Select Country
							</MenuItem>
							{filteredCountries && filteredCountries.map(item =>
								<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
							)}
						</SelectFormsy>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							label="Zip"
							id="zip_p"
							name="zip_p"
							value={form.zip_p}
							onChange={handleChange}
							variant="outlined"
							fullWidth
							validations={{
								minLength: 5,
							}}
							validationErrors={{
								minLength: 'Min character length is 5',
							}}
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							label="Phone"
							id="phone_p"
							name="phone_p"
							value={form.phone_p}
							onChange={handlePhoneChange}
							variant="outlined"
							fullWidth
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="mobile_p"
							id="mobile"
							value={form.mobile_p}
							onChange={handlePhoneChange}
							label="Mobile"
							variant="outlined"
							fullWidth
							validations={{
								matchRegexp: /^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/,
							}}
							validationErrors={{
								matchRegexp: 'Please enter valid mobile number',
							}}
						/>
					</div>
					<div className="flex mb-24">
						<TextFieldFormsy
							type="text"
							name="email_p"
							label="Email"
							value={form.email_p}
							onChange={handleChange}
							validations={{
								isEmail: true,
							}}
							validationErrors={{
								isEmail: "This is not a valid email"
							}}
							fullWidth
							variant="outlined"
						/>
					</div>
				</DialogContent>	
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						<Button
							variant="contained"
							color="secondary"
							className="mr-8"
							type="submit"
							onClick={handleSubmit}
						>
							Close
						</Button>
					</div>
				</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default ContactInfo;

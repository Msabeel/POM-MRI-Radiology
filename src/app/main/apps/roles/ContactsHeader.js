import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setContactsSearchText } from './store/contactsSlice';

function ContactsHeader(props) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ rolesApp }) => rolesApp.contacts.searchText);
	const mainTheme = useSelector(selectMainTheme);

	return (
		<div className="flex flex-1 items-center justify-between p-4 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-500">
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
							Roles Management
						</Typography>
					</FuseAnimate>
				</div>
			</div>

			
		</div>
	);
}

export default ContactsHeader;

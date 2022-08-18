import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import {makeStyles} from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, {useRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {useDeepCompareEffect} from '@fuse/hooks';
import ContactDialog from './ContactDialog';
import PatientAccessDialog from './PatientAccessDialog';
import PatientAccessPrintDialog from './PatientAccessPrintDialog';
import ContactsHeader from './ContactsHeader';
import ContactsList from './ContactsList';
import RecentSearched from './RecentSearched';
import StarredPatients from './StarredPatients';
import ContactsSidebarContent from './ContactsSidebarContent';
import reducer from './store';
import {openNewContactDialog, setStaredCount, setSearchCount, getAllCity, clearSearchText, getRecentAndStarredPatientCount, clearFilterOptions} from './store/contactsSlice';
import {getUserData} from './store/userSlice';
import {removePatientInfo, clearTabs} from '../profile/store/ProfileSlice'
import history from '@history';
const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	},
	d_inline: {
		display: "inline-block"
	}
});

function ContactsApp(props) {

	const dispatch = useDispatch();
	const searchCount = useSelector(({contactsApp}) => contactsApp.contacts.searchCount);
	const staredCount = useSelector(({contactsApp}) => contactsApp.contacts.staredCount);

	const searchText = useSelector(({contactsApp}) => contactsApp.contacts.searchText);

	const [currentView, setCurrentView] = useState('recent');//contacts

	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const {id} = useParams();

	useDeepCompareEffect(() => {
		// dispatch(getContacts(routeParams));
		dispatch(clearSearchText());
		dispatch(removePatientInfo());
		dispatch(clearTabs());

		// dispatch(getAllCity());
		// let result = await dispatch(getRecentAndStarredPatientCount());

		// if(result.payload.data){
		// 	setPatientSearchCount(result.payload.data)
		// }
		dispatch(getUserData());
	}, [dispatch, routeParams]);


	useEffect(() => {
		async function fetchData() {
			if ((!searchCount || searchCount === 0) && (!staredCount || staredCount === 0)) {
				const result = await dispatch(getRecentAndStarredPatientCount());
				if (result.payload && result.payload.data) {
					dispatch(setSearchCount(result.payload.data.searchCount));
					dispatch(setStaredCount(result.payload.data.staredCount));
				}
			}

		}
		fetchData()
		if (id == 'recent') {
			setCurrentView('recent')
		} else if (id == 'starred') {
			setCurrentView('starred')
		}

		if (searchText !== '' && currentView !== 'contacts') {
			if (id !== 'all') {
				history.push(`/apps/patient/all`)
			}
			setCurrentView('contacts')
		}
	}, [searchText]);


	function switchView(type) {
		if (type == 'recent') {
			dispatch(clearFilterOptions());
			history.push(`/apps/patient/recent`)
		} else if (type == 'starred') {
			dispatch(clearFilterOptions());
			history.push(`/apps/patient/starred`)
		} else {
			history.push(`/apps/patient/all`)
		}
		setCurrentView(type)
	}

	function renderView() {
		if (currentView == 'contacts') {
			return (<ContactsList />)
		}
		else if (currentView == 'recent') {
			return (<RecentSearched />)
		}
		else if (currentView == 'starred') {
			return (<StarredPatients />)
		}
	}
	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-450 border-0 pl-4',
					header: 'ctm-height',
					wrapper: `min-h-0 ${classes.d_inline}`
				}}
				header={<ContactsHeader pageLayout={pageLayout} />}
				content={renderView()}
				leftSidebarContent={<ContactsSidebarContent currentView={currentView} switchView={switchView} />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
			<ContactDialog />
			<PatientAccessDialog />
			<PatientAccessPrintDialog />
		</>
	);
}

export default withReducer('contactsApp', reducer)(ContactsApp);

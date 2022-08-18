import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import ContactsHeader from './ContactsHeader';
import ContactsSidebarContent from './ContactsSidebarContent';
import ContactDialog from './ContactDialog';
import ContactsList from './ContactsList';
import ContactsDetails from './ContactsDetails';
import reducer from './store';
import { getContacts } from './store/contactsSlice';
import { getUserData } from './store/userSlice';

function RolesApp(props) {
	const dispatch = useDispatch();

	const pageLayout = useRef(null);
	const routeParams = useParams();

	useDeepCompareEffect(() => {
		dispatch(getContacts(routeParams));
		dispatch(getUserData());
	}, [dispatch, routeParams]);
    console.log(routeParams.id);
	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					wrapper: 'min-h-0'
				}}
				header={<ContactsHeader pageLayout={pageLayout} />}
				leftSidebarContent={<ContactsSidebarContent />}				
				content={routeParams.id !='all' ? <ContactsDetails /> : <ContactsList />}
				sidebarInner
				ref={pageLayout}
				// innerScroll
			/>
			<ContactDialog />
		</>
	);
}

export default withReducer('rolesApp', reducer)(RolesApp);

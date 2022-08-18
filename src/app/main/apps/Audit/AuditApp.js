import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import AuditHeader from './AuditHeader';
import AuditList from './AuditList';
import reducer from './store';
import {  useSelector } from 'react-redux';


const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	},
	d_inline:{
		display:"inline-block"
	},
	
});

function AuditApp(props) {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const routeParams = useParams();

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-50 sm:pb-50 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-384 border-0',
					header: 'min-h-72 h-72 sm:h-72 sm:min-h-72',
					wrapper: `min-h-0 ${classes.d_inline}`
				}}
				header={<AuditHeader pageLayout={pageLayout} />}
				content={<AuditList />}
				// leftSidebarContent={<ContactsSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('auditApp', reducer)(AuditApp);

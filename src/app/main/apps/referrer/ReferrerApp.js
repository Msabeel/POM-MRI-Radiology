import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import ReferrerHeader from './ReferrerHeader';
import ReferrerList from './ReferrerList';
import reducer from './store';
import {  useSelector } from 'react-redux';
import { getReferrerCompanyList, clearSearchText } from './store/referrerSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	},
	d_inline:{
		display:"inline-block"
	}
});

function ReferrerApp(props) {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const routeParams = useParams();
	useDeepCompareEffect(() => {
		dispatch(clearSearchText());
		dispatch(getReferrerCompanyList());
	}, [dispatch, routeParams]);

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-384 border-0',
					header: 'ctm-height',
					wrapper: `min-h-0 ${classes.d_inline}`
				}}
				header={<ReferrerHeader pageLayout={pageLayout} />}
				content={<ReferrerList />}
				// leftSidebarContent={<ContactsSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('referrerApp', reducer)(ReferrerApp);

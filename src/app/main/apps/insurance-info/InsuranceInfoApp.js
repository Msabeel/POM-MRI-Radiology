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
import InsuranceInfoHeader from './InsuranceInfoHeader';
import InsuranceInfo from './InsuranceInfo';
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
	}
});

function InsuranceInfoApp(props) {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const routeParams = useParams();

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-384 border-0',
					header: 'min-h-64 h-64 sm:h-64 sm:min-h-64',
					wrapper: `min-h-0 ${classes.d_inline}`
				}}
				header={<InsuranceInfoHeader pageLayout={pageLayout} />}
				content={<InsuranceInfo />}
				// leftSidebarContent={<ContactsSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('insuranceInfoApp', reducer)(InsuranceInfoApp);

import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useRef } from 'react';
import withReducer from 'app/store/withReducer';
import reducer from './store';

import CancelExamManagementList from './CancelExamManagementList';
import CancelExamManagementHeader from './CancelExamManagementHeader';
import { getCancelExamManagementData } from './store/CancelExamManagementSlice';

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

function CancelExamManagementApp(props) {

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-384 border-0',
					header: 'min-h-64 h-64 sm:h-136 sm:min-h-136',
					wrapper: `min-h-0 ${classes.d_inline}`
				}}
				header={<CancelExamManagementHeader pageLayout={pageLayout} />}
				content={<CancelExamManagementList />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
		</>
	);
}

export default withReducer('CancelExamManagementApp', reducer)(CancelExamManagementApp);
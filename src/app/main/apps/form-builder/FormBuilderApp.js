import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import FormBuilderHeader from './FormBuilderHeader';
import FormBuilderList from './FormBuilderList';
import ContactsList from './FormList';
import FormOrderList from './FormOrderList';
import FormPreview from './FormPreview';
import ContactsSidebarContent from './FormsSidebarContent';
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

function FormBuilderApp(props) {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const location = useLocation();
	const { id } = useParams();
	
	function renderView(){
		if(id == 'all'){
			return (<ContactsList />)
		}
		else if(id == 'order'){
			return (<FormOrderList />)
		}
		else if(id == 'preview'){
			return (<FormPreview />)
		}
		else{
			return (<FormBuilderList />)
		}
	}
	
	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-64 h-64 sm:h-64 sm:min-h-64',
					wrapper: 'min-h-0'
				}}
				header={<FormBuilderHeader pageLayout={pageLayout} />}
				content={renderView()}
				leftSidebarContent={id ==='all' || id ==='order' ? <ContactsSidebarContent /> : null}
				sidebarInner
				ref={pageLayout}
				// innerScroll
			/>
		</>
	);
}

export default withReducer('formBuilderApp', reducer)(FormBuilderApp);

import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import ViewVerificationSheet from './tabs/ViewVerificationSheet';

const useStyles = makeStyles(theme => ({
	layoutHeader: {
		height: 200,
		minHeight: 200,
		[theme.breakpoints.down('md')]: {
			height: 240,
			minHeight: 240
		}
	}
}));

function VerificationSheetPage() {
	const classes = useStyles();
	const { examId, id } = useParams()
	return (
		<>
			<FusePageSimple
				classes={{
					header: classes.layoutHeader,
					toolbar: 'px-16 sm:px-24'
				}}
				content={
					<div className="p-16 sm:p-24">
						<ViewVerificationSheet  examId={parseInt(examId)} id={parseInt(id)} />
					</div>
				}

			/>
		</>
	);
}

export default withReducer('VerificationSheetPageApp', reducer)(VerificationSheetPage);


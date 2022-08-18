import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Backdrop from '@material-ui/core/Backdrop';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { openConfirmDialog, openEditRoleDialog } from './store/contactsSlice';
import { makeStyles } from '@material-ui/core/styles';
import ContactsTable from './FormsTable';
import FormListTable from './FormListTable';
import FormPrev from './FormPrev';
import history from '@history';
import { useParams } from 'react-router-dom';
import { getModalities, getPayerType, getForms, openPreviewDialog, getExamList } from './store/formBuilderSlice';

const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));


function ContactsList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const routeParams = useParams();
	const forms = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.forms);
	const modalities = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.modalities);
	const payerType = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.payerType);
	const [isSearchingState, setIsSearching] = useState(false);
	const [formData, setFormData] = useState([]);
	const [payerTypes, setPayerTypes] = useState([]);
	const [mods, setMods] = useState([]);

	useEffect(() => {
		dispatch(getModalities());
		dispatch(getPayerType());
		dispatch(getExamList());
		dispatch(getForms());
    }, []);

	useEffect(() => {
		if(forms && forms.length > 0) {
			setFormData(forms);
		}
    }, [forms]);

	useEffect(() => {
		if(payerType && payerType.length > 0) {
			setPayerTypes(payerType);
		}
    }, [payerType]);
	useEffect(() => {
		if(modalities && modalities.length > 0) {
			setMods(modalities);
		}
    }, [modalities]);

    const onViewClick = event => {
		console.log(event)
		history.push(`/apps/formBuilder/${event.original.id}`)
	};
    
	const onPreviewClick = event => {
		console.log(event)
		// history.push(`/apps/formBuilder/preview/${event.original.id}`)
		// dispatch(openPreviewDialog(event.original));	
	};

	const onDeleteClick = event => {
		console.log(event)
		// dispatch(openConfirmDialog({ usertype: event.original.id }));	
	};

	const columns = React.useMemo(
		() => [
			
			{
				Header: 'Form Name',
				accessor: 'name',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Is Active',
				accessor: 'isactive',
				className: 'font-bold',
				sortable: true,
				// Cell: ({ row }) => (
				// 	<div className="flex items-center">
				// 		{row.name == 'Sample 1' ? 
				// 		<IconButton>
				// 			<Icon>done</Icon>
				// 		</IconButton> 
				// 		: null}
				// 	</div>
				// )
			},
			{
				id: 'action',
                Header: 'Action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						{/* <IconButton
							onClick={ev => {
								ev.stopPropagation();
								onPreviewClick(row);
							}}
						>
							<Icon>remove_red_eye</Icon>
						</IconButton> */}
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								onViewClick(row);
							}}
						>
							<Icon>edit</Icon>
						</IconButton>
						{/* <IconButton
							onClick={ev => { 
								ev.stopPropagation();
                            	onDeleteClick(row);
                            }}
						>
							<Icon>delete</Icon>
						</IconButton> */}
					</div>
				)
			}
		],
		[dispatch]
	);

	const sonResponse = (err, res) => {
        localStorage.setItem('usertype', '');
    }

	if (!forms || mods.length === 0 || payerTypes.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularStatic></CircularStatic>
			</div>
		);
	}
	return (
		<div className="makeStyles-content-414 flex flex-col h-full">
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				{/* <ContactsTable
					columns={columns}
					data={forms}
					// onRowClick={(ev, row) => {
					// 	if (row) {
					// 		dispatch(openEditRoleDialog(row.original));
					// 	}
					// }}
				/> */}
				<FormListTable
					data={formData}
					modalities={mods}
					payerType={payerTypes}
				/>
			</FuseAnimate>
			<FormPrev />
		</div>
	);
}

export default ContactsList;

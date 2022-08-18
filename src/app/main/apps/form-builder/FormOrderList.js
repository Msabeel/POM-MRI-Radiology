import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService';
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
import FormOrderedTable from './FormOrderedTable';
import FormPrev from './FormPrev';
import history from '@history';
import { useParams } from 'react-router-dom';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import { getModalities, getPayerType, getForms, saveFormOrder } from './store/formBuilderSlice';

const useStyles = makeStyles((theme) => ({

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));


function FormOrderList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const routeParams = useParams();
	const forms = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.forms);
	const modalities = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.modalities);
	const payerType = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.payerType);
	const [isSearchingState, setIsSearching] = useState(false);
	const [formData, setFormData] = useState([]);
	const [requiredForms, setRequiredForms] = useState([]);
	const [modsForms, setModsForms] = useState([]);
	const [payerTypes, setPayerTypes] = useState([]);
	const [mods, setMods] = useState([]);
	const [grid1Api, setGrid1Api] = useState(null);
	const [grid2Api, setGrid2Api] = useState(null);
	const [loading, setLoading] = useState(false);
	const CustomNotify = useCustomNotify();

	useEffect(() => {
		dispatch(getModalities());
		dispatch(getPayerType());
		dispatch(getForms());
    }, []);

	useEffect(() => {
		if(forms && forms.length > 0) {
			setFormData(forms);
			const _reqForms = [];
			const _modForms = [];
			forms.map(form => {
				if(form.required === 1) {
					_reqForms.push(form)
				}
				else {
					_modForms.push(form);
				}
			})
			setRequiredForms([..._reqForms]);
			setModsForms([..._modForms]);
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

	const sonResponse = (err, res) => {
        localStorage.setItem('usertype', '');
    }

	
	const editIcon = event => {
		return '<span class="cursor-pointer text-blue-700 underline">Edit</span>';
		// return '<i class="material-icons cursor-pointer" title="Disable Attorney">edit</i>';
	};

	const onGrid1Ready = (params) => {
		setGrid1Api(params.api);
		params.api.sizeColumnsToFit();
	} 

	const onGrid2Ready = (params) => {
		setGrid2Api(params.api);
		params.api.sizeColumnsToFit();
	}

	const handleonRowDragEnd = async (event) => {
		console.log(event);
		const formData = [];
		let counter = 0;
		grid1Api.forEachNode((node, index)=>{
			formData.push({ id: node.data.id, form_order: counter});
			counter++;
		});
		grid2Api.forEachNode((node, index)=>{
			formData.push({ id: node.data.id, form_order: counter});
			counter++;
		});
		console.log(formData);		

		setLoading(true);
		const result = await dispatch(saveFormOrder({ data: formData }));
		setLoading(false);
		if(result.payload.isUpdateSuccess) {
			CustomNotify("Form order updated successfully.", "success");
		}
		else {
			CustomNotify("Something went wrong. Please try again.", "error");
		}
	}

	const editClick = (e) => {
		history.push(`/apps/formBuilder/${e.data.id}`)
	}
	const fieldRender = (event) => {
		if (parseInt(event.value) === 1 || event.value=== 'Y') {
			return '<i class="material-icons cursor-pointer">check</i>'
		} else {
			return ''
		}
	}

	const modRender = (event) => {
		const _mods = event.value;
		let str = '';
		for(var i=0; i<_mods.length; i++) {
			for(var j=0;j<mods.length; j++) {
				if(_mods[i].modality_id === mods[j].id) {
					if(str.indexOf(mods[j].mwl_display_name)<0)
					str += mods[j].mwl_display_name + ',';
				}
			}
		}
		str = str.replace(/,\s*$/, "");
		return str;
	}

	const payerRender = (event) => {
		const payers = event.value;
		let str = '';
		for(var i=0; i<payers.length; i++) {
			for(var j=0;j<payerTypes.length; j++) {
				if(payers[i].payer_type_id === payerTypes[j].id) {
					if(str.indexOf(payerTypes[j].display_name)<0)
						str += payerTypes[j].display_name + ',';
				}
			}
		}
		str = str.replace(/,\s*$/, "");
		return str;
	}

	
	const printNode = (node, index) => {
			console.log(
			index + ' -> data: ' + node.data.name
			);
	};

	async function handleUpdateOrder() {
		const formData = [];
		let counter = 0;
		grid1Api.forEachNode((node, index)=>{
			formData.push({ id: node.data.id, form_order: counter});
			counter++;
		});
		grid2Api.forEachNode((node, index)=>{
			formData.push({ id: node.data.id, form_order: counter});
			counter++;
		});
		console.log(formData);		

		setLoading(true);
		const result = await dispatch(saveFormOrder({ data: formData }));
		setLoading(false);
		if(result.payload.isUpdateSuccess) {
			CustomNotify("Form order updated successfully.", "success");
		}
		else {
			CustomNotify("Something went wrong. Please try again.", "error");
		}
	}

	if (!forms || forms.length === 0 || mods.length === 0 || payerTypes.length === 0) {
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
			<AppBar position="static" elevation={0} className="rounded-t-8">
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
						Required Forms Ordering
					</Typography>
					{/* <div className='p-8'>
						<Button
							variant="contained"
							color="secondary"
							className="w-full"
							onClick={handleUpdateOrder}
						>
							Save Order
							{loading && <CircularProgress className="ml-10" size={18}/>}
						</Button>
					</div> */}
				</Toolbar>
			</AppBar>
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<div className="flex flex-col sm:border-1 overflow-hidden h-full" style={{ height: '100%'}}>
					<div className="ag-theme-alpine ag-grid-custom" style={{height: '120%', width: '100%', lineHeight: '30px'}}>
						<AgGridReact
							onGridReady={onGrid1Ready}
							rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
							rowData={requiredForms}
							// pagination={true}
							// paginationPageSize="5"
							rowDragManaged={true}
							animateRows={true}
							onRowDragEnd={handleonRowDragEnd}
							rowHeight={38}>
							<AgGridColumn width={60} sortable={true} rowDrag={true} tooltipField="id" field="id" headerName="Form ID"></AgGridColumn>
							<AgGridColumn width={120} sortable={true} tooltipField="name" field="name" headerName="Form Name"></AgGridColumn>
							<AgGridColumn width={60} sortable={true} headerName="Is Active" cellRenderer={fieldRender} field="isactive"></AgGridColumn>
							<AgGridColumn width={60} sortable={true} headerName="Is Required" cellRenderer={fieldRender} field="required"></AgGridColumn>
							<AgGridColumn width={120} sortable={true} headerName="Modalities" cellRenderer={modRender} field="tran_form_required_modalities"></AgGridColumn>
							<AgGridColumn width={120} sortable={true} headerName="PayerType" cellRenderer={payerRender} field="tran_form_required_payer_types"></AgGridColumn>
						</AgGridReact>
					</div>
				</div>
			</FuseAnimate>
			<AppBar position="static" elevation={0} className="rounded-t-8">
				<Toolbar className="px-8">
					<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
						Modalities / Payer Type Forms Ordering
					</Typography>
				</Toolbar>
			</AppBar>
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<div className="flex flex-col sm:border-1 overflow-hidden h-full" style={{ height: '100%'}}>
					<div className="ag-theme-alpine ag-grid-custom" style={{height: '120%', width: '100%', lineHeight: '30px'}}>
						<AgGridReact
							onGridReady={onGrid2Ready}
							rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
							rowData={modsForms}
							// pagination={true}
							// paginationPageSize="5"
							rowDragManaged={true}
							animateRows={true}
							onRowDragEnd={handleonRowDragEnd}
							rowHeight={38}>
							<AgGridColumn width={60} sortable={true} rowDrag={true} tooltipField="id" field="id" headerName="Form ID"></AgGridColumn>
							<AgGridColumn width={120} sortable={true} tooltipField="name" field="name" headerName="Form Name"></AgGridColumn>
							<AgGridColumn width={60} sortable={true} headerName="Is Active" cellRenderer={fieldRender} field="isactive"></AgGridColumn>
							<AgGridColumn width={60} sortable={true} headerName="Is Required" cellRenderer={fieldRender} field="required"></AgGridColumn>
							<AgGridColumn width={120} sortable={true} headerName="Modalities" cellRenderer={modRender} field="tran_form_required_modalities"></AgGridColumn>
							<AgGridColumn width={120} sortable={true} headerName="PayerType" cellRenderer={payerRender} field="tran_form_required_payer_types"></AgGridColumn>
						</AgGridReact>
					</div>
				</div>
			</FuseAnimate>
			<FormPrev />
		</div>
	);
}

export default FormOrderList;

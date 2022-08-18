import {
	ISelectSearchFormsy,
	TextFieldFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import {useForm} from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createStyles, makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import PreviewComponent from './PreviewComponent';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {
	closePreviewDialog,
} from './store/formBuilderSlice';
const IndexSettings =  JSON.parse(localStorage.getItem('Index_Details'));

function FormPrev(props) {
	const dispatch = useDispatch();
	const previewDialog = useSelector(({formBuilderApp}) => formBuilderApp.formBuilder.previewDialog);
	const {form, handleChange1, setForm} = useForm({});
	const formRef = useRef(null);
	const [editMode, setEditMode] = useState(false);
	const [editElement, setEditElement] = useState(null);
	const [elementData, setElementData] = useState([]);
	const IndexSettings =  JSON.parse(localStorage.getItem('Index_Details'));

	const initDialog = useCallback(async () => {
		if (previewDialog.data) {
			setForm({...previewDialog.data});
			setElementData(previewDialog.data);
		}
	}, [previewDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (previewDialog.props.open) {
			initDialog();
		}
	}, [previewDialog.props.open, initDialog]);

	function closeComposeDialog() {
		dispatch(closePreviewDialog());
	}

	function editModeOn(data, e) {
		e.preventDefault();
		e.stopPropagation();
		if (editMode) {
			setEditMode(!editMode);
			setEditElement(null);
		} else {
			setEditMode(!editMode);
			setEditElement(data);
		}
	}

	function manualEditModeOff() {
		if (editMode) {
			setEditMode(false);
			setEditElement(null);
		}
	}

	function updateElementData(data) {
		setElementData(data);
	}

	function handleSubmit(event) {
		event.preventDefault();
		closeComposeDialog();
	}

	const handlePrint = (event) => {
		event.preventDefault();
		var content = document.getElementById("printArea");
		var w = window.open();
		w.document.write('<html><head><title></title><style>* {color: #fff} .flex-col{flex-direction: column;} .w-full{width:100%;} .flex-1{flex: 1 1;} .flex{display:flex;} .mr-10{margin-right:10px;} input {outline: 0;border-width: 0 0 2px;border-color: black} img {display:none} .w-1-3{width:33%;} .quest{margin-bottom: 5px;} .justify-center{justify-content:center} .justify-left{justify-content:left} .justify-right{justify-content:right} .logo-icon{display: flex;} .no-print{display:none;} .text-center{text-align: center;} .font-normal{font-size: 15px; font-family: Muli,Roboto,sans-serif} .font-bold{font-size: 20px; font-weight: bold; font-family: Muli,Roboto,sans-serif} @media print{ * {color: #000 } .MuiSvgIcon-root{display:none} .radio{height:15px;width:15px;display: flex;margin-right:50px} .print-card{padding-bottom: 10px; border-bottom: 1px solid #000} img {display:block; max-width: 100%}}			</style></head><body>');
		w.document.write(content.innerHTML);
		w.document.write('</body></html>');
		w.print();
		w.close();
	}

	function handleAddSignature(event) {
		event.preventDefault();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...previewDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Form Preview
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
				onValidSubmit={handleSubmit}
				ref={formRef}
				className="flex flex-col md:overflow-hidden"
			>
				<DialogContent classes={{root: 'p-24'}}>
					<div id={'printArea'}>
						<PreviewComponent 
							currentForm={elementData} 
							isPreview={true}
							logobase64={IndexSettings.index_logo} 
						/>
					</div>
				</DialogContent>
				<DialogActions className="justify-between p-8">
					<div className="px-16">
						{/* <Button
							variant="contained"
							color="primary"
							className="mr-8"
							type="submit"
							onClick={handlePrint}
						>
							Print
						</Button> */}
						<Button
							variant="contained"
							color="secondary"
							className="mr-8"
							type="submit"
							onClick={handleSubmit}
						>
							Close
						</Button>
					</div>
				</DialogActions>
			</Formsy>
		</Dialog>
	);
}

export default FormPrev;

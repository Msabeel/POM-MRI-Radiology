import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert, } from '@material-ui/lab';
import history from '@history';
import _ from '@lodash';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import Toolbar from './Toolbar';
import Placeholder from './Placeholder';
import Preview from './preview1';
import Registry from './store/registry';
import { getAllPlaceholder, saveFormQuestion, openPreviewDialog, updateFormQuestion, openNewFormDialog, updateNewFormDialog, editNewFormDialog } from './store/formBuilderSlice';
import NewFormDialog from './NewFormDialog';
import FormPrev from './FormPrev';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';

const useStyles = makeStyles((theme) => ({
		builder: {
		top: -30,
        backgroundColor: 'white',
        '& h4': {
            marginTop: 0,
            textAlign: 'center',
          },
        '& ul': {
            padding: 0,
            '& li': {
                cursor: 'pointer',
                listStyle: 'none',
                margin: '5px',
                padding: '10px',
                border: '1px dashed #ddd',
                '& i': {
                  margin: '0 15px 0 10px',
                }
              }
          }
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

function FormBuilderList(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editElement, setEditElement] = useState(null);
	const formDialog = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.formDialog);
	const forms = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.forms);
	const modalities = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.modalities);
	const payerType = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.payerType);
	const { id } = useParams();
	const [elementData, setElementData] = useState([]);
	const [deletedData, setDeletedData] = useState([]);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
    const [placeHolders, setPlaceholders] = useState([]);
	const [openError, setOpenError] = React.useState(false);
	const [isOpen, setIsOpen] = useState(false)
	const [formData, setFormData] = useState({})
	const CustomNotify = useCustomNotify();

	useEffect(() => {
        async function fetchPlaceholders() {
          const result = await dispatch(getAllPlaceholder());
          const data = result.payload.data
          setPlaceholders(data);
        }
        fetchPlaceholders();
    }, []);

	useEffect(() => {
        if(forms.length > 0 && id > 0) {
			let form = forms.find(y => y.id == id );
			if(!form.tran_form_required_modalities) {
				form = { ...form, modalities: []};
			}
			else {
				const modIds = [];
				const dbModalities = form.tran_form_required_modalities;
				const distModalities = _.uniqBy(modalities, 'mwl_display_name');
				distModalities.map((m) => {
					for(var i = 0; i < dbModalities.length; i++) {
						if(m.id == dbModalities[i].modality_id) {
							modIds.push(m);
						}
					}
				});
				form = { ...form, modalities: modIds};
			}
			if(!form.tran_form_required_payer_types) {
				form = { ...form, payertype: []};
			}
			else {
				const pIds = [];
				payerType.map((m) => {
					for(var i = 0; i < form.tran_form_required_payer_types.length; i++) {
						if(m.id == form.tran_form_required_payer_types[i].payer_type_id) {
							pIds.push(m);
						}
					}
				});
				form = { ...form, payertype: pIds};
			}

			const questions = [];
			for(let p = 0; p < form.tran_form_questions.length; p++){
				let el = form.tran_form_questions[p];
				const options = el.tran_form_questions_options.map((opt)=> {
					if(el.q_trigger.indexOf(opt.option) >= 0) {
						return { ...opt, q_trigger: true};
					}
					return opt;
				})
				
				let childItems = [];
				if(el.childItems && el.childItems.length > 0) {
					childItems = el.childItems.split(',').map(id => {
						for(let c=0; c<form.tran_form_questions.length; c++) {
							const quest = form.tran_form_questions[c];
							if(id === quest.childId) {
								return quest.id;
							}
						}
						return null;
					})
				}
				const question = {
					id: el.id,
					question: el.question,
					// content_object: el.content_object,
					element: el.field_type,
					text: el.field_type,
					field_name: el.field_type,
					childId: el.childId,
					childItems: childItems,
					isContainer: childItems.length > 0,
					position: el.position,
					q_group:1,
					is_required: el.is_required,
					options: options,
					isParent: el.tran_form_child_questions.length > 0 ? true : false,
					child: []
				};
				questions.push(question);
				for(let c = 0; c < el.tran_form_child_questions.length; c++){
					const elc = el.tran_form_child_questions[c];
					const question = {
						id: elc.id,
						question: elc.question,
						// content_object: el.content_object,
						element: elc.field_type,
						text: elc.field_type,
						field_name: elc.field_type,
						position: elc.position,
						q_group:1,
						is_required: elc.is_required,
						options: elc.tran_form_child_question_options,
						isChild: true,
						qparentId: el.id
					};
					questions.push(question);
				}
			}
			for(let a=0; a< questions.length; a++) {
				if(questions[a].childItems && questions[a].childItems.length > 0) {
					for(let b=0; b<questions.length; b++) {
						if(questions[a].childItems.indexOf(questions[b].id) >= 0) {
							questions[b] = { ...questions[b], parentId: questions[a].id, col: a, parentIndex: a };
						}
					}
				}
			}
			// setFormData({ ...form, questions: [{"id":"1BF3022C-39E1-477B-8210-25841B856D35","element":"ThreeColumnRow","text":"Three Column Row","is_required":false,"canHavePageBreakBefore":true,"canHaveAlternateForm":true,"canHaveDisplayHorizontal":true,"canHaveOptionCorrect":true,"canHaveOptionValue":true,"canPopulateFromApi":true,"field_name":"three_col_row_D6C0D171-6D5D-480C-81EC-E97A8C65E485","childItems":["B0968676-3A58-4D04-89EC-C23253EC6128",null,null],"isContainer":true},{"id":"B0968676-3A58-4D04-89EC-C23253EC6128","element":"TextInput","text":"Text Input","is_required":false,"position":"left","canHaveAnswer":true,"canHavePageBreakBefore":true,"canHaveAlternateForm":true,"canHaveDisplayHorizontal":true,"canHaveOptionCorrect":true,"canHaveOptionValue":true,"canPopulateFromApi":true,"field_name":"text_input_73E9FA9B-BF71-486B-B1B8-E6AEBA2D977C","label":"Placeholder Label","col":0,"parentId":"1BF3022C-39E1-477B-8210-25841B856D35","parentIndex":0,"question":"Middle Name"}] });
			setFormData({ ...form, questions });
			dispatch(updateNewFormDialog(form));
		}
		else {
			setFormData({ ...formDialog.data });
		}
    }, [forms, id]);

	const handleClose = (event, reason) => {
		setOpen(false);
	};
	const handleCloseError = (event, reason) => {
		setOpenError(false);
	};

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

	function deleteElementData(data) {
		const _deletedData = [ ...deletedData ];
		_deletedData.push(data);
		setDeletedData(_deletedData);
	}

	async function handlePreview(event) {
		dispatch(openPreviewDialog({ ...formDialog.data, questions: elementData }));	
	}

	async function openFormEdit(event) {
		dispatch(editNewFormDialog(formDialog.data));
	}

	function checkValidations(elementData) {
		let validations = [];
		const notRequiredElement = ['CompanyLogo', 'ThreeColumnRow', 'TwoColumnRow', "GroupRow", "Signature", "DatePicker", "TimePicker", "Checkboxes"];
		for(let i=0;i<elementData.length; i++) {
			if((elementData[i].question === undefined || elementData[i].question === '' || elementData[i].question === null) && notRequiredElement.indexOf(elementData[i].element) < 0) {
				if(validations.indexOf(elementData[i].element) < 0)
					validations.push(elementData[i].element);
			}
		}
		return validations;
	}

	async function handleSave(event) {
		// event.preventDefault();
		console.log(elementData);
		setLoading(true);
		if(elementData.length === 0) {
			CustomNotify(`Please add at least one element to save the form.`, "error");
			setLoading(false);
			return null;
		}
		let validations = checkValidations(elementData);
		if(validations.length > 0) {
			CustomNotify(`Please complete these ${validations.join(',')} element information.`, "error");
			setLoading(false);
			return null;
		}
		const questions = [];
		const child = [];
		const modIds = [];
		const payertypeIds = [];
		
		if(formDialog.data.modalities.length > 0) {
			modalities.map((m) => {
				for(var i = 0; i < formDialog.data.modalities.length; i++) {
					if(m.mwl_display_name == formDialog.data.modalities[i].mwl_display_name) {
						modIds.push(m.id);
					}
				}
			});
		}
		if(formDialog.data.payertype.length > 0) {
			for(var i = 0; i < formDialog.data.payertype.length; i++) {
				payertypeIds.push(formDialog.data.payertype[i].id);
			}
		}

		if(id > 0) {
			for(let q=0; q<elementData.length; q++){
				const el = elementData[q];
				let triggers = '';
				const opts = [];
				if(el.options) {
					for(let i=0; i<el.options.length; i++){
						if(el.options[i].q_trigger) {
							triggers += el.options[i].option + ',';
						}
						opts.push({ id: el.options[i].id > 0 ? el.options[i].id : 0, option: el.options[i].option, value: el.options[i].value });
					}
				}
				const que = {
					id: el.id > 0 ? el.id : 0,
					question: el.question,
					// content_object: JSON.stringify(el.content_object),
					field_type: el.element,
					q_group:1,
					q_order: q,
					is_required: el.is_required,
					options: opts,
					q_trigger: triggers.trimEnd(','),
					parentId: el.isChild ? el.qparentId : el.parentId,
					position: el.position,
					childItems: el.childItems ? el.childItems.join() : '',
					childId: el.id,
					child: []
				}
				if(el.isChild) {
					child.push(que);
				}
				else {
					questions.push(que);
				}
			}
	
			if(child.length > 0) {
				for(let c = 0; c < child.length; c++) {
					for(let p = 0; p < questions.length; p++) {
						if(child[c].parentId === questions[p].id) {
							if(!questions[p].child) {
								questions[p].child = [];
							}
							questions[p].child.push(child[c]);
						}
					}
				}
			}
			
			if(deletedData.length > 0) {
				for(let p = 0; p < deletedData.length; p++) {
					if(deletedData[p].id > 0) {
						const delQuestion = { ...deletedData[p], isDeleted: true};
						questions.push(delQuestion);
					}
				}
			}
			const result = await dispatch(updateFormQuestion({ form: { ...formDialog.data, modalities: modIds, payertype: payertypeIds, questions } }));
			setLoading(false);
			if(result.payload && result.payload.isUpdateSuccess) {
				setIsOpen(result.payload.isUpdateSuccess);
				// dispatch(openPreviewDialog(elementData));	
				history.push(`/apps/formBuilder/all`);
			}
			else {
				setOpenError(true);
			}
		}
		else {
			for(let q=0; q<elementData.length; q++){
				const el = elementData[q];
				let triggers = '';
				const opts = [];
				if(el.options) {
					for(let i=0; i<el.options.length; i++){
						if(el.options[i].q_trigger) {
							triggers += el.options[i].option + ',';
						}
						opts.push({ option: el.options[i].option, value: el.options[i].value });
					}
				}
				const que = {
					pid: el.id,
					question: el.question,
					// content_object: el.content_object,
					field_type: el.element,
					position: el.position,
					q_group:1,
					q_order: q,
					is_required: el.is_required,
					options: opts,
					q_trigger: triggers.trimEnd(','),
					parentId: el.isChild ? el.qparentId : el.parentId,
					childItems: el.childItems ? el.childItems.join() : '',
					childId: el.id,
					child: []
				}
				if(el.isChild) {
					child.push(que);
				}
				else {
					questions.push(que);
				}
			}
	
			if(child.length > 0) {
				for(let c = 0; c < child.length; c++) {
					for(let p = 0; p < questions.length; p++) {
						if(child[c].parentId === questions[p].pid) {
							if(!questions[p].child) {
								questions[p].child = [];
							}
							questions[p].child.push(child[c]);
						}
					}
				}
			}
	
			const result = await dispatch(saveFormQuestion({ form: { ...formDialog.data, modalities: modIds, payertype: payertypeIds, questions } }));
			setLoading(false);
			if(result.payload && result.payload.isUpdateSuccess) {
				setIsOpen(result.payload.isUpdateSuccess);
				history.push(`/apps/formBuilder/all`);
			}
			else {
				setOpenError(true);
			}
		}
	}

	return (
		<div className="makeStyles-content-414 flex flex-col h-full">
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<DndProvider backend={HTML5Backend}>
       			<div style={{flex:'1', height:'100%'}}>
				   <div className="react-form-builder clearfix" style={{flex:'1', height:'100%'}}>
						<div style={{flex:'1', height:'100%'}}>
							<Preview 
								// files={this.props.files}
								manualEditModeOff={manualEditModeOff}
								showCorrectColumn={false}
								// parent={this}
								data={formData.questions}
								// url={this.props.url}
								// saveUrl={this.props.saveUrl}
								// onLoad={this.props.onLoad}
								// onPost={this.props.onPost}
								editModeOn={editModeOn}
								updateElementData={updateElementData}
								deleteElementData={deleteElementData}
								editMode={editMode}
								// variables={this.props.variables}
								registry={Registry}
								editElement={editElement} 
								/>
							<Toolbar 
								loading={loading}
								handleSave={handleSave} 
								handlePreview={handlePreview} 
								formData={formData} 
								handleFormEdit={openFormEdit}
							/>
						</div>
					</div>
				</div>
      		</DndProvider>
			<NewFormDialog></NewFormDialog>
			<FormPrev></FormPrev>
			<SnackBarAlert snackOpen={isOpen} onClose={handleClose} text="Form saved successfully." />	
			<SnackBarAlert snackOpen={openError} onClose={handleCloseError} text="Something went wrong. Please try again." error={true} />
		</div>
	);
}

export default FormBuilderList;

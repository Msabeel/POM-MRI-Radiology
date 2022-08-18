import {
	SelectFormsy
} from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
	ContentState, EditorState, convertFromHTML, convertToRaw,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import DynamicOptionList from './dynamic-option-list';
import Placeholder from './Placeholder';
import {
	closeEditDialog,
	getAllPlaceholder
} from './store/formBuilderSlice';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

const toolbar = {
	options: ['inline', 'fontSize', 'list'],
	inline: {
	  inDropdown: false,
	  className: undefined,
	  options: ['bold', 'italic', 'underline'],
	},
	blockType: {
		inDropdown: false,
		options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
		className: undefined,
		component: undefined,
		dropdownClassName: undefined,
	  },
	list: {
		inDropdown: false,
		className: undefined,
		component: undefined,
		dropdownClassName: undefined,
		options: ['unordered', 'ordered'],
	},
  };
const locationPlaceHolders=[
    {
        "id": 1,
        "name": "location"
    },
    {
        "id": 2,
        "name": "location_txt",
    },
    {
        "id": 3,
        "name": "address_line_1",
    },
	{
        "id": 4,
        "name": "address_line_2",
    },
	{
        "id": 5,
        "name": "location_city",
    },
	{
        "id": 6,
        "name": "location_state",
    },
	{
        "id": 7,
        "name": "location_zip",
    },
	{
        "id": 8,
        "name": "location_phone",
    },
	{
        "id": 9,
        "name": "location_fax",
    }
];
  
function EditDialog(props) {
	const dispatch = useDispatch();
	const editDialog = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.editDialog);
	const placeHolders = useSelector(({ formBuilderApp }) => formBuilderApp.formBuilder.placeHolders);
	const { form, handleChange1, setForm } = useForm({});
    const formRef = useRef(null);
	const [filteredParentQue, setParentQue] = useState([]);
	const [isFormValid, setIsFormValid] = useState(false);
	const [state, setState]=useState({
		element: props.element,
		data: props.data,
		dirty: false,
		editorState: {}
	});
	const {
		canHavePageBreakBefore, canHaveAlternateForm, canHaveDisplayHorizontal, canHaveOptionCorrect, canHaveOptionValue,
	  } = props.element;

	const initDialog = useCallback(async () => {
		if (editDialog.data) {
			setForm({ ...editDialog.data });
		}
	}, [editDialog.data, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (editDialog.props.open) {
			initDialog();
		}
	}, [editDialog.props.open, initDialog]);

	useEffect(() => {
		if (props.data) {
			const filteredArr = [];
			for(var i =0; i < props.data.length; i ++) {
				if(props.data[i].isParent) {
					filteredArr.push(props.data[i]);
				}
			}
			setParentQue(filteredArr);
		}
	}, [props.data]);

	useEffect(() => {
		if (props.editMode) {
			if (state.element.question && (props.element.element === 'Header' || props.element.element === 'Paragraph' || props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons')) {
				const editorState = _convertFromHTML(state.element.question);
				setState({ ...state, editorState});
			}
			else {
				setState({ ...state, editorState: EditorState.createEmpty()});
			}
		}
	}, [props.editMode]);

	function closeComposeDialog() {
		const this_element = state.element;
		props.updateElement(this_element);
		// dispatch(closeEditDialog());
		props.manualEditModeOff();
	}
	
	function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
	}

	function handleSubmit(event) {
		// event.preventDefault();
		// const this_element = state.element;
		// props.updateElement(this_element);
		closeComposeDialog();
	}

	function onEditorStateChange(editorContent) {
		const property = 'question';
		// const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
		const content1 = editorContent.getCurrentContent();
		const content_object = convertToRaw(editorContent.getCurrentContent());
		const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/&nbsp;/g, ' ')
      	.replace(/(?:\r\n|\r|\n)/g, ' ');
    	const this_element = { ...state.element };
		this_element[property] = html;
		this_element['content_object'] = content_object;
	
		setState({
			...state,
			element: this_element,
		  	dirty: true,
		});
	}

	function onEditorStateChange1(editorContent) {
		const property = 'question';
		// const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
		const html = editorContent;
    	const this_element = { ...state.element };
		this_element[property] = html;
		setState({
			...state,
			element: this_element,
		  	dirty: true,
		});
	}

	function updateElement(event) {
		const name = event.target.name;
		const value = event.target.value;
		let element = state.element;
		element = { ...element, [name]: value };
		setState({ ...state, element });
	}
	
	function updateParentId(event) {
		const name = 'qparentId';
		const value = event.target.value;
		state.element[name] = value; 
		setState({ ...state });
	}

	function updateIsRequired(event) {
		const name = event.target.name;
		const value = event.target.checked;
		let element = state.element;
		element = { ...element, [name]: value };
		setState({ ...state, element });
	}

	function handleDragStart(event, data) {
		event.dataTransfer.setData("Text", data);
	}

	function handleDrop(event) {
		event.preventDefault();
		var dataText = event.dataTransfer.getData("text/plain");
		let textToInsert = dataText;
		let cursorPosition = event.target.selectionStart;
		let textBeforeCursorPosition = event.target.value.substring(0, cursorPosition)
		let textAfterCursorPosition = event.target.value.substring(cursorPosition, event.target.value.length)
		event.target.value = textBeforeCursorPosition + textToInsert + textAfterCursorPosition

		const name = event.target.name;
		const value = event.target.value;
		state.element[name] = value; 
		setState({ ...state });
	}
	function allowDrop(event) {
		event.preventDefault(); // Necessary. Allows us to drop.
	}

	function handleRequestFor(event) {
		const value = event.target.value;
		let element = state.element;
		element = { ...element, position: value };
		setState({ ...state, element });
	}

	function _convertFromHTML(content) {
		const newContent = htmlToDraft(content);
		// const newContent = convertFromHTML(content);
		if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
		  // to prevent crash when no contents in editor
		  return EditorState.createEmpty();
		}
		const contentState = ContentState.createFromBlockArray(newContent.contentBlocks);
		return EditorState.createWithContent(contentState);
	}

	function getEditor (element) {
		if(props.element.element === 'Header' || props.element.element === 'Paragraph' || props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons' || props.element.element === 'GroupRow') {
			if(element.parentId === null || element.parentId === undefined) {
				return 'Editor';
			}
			else {
				return 'Input';
			}
		}
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			// {...editDialog.props}
			open={props.editMode}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="lg"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						Edit - {props.element.text}
					</Typography>
				</Toolbar>
			</AppBar>
			<Formsy
                onValidSubmit={handleSubmit}
                ref={formRef}
				onValid={enableButton}
				onInvalid={disableButton}
				className="flex flex-col md:overflow-hidden"
            >
				<DialogContent classes={{ root: 'p-24' }}>
				<div className="flex w-full formBuilder">
					<div className="w-3/4 mr-8 sm:w-full">
						{getEditor(props.element) === 'Editor' ?
							<div className="flex flex-col mb-24 w-full" >
								{/* <Editor
									toolbar={toolbar}
									defaultEditorState={state.editorState}
									onBlur={updateElement}
									onEditorStateChange={onEditorStateChange}
									wrapperStyle={{ width: '100%'}}
									wrapperClassName="demo-wrapper"
          							editorClassName="demo-editor"
									stripPastedStyles={true}/> */}
									<div id="toolbar-container"></div>
									<CKEditor
										editor={ DecoupledEditor }
										config={{         
											toolbar: ['heading', '|', 'bold', 'italic', 'underline', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
											  'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo']
										  }} 
										data={state.element.question}
										onReady={ editor => {
												// Add the toolbar to the container
											const toolbarContainer = document.querySelector( '#toolbar-container' );
												toolbarContainer.appendChild( editor.ui.view.toolbar.element );

											editor.editing.view.change( writer => {
												writer.setStyle( 'height', '250px', editor.editing.view.document.getRoot() );
												writer.setStyle( 'border', '1px solid', editor.editing.view.document.getRoot() );
											});

											window.editor = editor;
												// You can store the "editor" and use when it is needed.
												console.log( 'Editor is ready to use!', editor );
										} }
										onChange={ ( event, editor ) => {
											const data = editor.getData();
											console.log( { event, editor, data } );
											onEditorStateChange1(data)
										} }
									/>
							</div> : null
						}
						{props.element.element === 'Label' || props.element.element === 'Tab' || props.element.element === 'TextInput' ?
							<div className="flex mb-12" >
								<TextField
									type="text"
									name="question"
									id="question"
									InputLabelProps={{
										style: { color: '#000' },
										}}
									value={state.element.question}
									onChange={updateElement}
									label="Header Text"
									variant="outlined"
									fullWidth
									onDrop={handleDrop} 
									onDragOver={allowDrop}
									onDragEnter={allowDrop}
								/>
							</div> : null
						}
			
						{/* {props.element.element === 'Paragraph' ?
							<div className="flex mb-12" >
								<TextField
									type="text"
									name="question"
									id="question"
									InputLabelProps={{
										style: { color: '#000' },
										}}
									value={state.element.question}
									onChange={updateElement}
									label="Header Text"
									variant="outlined"
									multiline
          							maxRows={4}
									fullWidth
									onDrop={handleDrop} 
									onDragOver={allowDrop}
									onDragEnter={allowDrop}
								/>
							</div> : null
						} */}

						{getEditor(props.element) === 'Input' ?
							<div className="flex mb-12">
								<TextField
									type="text"
									name="question"
									id="question"
									InputLabelProps={{
										style: { color: '#000' },
										}}
									value={state.element.question}
									onChange={updateElement}
									label="Display Label"
									variant="outlined"
									fullWidth
									onDrop={handleDrop} 
									onDragOver={allowDrop}
									onDragEnter={allowDrop}
								/>
							</div>: null
						}
						{props.element.element === 'Signature' &&
							<div className="flex mb-24 border justify-center p-20 text-xl italic underline font-cursive">
								{state.element.label}
							</div>
						}
						{props.element.parentId === null || props.element.parentId === undefined ?
							<div className="flex mb-12" >
								<Typography variant="subtitle1" className="font-bold m-10" color="inherit">
									Position: 
								</Typography>
								<RadioGroup className="flex-row" aria-label="position" name="position" value={state.element.position} onChange={handleRequestFor}>
									<FormControlLabel value="left" control={<Radio />} label="Left" />
									<FormControlLabel value="center" control={<Radio />} label="Center" />
									<FormControlLabel value="right" control={<Radio />} label="Right" />
								</RadioGroup>
							</div> : null
							}
						{/* {props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons' ?
						<div className="flex mb-12">
							<Typography variant="subtitle1" className="font-bold m-10" color="inherit">
									Position: 
							</Typography>
							<div className="flex mb-12">
								<FormControlLabel
									control={
									<Checkbox 
										value={state.element.italic} 
										checked={state.element.italic} 
										name="italic"
										onChange={updateIsRequired}
									/>}
									label="Italic"
								/>
							</div>
							<div className="flex mb-12">
								<FormControlLabel
									control={
									<Checkbox 
										value={state.element.bold} 
										checked={state.element.bold} 
										name="bold"
										onChange={updateIsRequired}
									/>}
									label="Bold"
								/>
							</div>
							<div className="flex mb-12">
								<FormControlLabel
									control={
									<Checkbox 
										value={state.element.underline} 
										checked={state.element.underline} 
										name="underline"
										onChange={updateIsRequired}
									/>}
									label="Underline"
								/>
							</div>
						</div> : null
						} */}
						<div className="w-full flex">
							<div className="w-1/3">
								{props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons' ?
									<div className="flex mb-12">
										<FormControlLabel
											control={
											<Checkbox 
												value={state.element.is_required} 
												checked={state.element.is_required} 
												name="is_required"
												onChange={updateIsRequired}
											/>}
											label="Is Required"
										/>
									</div>: null
								}
								{(props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons') && !state.element.isChild &&
									<div className="flex mb-12">
										<FormControlLabel
											control={
											<Checkbox 
												value={state.element.isParent} 
												checked={state.element.isParent} 
												name="isParent"
												onChange={updateIsRequired}
											/>}
											label="Is Parent Question"
										/>
									</div>
								}
								{(props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons' || props.element.element === 'TextInput') && !state.element.isParent &&
									<div className="flex mb-12">
										<FormControlLabel
											control={
											<Checkbox 
												value={state.element.isChild} 
												checked={state.element.isChild} 
												name="isChild"
												onChange={updateIsRequired}
											/>}
											label="Is Child Question"
										/>
									</div>
								}
								{(props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons' || props.element.element === 'TextInput') && state.element.isChild &&
									<div className="flex mb-12">
										<SelectFormsy
											id="qparentId"
											name="qparentId"
											label="Select Parent Question"
											variant="outlined" 
											style={{ width: '100%' }}
											onChange={updateParentId}
											value={state.element.qparentId}
											>
											<option value="">
											</option>
											{filteredParentQue && filteredParentQue.map(item =>
												<option key={item.id} value={item.id}>{item.question}</option>
											)}
										</SelectFormsy>
									</div>
								}
							</div>
							<div className="w-2/3">
								{props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons' ?
									<DynamicOptionList showCorrectColumn={props.showCorrectColumn}
										canHaveOptionCorrect={canHaveOptionCorrect}
										canHaveOptionValue={canHaveOptionValue}
										data={state.data}
										updateElement={props.updateElement}
										preview={props.preview}
										element={state.element}
										key={props.element.options.length} />: null
								}
							</div>
						</div>
					</div>
					{props.element.element === 'Checkboxes' || props.element.element === 'RadioButtons' || props.element.element === 'Header' || props.element.element === 'Label' || props.element.element === 'Paragraph' ?
					<>
					<div className="w-1/4" style={{position:'relative', minHeight: '300px'}}>
						<Placeholder placeHolderName={"Location Address"} placeHolders={locationPlaceHolders} handleDragStart={handleDragStart} />
					</div>
					<div className="w-1/4" style={{position:'relative', minHeight: '300px'}}>
						<Placeholder placeHolderName={"Placeholders"} placeHolders={placeHolders} handleDragStart={handleDragStart} />
					</div>
					</> : null }
				</div>
				</DialogContent>	
					<DialogActions className="justify-between p-8">
						<div className="px-16">
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

export default EditDialog;

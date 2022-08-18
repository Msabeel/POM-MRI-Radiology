import AWS from 'aws-sdk'
import Formsy from 'formsy-react';
import {withStyles} from '@material-ui/core/styles';
import moment from 'moment';
import {
	CheckboxFormsy,
	RadioGroupFormsy,
	TextFieldFormsy
} from '@fuse/core/formsy';
import { useForm } from '@fuse/hooks';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
const pdfFonts = require('./pdfFonts.json');
const IndexSettings =  JSON.parse(localStorage.getItem('Index_Details'));

function PreviewComponent(props) {
	const formRef = useRef(null);
	const dispatch = useDispatch();
	const [isFormValid, setIsFormValid] = useState(false);
	const [logo, setlogo] = useState('');
	const {form, handleChange, setForm} = useForm({});

    const { currentForm, handleAddSignature, isShowSign, signFont, signName, handleFormNext, handleFormBack, placeholdersValues, isPreview } = props;

	useEffect(() => {
		if (currentForm) {
			setForm({ ...currentForm });
		}
	}, [currentForm]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function replaceAll(str, find, replace) {
		var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return str.replace(new RegExp(escapedFind, 'g'), replace);
	}

	function getPlaceholders(str) {
    	var regex = /\[(\w+)\]/g;
    	var result = [];
		var match;
	    while (match = regex.exec(str))
    	{
        	result.push(match[1]);    
    	}
	    return result;
	}

	function replacePlaceholders(questionText) {
		if(!placeholdersValues) {
			return questionText;
		}

		const placeholders = getPlaceholders(questionText);
		if(placeholders.length === 0) {
			return questionText;
		}

		for(let j=0; j< placeholdersValues.length; j++) {
			const key = placeholdersValues[j].key;
			if(questionText && questionText.indexOf(key) >=0) {
				const objvalue = placeholdersValues[j].value;
				const keys = Object.keys(objvalue);
				questionText = replaceAll(questionText, key, objvalue[keys[0]] + " "); 
			}
		}
		return questionText;
	}

	function handleChangeR(event, index, ques) {
		if(ques) {
			index = form.questions.findIndex(i=> i.id === ques.id);
		}
		const name = event.target.name;
		const value = event.target.value;
		const opt = { ...form.questions[index]};
		opt.answerText = value;
		form.questions[index] = {...opt};
		setForm({...form});
	}

	function handleChangeC(event, index, option, ques) {
		if(ques) {
			index = form.questions.findIndex(i=> i.id === ques.id);
		}
		const name = event.target.name;
		const value = event.target.checked;
		const opt = { ...form.questions[index]};
		if(value) {
			opt.answerText += option + ',';
		}
		form.questions[index] = {...opt};
		setForm({...form});
	}

	function handleChangeT(event, index) {
		const name = event.target.name;
		const value = event.target.value;
		const opt = { ...form.questions[index]};
		opt.answerText = value;
		form.questions[index] = {...opt};
		setForm({...form});
	}

	async function loadImage(url) {
		return new Promise((resolve) => {
		  let img = new Image();
		  img.onload = () => resolve(img);
		  img.src = url;
		})
	}
	  
	function getBase64Image(img) {
		var canvas = document.createElement("canvas");
		img.crossOrigin = 'anonymous';
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var dataURL = canvas.toDataURL("image/jpeg");
		return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	  }
	
	  const getS3ImageObj = (params) => {
		var s3 = new AWS.S3({
			accessKeyId:  'AKIA32BK6623JYWZUFEK',
			secretAccessKey: 'CvK67pnsxE0GFdXc8h2aDBcOcPuVzgJUdGGcbO9t'
		});
		return new Promise((resolve, reject) => {
		  s3.getObject( params, (err, url) => {
			err ? reject(err) : resolve(url);
		  });
		})
	  }
	  
	async function handleSaveHtml (e) {
		handleFormNext(e, 'Forms');
	}

	function renderTextInput (child, classes) {
		return(
			<div className={`mb-12 mr-10 ${classes}`}>
				<Typography variant="subtitle1" color="inherit" className={`flex-1 font-normal quest`}>
					{child.question} {child.is_required === 1 ? '*' : ''}
				</Typography>
				<TextFieldFormsy
					type="text"
					name="answerText"
					id="answerText"
					value={child.answerText}
					required={child.is_required === 1 ? true : false}
					onChange={handleChange}
					className="w-full"
				/>
			</div>
		)
	};

	const renderGroupChildControls = (ques, index) => {
		const childItems = [];
		form.questions && form.questions.map(ele => {
			if(ques.childItems.indexOf(ele.id) >= 0) {
				childItems.push(ele);
			}
		});
		return (
			<>
				{childItems.map(child => (
					child.element === "TextInput" ? (
						renderTextInput(child)
					) : 
					child.element === "Label" ? (
						<div className="mb-24 w-full">
							{renderLabelControl(child)}
						</div>
					) : 
					child.element === "TimePicker" ? (
						<div className="mb-24 w-full">
							{renderTimePickerControl(child, index)}
						</div>
					) : 
					child.element === "RadioButtons" ? (
						<div className="mb-24 w-full mr-10">
							<Typography variant="subtitle1" color="inherit" className={`flex-1 font-normal quest`}>
								{child.question}
							</Typography>
							<div style={{display: 'flex'}}>
								{child.options && child.options.map(opt => (
									<FormControlLabel className="px-12 radio" value={opt.option} control={<Radio />} label={opt.option} />

								))}
							</div>
						</div>
					):null
				))}
			</>
		)
	}

	function handleParentQChange(event, ques) {
		const index = form.questions.findIndex(i=> i.id === ques.id);
		const name = event.target.name;
		const value = event.target.value;
		const opt = { ...form.questions[index]};
		opt.answerText = value;
		form.questions[index] = {...opt};
		setForm({...form});
	}

	const renderChildControls = (ques, index, classes) => {
		const childItems = [];
		form.questions && form.questions.map(ele => {
			if(ques.childItems.indexOf(ele.id) >= 0) {
				childItems.push(ele);
			}
		});
		return (
			<>
				{childItems.map(child => (
					child.element === "TextInput" ? (
						<div className={`mb-12 mr-10 ${classes}`}>
							<Typography variant="subtitle1" color="inherit" className={`flex-1 font-normal quest`}>
								{replacePlaceholders(child.question)} {child.is_required === 1 ? '*' : ''}
							</Typography>
							<TextFieldFormsy
								type="text"
								name="answerText"
								id="answerText"
								value={child.answerText}
								required={child.is_required === 1 ? true : false}
								onChange={(e) => handleParentQChange(e, child)}
								className="w-full"
							/>
						</div>
					) : 
					child.element === "Label" ? (
						<div className={`mb-12 mr-10 ${classes}`}>
							{renderLabelControl(child, index)}
						</div>
					) : 
					child.element === "Signature" ? (
						<div className={`mb-12 mr-10 ${classes}`}>
							{renderSignatureControl(child, index)}
						</div>
					) : 
					child.element === "DatePicker" ? (
						<div className={`mb-12 mr-10 ${classes}`}>
							{renderDatePickerControl(child, index)}
						</div>
					) : 
					child.element === "TimePicker" ? (
						<div className={`mb-12 mr-10 ${classes}`}>
							{renderTimePickerControl(child, index)}
						</div>
					) : 
					child.element === "Checkboxes" ? (
						<div className={`mb-12 mr-10 ${classes}`}>
							<Typography variant="subtitle1" color="inherit" className={`flex-1 font-normal quest`}>
								{replacePlaceholders(child.question)}
							</Typography>
							<div className="flex flex-col">
								{child.options && child.options.map(opt => (
									<CheckboxFormsy
										className="my-8"
										name="accept"
										value={false}
										label={opt.option}
										onChange={(e) => handleChangeC(e, index, opt.option, child)}
										validationError="Please select any option"
										required={ques.is_required === 1 ? true : false}
									/>
								))}
							</div>
						</div>
					) :
 					child.element === "RadioButtons" ? (
						<div className={`mb-12 mr-10 ${classes}`}>
							<div style={{display: 'flex'}}>
								<RadioGroupFormsy
									className="my-16"
									name='answerText'
									label={child.question}
									// validations="equals:female"
									validationError="Please select any option"
									onChange={(e) => handleChangeR(e, index, child)}
									required={child.is_required === 1 ? true : false}
								>
									{child.options && child.options.map(opt => (
										<FormControlLabel className="px-12 radio" value={opt.option} control={<Radio color="primary" />} label={opt.option} />
									))}
								</RadioGroupFormsy>
							</div>
						</div>
					):null
				))}
			</>
		)
	}

	function checkQTrigger(question) {
		for(var i=0;i<form.questions.length;i++) {
			const pques = form.questions[i];
			if(pques.id === question.qparentId) {
				if(pques.options && pques.options.length > 0) {
					for(var j=0;j<pques.options.length;j++) {
						const opt = pques.options[j];
						if(opt.q_trigger && opt.option === pques.answerText) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	const renderLabelControl = (ques, index) => {
		let classes = '';
		if(ques.position) {
			classes += ` text-${ques.position} `;
		}
		return (
			<Typography color="inherit" className={`flex-1 mb-6 font-bold text-15 ${classes}`} key={`${ques.element}-${index}`}>
				{replacePlaceholders(ques.question)}
			</Typography>
		);
	}

	const renderDatePickerControl = (ques, index) => {
		let classes = '';
		if(ques.position) {
			classes += ` text-${ques.position} `;
		}
		return (
			<Typography color="inherit" className={`flex-1 text-15 ${classes}`} key={`${ques.element}-${index}`}>
				Date: {moment().format("MM-DD-YYYY")}
			</Typography>
		);
	}

	const renderTimePickerControl = (ques, index) => {
		let classes = '';
		if(ques.position) {
			classes += ` text-${ques.position} `;
		}
		return (
			<Typography color="inherit" className={`flex-1 text-15 ${classes}`} key={`${ques.element}-${index}`}>
				Time: {moment().format("hh:mm:ss")}
			</Typography>
		);
	}

	const renderSignatureControl = (ques, index) => {
		let classes = '';
		if(ques.position) {
			classes += ` text-${ques.position} `;
		}
		return (
			<>
				{!isShowSign &&(
				<Button
					variant="contained"
					color="primary"
					className="mx-auto my-16"
					aria-label="Subscribe"
					type="submit"
					onClick={(e) => handleAddSignature(e)}
				>
					ADD SIGNATURE
				</Button>)}
				{isShowSign &&(
					<Typography color="inherit" className={`flex-1 px-12 text-15 font-bold text-${ques.position}`} style={{ fontFamily: signFont }}>
						{signName}
					</Typography>	
				)}
				<Typography color="inherit" className={`flex-1 px-12 text-10 font-bold mb-24 text-${ques.position} border-t-2 border-dashed`}>
					PATIENT SIGNATURE
				</Typography>
			</>
		);
	}

	const renderControls = (ques, index) => {
		if(ques.isChild && !checkQTrigger(ques)) {
			return null;
		}
		return (
			<>
				{ques.element === "CompanyLogo" && (
					<div className={`flex mb-24 w-full logo-icon justify-${ques.position}`} key={`${ques.element}-${index}`}>
						<img style={{ width: '258px', height: '131px' }} src={isPreview ? props.logobase64 : `data:image/jpeg;base64,${props.logobase64}`} alt="logo" />
					</div>
				)}
				{ques.element === "Header" && (
					<Typography 
						dangerouslySetInnerHTML={{ __html: replacePlaceholders(ques.question) }}
						variant="subtitle1" 
						color="inherit" 
						className={`flex-1 mb-12 text-${ques.position}`} 
						key={`${ques.element}-${index}`}>
					</Typography>
				)}
				{ques.element === "Label" && (
					renderLabelControl(ques, index)
				)}
				{ques.element === "DatePicker" && (
					renderDatePickerControl(ques, index)
				)}
				{ques.element === "TimePicker" && (
					renderTimePickerControl(ques, index)
				)}
				{(ques.element === "RadioButtons" || ques.field_type === "RadioButtons") && (
					<div className="flex flex-col w-full" key={`${ques.element}-${index}`}>
						<Typography 
							variant="subtitle1" 
							color="inherit" 
							dangerouslySetInnerHTML={{ __html: replacePlaceholders(ques.question) }}
							className={`flex-1 font-normal quest text-${ques.position}`}>
							{/* {ques.is_required === 1 ? '*' : ''} */}
						</Typography>
						<RadioGroupFormsy
							className="my-8"
							name={`answerText`}
							// label={ques.question}
							value={ques.answerText}
							onChange={(e) => handleChangeR(e, index)}
							// validations="equals:female"
							validationError="Please select any option"
							required={ques.is_required === 1 ? true : false}
						>
							{ques.options && ques.options.map(opt => (
								<FormControlLabel className="px-12 radio" value={opt.option} control={<Radio color="primary" />} label={opt.option} />
							))}
						</RadioGroupFormsy>
					</div>
				)}
				{ques.element === "Checkboxes" && (
					<div className="w-full" key={`${ques.element}-${index}`}>
						<Typography 
							variant="subtitle1" 
							color="inherit" 
							dangerouslySetInnerHTML={{ __html: replacePlaceholders(ques.question) }}
							className={`flex-1 font-normal quest text-${ques.position}`}>
							{/* {ques.is_required === 1 ? '*' : ''} */}
						</Typography>
						<div className="flex flex-col">
							{ques.options && ques.options.map(opt => (
								<CheckboxFormsy
									className="my-8"
									name="accept"
									value={false}
									label={opt.option}
									onChange={(e) => handleChangeC(e, index, opt.option)}
									validationError="Please select any option"
									required={ques.is_required === 1 ? true : false}
								/>
							))}
						</div>
					</div>
				)}
				{ques.element === "TextInput" && (
					<div className="mb-24 w-full" key={`${ques.element}-${index}`}>
						<Typography variant="subtitle1" color="inherit" className={`flex-1 font-normal quest text-${ques.position}`}>
							{ques.question} {ques.is_required === 1 ? '*' : ''}
						</Typography>
						<TextFieldFormsy
							type="text"
							name={`answerText`}
							id="answerText"
							value={ques.answerText}
							required={ques.is_required === 1 ? true : false}
							// onChange={handleChange}
							onChange={(e) => handleChangeT(e, index)}
							// label={ques.question}
							// variant="outlined"
							className="w-full"
						/>
					</div>
				)}
				{ques.element === "Paragraph" && (
					<div className="mb-24 w-full" key={`${ques.element}-${index}`}>
						<Typography 
							dangerouslySetInnerHTML={{ __html: replacePlaceholders(ques.question) }}
							variant="subtitle1" 
							color="inherit" 
							className={`flex-1 font-normal quest text-${ques.position}`}>
						</Typography>
					</div>
				)}
				{ques.element === "Signature" && (
					<div className="w-1/3" key={`${ques.element}-${index}`}>
						{!isShowSign &&(
						<Button
							variant="contained"
							color="primary"
							className="mx-auto my-16"
							aria-label="Subscribe"
							type="submit"
							onClick={(e) => handleAddSignature(e)}
						>
							ADD SIGNATURE
						</Button>)}
						{isShowSign &&(
							<Typography color="inherit" className={`flex-1 px-12 text-15 font-bold text-${ques.position}`} style={{ fontFamily: signFont }}>
								{signName}
							</Typography>	
						)}
						<Typography color="inherit" className={`flex-1 px-12 text-10 font-bold mb-24 text-${ques.position} border-t-2 border-dashed`}>
							PATIENT SIGNATURE
						</Typography>
					</div>
				)}
			</>
		)
	}

	return (
            <>
			<Formsy
				// onValidSubmit={(e) => handleFormNext(e, 'Forms')}
				onValidSubmit={handleSaveHtml}
				onValid={enableButton}
				onInvalid={disableButton}
				ref={formRef}
				id={'printArea'}
			>
				{form.questions && form.questions.map((ques, i) => (
					<div className="flex" key={i}>
						{ques.element === "ThreeColumnRow" && renderChildControls(ques, i, 'w-1/3 w-1-3')}
						{ques.element === "TwoColumnRow" && renderChildControls(ques, i, 'w-1/2 w-1-2')}
						{ques.element === "GroupRow" && 
							<div className="flex flex-col mt-12 border-2 p-10 rounded-t w-full" key={i}>
								<Typography 
									dangerouslySetInnerHTML={{ __html: ques.question }}
									variant="subtitle1" 
									color="inherit" 
									className={`flex-1 mb-12 text-${ques.position}`} 
									key={`${ques.element}-${i}`}>
								</Typography>
								{renderChildControls(ques, i, 'w-full')}
							</div>
						}
						{ques.parentId === null || ques.parentId === undefined ? renderControls(ques, i) : null}
					</div>
				))}
				{!isPreview && (
				<div className="flex">
					<Button
						variant="contained"
						color="primary"
						className="mx-auto my-16"
						aria-label="Subscribe"
						// type="submit"
						onClick={(e) => handleFormBack(e, 'Forms')}
					>
						Back
					</Button>
					<Button
						variant="contained"
						color="primary"
						className="mx-auto my-16"
						aria-label="Subscribe"
						type="submit"
						// onClick={(e) => handleFormNext(e, 'Forms')}
						disabled={!isFormValid}
					>
						Next
					</Button>
				</div>)}
			</Formsy>
            </>
	);
}

export default PreviewComponent;

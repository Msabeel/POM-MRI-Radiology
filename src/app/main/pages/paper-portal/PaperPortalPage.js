import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useForm } from '@fuse/hooks';
import AWS from 'aws-sdk'
import jsPDF from "jspdf";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import _ from '@lodash';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import htmlToDraft from 'html-to-draftjs';
import {
	ContentState, convertFromHTML, convertToRaw,
} from 'draft-js';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';
import { getAllCity, getUploadCred, savePaperWork, verifyPaperwork } from './store/paperPortalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify';
import ExamCard from 'app/fuse-layouts/shared-components/ExamCard';
import PreviewComponent from 'app/main/apps/form-builder/PreviewComponent';
import PatientEditInfo from 'app/fuse-layouts/shared-components/PatientEditInfo';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts1 from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts1.pdfMake.vfs;

const pdfFonts = require('app/main/apps/form-builder/pdfFonts.json');
const steps = ['Start', 'PatientInfo', 'Signature', 'Forms', 'Finish'];

let S3_BUCKET ='pomrisdev';
const REGION ='us-east-1';

var myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	font1: {
		fontFamily: 'Damion'
	}, 
	font2: {
		fontFamily: 'Leckerli One'
	},
	font3: {
		fontFamily: 'Beth Ellen'
	},
	font4: {
		fontFamily: 'Pacifico'
	},
	font5: {
		fontFamily: 'Homemade Apple'
	},
	selectedButton: {
		backgroundColor: 'rgb(76, 175, 80)',
		'&:hover': {
			backgroundColor: 'rgb(76, 175, 80)',
		  },
	},
	scrollHrSelectedExam: {
		display: "grid",
		gridTemplateColumns: "auto auto",
		gridColumnGap: "2px",
		width: "100%",
		justifyContent: "center"
	},
}));

function PaperPortalPage() {
	const routeParams = useParams();
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const { key, patientId } = useParams()
	const [loadingPage, setLoadingPAge] = useState(false);
	const paperworkdata = useSelector(({ paperPortalApp }) => paperPortalApp.paperPortal.data);
	const uploadCred = useSelector(({ paperPortalApp }) => paperPortalApp.paperPortal.uploadCred);
	const [filledForms, setfilledForms] = useState([]);
	const [patientDetail, setPatientDetail] = useState({});
	const [placeholdersValues, setPlaceholdersValues] = useState([]);
	const [exams, setExams] = useState([]);
	const [fulllocationText, setFulllocationText] = useState('');
	const [locationText, setLocationText] = useState('');
	const [openForm, setOpenForm] = useState(false);
	const [currentForm, setCurrentForm] = useState(false);
	const CustomNotify = useCustomNotify();
	const location = useLocation();
	const { pathname } = location;
	const [currentStep, setCurrentStep] = React.useState(steps[0]);
	const [formIndex, setFormIndex] = React.useState(0);
	const [signFont, setSignFont] = React.useState('');
	const [signName, setSignName] = React.useState('');
	const [isShowSign, setShowSign] = React.useState(false);
	const [allCity, setAllCity] = React.useState([]);
	const CityList = useSelector(({ paperPortalApp }) => paperPortalApp.paperPortal.allCity);
	const [activeStep, setActiveStep] = React.useState(1);
	const [logobase64, setlogobase64] = React.useState('');
	const [loading, setLoaing] = React.useState(false);
	const [paperWorkStatus, setPaperWorkStatus] = React.useState('');
	const paperPageScroll = useRef(null);

	useEffect(() => {
		async function fetchPatientPortalData() {
			setLoadingPAge(true);
			const key = pathname.replace('/pages/paper-portal/','');
			await dispatch(verifyPaperwork({ key }));
			dispatch(getAllCity());
			dispatch(getUploadCred());
			setLoadingPAge(false);
		}
		if(key) {
			fetchPatientPortalData();
		}
	}, [key]);

	useEffect(() => {
		async function fetchLogo(logopath) {
			const imageObj = await getS3ImageObj({
				Bucket: uploadCred.bucket,
				Key:  logopath  //'images/pom12345pom12345pom12345pom123456POM-LOGO.jpg',
			}, uploadCred);
			let base64data = await imageObj.Body.toString('base64');
			setlogobase64(base64data);
		}

		if (uploadCred) {
			let logopath = '';
			for(let i=0; i< paperworkdata.forms.length; i++) {
				const form = paperworkdata.forms[i];
				for(let j=0; j<form.tran_form_questions.length; j++) {
					const question = form.tran_form_questions[j];
					if(question.field_type === 'CompanyLogo') {
						logopath = question.question;
					}
				}
			}

			AWS.config.update({
				accessKeyId: uploadCred.plainKeyText,
				secretAccessKey: uploadCred.plainSecretText
			});
			S3_BUCKET = uploadCred.bucket;
			myBucket = new AWS.S3({
				params: { Bucket: S3_BUCKET},
				region: REGION,
			})

			if(logopath !== '') {
				fetchLogo(logopath);
			}
		}
	}, [uploadCred]);

	useEffect(() => {
		if (CityList && CityList.length > 0) {
			setAllCity(CityList);
		}
	}, [CityList]);

	useEffect(() => {
		if(paperworkdata && paperworkdata.patientDetail) {
			const patientDetail = {
				...paperworkdata.patientDetail,
				patient_id: paperworkdata.patientDetail.patient_id,
				patient_name: paperworkdata.patientDetail.lname +"," + paperworkdata.patientDetail.fname,
				birth_date: paperworkdata.patientDetail.dob,
			};
			setPatientDetail(patientDetail);
			setPaperWorkStatus(paperworkdata.PaperWorkStatus);
			setSignName(paperworkdata.patientDetail.lname + ', ' + paperworkdata.patientDetail.fname);
			const exams = paperworkdata.examDetail.map(e=>{
				return e.exam_access_no;
			})
			setExams(exams);
			if(paperworkdata.examDetail && paperworkdata.examDetail.length > 0 && paperworkdata.examDetail[0].tran_location){
				const location = paperworkdata.examDetail[0].tran_location;
				setLocationText(location.location_txt);
				const txt = location.location_txt + " (" + location.address_line_1 + "," + location.address_line_2 + "," + location.location_city + "," + location.location_state +")";
				setFulllocationText(txt.replace(',,', ','));
			}
		}
		if(paperworkdata && paperworkdata.placeHolders && paperworkdata.placeHolders.length > 0) {
			setPlaceholdersValues(paperworkdata.placeHolders);
		}
	}, [paperworkdata]);

	function prepareForms (form) {
		if(!form.tran_form_required_modalities) {
			form = { ...form, modalities: []};
		}
		else {
			const modIds = [];
			const dbModalities = form.tran_form_required_modalities;
			const distModalities = []; //_.uniqBy(modalities, 'mwl_display_name');
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
			// payerType.map((m) => {
			// 	for(var i = 0; i < form.tran_form_required_payer_types.length; i++) {
			// 		if(m.id == form.tran_form_required_payer_types[i].payer_type_id) {
			// 			pIds.push(m);
			// 		}
			// 	}
			// });
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
		return questions;
    }


	async function handleOpenPaperwork(e, step) {
		if(currentStep === 'Signature' && signFont === '' && step === 'Forms') {
			CustomNotify("Please choose the signature font.", "error");
			return null;
		}
		if(currentStep === 'Signature' && signFont !== '' && step === 'Forms') {
			// dispatch(saveSignature({ signature_font: signFont, signature_date: moment().format(), patient_id: paperworkdata.patientDetail.id, exam_id: exam.access_no }));
		}
		setCurrentStep(step);
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		if(step === 'Forms') {
			if(paperworkdata && paperworkdata.forms) {
				const questions = prepareForms(paperworkdata.forms[formIndex]);
				setCurrentForm({ ...paperworkdata.forms[formIndex], questions });
			}
		}
	}

	async function handleFormBack(e, step) {
		const indx = formIndex - 1;
		if(indx !== -1) {
			setCurrentForm(filledForms[indx]);
			setFormIndex(indx);
		}
		else {
			setCurrentStep('Signature');
		}
	}

	const getS3ImageObj = (params, config) => {
		var s3 = new AWS.S3({
			accessKeyId:  config.plainKeyText, //'AKIA32BK6623JYWZUFEK',
			secretAccessKey: config.plainSecretText //'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'
		});
		return new Promise((resolve, reject) => {
		  s3.getObject( params, (err, url) => {
			err ? reject(err) : resolve(url);
		  });
		})
	}

	function fetchTextWithInlineStyle (block) {
		const text = [];
		let curOffset = 0;
		if(block.inlineStyleRanges.length === 0) {
			text.push(block.text);
			// text.push('\n\n');
			return text;
		}
		for(var i=0; i< block.inlineStyleRanges.length; i++) {
			const inlinestyle = block.inlineStyleRanges[i];
			if(curOffset < inlinestyle.offset) {
				text.push(block.text.substring(curOffset, inlinestyle.offset));
				curOffset = inlinestyle.offset;
			}

			if(curOffset > inlinestyle.offset) {
				const findtxt = block.text.substring(inlinestyle.offset, inlinestyle.offset + inlinestyle.length);
				for(var f=0; f<text.length; f++) {
					if(text[f].text && text[f].text === findtxt) {
						if(inlinestyle.style.includes("fontsize") === true) {
							const fontSizeVal = inlinestyle.style.split('-');
							text[f] = {...text[f], fontSize: fontSizeVal };
							curOffset = inlinestyle.offset + inlinestyle.length;
						}
						if(inlinestyle.style === 'BOLD') {
							text[f] = {...text[f], bold: true };
							curOffset = inlinestyle.offset + inlinestyle.length;
						}
						if(inlinestyle.style === 'ITALIC') {
							text[f] = {...text[f], italic: true };
							curOffset = inlinestyle.offset + inlinestyle.length;
						}
						if(inlinestyle.style === 'UNDERLINE') {
							text[f] = {...text[f], decoration: 'underline' };
							curOffset = inlinestyle.offset + inlinestyle.length;
						}
					}
				}
				continue;
			}

			if(inlinestyle.style.includes("fontsize") === true) {
				const fontSizeVal = inlinestyle.style.split('-');
				text.push({ text: block.text.substring(inlinestyle.offset, inlinestyle.offset + inlinestyle.length), fontSize: fontSizeVal[1] });
				curOffset = inlinestyle.offset + inlinestyle.length;
			}
			if(inlinestyle.style === 'BOLD') {
				text.push({ text: block.text.substring(inlinestyle.offset, inlinestyle.offset + inlinestyle.length), bold: true });
				curOffset = inlinestyle.offset + inlinestyle.length;
			}
			if(inlinestyle.style === 'ITALIC') {
				text.push({ text: block.text.substring(inlinestyle.offset, inlinestyle.offset + inlinestyle.length), italic: true });
				curOffset = inlinestyle.offset + inlinestyle.length;
			}
			if(inlinestyle.style === 'UNDERLINE') {
				text.push({ text: block.text.substring(inlinestyle.offset, inlinestyle.offset + inlinestyle.length), decoration: 'underline' });
				curOffset = inlinestyle.offset + inlinestyle.length;
			}
		}
		if(curOffset !== block.text.length) {
			text.push(block.text.substring(curOffset, block.text.length));
		}
		text.push('\n\n');
		return text;
	}

	function RenderCommonComponent (ques, textlineWidth) {
		if(!ques) {
			return '';
		}
		switch(ques.element) {
			case 'Label':
				const content = _convertFromHTML(ques.question);
				if(content.blocks) {
					const block = content.blocks[0];
					return fetchTextWithInlineStyle(block)
				}
				break;
			case 'Checkboxes':
				const texts = [];
				texts.push(ques.question);
				ques.options && ques.options.map(opt => {
					const cols = [];
					if(ques.answerText && ques.answerText.indexOf(opt.option) >= 0) {
						cols.push({
							width: 20,
							image: 'checkFill',
							alignment: ques.position ? ques.position : 'left'
						});
					}
					else {
						cols.push({
							width: 20,
							image: 'checkEmpty',
							alignment: ques.position ? ques.position : 'left'
						});
					}
					cols.push({
						width: '*',
						margin: [10, 2, 0, 0],
						text: opt.option
					});
					texts.push({
						alignment: 'justify',
						fontSize: 10,
						margin: [0, 5, 0, 0],
						columns: cols
					});
				})
				return texts;
			case 'RadioButtons':
				const textr = [];
				textr.push(ques.question);
				ques.options && ques.options.map(opt => {
					const optionscols = [];
					if(ques.answerText && ques.answerText.indexOf(opt.option) >= 0) {
						optionscols.push({
							width: 20,
							image: 'radiofill',
						});
					}
					else {
						optionscols.push({
							width: 20,
							image: 'radioempty',
						});
					}
					optionscols.push({
						width: '*',
						margin: [5, 2, 0, 0],
						text: opt.option
					});
					textr.push({
						alignment: 'justify',
						fontSize: 10,
						margin: [0, 5, 0, 0],
						columns: optionscols
					});
				})
				return textr;
			case 'DatePicker':
				return 'Date: ' + moment().format("MM-DD-YYYY");
			case 'TimePicker':
				return 'Time: ' + moment().format("hh:mm:ss");
			case 'TextInput':
				const text = [];
				const txtwidth = 
					getTextMaxWidth({
						absolutePosition: { x: 10, y: 10 },
						columns: [
						{
							text: ques.question,
						}
						]
					});
				text.push({ text: ques.question + ' ' + (ques.answerText ? ques.answerText : '') });
				text.push({ canvas: [{ type: 'line', x1: txtwidth, y1: 5, x2: (textlineWidth-10), y2: 5, lineWidth: 0.5 }] });
				return text;
			case 'Signature':
				const signtext = [];
				if(isShowSign) {
					signtext.push({ text: signName, italic: true });
					signtext.push('\n');
				}
				signtext.push('-----------------------------------\n');
				signtext.push('PATIENT SIGNATURE');
				return signtext;
		}
	}
	
	function getTextMaxWidth(content) {
		const temp = [];
		temp.push(content);
		const pdf = pdfMake.createPdf({ content: temp });
		pdf.getStream({});
		return pdf.docDefinition.content[0]._maxWidth;
	  }

	function replaceAll(str, find, replace) {
		var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return str.replace(new RegExp(escapedFind, 'g'), replace);
	}
	
	function replacePlaceholders(questionText) {
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

	async function prepareNewPDF (forms) {
		var fileObj = []
		setLoaing(true);
		let result = await Promise.all(forms.map(async (form) => {
			var docDefinition = {
				content: [],
				images: {
					logo: 'data:image/jpeg;base64,' + logobase64,
					radiofill: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAv0lEQVRIie3TO27CQBgE4E/0SYVpApdCcAxyh0COhOAUPI4CTmpCYVuyyIL92yWMNNWsZmZHu7zwdBjhGwf8ltxjVWq9MEeOvzvMMetjfnlgXvHSJWTU0PyWZ2RtzQf4xFug0DsWgfOO/rdc4wNjbBL6PhKQmmdc0ycJPa/pDycdRJrcmLbGIZG8Udxigm1CD020Shg08SsSEH2mJwwjARSfp+1Hm0bN6yHnhuadzStkWGKHn5I7xebhWV54ElwBlg9/Grd4t9YAAAAASUVORK5CYII=",
					radioempty: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA/klEQVRIie3TMU5CURAF0BNbsRLYDkglsTAYt2KMncKCNLgNAdcA9ijaIhZvCC8mX3mhhJtMc9+dO/Pnz3DA3qGJASb4ihijj8au5tdYYFURH7jaxfw7jB7RwnFEG0/xtkSv1LyZdX7zh+42NO+olxQY2HT+H4ahfSgp8BpJrYy7wBtm6Gb8WWjHJQXW46ll3Mzm504z/iS4RcZVLcUKq6OSTn6Zbo1JJLQzrit9xRTnGd8J7aikQD+SnrbQPof2vqRAQzqilbSKVbgLzRynJQVIF7oMg6G0LbWIjk3nS1yWmq/Rk46oaiPmu5ivUZeOaIRPaR1fpJkXj+WAPcEPFWpX1WYOUKsAAAAASUVORK5CYII=",
					checkEmpty: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAUUlEQVRIiWNgGAUkAg8GBobHDAwM/8nEj6Bm4ASPKDAc2RKcAKaIXIChn4kCw4gCoxaMWjBqwagFg9GCx1Ca3KIa2QyswIOBsjqBYIUzCjAAALrIRhJJbcctAAAAAElFTkSuQmCC",
					checkFill: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAWUlEQVRIie2VQQrAIAwEx76u4v8/YPyHPVmkoGDNodAdyEmYiaeAWCQBBagvx4A4C9iGvE3uheERqIs/HnF7DyfhEAUUUECBLwaKg9Nmj5G9m5CB02HJP3EBgwA1L3r99a0AAAAASUVORK5CYII=",
				}
			}

			for(let i=0; i<form.questions.length; i++) {
				const ques = form.questions[i];
				if(ques.parentId > 0) {
					continue;
				}

				if(ques.element === "CompanyLogo") {
					docDefinition.content.push(
						{
							image: 'logo',
							alignment: ques.position ? ques.position : 'left',
							width: 180,
							height: 100,
						},
					);
					docDefinition.content.push({
						text: '\n'
					});
				}

				if(ques.element === "TextInput" ) {
					const txtwidth = 
						getTextMaxWidth({
						  absolutePosition: { x: 10, y: 10 },
						  columns: [
							{
							  text: ques.question,
							}
						  ]
						});
					docDefinition.content.push({ text: ques.question });
					docDefinition.content.push({ canvas: [{ type: 'line', x1: txtwidth, y1: 5, x2: 495-10, y2: 5, lineWidth: 0.5 }] });
					docDefinition.content.push({
						text: '\n'
					});
				}

				if(ques.element === "Header") {
					const queText = replacePlaceholders(ques.question);
					const content = _convertFromHTML(queText);
					if(content.blocks) {
						const block = content.blocks[0];
						docDefinition.content.push(
							{
								text: fetchTextWithInlineStyle(block),
								alignment: ques.position ? ques.position : 'left',
							},
						);
					}
				}
				
				if(ques.element === "Paragraph") {
					//ordered-list-item
					console.log('ques.question: ', ques.question);
					const content = _convertFromHTML(ques.question);
					if(content.blocks) {
						console.log('content: ', content);
						const block = content.blocks[0];
						var start = true;
						let ullist = [];
						let ollist = [];
						content.blocks.map(b=> {
							if(b.type === 'unordered-list-item') {
								start = true;
								console.log(fetchTextWithInlineStyle(b));
								ullist.push(fetchTextWithInlineStyle(b));
							}
							else if(b.type === 'ordered-list-item') {
								start = true;
								console.log(fetchTextWithInlineStyle(b));
								ollist.push(fetchTextWithInlineStyle(b));
							}
							else {
								if(ullist.length > 0) {
									docDefinition.content.push(
										{
											ul: ullist,
										},
									);
									ullist = [];
								}
								if(ollist.length > 0) {
									docDefinition.content.push(
										{
											ol: ollist,
										},
									);
									ollist = [];
								}
								start = false;
								docDefinition.content.push(
									{
										text: fetchTextWithInlineStyle(b),
									},
								);	
							}
						})

						if(start === true && ullist.length > 0) {
							docDefinition.content.push(
								{
									ul: ullist,
								},
							);
						}

						if(start === true && ollist.length > 0) {
							docDefinition.content.push(
								{
									ol: ollist,
								},
							);
						}

						docDefinition.content.push({
							text: '\n'
						});
					}
				}

				if(ques.element === "Label") {
					const content = _convertFromHTML(ques.question);
					if(content.blocks) {
						const block = content.blocks[0];
						docDefinition.content.push(
							{
								text: fetchTextWithInlineStyle(block),
							},
						);
					}
				}

				if(ques.element === "TwoColumnRow" ) {
					const childItems = [];
					form.questions && form.questions.map(ele => {
						if(ques.childItems.indexOf(ele.id) >= 0) {
							childItems.push(ele);
						}
					});
					const child0 = childItems[0];
					const child1 = childItems[1];
					docDefinition.content.push({
						text: '\n'
					});
					const cols = [];
					cols.push(RenderCommonComponent(child0, 250));
					cols.push(RenderCommonComponent(child1, 250));
					docDefinition.content.push({
						alignment: 'justify',
						columns: cols
					});
					docDefinition.content.push({
						text: '\n'
					});
				}

				if(ques.element === "ThreeColumnRow" ) {
					const childItems = [];
					form.questions && form.questions.map(ele => {
						if(ques.childItems.indexOf(ele.id) >= 0) {
							childItems.push(ele);
						}
					});
					const child0 = childItems[0];
					const child1 = childItems[1];
					const child2 = childItems[2];
					docDefinition.content.push({
						text: '\n'
					});
					const cols = [];
					cols.push(RenderCommonComponent(child0, 170));
					cols.push(RenderCommonComponent(child1, 170));
					cols.push(RenderCommonComponent(child2, 170));
					docDefinition.content.push({
						alignment: 'justify',
						columns: cols
					});
					docDefinition.content.push({
						text: '\n'
					});
				}

				if(ques.element === "GroupRow" ) {
					const content = _convertFromHTML(ques.question);
					if(content.blocks) {
						const block = content.blocks[0];
						docDefinition.content.push(
							{
								text: fetchTextWithInlineStyle(block),
							},
						);
					}

					const childItems = [];
					form.questions && form.questions.map(ele => {
						if(ques.childItems.indexOf(ele.id) >= 0) {
							childItems.push(ele);
						}
					});

					for(var c=0; c< childItems.length; c++) {
						const child = childItems[c];
						docDefinition.content.push(RenderCommonComponent(child, 170));
						docDefinition.content.push({
							text: '\n'
						});
					}

					docDefinition.content.push({
						text: '\n'
					});
				}

				if(ques.element === "Signature" ) {
					docDefinition.content.push({
						text: '\n'
					});
					docDefinition.content.push({
						text: RenderCommonComponent(ques)
					});
					docDefinition.content.push({
						text: '\n'
					});
				}

				// if(ques.element === "DatePicker" ) {
				// 	RenderComponent(doc, x, y, ques);
				// 	y = y + 20;
				// }

				// if(ques.element === "TimePicker" ) {
				// 	RenderComponent(doc, x, y, ques);
				// 	y = y + 20;
				// }

				if(ques.element === "RadioButtons") {
					docDefinition.content.push({
						text: '\n'
					});
					const content = _convertFromHTML(ques.question);
					if(content.blocks) {
						const block = content.blocks[0];
						docDefinition.content.push(
							{
								text: fetchTextWithInlineStyle(block),
							},
						);
					}
					ques.options && ques.options.map(opt => {
						const cols = [];
						if(ques.answerText && ques.answerText.indexOf(opt.option) >= 0) {
							cols.push({
								width: 18,
								image: 'radiofill',
								alignment: ques.position ? ques.position : 'left'
							});
						}
						else {
							cols.push({
								width: 18,
								image: 'radioempty',
								alignment: ques.position ? ques.position : 'left'
							});
						}
						cols.push({
							width: '*',
							margin: [5, 2, 0, 0],
							text: opt.option
						});
						docDefinition.content.push({
							alignment: 'justify',
							columns: cols
						});
					})
					docDefinition.content.push({
						text: '\n'
					});
				}

				if(ques.element === "Checkboxes") {
					docDefinition.content.push({
						text: '\n'
					});
					const content = _convertFromHTML(ques.question);
					if(content.blocks) {
						const block = content.blocks[0];
						docDefinition.content.push(
							{
								text: fetchTextWithInlineStyle(block),
							},
						);
					}
					// docDefinition.content.push(ques.question);
					ques.options && ques.options.map(opt => {
						const cols = [];
						if(ques.answerText && ques.answerText.indexOf(opt.option) >= 0) {
							cols.push({
								width: 20,
								image: 'checkFill',
								alignment: ques.position ? ques.position : 'left'
							});
						}
						else {
							cols.push({
								width: 20,
								image: 'checkEmpty',
								alignment: ques.position ? ques.position : 'left'
							});
						}
						cols.push({
							width: '*',
							margin: [5, 2, 0, 0],
							text: opt.option
						});
						docDefinition.content.push({
							alignment: 'justify',
							fontSize: 10,
							margin: [0, 5, 0, 0],
							columns: cols
						});
					})
					
				}
			}

			// pdfMake.createPdf(docDefinition).open();
			const pdfDocGenerator = pdfMake.createPdf(docDefinition);
			const filename = form.name +'_' + patientDetail.patient_id + '_' + exams[0] + '.pdf';
			
			const wait = pdfData => new Promise(resolve => {
				pdfData.getBuffer(buffer => {
				resolve(buffer);
				});
			});
  			const pdfDocbuffer = await wait(pdfDocGenerator);

			const params = {
				Body:  pdfDocbuffer,
				Bucket: S3_BUCKET,
				Key: 'ris/paperworkpdf/' + filename,
				ContentType: 'application/pdf'
			};

			const response = await myBucket.putObject(params).promise();

			const document = {
				form_id: form.id,
				doc_status: 'yes',
				pdfName: 'paperworkpdf/' + filename
			}
			fileObj.push(document)

			return response;
		}));

		if(fileObj.length > 0) {
			var uploadData = {
				patient_id: patientDetail.id,
				exam_id: exams,
				data: fileObj,
			}
			const data = await dispatch(savePaperWork(uploadData))
		}
		setLoaing(false);

		
	};

	function RenderComponent (doc, x, y, ques, textlineWidth) {
		switch(ques.element) {
			case 'Label':
				var splitTitle = doc.splitTextToSize(ques.question, 180);
				if(ques.position === 'right') {
					doc.text(splitTitle, 200, y, null, null, "right");
				}
				else if(ques.position === 'center') {
					doc.text(splitTitle, 100, y, null, null, "center");
				}
				else {
					doc.text(splitTitle, x, y);
				}
				break;
			case 'DatePicker':
				y = y + 3;
				doc.text('Date: ' + moment().format("MM-DD-YYYY"), x, y);
				break;
			case 'TimePicker':
				y = y + 3;
				doc.text('Time: ' + moment().format("hh:mm:ss"), x, y);
				break;
			case 'TextInput':
				var splitTitle = doc.splitTextToSize(ques.question, 180);
				doc.text(x, y, splitTitle);
				var width = doc.getTextWidth(ques.question);
				// y = y + 5;
				x = x + width + 2;
				doc.text(x, y, ques.answerText ? ques.answerText : '');
				y = y + 1;
				doc.line(x, y, textlineWidth, y);
				x = 10;
				break;
			case 'Signature':
				y = y + 3;
				if(isShowSign) {
					doc.addFileToVFS("Pacifico-Regular.ttf", pdfFonts[signFont]);
					doc.addFont("Pacifico-Regular.ttf", "Pacifico", "normal");
					doc.setFont("Pacifico", "normal");
					doc.text(signName,x, y);
					doc.setFont("helvetica", "normal");
					y = y + 5;
				}
				doc.text('-----------------------------------',x, y);
				y = y + 5;
				doc.text('PATIENT SIGNATURE',x, y);
				break;
		}
	}
	function parsedHTML (questionText) {
		return questionText.replace(/<ins>/g, '').replace(/<\/ins>/g, '').replace(/<strong>/g, '').replace(/<\/strong>/g, '');
	}

	function _convertFromHTML(content) {
		const newContent = htmlToDraft(content);
		const contentState = ContentState.createFromBlockArray(newContent.contentBlocks);
		const content_object = convertToRaw(contentState);
		return content_object;
	}
	
	function setInlineStyle (doc, block, x, y) {
		var isBold = false;
		var isItalic = false;
		for(var i=0; i< block.inlineStyleRanges.length; i++) {
			const inlinestyle = block.inlineStyleRanges[i];
			if(inlinestyle.style === 'BOLD') {
				// const startstr = block.text.substring(0, inlinestyle.offset);
				// var splitTitle = doc.splitTextToSize(startstr, 180);
				// doc.text(splitTitle, x, y);
				// console.log(startstr);
				// var startwidth = doc.getTextWidth(startstr);
				// const textstr = block.text.substring(inlinestyle.offset, inlinestyle.offset + inlinestyle.length);
				// console.log(textstr);
				// var width = doc.getTextWidth(textstr);
				// var lineHeight = doc.getLineHeight(block.text) / doc.internal.scaleFactor;
				// splitTitle = doc.splitTextToSize(textstr, 180);
				doc.setFont("helvetica", "bold");
				// doc.text(splitTitle, x + startwidth % 180, y + lineHeight);
				// doc.setFont("helvetica", "normal");
				isBold = true;
			}
			if(inlinestyle.style === 'ITALIC') {
				doc.setFont("helvetica", "italic");
				isItalic = true;
			}
			if(inlinestyle.style === 'UNDERLINE') {
				const textstr = block.text.substring(inlinestyle.offset, inlinestyle.length);
				var width = doc.getTextWidth(textstr);
				doc.line(x, y + 1, width + 5, y + 1);
			}
		}
		if(isItalic && isBold) {
			doc.setFont("helvetica", "bolditalic");
		}
		return doc;
	}

	
	function resetInlineStyle (doc) {
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		return doc;
	}
	async function uploadPDFS3(forms) {
		var fileObj = []
		setLoaing(true);
		let result = await Promise.all(forms.map(async (form) => {
			var doc = new jsPDF();
			let x = 10, y = 10;
			const radiofill = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAv0lEQVRIie3TO27CQBgE4E/0SYVpApdCcAxyh0COhOAUPI4CTmpCYVuyyIL92yWMNNWsZmZHu7zwdBjhGwf8ltxjVWq9MEeOvzvMMetjfnlgXvHSJWTU0PyWZ2RtzQf4xFug0DsWgfOO/rdc4wNjbBL6PhKQmmdc0ycJPa/pDycdRJrcmLbGIZG8Udxigm1CD020Shg08SsSEH2mJwwjARSfp+1Hm0bN6yHnhuadzStkWGKHn5I7xebhWV54ElwBlg9/Grd4t9YAAAAASUVORK5CYII=";
			const radioempty = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA/klEQVRIie3TMU5CURAF0BNbsRLYDkglsTAYt2KMncKCNLgNAdcA9ijaIhZvCC8mX3mhhJtMc9+dO/Pnz3DA3qGJASb4ihijj8au5tdYYFURH7jaxfw7jB7RwnFEG0/xtkSv1LyZdX7zh+42NO+olxQY2HT+H4ahfSgp8BpJrYy7wBtm6Gb8WWjHJQXW46ll3Mzm504z/iS4RcZVLcUKq6OSTn6Zbo1JJLQzrit9xRTnGd8J7aikQD+SnrbQPof2vqRAQzqilbSKVbgLzRynJQVIF7oMg6G0LbWIjk3nS1yWmq/Rk46oaiPmu5ivUZeOaIRPaR1fpJkXj+WAPcEPFWpX1WYOUKsAAAAASUVORK5CYII=";
			const checkEmpty = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAUUlEQVRIiWNgGAUkAg8GBobHDAwM/8nEj6Bm4ASPKDAc2RKcAKaIXIChn4kCw4gCoxaMWjBqwagFg9GCx1Ca3KIa2QyswIOBsjqBYIUzCjAAALrIRhJJbcctAAAAAElFTkSuQmCC";
			const checkFill = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAWUlEQVRIie2VQQrAIAwEx76u4v8/YPyHPVmkoGDNodAdyEmYiaeAWCQBBagvx4A4C9iGvE3uheERqIs/HnF7DyfhEAUUUECBLwaKg9Nmj5G9m5CB02HJP3EBgwA1L3r99a0AAAAASUVORK5CYII=";

			doc.setFontSize(11);
			doc.setFont("helvetica", "normal");
			const pageHeight= doc.internal.pageSize.height;
			for(let i=0; i<form.questions.length; i++) {
				if (y >= (pageHeight - 10)){
					doc.addPage();
					y = 20;
				}
				const ques = form.questions[i];
				if(ques.parentId > 0) {
					continue;
				}

				if(ques.element === "CompanyLogo") {
					y = y - 5;
					doc.addImage(logobase64, 'JPEG', 70, y);
					y = y + 45;
				}
				if(ques.element === "RadioButtons") {
					if(ques.question !== null){
						var splitTitle = doc.splitTextToSize(ques.question, 180);
						doc.text(x, y, splitTitle);
						let subx = 0;
						y = y + (4 * splitTitle.length);
						ques.options && ques.options.map(opt => {
							subx = subx + 15;
							if(opt.option === ques.answerText) {
								doc.addImage(radiofill, "PNG", subx , y);
							}
							else {
								doc.addImage(radioempty, "PNG", subx , y);
							}
							subx = subx + 10;
							doc.text(opt.option, subx, y + 5);
						})
						y = y + 5;
					}
					y = y + 12;
				}

				if(ques.element === "Checkboxes") {
					if(ques.question !== null){
						var splitTitle = doc.splitTextToSize(ques.question, 180);
						doc.text(x, y, splitTitle);
						y = y + (4 * splitTitle.length);
						ques.options && ques.options.map(opt => {
							let subx = 15;
							if(ques.answerText && ques.answerText.indexOf(opt.option) >= 0) {
								doc.addImage(checkFill, "PNG", subx , y);
							}
							else {
								doc.addImage(checkEmpty, "PNG", subx , y);
							}
							subx = subx + 10;
							doc.text(opt.option, subx, y + 5);
							var lineHeight = doc.getLineHeight(opt.option) / doc.internal.scaleFactor;
							y = y + lineHeight + 2;
						})
						y = y + 5;
					}
					y = y + 12;
				}

				if(ques.element === "TextInput" ) {
					if(ques.question !== null ){
						RenderComponent(doc, x, y, ques, 190);
					}
					y = y + 10;
				}

				if(ques.element === "Label" ) {
					if(ques.question !== null ){
						RenderComponent(doc, x, y, ques);
					}
					y = y + 8;
				}

				if(ques.element === "Header" ) {
					if(ques.question !== null ){
						doc.setFontSize(14);
						const content = _convertFromHTML(ques.question);
						if(content.blocks) {
							for(var j=0; j<content.blocks.length; j++){
								const block = content.blocks[j];
								doc = setInlineStyle(doc, block, x, y);
								var splitTitle = doc.splitTextToSize(block.text, 180);
								if(ques.position === 'right') {
									doc.text(splitTitle, 200, y, null, null, "right");
								}
								else if(ques.position === 'center') {
									doc.text(splitTitle, 100, y, null, null, "center");
								}
								else {
									doc.text(splitTitle, x, y);
								}
								y = y + (3 * splitTitle.length);
							}
						}
						doc = resetInlineStyle(doc);
					}
					y = y + 6;
				}

				if(ques.element === "TwoColumnRow" ) {
					const childItems = [];
					form.questions && form.questions.map(ele => {
						if(ques.childItems.indexOf(ele.id) >= 0) {
							childItems.push(ele);
						}
					});
					const child0 = childItems[0];
					const child1 = childItems[1];
					RenderComponent(doc, x, y, child0, 98);
					RenderComponent(doc, 100, y, child1, 190);
					y = y + 10;
				}

				if(ques.element === "ThreeColumnRow" ) {
					const childItems = [];
					form.questions && form.questions.map(ele => {
						if(ques.childItems.indexOf(ele.id) >= 0) {
							childItems.push(ele);
						}
					});
					const child0 = childItems[0];
					const child1 = childItems[1];
					const child2 = childItems[2];
					RenderComponent(doc, x, y, child0, 65);
					RenderComponent(doc, 68, y, child1, 130);
					RenderComponent(doc, 132, y, child2, 190);
					y = y + 10;
				}

				if(ques.element === "Paragraph" ) {
					if(ques.question !== null ){
						var lineHeight = doc.getLineHeight(ques.question) / doc.internal.scaleFactor;
						var splitTitle = doc.splitTextToSize(ques.question, 180);
						// doc.text(x, y, splitTitle);
						const content = _convertFromHTML(ques.question);
						if(content.blocks) {
							const block = content.blocks[0];
							doc = setInlineStyle(doc, block, x, y);
							var splitTitle = doc.splitTextToSize(block.text, 180);
							doc.text(splitTitle, x, y);
						}
						doc = resetInlineStyle(doc);

						y = y + (lineHeight * splitTitle.length);
					}
					y = y + 4;
				}

				if(ques.element === "Signature" ) {
					RenderComponent(doc, x, y, ques);
					y = y + 20;
				}

				if(ques.element === "DatePicker" ) {
					RenderComponent(doc, x, y, ques);
					y = y + 20;
				}

				if(ques.element === "TimePicker" ) {
					RenderComponent(doc, x, y, ques);
					y = y + 20;
				}
			}

			if (y === 20) {
				var pageCount = doc.internal.getNumberOfPages();
				doc.deletePage(pageCount);
			}
			doc.save('sample-file.pdf');
			// const filename = form.name +'_' + patientDetail.patient_id + '_' + exams[0] + '.pdf';
			// const params = {
			// 	Body:  doc.output('arraybuffer'),
			// 	Bucket: S3_BUCKET,
			// 	Key: 'ris/paperworkpdf/' + filename,
			// 	ContentType: 'application/pdf'
			// };

			// const response = await myBucket.putObject(params).promise();

			// const document = {
			// 	form_id: form.id,
			// 	doc_status: 'yes',
			// 	pdfName: 'paperworkpdf/' + filename
			// }
			// fileObj.push(document)

			// return response;
		}));

		if(fileObj.length > 0) {
			var uploadData = {
				patient_id: patientDetail.id,
				exam_id: exams,
				data: fileObj,
			}
			const data = await dispatch(savePaperWork(uploadData))
		}
		setLoaing(false);
	}

	async function handleFormNext(e, step) {
		// if(!isShowSign) {
		// 	handleAddSignature();
		// }
		const _filledForms = [ ...filledForms ];			
		_filledForms[formIndex] = currentForm;
		setfilledForms(_filledForms);
		const indx = formIndex + 1;
		if(indx < paperworkdata.forms.length) {
			const questions = prepareForms(paperworkdata.forms[indx]);
			setCurrentForm({ ...paperworkdata.forms[indx], questions });
			setFormIndex(indx);
		}
		else {
			// uploadPDFS3(_filledForms);
			prepareNewPDF(_filledForms);
			setCurrentStep('Finish');
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
		scrollToTop();
	}

	function handleAddSignature () {
		setShowSign(true);
		CustomNotify("Signature added", "success");
	}

	function handleSignSelected (e, font) {
		setSignFont(font);
	}

	// function handleChange(event, index) {
	// 	const name = event.target.name;
	// 	const value = event.target.value;
	// 	console.log('test', index);
	// }

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	// function disableButton() {
	// 	setIsFormValid(false);
	// }

	// function enableButton() {
	// 	setIsFormValid(true);
	// }

	const scrollToTop = () => {
		paperPageScroll.current.scrollTop = 0;
	};

	if(!paperworkdata || loadingPage) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}
	
	return (
		<FuseScrollbars
			className={clsx(classes.root, 'flex flex-1 flex-shrink-0 flex-col overflow-y-auto py-8')}
			ref={paperPageScroll}
		>
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32')}>
			<div className="flex flex-col items-center justify-center w-full">
				<FuseAnimate animation="transition.expandIn">
					<Card className="w-full max-w-2xl rounded-8">
						<Stepper alternativeLabel activeStep={activeStep}>
							{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
							))}
						</Stepper>
						{currentStep === 'Start' &&(
						<CardContent className="flex flex-col items-center justify-center p-32 text-center" style={{ background: '#fff' }} >
							{paperWorkStatus === 'Pending' && (
							<>
							<Typography variant="h6" >
								Thank you for Scheduling your appointment at
								<span className="font-bold ml-4">
									{fulllocationText}.
								</span>
							</Typography>

							<Typography variant="h6" className="mb-16">
								Below you will find your exam details for your visit at
								<span className="font-bold ml-4">
									{locationText}:
								</span>
							</Typography>

							<Divider className="w-48" />
							<div className="flex">
								<Button
									variant="contained"
									color="primary"
									className="mx-auto my-16"
									aria-label="Subscribe"
									type="submit"
									onClick={(e) => handleOpenPaperwork(e, 'PatientInfo')}
								>
									Click here to begin your Paperwork
								</Button>
							</div>
							</>)}
							{paperWorkStatus === 'Completed' && (
							<Typography variant="h6" >
								Thank you for the Business. You have already completed Paper work for below exams.
							</Typography>)}
							{paperWorkStatus === 'ExamPassed' && (
							<Typography variant="h6" >
								Your exam has passed. Please contact our office to reschedule.
							</Typography>)}
							{paperWorkStatus === 'ExamCancelled' && (
							<Typography variant="h6" >
								Your exam has been cancelled. Please contact our office for more details.
							</Typography>)}
							{paperworkdata && paperworkdata.patientDetail && (
							<div className="mb-12 flex flex-col justify-center">
								<div className='w-440 pt-8 pb-8 mr-8'>
								<Card style={{color: "black", background: "white", position: 'relative'}} elevation={1}>
									<CardContent style={{padding: "0px"}} className="w-full flex flex-col flex-auto items-center justify-center">
										<div className={`flex flex-shrink-0 items-center justify-center px-12 w-full h-32`}>
											<Typography className='text-17 italic mr-6'>
												Patient Id:
											</Typography>
											<Typography className='font-700 text-17 mr-12'>
												{patientDetail.patient_id}
											</Typography>
											<Typography className='text-17 italic mr-6'>
												Name:
											</Typography>
											<Typography className='font-700 text-17 truncate'>
												{patientDetail.patient_name}
											</Typography>
										</div>
										<div className={`flex flex-shrink-0 items-center justify-center px-24  h-32`}>
											<Typography className='text-17 truncate italic mr-6'>
												Date of Birth:
											</Typography>
											<Typography className='font-700 text-17 truncate mr-12'>
												{moment(patientDetail.birth_date).format("MM-DD-YYYY")}
											</Typography>
										</div>
									</CardContent>
								</Card>
								</div>
								{/* <div className='w-440 pt-8 pb-8 mr-8'>
									<ExamCard 
										patient={exam} 
										isShowAction={false}
										isShowClose={true}
									/>
								</div> */}
								<div className="mb-12 flex justify-center" className={classes.scrollHrSelectedExam}>
									{paperworkdata && paperworkdata.examDetail.map(exam =>
										<div className={paperworkdata.examDetail && paperworkdata.examDetail.length <=1 ?  'w-440 pt-8 pb-8 mr-8' : 'w-400 pt-8 pb-8 mr-8'} key={exam.exam_id}>
											<ExamCard 
												patient={exam} 
												isShowAction={false}
												isShowClose={true}
											/>
										</div>
									)}
								</div>
							</div>)}
						</CardContent>)}
						{currentStep === 'PatientInfo' &&(
						<CardContent className="flex flex-col items-center justify-center" style={{ background: '#fff' }} >
							<PatientEditInfo patientInfo={paperworkdata.patientDetail} allCity={allCity}/>
							<div className="flex">
								<Button
									variant="contained"
									color="primary"
									className="mx-auto my-16"
									aria-label="Subscribe"
									type="submit"
									onClick={(e) => handleOpenPaperwork(e, 'Signature')}
								>
									Confirm
								</Button>
							</div>
						</CardContent>)}
						{currentStep === 'Signature' &&(
						<CardContent className="flex flex-col items-center justify-center" style={{ background: '#fff' }} >
							<Card className="w-full max-w-sm rounded-8">
								<AppBar position="static" elevation={0}>
									<Toolbar className="px-8">
										<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
											Choose A Signature Font
										</Typography>
									</Toolbar>
								</AppBar>
								{paperworkdata && paperworkdata.patientDetail && (
								<CardContent className="flex flex-col items-center justify-center" style={{ background: '#fff' }} >
									<Button 
										variant="contained" 
										className={clsx(classes.font1, signFont === 'Damion' ? classes.selectedButton: '' ,'p-10 m-10 italic w-full text-2xl')}
										onClick={(e) => handleSignSelected(e, 'Damion' )}>
										{paperworkdata.patientDetail.lname}, {paperworkdata.patientDetail.fname}
									</Button>
									<Button 
										variant="contained" 
										className={clsx(classes.font2, signFont === 'Leckerli One' ? classes.selectedButton: '' ,'p-10 m-10 italic w-full text-2xl')}
										onClick={(e) => handleSignSelected(e, 'Leckerli One' )}>
										{paperworkdata.patientDetail.lname}, {paperworkdata.patientDetail.fname}
									</Button>
									<Button 
										variant="contained" 
										className={clsx(classes.font3, signFont === 'Beth Ellen' ? classes.selectedButton: '' , 'p-10 m-10 italic w-full text-2xl')}
										onClick={(e) => handleSignSelected(e, 'Beth Ellen' )}>
										{paperworkdata.patientDetail.lname}, {paperworkdata.patientDetail.fname}
									</Button>
									<Button 
										variant="contained" 
										className={clsx(classes.font4, signFont === 'Pacifico' ? classes.selectedButton: '' , 'p-10 m-10 italic w-full text-2xl')}
										onClick={(e) => handleSignSelected(e, 'Pacifico' )}>
										{paperworkdata.patientDetail.lname}, {paperworkdata.patientDetail.fname}
									</Button>
									<Button 
										variant="contained" 
										className={clsx(classes.font5, signFont === 'Homemade Apple' ? classes.selectedButton: '' , 'p-10 m-10 italic w-full text-2xl')}
										onClick={(e) => handleSignSelected(e, 'Homemade Apple' )}>
										{paperworkdata.patientDetail.lname}, {paperworkdata.patientDetail.fname}
									</Button>
									<div className="flex w-full">
										<Button
											variant="contained"
											color="primary"
											className="mx-auto my-4 w-full"
											aria-label="Subscribe"
											type="submit"
											onClick={(e) => handleOpenPaperwork(e, 'Forms')}
										>
											Choose
										</Button>
									</div>
									<div className="flex w-full">
										<Button
											variant="contained"
											color="default"
											className="mx-auto my-4 w-full"
											aria-label="Subscribe"
											type="submit"
											onClick={(e) => handleOpenPaperwork(e, 'PatientInfo')}
										>
											Exam Details
										</Button>
									</div>
								</CardContent>
								)}
							</Card>
						</CardContent>)}
						{currentStep === 'Forms' &&(
							<div className="flex flex-col items-center justify-center w-full">
						<Card className="w-full max-w-xl rounded-8">
							<AppBar position="static" elevation={0}>
								<Toolbar className="px-8">
									<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
										{currentForm.name}
									</Typography>
								</Toolbar>
							</AppBar>
							<CardContent className="flex flex-col justify-center" style={{ background: '#fff' }} >
								<PreviewComponent 
									currentForm={currentForm} 
									handleAddSignature={handleAddSignature} 
									signFont={signFont}
									signName={signName}
									isShowSign={isShowSign}
									// handleChange={handleChange}
									logobase64={logobase64}
									handleFormNext={handleFormNext}
									handleFormBack={handleFormBack}
									placeholdersValues={placeholdersValues}
								/>
								{/* <div className="flex">
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
								</div> */}
							</CardContent>
						</Card>
						</div>)}

						{currentStep === 'Finish' &&(
						<CardContent className="flex flex-col items-center justify-center p-32 text-center" style={{ background: '#fff' }} >
							{!loading &&
							<Typography variant="h6" className="mb-12 bg-green-100 rounded-md">
								Congratulations you have completed the process. We look forward to seeing you on 
								<span className="font-bold ml-4 mr-4">
									{fulllocationText}.
								</span>
								Please reach 15 mins before your appointment time.
							</Typography>}

							{loading &&
							<Typography variant="h6" className="mb-12 rounded-md">
								Please wait we are finalizing your paper work.
								<CircularStatic />
							</Typography>}

							<Divider className="w-48" />

							{paperworkdata && paperworkdata.patientDetail && (
							<div className="mb-12 flex flex-col justify-center">
								<div className='w-440 pt-8 pb-8 mr-8'>
								<Card style={{color: "black", background: "white", position: 'relative'}} elevation={1}>
									<CardContent style={{padding: "0px"}} className="w-full flex flex-col flex-auto items-center justify-center">
										<div className={`flex flex-shrink-0 items-center justify-center px-12 w-full h-32`}>
											<Typography className='text-17 italic mr-6'>
												Patient Id:
											</Typography>
											<Typography className='font-700 text-17 mr-12'>
												{patientDetail.patient_id}
											</Typography>
											<Typography className='text-17 italic mr-6'>
												Name:
											</Typography>
											<Typography className='font-700 text-17 truncate'>
												{patientDetail.patient_name}
											</Typography>
										</div>
										<div className={`flex flex-shrink-0 items-center justify-center px-24  h-32`}>
											<Typography className='text-17 truncate italic mr-6'>
												Date of Birth:
											</Typography>
											<Typography className='font-700 text-17 truncate mr-12'>
												{moment(patientDetail.birth_date).format("MM-DD-YYYY")}
											</Typography>
										</div>
									</CardContent>
								</Card>
								</div>
								<div className="mb-12 flex justify-center" className={classes.scrollHrSelectedExam}>
									{paperworkdata && paperworkdata.examDetail.map(exam =>
										<div className={paperworkdata.examDetail && paperworkdata.examDetail.length <=1 ?  'w-440 pt-8 pb-8 mr-8' : 'w-400 pt-8 pb-8 mr-8'} key={exam.exam_id}>
											<ExamCard 
												patient={exam} 
												isShowAction={false}
												isShowClose={true}
											/>
										</div>
									)}
								</div>
							</div>)}
						</CardContent>)}
						{/* <div>
							<Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
								Back
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleNext}
								className={classes.button}
							>
								{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
							</Button>
							</div> */}
					</Card>
				</FuseAnimate>
			</div>
		</div>
	</FuseScrollbars>
	);
}

export default PaperPortalPage;

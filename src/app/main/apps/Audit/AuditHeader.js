import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setTableNumber,setdefaultOptions,setAuditTypeinState, setAuditSearchText, setFilterOptions, removeFilterOptions, clearFilterOptions, removErrorMessage } from './store/auditSlice';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import AlertDialog from 'app/fuse-layouts/shared-components/AlertDialog';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from 'react-bootstrap-slider';
import Card from "react-bootstrap-slider";
import { Accordion, AccordionSummary } from 'react-bootstrap-slider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import CardContent from '@material-ui/core/CardContent';
import { useForm } from '@fuse/hooks';
import clsx from 'clsx';


const head = {
    color: '#fff',
    display: 'flex',
    //  background: 'linear-gradient(to left, #122230 0%, #192d3e 100%)',
    minHeight: ' 60px',
    backgroundSize: 'cover',
    // backgroundColor: '#122230'
},
    active = {
        color: "red",
    }


const useStyles = makeStyles(theme => ({
    selectedButton: {
        backgroundColor: 'rgb(76, 175, 80)',
        '&:hover': {
            backgroundColor: 'rgb(76, 175, 80)',
        },
    },
    padding_0 : {
		paddingBottom:'0px !important'
	},
    heading: {
        backgroundColor: '#192d3e',
        margin: '0px'
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },

}));


function Audit(props) {



    function handleClick(e) {
        // modify the state, this will automatically recall render() below.
        this.setState((prevState) => {
            return { animate: !prevState.animate }
        });
    }

    const classes = useStyles();
    const card = '';


    const dispatch = useDispatch();
    //	const searchText = useSelector(({ insuranceApp }) => insuranceApp.insurance.searchText);
    const mainTheme = useSelector(selectMainTheme);
    const [open, setOpen] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);
    const tableNo = useSelector(({ auditApp }) => auditApp.audit.tableNo);

    const filterOptions = []
    //	const err_msg = useSelector(({ insuranceApp }) => insuranceApp.insurance.err_msg);
    const err_msg = '';
    const [whereOperator, setWhereOperator] = React.useState('AND');
    const [auditType, setAuditType] = useState('');


    // async function fetchAuditTypes() {	
    // 	const result = await dispatch(insuranceCompanyTypes());
    // 	setInsuranceTypes(result.payload.data)
    // 	// if(result.payload.data){
    // 	// 	setFilteredData(result.payload.data)
    // 	// }			
    // 	// setIsSearching(false);
    // }

    // useEffect(() => {
    // 	fetchAuditTypes()
    // },[]);




    const [expanded, setExpanded] = React.useState('commercial');

    const handleAChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSelected = (event, name) => {

        if(name=='User'){
            dispatch(setTableNumber({tableNo:null}))
            dispatch(setdefaultOptions(defaultOptionsForUser))
        }
        else if(name=='Patient'){
            dispatch(setTableNumber({tableNo:0}))
            dispatch(setdefaultOptions(defaultOptions))
        }

        setAuditType(name);
        dispatch(setAuditTypeinState(name));
        //dispatch(setTableNumber({tableNo:0}))
        dispatch(setAuditSearchText({ type: name, action: 'TYPE' }))


    }


    const Buttons = ['System', 'Patient', 'User']

    const defaultOptionsForUser = [
		//{ title: 'First Name', value: 'fname', match: '', type: 'string', name: 'firstname' },
		//{ title: 'Last Name', value: 'lname', match: '', type: 'string', name: 'lastname' },
		{ title: 'Access No.', value: 'exam_access_no', match: '', type: 'string', name: 'access' },
		{ title: 'UserId', value: 'userid', match: '', type: 'string', name: 'user_id' },

	];

    const defaultOptions =  [{ title: 'First Name', value: 'fname', match: '', type: 'string', name: 'firstname' },
		{ title: 'Last Name', value: 'lname', match: '', type: 'string', name: 'lastname' },
		{ title: 'Access No.', value: 'exam_access_no', match: '', type: 'string', name: 'access' },
		{ title: 'PatientId', value: 'patient_id', match: '', type: 'string', name: 'patient_id' }]

    return (



        <div className="flex flex-1 items-center justify-between p-8 sm:p-24">




            <div style={head} className=" head  p-12">

                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography variant="h6" className="mx-12 hidden sm:flex">
                        <Icon className="text-32 mr-12">account_box</Icon>
                        Audit Details
                    </Typography>

                </FuseAnimate>
                {
                    Buttons.map((item, i) =>
                        <AccordionDetails className="justify-center p-0 ml-20">
                            <CardContent className={"p-0 "+classes.padding_0}>
                                <div className="flex justify-center w-full">
                                    <Button
                                        variant="contained"
                                        color={auditType === item ? "primary" : "default"}
                                        type="submit"
                                        className={clsx(
                                            auditType === item ? classes.selectedButton : '',
                                            'mr-10'
                                        )}
                                        // onClick={this.handleClick}
                                        onClick={(e) => handleSelected(e, item)}
                                    >
                                        {item}
                                    </Button>

                                </div>
                            </CardContent>
                        </AccordionDetails>
                    )
                }




            </div>






            <div>

            </div>

            <div className="flex flex-1 items-center justify-between p-8 ">

                <div className="flex flex-shrink items-center ">
                    <Hidden lgUp>
                        <IconButton
                            onClick={ev => {
                                props.pageLayout.current.toggleLeftSidebar();
                            }}
                            aria-label="open left sidebar"
                        >
                            <Icon>menu</Icon>
                        </IconButton>
                    </Hidden>

                </div>

                <PermissionSwitch permission="attorney_lookup" />
                {/* <div>{err_msg && <AlertDialog isOpen={true} alertType="error" alertMessage={err_msg}</div> */}
            </div>



        </div>


    );
}


export default Audit;

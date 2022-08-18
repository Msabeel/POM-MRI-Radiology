import FuseAnimate from '@fuse/core/FuseAnimate';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState, useCallback, useRef, useDeepCompareEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsTable from './ContactsTable';
import { getPermissions,updateContact } from './store/contactsSlice';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    marginLeft: theme.spacing(3),
  },
}));

const NestedList = ({ permissionsData, manageCheckUncheckExam, handleAction, handleChange, selected, deSelected }) => (
  <ul>
    {permissionsData.map((permission, index) => (
      <ul key={index}>
        {permission.parent === 0 ? <FormControlLabel
                                control={
                                  <Checkbox 
                                    onChange={handleChange} 
                                    name={permission.permission_name} 
                                    onChange={(e) => handleAction(e, permission)}
                                    checked={manageCheckUncheckExam(permission.permission_name)? selected:deSelected}
                                  />}
                                label={permission.permission_text}
                                key={permission.permission_name}
                              /> : null}
        {permissionsData.map(item => (
          item.parent === permission.id ?
          <li key={item.id} style={{ paddingLeft: '30px'}}>
              <FormControlLabel
                control={
                  <Checkbox 
                    onChange={handleChange} 
                    name={item.permission_name} 
                    onChange={(e) => handleAction(e, item)}
                    checked={manageCheckUncheckExam(item.permission_name)? selected:deSelected}
                  />}
                label={item.permission_text}
                key={item.permission_name}
              />
          </li> : null
        ))}
      </ul>
    ))}
  </ul>
);

function ContactsDetails(props) {


    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const [open, setOpen] = React.useState(false);
	  const [openError, setOpenError] = React.useState(false);
    const routeParams = useParams();
    const { form, handleChange, setForm } = useForm({});   
  	const dispatch = useDispatch();
    const contacts = useSelector(({ rolesApp }) => rolesApp.contacts);
    const permissions = useSelector(({ rolesApp }) => rolesApp.contacts.permissionlist);
    const isRolePermissionUpdated = useSelector(({ rolesApp }) => rolesApp.contacts.isRolePermissionUpdated);
    const isRolePermissionUpdatedError = useSelector(({ rolesApp }) => rolesApp.contacts.isRolePermissionUpdatedError);
  	const user = useSelector(({ rolesApp }) => rolesApp.user);
  	const [filteredData, setFilteredData] = useState(null);
    const [userTypeHasPermission,setState] = useState([]);
    const [openPermissionUpdated, setOpenPermissionUpdated] = React.useState(false);
    const [openPermissionUpdatedError, setOpenPermissionUpdatedError] = React.useState(false);
    
    useEffect(() => {
      if(isRolePermissionUpdated) {
          setOpenPermissionUpdated(true);
      }
    }, [isRolePermissionUpdated]);

    useEffect(() => {
      if(isRolePermissionUpdatedError) {
          setOpenPermissionUpdatedError(true);
      }
    }, [isRolePermissionUpdatedError]);

    useEffect(() => {
        dispatch(getPermissions(routeParams));
    }, [dispatch]);
      
    useEffect(() => {
        setState(permissions.userTypeHasPermission)
    }, [permissions.userTypeHasPermission]);
    
    useEffect(() => {
      return () => {
        console.log('will unmount');
        localStorage.setItem('usertype', '');
      }
    }, []);

    const handleClosePermissionUpdated = (event, reason) => {
      setOpenPermissionUpdated(false);
    };

    const handleClosePermissionUpdatedError = (event, reason) => {
      setOpenPermissionUpdatedError(false);
    };

    if (!permissions) {
      return null;
    }
    
    const selected = true;
    const preSelected = true;
    const deSelected = false;

    let permissionsData = permissions.allPermission;
    let role_name = permissions.role_name;
   
    
    if (!permissionsData) {
      return (
        <div className="flex flex-1 items-center justify-center h-full">
          <CircularProgress></CircularProgress>
        </div>
      );
    }
    const manageCheckUncheckExam = (id) => {
        if (!userTypeHasPermission) {
            return null;
        }
        let exam = userTypeHasPermission.find(x => x.permission_name == id);
        
        if (exam) {
          return true
        }
        else {
          return false
        }
	  }
    
    
    
    function handleAction(event, data) {
        const str = event.target.checked;
        let exam = userTypeHasPermission.find(x=>x.permission_name == data.permission_name);
        if(exam){ //remove from list
          const tempExams = [...userTypeHasPermission];
          let filterd = tempExams.filter(x=>x.permission_name !== data.permission_name);
          if(data.parent === 0) {
            const childPermissions = permissionsData.filter(x=> x.parent === data.id);
            filterd = filterd.filter(function(item) {
              for (var key in childPermissions) {
                if (childPermissions[key].id === item.permission_id) {
                  return false;
                }
              }
              return true;
            });
          }
          setState([...filterd]);
        }
        else{
          const tempExams = [...userTypeHasPermission];
          tempExams.push({ permission_id: data.id, permission_name: data.permission_name }) ;
          setState([...tempExams]);
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const tempExams2 = [];
          
        userTypeHasPermission.map((item) => 
          tempExams2.push({ permission_id:item.permission_id, active:1 })
        );
        console.log(tempExams2);
        const contact = {
          data: tempExams2,
          usertype: routeParams.id && parseInt(routeParams.id)
        };
        const result = await dispatch(updateContact(contact));
        setLoading(false);
        if(result.payload.isUpdateSuccess) {
          setOpen(result.payload.isUpdateSuccess);
        }
        else {
          setOpenError(true);
        }
	  }
    
    return <div id="fr1" style={{height: '100%', width: '100%' }} dangerouslySetInnerHTML={{ __html: "<iframe style='width:100%;height:100%;' src='/apps/dashboards/project/"+ routeParams.id +"' />"}} />;

	// return (
  //   <div className="md:flex max-w-2xl">
  //     <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
  //           <Card className="w-full mb-16 rounded-8">
  //             <Formsy
  //               onValidSubmit={handleSubmit}
  //               ref={formRef}
  //             // className="flex flex-col justify-center"
  //               className="flex flex-col md:overflow-hidden"
  //             >
  //             <div className="p-16 sm:p-24">
  //                 <div className="flex flex-row">
  //                   <FuseAnimate delay={100}>
  //                     <Typography variant="subtitle1" className="flex">
  //                       RoleName: {role_name}
  //                     </Typography>
  //                   </FuseAnimate>
  //                 </div>
  //                 <div className="flex items-center justify-between overflow-hidden">
  //                   <div className="flex flex-col">
  //                     <div className={classes.root}>
  //                       <Typography variant="subtitle1" className="flex">
  //                         Permissions: 
  //                       </Typography>
  //                       <FormControl className={classes.formControl}>
  //                         <NestedList 
  //                           permissionsData={permissionsData}
  //                           manageCheckUncheckExam={manageCheckUncheckExam}
  //                           handleAction={handleAction}
  //                           handleChange={handleChange}
  //                           selected={selected}
  //                           deSelected={deSelected}
  //                         />
  //                         <div className="w-1/2 mb-24" style={{ float: 'right'}}>
  //                           <Button
  //                             variant="contained"
  //                             className="mb-24 ml-8"
  //                             style={{ float: 'right'}}
  //                             color="primary"
  //                             type="submit"
  //                             onClick={handleSubmit}
  //                           >
  //                             Save
  //                             {loading && <CircularProgress style={{ color: 'white' }} className="ml-10" size={18}/>}
  //                           </Button>
  //                         </div>
  //                       </FormControl>
  //                   </div>
  //               </div>
  //           </div>
  //       </div> 
  //       </Formsy>   
  //       </Card>
  //       </div>  
  //       <Snackbar open={openPermissionUpdated} autoHideDuration={6000} onClose={handleClosePermissionUpdated}>
  //         <Alert onClose={handleClosePermissionUpdated} severity="success">
  //           Roles permission updated successfully.
  //         </Alert>
  //       </Snackbar>
  //       <Snackbar open={openPermissionUpdatedError} autoHideDuration={6000} onClose={handleClosePermissionUpdatedError}>
  //         <Alert onClose={handleClosePermissionUpdatedError} severity="error">
  //           Something went wrong while updating Roles permission.
  //         </Alert>
  //       </Snackbar>
  //     </div>  
	// );
}

export default ContactsDetails;

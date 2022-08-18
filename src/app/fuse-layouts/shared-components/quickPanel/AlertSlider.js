import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Paper} from '@material-ui/core'
import { updateViewedAlert } from './store/dataSlice';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextIcon from '@material-ui/icons/ArrowForwardIosRounded';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import PatientAccessDialog from 'app/fuse-layouts/shared-components/PatientAccessDialog';
import PatientAccessPrintDialog from 'app/fuse-layouts/shared-components/PatientAccessPrintDialog';
import {
	openPatientAccessDialog,
	openPatientAccessPrintPage,
	getRequestAlertsData,
  clearPatientAccessResponse,
  sendPatientAccessMail
} from 'app/fuse-layouts/shared-components/quickPanel/store/dataSlice';
import SnackBarAlert from 'app/fuse-layouts/shared-components/SnackBarAlert';

export default function AlertSlider(props)
{
    const dispatch = useDispatch();
    const data = useSelector(({ quickPanel }) => quickPanel.data);
    const [reqAlerts, setRequestAlerts] = React.useState([]);
    const [mouseEnter, setMouseEnter] = React.useState(false);
    const [openPatientAccessMailSent, setOpenPatientAccessMailSent] = React.useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      if(data && data.requestAlerts) {
        const filteredAlerts = data.requestAlerts.filter(a => a.request_viewed === 0 && a.request_completed === 0);
         setRequestAlerts(filteredAlerts);
      }
    }, [data]);

    useEffect(() => {
      if(data && data.patientAccessResponse) {
        const { patientAccessResponse } = data;
        if(patientAccessResponse.maildata && patientAccessResponse.maildata.length > 0) {
          setOpenPatientAccessMailSent(true);
        }
        if(patientAccessResponse.PrintPage && patientAccessResponse.PrintPage.length > 0) {
          dispatch(openPatientAccessPrintPage(patientAccessResponse.PrintPage));
        }
        if(patientAccessResponse.maildata || patientAccessResponse.PrintPage){
         
          /*
          this api is used to get alerts of 
          patients who are requesting additional access 
          time on their patient portal
          */
          // dispatch(getRequestAlertsData());
          dispatch(clearPatientAccessResponse());
        }
      }
    }, [data]);

    async function handleNext(next, active) {
      if(reqAlerts) {
        const tempReqAlerts = [...reqAlerts];
        const currentAlert = tempReqAlerts[0];
        tempReqAlerts.splice(0, 1);
        setRequestAlerts(tempReqAlerts);
        const req = { id: currentAlert.id, pid: currentAlert.tran_patient_detail.patient_id };
        const result = await dispatch(updateViewedAlert(req));
      }
    }
    
    function handleMouseEnter(event) {
      setMouseEnter(true);
    }

    function handleMouseLeave(event) {
      setMouseEnter(false);
    }
    const handleClosePatientAccessMailSent = (event, reason) => {
      setOpenPatientAccessMailSent(false);
    };
  
    async function handlePatientAccess(event) {
      setLoading(true);
      const tempReqAlerts = [...reqAlerts];
      const currentAlert = tempReqAlerts[0];
      // dispatch(openPatientAccessDialog({id: currentAlert.patient_id}));
      await dispatch(sendPatientAccessMail({ id: currentAlert.patient_id, isRequestedAgain: true }));
      setLoading(false);
    }

    return (
        reqAlerts && reqAlerts.length > 0 ?
          <div className="carousel" 
            onMouseLeave={e => {
              setMouseEnter(false)
            }}>

          <ul className="carousel__slides">
            {reqAlerts && reqAlerts.map((slide, index) =>
              <CarouselSlide
                key={index}
                index={index}
                activeIndex={0}
                item={slide.tran_patient_detail}
              />
            )}
          </ul>
          {!mouseEnter && !loading &&
            <CarouselRightArrow 
              onClick={handleNext} 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            />}
          {mouseEnter && !loading &&
          <Button
            style={{ float: 'right'}}
            className="carousel__arrow_next"
            variant="contained"
            color="primary"
            type="button"
            onClick={handleNext}
          >
            Next
          </Button>}
          {mouseEnter && !loading &&
          <Button
            style={{ float: 'right'}}
            className="carousel__arrow_grant"
            variant="contained"
            color="primary"
            type="button"
            onClick={(event) => handlePatientAccess(event)}
          >
            Grant
          </Button>}
          {loading && <CircularProgress className="ml-10 carousel__loader" size={18}/>}
          <ul className="carousel__indicators">
            {reqAlerts && reqAlerts.map((slide, index) =>
              <CarouselIndicator
                key={index}
                index={index}
                activeIndex={0}
                isActive={0==index} 
                // onClick={e => handleNext(index)}
              />
            )}
          </ul>
          <PatientAccessDialog />
          <PatientAccessPrintDialog />
          <SnackBarAlert snackOpen={openPatientAccessMailSent} onClose={handleClosePatientAccessMailSent} text="Patient portal access mail sent successfully." />
        </div> : null
    )
}

function Item(props)
{
    return (
        <Paper className="alertSlideItem">
            <h5>{`${props.item.lname}, ${props.item.fname} requesting access !`}</h5>
        </Paper>
    )
}

function CarouselIndicator (props) {
    return (
      <li>
        <a
          className={
            props.index == props.activeIndex
              ? "carousel__indicator carousel__indicator--active"
              : "carousel__indicator"
          }
          onClick={props.onClick}
        />
      </li>
    );
}

function CarouselRightArrow (props) {
  return (
    <IconButton
        className="carousel__arrow carousel__arrow--right"
        aria-label="close"
        color="inherit"
        size="small"
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter} 
        onMouseLeave={props.onMouseLeave}
        >
        <NavigateNextIcon fontSize="inherit" />
    </IconButton>
  );
}

function CarouselSlide (props) {
    return (
      <li
        className={
          props.index == props.activeIndex
            ? "carousel__slide carousel__slide--active"
            : "carousel__slide"
        }
      >
        <p className="carousel-slide__content">{`${props.item.lname}, ${props.item.fname} requesting access !`}</p>
      </li>
    );
}

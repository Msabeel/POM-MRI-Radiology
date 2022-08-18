import React, { useState, useEffect } from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {setTechHold1}  from '../store/ProfileSlice'
const useStyles = makeStyles(theme => ({
   exam:{
       '& .ag-react-container':{
        fontSize:20
       }
   } 
}))
export const PatientView = ({
    data,
    patientName,
    handleSelectedAcc,
    filterOptions,
	selectedID,
    selectedScheduleDate,
    modalityID,
    placeHolder,
    setTechHoldButton,
    patientData
    
}) => {
    let paramsData;

    const [gridApi, setGridApi] = useState(null);
    const [tempData, setTempData] = useState(data);
    const classes= useStyles();
	const dispatch = useDispatch();
    const date = new moment().format('MM-DD-YYYY');
    //const [row] = useState();
    
    useEffect(() => {
        if (filterOptions.length > 0) {
            let filter = data.filter(x => {
                let exam = x.exam ? x.exam : "";
                let modality = x.modality ? x.modality : "";
                let rad = x.radDetail ? x.radDetail.displayname : "";
                let ref = x.rafDetail ? x.rafDetail.displayname : "";
                let scheduling_date = x.scheduling_date ? x.scheduling_date : "";
                let access_no = x.access_no ? x.access_no : "";
                x.name = patientName;
                let name = x.name;
                if (filterOptions.length === 1) {
                    if (modality.toUpperCase() === filterOptions[0].match.toUpperCase() ||
                        exam.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
                        name.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
                        rad.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
                        ref.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
                        scheduling_date.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
                        access_no.toString().startsWith(filterOptions[0].match)) {
                        return x
                    }
                }
            })
            if (filter) {
                if (gridApi) {
                    gridApi.setRowData(filter)
                }
            }
        } else {
            if (gridApi) {
                gridApi.setRowData(tempData)

            }
        }
    }, [filterOptions])
    

    const onGridReady = (params) => {
    let filteredDate=null;

     if (placeHolder==='techhold')
    {
        filteredDate= data.filter(exam => exam.scheduling_date == selectedScheduleDate && exam.modality==modalityID);
    }
      //  var data1 = data.filter(exam => exam.scheduling_date == date) why add this condition does not make sense.
        var data2 = filteredDate.map((item) =>
            Object.assign({}, item, { name: patientName })
        )
        setGridApi(params.api);

        paramsData = params.api;
        params.api.showLoadingOverlay();
        const getAllData = () => {
            params.api.setRowData(data2);
        };
        getAllData();
        params.api.sizeColumnsToFit();
        dispatch(setTechHold1({access_no:selectedID}))
/*
        var selectedRows = params.api.getSelectedNodes()
        var data1={}
        var data= selectedRows.map(item=>{
            data1.access_no=item.data.access_no
            
        })
        var data= selectedRows.map(item=>{
            data1.access_no=item.data.access_no
            
        })
        */
    }

    const modalityRender = (event) => {
        return (
            <p style={{
                fontSize: 13,
                backgroundColor: "#" + event.data.modality_color,
                paddingLeft: 10,
                paddingRight: 10,
                width: '100%',
                borderRadius: 5,
                height: 35,
                textAlign: 'center',
                boxShadow: '1px 3px 1px gray',
                fontWeight: 'bold'
            }}>
                {event.value ? event.value : '-'}
            </p>
        )
    }

    const acc_no_render = (event) => {
        alert()

        /*
        return (
            <p
                onClick={() => {
                    setTechHoldButton(event.value)
                }}
            >{event.value ? event.value : '-'}</p>
        );
        */

    }
    const onSelectionChanged =  (params) =>{
        var selectedRows = params.api.getSelectedNodes()
        var data1={}
        var data= selectedRows.map(item=>{
            data1.access_no=item.data.access_no
            
        })
   dispatch(setTechHold1(data1))
        //  selectedRowData(data,result)
     }
 
    const exam_render = (event) => {
        return (
            <Tooltip  title={<h6 style={{ padding: 5 }}>{event.value}</h6>} placement="top">
                <p style={{ fontSize: 13, }}>
                    {event.value}
                </p>
            </Tooltip>
        );
    }
    
    const customLoading = () => {
        return <CircularProgress color="primary" />
    }
    
    const status_render = (event) => {
        return (
            <p style={{
                fontSize: 13,
                backgroundColor: getStatusColor(event.value),
                paddingLeft: 10,
                paddingRight: 10,
                width: '100%',
                borderRadius: 5,
                height: 35,
                textAlign: 'center',
                boxShadow: '1px 3px 1px gray',

            }}>
                {event.value ? event.value.toUpperCase() : '-'}
            </p>

        );
    }
    
    const getStatusColor = (status) => {
        if (status == 'pickup') {
            return '#F1C6F1';
        } else if (status == 'drop') {
            return '#D4D4FF';
        } else if (status == 'incoming order') {
            return '#F1C6F1';
        } else if (status == 'cancle exam' || status == 'cancel exam' || status == 'Exam Cancelled') {
            // return '#ddd5zz';
            return '#ddd500';
        } else if (status == 'quick order') {
            return '#D4D4FF';
        } else if (status == 'approved') {
            return '#da9695';
        }
        else if (status == 'scheduled') {
            return '#b2a2c7';
        } else if (status == 'pre scheduled') {
            return '#ddb883';
        } else if (status == 'examstart') {
            return '#bfbfbf';
        } else if (status == 'checkin') {
            return '#FF0000';
        } else if (status == 'study from technician') {
            return '#F3F3C9';
        }
        else if (status == 'rad non dicom accunts') {
            return '#CBF6CB';
        } else if (status == 'rad reports on hold') {
            return '#D2D2FD';
        } else if (status == 'rad reports pending signature') {
            return '#FCFCFC';
        } else if (status == 'rad final report') {
            return '#EE99C4';
        } else if (status == 'trans new messages') {
            return '#F1C6F1';
        } else if (status == 'no show') {
            return '#ffb746';
        } else if (status == 'trans reports on hold') {
            return '#D0FAFA';
        }
    }

    return (
        <div>
            <div className="ag-theme-alpine" style={{ height: 200,marginBottom:30,paddingRight:0  }}>
                <AgGridReact
                className={classes.exam}
                    onGridReady={onGridReady}
                    immutableData={false}
                    resize={true}
                    frameworkComponents={{
                        modalityRender: modalityRender,
                        exam_render: exam_render,
                        customLoadingOverlay: customLoading,
                        acc_no_render: acc_no_render,
                        status_render:status_render
                    }}
                    loadingOverlayComponent={'customLoadingOverlay'}
                    rowData={null}
                    pagination={false}
                    paginationPageSize="3"
                    rowHeight={45}
                    rowSelection={'single'}
                    onSelectionChanged= {onSelectionChanged}
                    >
                    <AgGridColumn 
                        cellRenderer={params => {
                            
                            return `<input type='checkbox' ${params.data.access_no>0 ? 'checked' : ''} /> ${params.data.access_no}`;
                                            }} 
                    headerCheckboxSelection={false} fontSize={20} 
                   // cellRenderer={"acc_no_render"}
                    field="access_no" headerName={"Accession Number"} width={180}  sortable={true}></AgGridColumn>
                    <AgGridColumn field="modality" width={50} sortable={true} cellRenderer={"modalityRender"}></AgGridColumn>
                    <AgGridColumn field="exam" width={135} sortable={true} cellRenderer={"exam_render"}></AgGridColumn>
                    <AgGridColumn  field="scheduling_date" headerName={"Scheduling Date"} width={100}  sortable={true}></AgGridColumn>        
                    <AgGridColumn field="status" widgth={100} sortable={true} cellRenderer="status_render"></AgGridColumn>
                    <AgGridColumn field="time_to" width={135} sortable={true} headerName="Time"></AgGridColumn>
                </AgGridReact>
            </div>
        </div >

    )
}
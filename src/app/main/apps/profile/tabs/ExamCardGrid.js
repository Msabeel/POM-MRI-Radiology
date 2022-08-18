import React, {useState, useEffect} from 'react'
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import ActionsSwitcher from 'app/fuse-layouts/shared-components/ActionsSwitcher';
import CircularProgress from '@material-ui/core/CircularProgress';
import useCustomNotify from 'app/fuse-layouts/shared-components/useCustomNotify'
import Button from '@material-ui/core/Button';
import {useSelector, useDispatch} from 'react-redux';
import {openTabLoading, setTabs, setActiveTab} from '../store/ProfileSlice';
import RadiologistRenderer from './RenderDropDowns/radioloadigtRender'
import RafererRenderer from './RenderDropDowns/refererDropDown';
import ScheduleDate from './RenderDropDowns/scheduleDate';
import TimePicker from './RenderDropDowns/timeRender';
export const ExamCardGrid = ({
    data,
    patientData,
    examId,
    handleSelectedAcc,
    filterOptions,
    s3Cred,
    setSelectedGridRows
}) => {
    let paramsData;
    const CustomNotify = useCustomNotify();
    const dispatch = useDispatch();
    const [gridApi, setGridApi] = useState(null);
    const [radiologistDrop, setRadiologistDrop] = useState([]);
    const [refDrop, setRefDrop] = useState([]);
    const [tempData, setTempData] = useState(data);
    const [tabLoading, setTabLoading] = useState(false)
    const TabLoading = useSelector(({profilePageApp}) => profilePageApp.profile)
    const Radiologist = useSelector(({profilePageApp}) => profilePageApp.profile.radiologist);
    const Refferers = useSelector(({profilePageApp}) => profilePageApp.profile.refferers);

    useEffect(() => {
        if (Radiologist) {
            let temp = []
            Radiologist.map((item, index) => {
                temp.push(item.displayname)
            })
            setRadiologistDrop(temp)
        }
    }, [Radiologist])

    useEffect(() => {
        if (Refferers) {
            let temp = []
            Refferers.map((item, index) => {
                temp.push(item.name)
            })
            setRefDrop(temp)
        }
    }, [Refferers])

    useEffect(() => {
        if (!TabLoading.tabLoading) {
            setTabLoading(false)
        }
    }, [TabLoading.tabLoading])
    useEffect(() => {
        if (filterOptions.length > 0) {
            let filter = data.filter(x => {
                let exam = x.exam ? x.exam : "";
                let modality = x.modality ? x.modality : "";
                let rad = x.radDetail ? x.radDetail.displayname : "";
                let ref = x.rafDetail ? x.rafDetail.displayname : "";
                let scheduling_date = x.scheduling_date ? x.scheduling_date : "";
                let access_no = x.access_no ? x.access_no : "";
                if (filterOptions.length === 1) {
                    if (modality.toUpperCase() === filterOptions[0].match.toUpperCase() ||
                        exam.toUpperCase().startsWith(filterOptions[0].match.toUpperCase()) ||
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
        setGridApi(params.api);
        paramsData = params.api;
        params.api.showLoadingOverlay();
        const getAllData = () => {
            let temp = [];
            if (data.length) {
                data.map((item, index) => {
                    let obj = {
                        access_no: item.access_no,
                        bg_color: item.bg_color,
                        data: item.data,
                        exam: item.exam,
                        exam_id: item.exam_id,
                        id: item.id,
                        location: item.location,
                        modality: item.modality,
                        modality_color: item.modality_color,
                        patient_id: item.patient_id,
                        radDetail: item.radDetail,
                        rafDetail: item.rafDetail,
                        scheduling_date: item.scheduling_date,
                        status: item.status,
                        time_from: item.time_from,
                        rad: item.radDetail ? item.radDetail.displayname : "",
                        ref: item.rafDetail ? item.rafDetail.displayname : "",
                        paperwork_sent:item.paperwork_sent
                    }
                    temp.push(obj)
                })
            }
            params.api.setRowData(temp);
        };
        getAllData();
        params.api.sizeColumnsToFit();
    }
    const acc_no_render = (event) => {
        return (
            <>
                {
                    tabLoading ?
                        <CircularProgress size={18} /> :
                        <p
                            onClick={() => {
                             
                                dispatch(setTabs(event.value))
                                dispatch(setActiveTab(event.value))
                           
                            }}
                            style={{
                                cursor: 'pointer',
                                color: '#225de6'
                            }}
                        >{event.value ? event.value : '-'}</p>
                }
            </>
        );

    }
    const ref_render = (event) => {
        return (
            <Tooltip title={<h6 style={{padding: 5}}>{event.value && event.value} </h6>} placement="top">
                <p style={{fontSize: 13, }}>
                    {event.value ? event.value : "-"}
                </p>
            </Tooltip>
        );
    }
    const rad_render = (event) => {
        return (

            <select value={event.value} onChange={() => {}}
                style={{
                    height: 40,
                    width: 120,
                    marginLeft: -17,
                    marginRight: -17,
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    padddingLeft: 10,
                    paddingRight: 10
                }}
            >
                {
                    Radiologist.map((item, index) => {
                        return (
                            <option value={item.displayname}> {item.displayname} </option>
                        )
                    })
                }

                {/* <option value="black"> black </option>
                <option value="green"> green </option>
                <option value="yellow"> yellow </option>
                <option value="violet"> violet </option> */}
            </select>

            // <Tooltip title={<h6 style={{padding: 5}}>{event.value}</h6>} placement="top">
            //     <p style={{fontSize: 13, }}>
            //         {event.value ? event.value : "-"}
            //     </p>
            // </Tooltip>

        )
    }
    const handlePayload = (payload) => {
        if (payload.isFinalReport === true) {
            CustomNotify(payload.data.message[0], "success");
            setTimeout(() => {
                if (payload.data.message[1]) {
                    CustomNotify(payload.data.message[1], "info");
                } else {
                    if (payload.data.error) {
                        CustomNotify(payload.data.error, "error");
                    }
                }
            }, 1500)
        } else {
            CustomNotify("Something weng wrong.", "error");
        }
    }
    const actionRender = (event) => {
        return (

            <ActionsSwitcher
                patient={event.data}
                s3Cred={s3Cred}
                changedStatus={event.data.status}
                patientData={patientData}
                examId={examId}
                currentStatus={event.data.status}
                selectedID={event.data.id}
                selectedScheduleDate={event.data.scheduling_date}
                modalityID={event.data.modality}
                isGrid={true}
                handlePayload={handlePayload}
                onFinalReportSubmit={(msg, payload, status, access_no) => {
                    paramsData.showLoadingOverlay();

                    data.map((item, index) => {
                        if (item.access_no === access_no) {
                            item.status = msg
                        }
                        return 0
                    })

                    paramsData.setRowData(data);

                    paramsData.hideOverlay();
                }}
            />

        )
    }
    const exam_render = (event) => {
        return (
            <Tooltip title={<h6 style={{padding: 5}}>{event.value}</h6>} placement="top">
                <p style={{fontSize: 13, }}>
                    {event.value}
                </p>
            </Tooltip>
        );
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
    
    const paperworksent_render = (event) => {
    
        return (
            <p>
                {event.value ===1 ? 'Yes' : 'No'}
            </p>

        );
    }

    const customLoading = () => {
        return <CircularProgress color="primary" />
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

    const onRowValueChanged = (params) => {
        // setTimeout(() => {
        // 	var data = params.data
        // 	const location = tempLocationObj.find(x => x.value === data.locationName);
        // 	const color = colors.find(x => x.name === data.bg_color)
        // 	let obj = {
        // 		ae_title: data.ae_title,
        // 		bg_color: color ? color.value : data.bg_color,
        // 		id: data.id,
        // 		isCopy: data.isCopy,
        // 		isDeleted: data.isDeleted,
        // 		locationid: location ? location.id : data.locationid,
        // 		modality: data.modality,
        // 		modality_group_no: data.modality_group_no,
        // 		modalityidforExam: data.modalityidforExam,
        // 		mwl_display_name: data.mwl_display_name,
        // 		mwl_show: data.mwl_display_name ? "on" : "off",
        // 		noGraphModality: data.noGraphModality,
        // 		noinsurance: data.noinsurance,
        // 		order: data.order,
        // 		order_dashboard: data.order_dashboard,
        // 		order_grid: 0,
        // 		order_mod: 0,
        // 		quantity: data.quantity,
        // 		status: data.status,
        // 		token: null,
        // 		type: 0,
        // 	}
        // 	dispatch(editData(obj))
        // }, 1000)
        // dispatch(openConfirmDialog({
        // 	type: 1,
        // 	msg: "Are you sure want to update Modality ?",
        // 	title: 'Update Modality Confirmation',
        // 	btnTitle: 'Update'
        // }))
    };
    const onRadChange = (rad) => {
        console.log("rad", rad)
    }
    const onRefChange = (ref) => {
        console.log("ref", ref)
    }
    function onSelectionChanged(event) {
        var data = event.api.getSelectedNodes();
        const examIds = data.map(e => {
            return e.data.access_no;
        })
        setSelectedGridRows(examIds);
    }

    return (
        <div>
            <div className="ag-theme-alpine" style={{height: '66vh', }}>

                {/* <AgGridReact
                    onGridReady={onGridReady}
                    rowData={data}
                > */}
                <AgGridReact
                    onGridReady={onGridReady}
                    immutableData={false}
                    resize={true}
                    onRowValueChanged={onRowValueChanged}
                    onRowEditingStarted={(params) => {
                        params.api.refreshCells({
                            columns: ["action"],
                            rowNodes: [params.node],
                            force: true
                        });
                    }}
                    onCellEditingStopped={(params) => {
                        params.api.refreshCells({
                            columns: ["action"],
                            rowNodes: [params.node],
                            force: true
                        });
                    }}
                    frameworkComponents={{
                        actionRender: actionRender,
                        timeRender: TimePicker,
                        modalityRender: modalityRender,
                        ref_render: RafererRenderer,
                        exam_render: exam_render,
                        rad_render: RadiologistRenderer,
                        status_render: status_render,
                        customLoadingOverlay: customLoading,
                        acc_no_render: acc_no_render,
                        ScheduleDate: ScheduleDate,
                        paperworksent_render:paperworksent_render
                    }}
                    loadingOverlayComponent={'customLoadingOverlay'}

                    rowData={null}
                    pagination={true}
                    paginationPageSize="25"
                    rowHeight={45}
                    rowSelection="multiple" onSelectionChanged={(event) => onSelectionChanged(event)}>

                    <AgGridColumn field="access_no" checkboxSelection={true} headerCheckboxSelection={true} headerName="Acc#" width={150} sortable={true} cellRenderer={"acc_no_render"}></AgGridColumn>
                    <AgGridColumn field="modality" cellRenderer={"modalityRender"} width={120} sortable={true}></AgGridColumn>
                    <AgGridColumn field="exam" sortable={true} cellRenderer={"exam_render"}></AgGridColumn>
                    <AgGridColumn
                        field="scheduling_date"
                        // cellRenderer={"ScheduleDate"}
                        sortable={true}
                        headerName="Sch. Date"></AgGridColumn>
                    <AgGridColumn field="time_from"
                        // cellRenderer={"timeRender"}
                        sortable={true} headerName="Time"></AgGridColumn>
                    <AgGridColumn
                        // cellEditor='agSelectCellEditor'
                        filter='agTextColumnFilter'
                        field="rad"
                        cellRendererParams={{onChangeRad: onRadChange}}
                        sortable={true}
                        headerName="RAD"
                        cellRenderer={"rad_render"}></AgGridColumn>
                    <AgGridColumn
                        field="ref"
                        filter='agTextColumnFilter'
                        cellRendererParams={{onRefChange: onRefChange}}
                        editable={false} sortable={true} headerName="Ref" cellRenderer={"ref_render"}></AgGridColumn>
                    <AgGridColumn field="status" width={300} sortable={true} cellRenderer="status_render"></AgGridColumn>
                    <AgGridColumn field="paperwork_sent" width={250} sortable={true} cellRenderer="paperworksent_render"></AgGridColumn>
                    <AgGridColumn field="access_no" headerName="Actions" cellRenderer={"actionRender"}></AgGridColumn>

                </AgGridReact>
            </div>
        </div >

    )
}
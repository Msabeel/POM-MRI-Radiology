
import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useForm} from '@fuse/hooks'
import {useDispatch, useSelector} from 'react-redux';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import {openConfirmDialog, editData} from './store/examSlice';
import Button from '@material-ui/core/Button';
import ConfirmDialog from './ConfirmDialog';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Permissions} from 'app/config';
import CreateFormDialog from './CreateFormDialog';
import ActionComponent from '../../../fuse-layouts/shared-components/ActionComponent';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    filterContiainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    formControl: {
        margin: 5,
        width: '100%'
    },
}));
const EnhancedTable = ({data}) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_modality);
    var modalityForDrop = useSelector(({examApp}) => examApp.exam.modalityForDrop)
    var locations = useSelector(({examApp}) => examApp.exam.locations)
    const [open, setOpen] = React.useState(false);
    const [modality, setModality] = React.useState(null);
    var exams = useSelector(state => state.examApp.exam.entities)
    const [Fmodality, setFModality] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [gridApi, setGridApi] = useState(null)
    const [gridColumnApi, setGridColumnApi] = useState(null)

    var tempdata = data;
    const actionHeader = () => {
        return (
            <div style={{
                display: 'flex',
                flex: 1,
                width: 170,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <label>Edit</label>
                <label>Status</label>
                <label>Delete</label>
            </div>
        )
    }

    function actionCellRenderer(params) {
        let eGui = document.createElement("div");

        let editingCells = params.api.getEditingCells();
        // checks if the rowIndex matches in at least one of the editing cells
        let isCurrentRowEditing = editingCells.some((cell) => {
            return cell.rowIndex === params.node.rowIndex;
        });

        return (
            <ActionComponent
                isCurrentRowEditing={isCurrentRowEditing}
                isChecked={params.data.block === 1}
                isDeleted={params.data.isDeleted}
                params={params}
                handleDelete={() => {
                    dispatch(openConfirmDialog({
                        type: 3, id: params.data.id,
                        msg: "Are you sure want to delete this Exam ?",
                        title: 'Delete Exam Confirmation',
                        btnTitle: 'Delete'
                    }))
                }}
                handleStatus={() => {

                    dispatch(openConfirmDialog({
                        type: 2, id: params.data.id,
                        msg: "Are you sure want to change Status this Exam ?",
                        title: 'Change Status Exam Confirmation',
                        btnTitle: 'Update'
                    }))
                }}
                openConfirmDialog={openConfirmDialog}
                editData={editData}
                colors={colors}
                handleEdit={() => {
                    params.api.startEditingCell({
                        rowIndex: params.node.rowIndex,
                        // gets the first columnKey
                        colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
                    });
                }}
                handleSubmit={() => {
                    setTimeout(() => {
                        var data = params.data
                        let filter = tempModlityObjects.find(x => x.name === data.modality)
                        const location = tempLocationObj.find(x => x.value === data.location);
                     
                        let obj = {
                            cpt: data.cpt,
                            cpt1: data.cpt1,
                            cpt2: data.cpt2,
                            exam: data.exam,
                            exampreptext: data.exampreptext,
                            id: data.id,
                            isdeleted: data.isdeleted,
                            laterality: data.laterality,
                            locationId: location ? location.id : data.locationId,
                            modalityId: filter ? filter.id : data.modalityId,
                            p_instruction: data.p_instruction,
                            price: data.price,
                            selfprice: data.selfprice,
                            timeslot: data.timeslot
                        }
                        dispatch(editData(obj))
                    }, 1000)
                    dispatch(openConfirmDialog({
                        type: 1,
                        msg: "Are you sure want to update Exam ?",
                        title: 'Update Exam Confirmation',
                        btnTitle: 'Update'
                    }))
                    params.api.stopEditing(false);
                }}
            />
        )
    }

    const onGridReady = (params) => {
        setGridApi(params.api)
        setGridColumnApi(params.columnApi)
        params.api.sizeColumnsToFit();

    }
    var tempdata = [];
    var tempColor = [];
    var tempModality = [];
    var tempModlityObjects = [];
    var tempLocation = [];
    var tempLocationObj = [];
    var colors = [
        {value: "#1dab43", name: 'Green'},
        {value: "#cc1427", name: 'Red'},
        {value: "#7f0c94", name: 'Purple'},
        {value: "#2210c7", name: 'Blue'},
        {value: "#eb0eca", name: 'Pink'},
        {value: "#b7c223", name: 'Yellow'},
    ]
    colors.map((u, i) => {
        tempColor.push(u.name)
    })
    Object.keys(exams).map((u, i) => {
        let obj = {
            cpt: exams[u].cpt,
            cpt1: exams[u].cpt1,
            cpt2: exams[u].cpt2,
            exam: exams[u].exam,
            exampreptext: exams[u].exampreptext,
            id: exams[u].id,
            isdeleted: exams[u].isdeleted,
            laterality: exams[u].laterality,
            location: exams[u].location,
            locationId: exams[u].locationId,
            modality: exams[u].modality,
            modalityId: exams[u].modalityId,
            p_instruction: exams[u].p_instruction,
            price: exams[u].price,
            selfprice: exams[u].selfprice,
            timeslot: exams[u].timeslot
        }
        tempdata.push(obj)
    })
    Object.keys(locations).map((u, i) => {
        tempLocation.push(locations[u])
        tempLocationObj.push({id: u, value: locations[u]})
    })
    Object.keys(modalityForDrop).map((u, i) => {
        tempModality.push(modalityForDrop[u])
        tempModlityObjects.push({
            id: u,
            name: modalityForDrop[u]
        })
    })

    const cellRender = (event) => {
        return `<p>${event.value}</p>`;
    }


    const doesExternalFilterPass = (node) => {
    
        if (Fmodality) {
            return node.data.modalityId < parseInt(Fmodality);
        } else {
            return node.data.locationId < parseInt(location);
        }
    }

    const handleModality = (event) => {
        setFModality(event.target.value);
        gridApi.onFilterChanged()
    };
    const handleLocation = (event) => {
        setLocation(event.target.value);
        gridApi.onFilterChanged()
    };
    
    var gridOptions = {
        onCellClicked(params) {
            if (params.column.colId === "action" && params.event.target.dataset.action) {
                let action = params.event.target.dataset.action;
                if (action === "create") {

                    params.api.startEditingCell({
                        rowIndex: params.node.rowIndex,
                        // gets the first columnKey
                        colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
                    });
                }

                if (action === "status") {
                    dispatch(openConfirmDialog({
                        type: 2, id: params.data.id,
                        msg: "Are you sure want to change Status this Exam ?",
                        title: 'Change Status Exam Confirmation',
                        btnTitle: 'Update'
                    }))

                }
                if (action === "delete") {
                    dispatch(openConfirmDialog({
                        type: 3, id: params.data.id,
                        msg: "Are you sure want to delete this Exam ?",
                        title: 'Delete Exam Confirmation',
                        btnTitle: 'Delete'
                    }))
                    // params.api.applyTransaction({
                    //  remove: [params.node.data]
                    // });
                }

                if (action === "update") {

                    setTimeout(() => {
                        var data = params.data
                        let filter = tempModlityObjects.find(x => x.name === data.modality)
                        let obj = {
                            cpt: data.cpt,
                            cpt1: data.cpt1,
                            cpt2: data.cpt2,
                            exam: data.exam,
                            exampreptext: data.exampreptext,
                            id: data.id,
                            isdeleted: data.isdeleted,
                            laterality: data.laterality,
                            locationId: data.locationId,
                            modalityId: filter ? filter.id : data.modalityId,
                            p_instruction: data.p_instruction,
                            price: data.price,
                            selfprice: data.selfprice,
                            timeslot: data.timeslot
                        }
                        dispatch(editData(obj))
                    }, 1000)
                    dispatch(openConfirmDialog({
                        type: 1,
                        msg: "Are you sure want to update Exam ?",
                        title: 'Update Exam Confirmation',
                        btnTitle: 'Update'
                    }))
                    params.api.stopEditing(false);
                }

                if (action === "cancel") {
                    params.api.stopEditing(true);
                }
            }
        },
        onRowEditingStarted: (params) => {
            params.api.refreshCells({
                columns: ["action"],
                rowNodes: [params.node],
                force: true
            });
        },
        onRowEditingStopped: (params) => {
            params.api.refreshCells({
                columns: ["action"],
                rowNodes: [params.node],
                force: true
            });
        },
        onGridReady: onGridReady,
        editType: "fullRow",
        animateRows: true,
        defaultColDef: {
            editable: true
        },
        frameworkComponents: {
            actionCellRenderer: actionCellRenderer,
            actionHeader: actionHeader
        },
        isExternalFilterPresent: true,
        doesExternalFilterPass: doesExternalFilterPass,
        columnDefs: [
            {
                field: "location",
                cellEditor: 'agSelectCellEditor',
                filter: 'agTextColumnFilter',
                sortable: true,
                width: 150,
                cellEditorParams: {
                    values: tempLocation,
                    cellRenderer: (params) => params.value
                },
            },
            {
                field: "modality",
                cellEditor: 'agSelectCellEditor',
                filter: 'agTextColumnFilter',
                sortable: true,
                width: 130,
                cellEditorParams: {
                    values: tempModality,
                    cellRenderer: (params) => params.value
                },
                // cellStyle: cellStyle
            },
            {
                field: "exam",
                width: 150,
                sortable: true,
                filter: 'agTextColumnFilter',
            },
            {
                field: "cpt",
                sortable: true,
                filter: 'agNumberColumnFilter',
                width: 100,
            },
            {
                field: "cpt1",
                sortable: true,
                width: 100,
            },
            {
                field: "cpt2",
                sortable: true,
                width: 100,
            },
            {
                field: "price",
                headerName: 'Price',
                sortable: true,
                width: 150,
                filter: 'agNumberColumnFilter',
            },
            {
                field: "timeslot",
                headerName: 'Time Slot',
                sortable: true,
                filter: 'agNumberColumnFilter',
                width: 100,
            },


            {
                field: "exampreptext",
                headerName: 'Exam Pre. Instruction',
                width: 150,
                sortable: true,
                filter: 'agTextColumnFilter',
            },
            {
                field: "p_instruction",
                headerName: 'Exam Pre. Text',
                width: 150,
                sortable: true,
                filter: 'agTextColumnFilter',
                cellRenderer: cellRender
            },


            {
                headerName: "Action",
                minWidth: 150,
                headerComponent: "actionHeader",
                cellRenderer: "actionCellRenderer",
                editable: false,
                colId: "action"
            }
        ],
        rowData: tempdata,


    };

    return (
        <div className="flex flex-col min-h-full sm:border-1 overflow-hidden">
            <PermissionSwitch permission={Permissions.update_attorney} label="Update Attorney" />
            <PermissionSwitch permission={Permissions.delete_attorney} label="Delete Attorney" />

            <div className="p-24" style={{width: 200}}>
                <Button
                    variant="contained"
                    color="primary"
                    className="w-full"
                    onClick={ev => setOpen(true)}
                >
                    Create New
                </Button>
            </div>
            <div className={classes.filterContiainer}>
                <div className="p-10" style={{width: 300}}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Location</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={location}
                            onChange={handleLocation}
                            label="location"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                locations &&
                                Object.keys(locations).map((u, i) => {
                                    return (
                                        <MenuItem value={u}>
                                            <em>{locations[u]}</em>
                                        </MenuItem>

                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                <div className="p-10" style={{width: 300}}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Modality</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={Fmodality}

                            onChange={handleModality}
                            label="modality"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                Object.keys(modalityForDrop).map((u, i) => {
                                    return (
                                        <MenuItem value={u}>
                                            <em>{modalityForDrop[u]}</em>
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="ag-theme-alpine ag-grid-custom" style={{height: '120%', width: '100%', lineHeight: '30px'}}>
                <AgGridReact gridOptions={gridOptions} pagination={true} paginationPageSize="15" height={400} />
                <ConfirmDialog />
                <CreateFormDialog
                    isOpen={open}
                    handleCloseDialog={() => {setOpen(false)}}
                    onSaved={() => {
                        setOpen(false)
                    }}
                    data={modality}
                    modality={data} />
            </div>

        </div>
    );
};

EnhancedTable.propTypes = {
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
    onStarClick: PropTypes.func
};

export default EnhancedTable;



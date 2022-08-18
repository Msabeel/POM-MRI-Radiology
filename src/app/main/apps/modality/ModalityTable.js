import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useForm} from '@fuse/hooks'
import {useDispatch, useSelector} from 'react-redux';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import {openConfirmDialog, editData} from './store/modalitySlice';
import Button from '@material-ui/core/Button';
import ConfirmDialog from './ConfirmDialog';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Permissions} from 'app/config';
import CreateFormDialog from './CreateFormDialog';
import {AllCommunityModules} from '@ag-grid-community/all-modules';
import ActionComponent from '../../../fuse-layouts/shared-components/ActionComponent'
const EnhancedTable = ({data}) => {
	const dispatch = useDispatch();
	const isDeletePermission = FuseUtils.hasButtonPermission(Permissions.delete_attorney);
	const [open, setOpen] = React.useState(false);
	const [modality, setModality] = React.useState(null);
	var modalities = useSelector(({modalityApp}) => modalityApp.modality.entities)
	var locations = useSelector(({modalityApp}) => modalityApp.modality.locations)
	var tempdata = data;
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
				isChecked={params.data.status === "on"}
				isDeleted={params.data.isDeleted}
				params={params}
				handleDelete={() => {
					dispatch(openConfirmDialog({
						type: 3,
						id: params.data.id,
						isDelete: params.data.isDeleted === true ? false : true,
						msg: "Are you sure want to delete this Modality ?",
						title: 'Delete Modality Confirmation',
						btnTitle: 'Delete'
					}))
					
				}}
				handleStatus={()=>{

					dispatch(openConfirmDialog({
						type: 2,
						id: params.data.id,
						status: params.data.status === true ? "off" : "on",
						msg: "Are you sure want to change Status this Modality ?",
						title: 'Change Status Modality Confirmation',
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
						const location = tempLocationObj.find(x => x.value === data.locationName);
						const color = colors.find(x => x.name === data.bg_color)
						let obj = {
							ae_title: data.ae_title,
							bg_color: color ? color.value : data.bg_color,
							id: data.id,
							isCopy: data.isCopy,
							isDeleted: data.isDeleted,
							locationid: location ? location.id : data.locationid,
							modality: data.modality,
							modality_group_no: data.modality_group_no,
							modalityidforExam: data.modalityidforExam,
							mwl_display_name: data.mwl_display_name,
							mwl_show: data.mwl_display_name ? "on" : "off",
							noGraphModality: data.noGraphModality,
							noinsurance: data.noinsurance,
							order: data.order,
							order_dashboard: data.order_dashboard,
							order_grid: 0,
							order_mod: 0,
							quantity: data.quantity,
							status: data.status,
							token: null,
							type: 0,
						}
						dispatch(editData(obj))
					}, 1000)
					dispatch(openConfirmDialog({
						type: 1,
						msg: "Are you sure want to update Modality ?",
						title: 'Update Modality Confirmation',
						btnTitle: 'Update'
					}))
					params.api.stopEditing(false);
				}}
			/>
		)


	}

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


	var tempdata = []
	var tempLocation = [];
	var tempLocationObj = [];
	var tempColor = []
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
	Object.keys(modalities).map((u, i) => {
		let obj = {
			ae_title: modalities[u].ae_title,
			bg_color: modalities[u].bg_color,
			id: modalities[u].id,
			isCopy: modalities[u].isCopy,
			isDeleted: modalities[u].isDeleted,
			locationName: modalities[u].locationName,
			locationid: modalities[u].locationid,
			modality: modalities[u].modality,
			modality_group_no: modalities[u].modality_group_no,
			modalityidforExam: modalities[u].modalityidforExam,
			mwl_display_name: modalities[u].mwl_display_name,
			mwl_show: modalities[u].mwl_show,
			noGraphModality: modalities[u].noGraphModality,
			noinsurance: modalities[u].noinsurance,
			order: modalities[u].order,
			order_dashboard: modalities[u].order_dashboard,
			order_grid: 0,
			order_mod: 0,
			quantity: modalities[u].quantity,
			status: modalities[u].status,
			token: null,
			type: 0,
		}
		tempdata.push(obj)
	})

	Object.keys(locations).map((u, i) => {
		tempLocation.push(locations[u])
		tempLocationObj.push({id: u, value: locations[u]})
	})
	const ModalityDisplay = [
		"CR",
		"CT",
		"MR",
		"US",
		"OT",
		"BI",
		"CD",
		"DD",
		"DG",
		"ES",
		"LS",
		"PT",
		"RG",
		"ST",
		"TG",
		"XA",
		"RF",
		"RTIMAGE",
		"RTDOSE",
		"RTSTRUCT",
		"RTPLAN",
		"RTRECORD",
		"HC",
		"DX",
		"NM",
		"MG",
		"IO",
		"PX",
		"GM",
		"SM",
		"XC",
		"PR",
		"AU",
		"EPS",
		"HD",
		"SR",
		"IVUS",
		"OP",
		"SMR"
	]
	const fieldRender = (event) => {
		let color = ""
		if (event.colDef.field === "bg_color") {
			if (event.value) {
				const findColor = colors.find(x => x.name == event.value)
				if (findColor) {
					color = findColor.value
				} else {
					let first = event.value.charAt(0)
					if (first === "#") {
						color = event.value
					} else {
						color = "#" + event.value
					}
				}
			}
			return `<div style="background-color:${color};width:100%;height:100%;"></div>`;
		} else {
			if (event.data.isDeleted) {
				return `
				<div
				style="
						content: '';
						width: 120%;
						height: 1px;
						background: #bfbdbd;
						display: block;
						position: relative;
						top: 20px;
						padding-left:17px;padding-right:17px;"
				></div>
				<div style="width:100%;height:100%;padding-left:17px;padding-right:17px;color:#bfbdbd">${event.value}</div>
				`;
			} else if (event.data.status === "off") {
				return `<div style="color:#dddddd;width:100%;height:100%;padding-left:17px;padding-right:17px;">${event.value}</div>`;
			} else {
				return `<div style="width:100%;height:100%;padding-left:17px;padding-right:17px;">${event.value}</div>`;
			}
		}
	};
	const cellStyle = (params) => {
		if (params.data.status == "off") {
			//Here you can check the value and based on that you can change the color
			//mark police cells as red
			return {
				color: '#dddddd',
				'padding-left': '0px',
				'padding-right': '0px'
			};
		} else if (params.data.isDeleted === true) {
			return {
				'padding-left': '0px',
				'padding-right': '0px'
			}
		} else {
			return {
				'padding-left': '0px',
				'padding-right': '0px'
			}
		}
	}
	const onRowValueChanged = (params) => {

		setTimeout(() => {
			var data = params.data
			const location = tempLocationObj.find(x => x.value === data.locationName);
			const color = colors.find(x => x.name === data.bg_color)
			let obj = {
				ae_title: data.ae_title,
				bg_color: color ? color.value : data.bg_color,
				id: data.id,
				isCopy: data.isCopy,
				isDeleted: data.isDeleted,
				locationid: location ? location.id : data.locationid,
				modality: data.modality,
				modality_group_no: data.modality_group_no,
				modalityidforExam: data.modalityidforExam,
				mwl_display_name: data.mwl_display_name,
				mwl_show: data.mwl_display_name ? "on" : "off",
				noGraphModality: data.noGraphModality,
				noinsurance: data.noinsurance,
				order: data.order,
				order_dashboard: data.order_dashboard,
				order_grid: 0,
				order_mod: 0,
				quantity: data.quantity,
				status: data.status,
				token: null,
				type: 0,
			}
			dispatch(editData(obj))
		}, 1000)
		dispatch(openConfirmDialog({
			type: 1,
			msg: "Are you sure want to update Modality ?",
			title: 'Update Modality Confirmation',
			btnTitle: 'Update'
		}))
	};
	const onGridReady = (params) => {
		params.api.sizeColumnsToFit();
	}

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
						type: 2,
						id: params.data.id,
						status: params.data.status === "on" ? "off" : "on",
						msg: "Are you sure want to change Status this Modality ?",
						title: 'Change Status Modality Confirmation',
						btnTitle: 'Update'
					}))

				}
				if (action === "delete") {

					dispatch(openConfirmDialog({
						type: 3,
						id: params.data.id,
						isDelete: params.data.isDeleted === true ? false : true,
						msg: "Are you sure want to delete this Modality ?",
						title: 'Delete Modality Confirmation',
						btnTitle: 'Delete'
					}))
					// params.api.applyTransaction({
					// 	remove: [params.node.data]
					// });
				}

				if (action === "update") {


				}

				if (action === "cancel") {
					params.api.stopEditing(true);
				}
			}
		},

		onGridReady:onGridReady,
		onRowValueChanged: onRowValueChanged,
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
		module: AllCommunityModules,
		editType: "fullRow",
		defaultColDef: {
			editable: true
		},
		frameworkComponents: {
			actionCellRenderer: actionCellRenderer,
			actionHeader: actionHeader
		},

		getRowStyle: params => {
			if (params.data.isDeleted === true) {
				return {
					// 'border': 0,
					// 'height': '1px',
					// 'background': 'black',
					// 'position': 'absolute',
					// // 'top': '25px',
					// 'width': '100%',
					// color:'#000'
				};
			}
		},

		columnDefs: [
			{
				field: "locationName",
				cellEditor: 'agSelectCellEditor',
				filter: 'agTextColumnFilter',
				sortable: true,
				cellRenderer: fieldRender,
				cellEditorParams: {
					values: tempLocation,
					cellRenderer: (params) => params.value
				},
				cellStyle: cellStyle
			},
			{
				field: "modality",
				filter: 'agTextColumnFilter',
				sortable: true,
				cellRenderer: fieldRender,
				cellStyle: cellStyle
			},
			{
				field: "status",
				sortable: true,
				editable: false,
				width: 150,
				cellRenderer: fieldRender,
				cellStyle: cellStyle
			},

			{
				field: "ae_title",
				sortable: true,
				filter: 'agTextColumnFilter',
				cellRenderer: fieldRender,
				cellStyle: cellStyle
			},
			{
				field: "mwl_display_name",
				headerName: 'MWL Display Name',
				cellEditor: 'agSelectCellEditor',
				cellEditorParams: {
					values: ModalityDisplay,
					cellRenderer: (params) => params.value
				},
				sortable: true,
				filter: 'agTextColumnFilter',
				cellRenderer: fieldRender,
				cellStyle: cellStyle
			},
			{
				field: "mwl_show",
				headerName: 'MWL Show',
				editable: false,
				sortable: true,
				width: 150,
				cellRenderer: fieldRender,
				cellStyle: cellStyle
			},

			{
				field: "bg_color",
				cellRenderer: fieldRender,
				cellEditor: 'agSelectCellEditor',
				cellEditorParams: {
					values: tempColor,
					cellRenderer: (params) => params.value
				},
				width: 150,
				sortable: true,
			},
			{
				headerName: "Action",
				headerComponent: "actionHeader",
				cellRenderer: "actionCellRenderer",
				editable: false,
				colId: "action"
			}
		],
		rowData: tempdata,


	};

	return (
		<div className="flex flex-col h-full sm:border-1 overflow-hidden">
			<PermissionSwitch permission={Permissions.update_modality} label="Update Modality" />
			<PermissionSwitch permission={Permissions.delete_modality} label="Delete Modality" />

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
			<div className="ag-theme-alpine ag-grid-custom" style={{height: '120%', width: '100%', lineHeight: '30px'}}>
				<AgGridReact gridOptions={gridOptions} pagination={true} paginationPageSize="15" height={400} />
				<ConfirmDialog />
				<CreateFormDialog
					isOpen={open}
					handleCloseDialog={() => {setOpen(false)}}
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

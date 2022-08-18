import FuseUtils from '@fuse/utils';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService';
import history from '@history';
import {useSnackbar} from 'notistack';
import {makeStyles} from '@material-ui/styles';
const useStyle = makeStyles({
	button: {
		margin: '15px 10px',
		width: 120
	}
})
const FormListTable = ({ data, modalities, payerType }) => {
	const [gridApi, setGridApi] = useState(null);
	const editIcon = event => {
		return '<span class="cursor-pointer text-blue-700 underline">Edit</span>';
		// return '<i class="material-icons cursor-pointer" title="Disable Attorney">edit</i>';
	};
	const onGridReady = (params) => {
		setGridApi(params.api);
		params.api.sizeColumnsToFit();
	} 

	const editClick = (e) => {
		history.push(`/apps/formBuilder/${e.data.id}`)
	}
	const fieldRender = (event) => {
		if (parseInt(event.value) === 1 || event.value=== 'Y') {
			return '<i class="material-icons cursor-pointer">check</i>'
		} else {
			return ''
		}
	}

	const modRender = (event) => {
		const mods = event.value;
		let str = '';
		for(var i=0; i<mods.length; i++) {
			for(var j=0;j<modalities.length; j++) {
				if(mods[i].modality_id === modalities[j].id) {
					if(str.indexOf(modalities[j].mwl_display_name)<0)
					str += modalities[j].mwl_display_name + ',';
				}
			}
		}
		str = str.replace(/,\s*$/, "");
		return str;
	}

	const payerRender = (event) => {
		const payers = event.value;
		let str = '';
		for(var i=0; i<payers.length; i++) {
			for(var j=0;j<payerType.length; j++) {
				if(payers[i].payer_type_id === payerType[j].id) {
					if(str.indexOf(payerType[j].display_name)<0)
						str += payerType[j].display_name + ',';
				}
			}
		}
		str = str.replace(/,\s*$/, "");
		return str;
	}

	const onBtForEachNode = () => {
		console.log('### api.forEachNode() ###');
		gridApi.forEachNode(printNode);
	  };
	
	
	const printNode = (node, index) => {
		if (node.group) {
			console.log(index + ' -> group: ' + node.key);
		} else {
			console.log(
			index + ' -> data: ' + node.data.country + ', ' + node.data.athlete
			);
		}
	};

	const i = 0;
	// Render the UI for your table
	return (
		<div className="flex flex-col sm:border-1 overflow-hidden" style={{height: '50%'}}>
			<div className="ag-theme-alpine ag-grid-custom" style={{height: '120%', width: '100%', lineHeight: '30px'}}>
				<AgGridReact
					onGridReady={onGridReady}
					rowDataChangeDetectionStrategy={ChangeDetectionStrategyType.IdentityCheck}
					rowData={data}
					// pagination={true}
					// paginationPageSize="5"
					rowDragManaged={true}
          			animateRows={true}
					rowHeight={38}>
					<AgGridColumn width={60} sortable={true} rowDrag={true} tooltipField="id" field="id" headerName="Form ID"></AgGridColumn>
					<AgGridColumn width={120} sortable={true} tooltipField="name" field="name" headerName="Form Name"></AgGridColumn>
					<AgGridColumn width={60} sortable={true} headerName="Is Active" cellRenderer={fieldRender} field="isactive"></AgGridColumn>
					<AgGridColumn width={60} sortable={true} headerName="Is Required" cellRenderer={fieldRender} field="required"></AgGridColumn>
					<AgGridColumn width={120} sortable={true} headerName="Modalities" cellRenderer={modRender} field="tran_form_required_modalities"></AgGridColumn>
					<AgGridColumn width={120} sortable={true} headerName="PayerType" cellRenderer={payerRender} field="tran_form_required_payer_types"></AgGridColumn>
					<AgGridColumn width={35} field="id" headerName="" cellRenderer={editIcon} onCellClicked={editClick}></AgGridColumn>
				</AgGridReact>
			</div>
		</div>
	);
};

FormListTable.propTypes = {
	data: PropTypes.array.isRequired,
	onRowClick: PropTypes.func,
	onStarClick: PropTypes.func
};

export default FormListTable;

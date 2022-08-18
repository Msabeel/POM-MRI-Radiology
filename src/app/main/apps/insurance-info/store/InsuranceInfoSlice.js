import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';


export const getInsurancePageFormsData = createAsyncThunk('insuranceInfoApp/contacts/getInsurancePageFormsData', async (req) => {
	const response = await axios.get(API_URL.GET_INSURANCE_FORM_DATA);
	const data =  response.data;
	return { data };
	}
);

export const getAttorney = createAsyncThunk('insuranceInfoApp/contacts/getAttorney', async (req) => {
	const response = await axios.get(API_URL.GET_ATTORNEY);
	const data =  response.data;
	return { data };
	}
);




export const getInsurancePageDataByPId = createAsyncThunk('insuranceInfoApp/contacts/getInsurancePageDataByPId', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.GET_INSURANCE_DATA_BY_PID, { ...req, userid: currentUser.data.userId });
	const data =  response.data;
	return { data };
	}
);


export const saveInsuranceData = createAsyncThunk('insuranceInfoApp/contacts/saveInsuranceData', async (req) => {
	const currentUser = JSON.parse(localStorage.getItem('USER'));
	const response = await axios.post(API_URL.SAVE_INSURANCE_DATA, { ...req, userid: currentUser.data.userId });
	const data =  response.data;
	return { data, isUpdateSuccess: true };
	}
);

const insuranceInfoAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = insuranceInfoAdapter.getSelectors(
	state => state.insuranceInfoApp.contacts
);

const insuranceInfoSlice = createSlice({
	name: 'insuranceInfoApp/contacts',
	initialState: insuranceInfoAdapter.getInitialState({
		insuranceFormData: {},		
		attorneyData: [],
		insuranceData: {},
		isNavigationBlocked: false,
		commercialInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		coverageInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		coPayInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		deductibleInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		referenceInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		siCommercialInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		siCoverageInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		siCoPayInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		siDeductibleInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		siReferenceInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		tiCommercialInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		tiCoverageInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		tiCoPayInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		tiDeductibleInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		tiReferenceInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		giGeneralInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		giContactInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		lopCommercialInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		lopCoverageInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		lopCoPayInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		lopDeductibleInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		lopReferenceInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		lopAttorneyInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		workersCommercialInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		workersCoverageInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		workersReferenceInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		autoCommercialInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		autoCoverageInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		autoReferenceInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
		autoAttorneyInfoDialog: {
			props: {
				open: null
			},
			data: null,
		},
	}),
	reducers: {
		openCommercialDialog: (state, action) => {
			state.commercialInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeCommercialDialog: (state, action) => {
			state.commercialInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openCoverageDialog: (state, action) => {
			state.coverageInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeCoverageDialog: (state, action) => {
			state.coverageInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openCoPayDialog: (state, action) => {
			state.coPayInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeCoPayDialog: (state, action) => {
			state.coPayInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openDeductibleDialog: (state, action) => {
			state.deductibleInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeDeductibleDialog: (state, action) => {
			state.deductibleInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openReferenceDialog: (state, action) => {
			state.referenceInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeReferenceDialog: (state, action) => {
			state.referenceInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openSICommercialDialog: (state, action) => {
			state.siCommercialInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeSICommercialDialog: (state, action) => {
			state.siCommercialInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openSICoverageDialog: (state, action) => {
			state.siCoverageInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeSICoverageDialog: (state, action) => {
			state.siCoverageInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openSICoPayDialog: (state, action) => {
			state.siCoPayInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeSICoPayDialog: (state, action) => {
			state.siCoPayInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openSIDeductibleDialog: (state, action) => {
			state.siDeductibleInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeSIDeductibleDialog: (state, action) => {
			state.siDeductibleInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openSIReferenceDialog: (state, action) => {
			state.siReferenceInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeSIReferenceDialog: (state, action) => {
			state.siReferenceInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openTICommercialDialog: (state, action) => {
			state.tiCommercialInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeTICommercialDialog: (state, action) => {
			state.tiCommercialInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openTICoverageDialog: (state, action) => {
			state.tiCoverageInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeTICoverageDialog: (state, action) => {
			state.tiCoverageInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openTICoPayDialog: (state, action) => {
			state.tiCoPayInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeTICoPayDialog: (state, action) => {
			state.tiCoPayInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openTIDeductibleDialog: (state, action) => {
			state.tiDeductibleInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeTIDeductibleDialog: (state, action) => {
			state.tiDeductibleInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openTIReferenceDialog: (state, action) => {
			state.tiReferenceInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeTIReferenceDialog: (state, action) => {
			state.tiReferenceInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openGIGeneralInfoDialog: (state, action) => {
			state.giGeneralInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeGIGeneralInfoDialog: (state, action) => {
			state.giGeneralInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openGIContactInfoDialog: (state, action) => {
			state.giContactInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeGIContactInfoDialog: (state, action) => {
			state.giContactInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openLOPCommercialDialog: (state, action) => {
			state.lopCommercialInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeLOPCommercialDialog: (state, action) => {
			state.lopCommercialInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openLOPCoverageDialog: (state, action) => {
			state.lopCoverageInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeLOPCoverageDialog: (state, action) => {
			state.lopCoverageInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openLOPCoPayDialog: (state, action) => {
			state.lopCoPayInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeLOPCoPayDialog: (state, action) => {
			state.lopCoPayInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openLOPDeductibleDialog: (state, action) => {
			state.lopDeductibleInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeLOPDeductibleDialog: (state, action) => {
			state.lopDeductibleInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openLOPReferenceDialog: (state, action) => {
			state.lopReferenceInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeLOPReferenceDialog: (state, action) => {
			state.lopReferenceInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openLOPAttorneyDialog: (state, action) => {
			state.lopAttorneyInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeLOPAttorneyDialog: (state, action) => {
			state.lopAttorneyInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openWorkersCommercialDialog: (state, action) => {
			state.workersCommercialInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeWorkersCommercialDialog: (state, action) => {
			state.workersCommercialInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openWorkersCoverageDialog: (state, action) => {
			state.workersCoverageInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeWorkersCoverageDialog: (state, action) => {
			state.workersCoverageInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openWorkersReferenceDialog: (state, action) => {
			state.workersReferenceInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeWorkersReferenceDialog: (state, action) => {
			state.workersReferenceInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openAutoCommercialDialog: (state, action) => {
			state.autoCommercialInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeAutoCommercialDialog: (state, action) => {
			state.autoCommercialInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,
			};
		},
		openAutoCoverageDialog: (state, action) => {
			state.autoCoverageInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeAutoCoverageDialog: (state, action) => {
			state.autoCoverageInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openAutoReferenceDialog: (state, action) => {
			state.autoReferenceInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeAutoReferenceDialog: (state, action) => {
			state.autoReferenceInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openAutoAttorneyDialog: (state, action) => {
			state.autoAttorneyInfoDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closeAutoAttorneyDialog: (state, action) => {
			state.autoAttorneyInfoDialog = {
				props: {
					open: false
				},
				data: action.payload,

			};
		},
		openPreivewDialog: (state, action) => {
			state.previewDialog = {
				props: {
					open: true
				},
				data: action.payload,

			};
		},
		closePreviewDialog: (state, action) => {
			state.previewDialog = {
				props: {
					open: false
				},

			};
		},
		updateNavigationBlocked: (state, action) => {
			state.isNavigationBlocked = action.payload
		},
	},
	extraReducers: {
		[getInsurancePageFormsData.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.insuranceFormData = data;
		},
		[getAttorney.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.attorneyData = data;
		},
		[getInsurancePageDataByPId.fulfilled]: (state, action) => {
			const { data } = action.payload;
			state.insuranceData = data;
		},
	}
});

export const {
	openCommercialDialog,
	closeCommercialDialog,
	openCoverageDialog,
	closeCoverageDialog,
	openCoPayDialog,
	closeCoPayDialog,
	openDeductibleDialog,
	closeDeductibleDialog,
	openReferenceDialog,
	closeReferenceDialog,
	openSICommercialDialog,
	closeSICommercialDialog,
	openSICoverageDialog,
	closeSICoverageDialog,
	openSICoPayDialog,
	closeSICoPayDialog,
	openSIDeductibleDialog,
	closeSIDeductibleDialog,
	openSIReferenceDialog,
	closeSIReferenceDialog,
	openTICommercialDialog,
	closeTICommercialDialog,
	openTICoverageDialog,
	closeTICoverageDialog,
	openTICoPayDialog,
	closeTICoPayDialog,
	openTIDeductibleDialog,
	closeTIDeductibleDialog,
	openTIReferenceDialog,
	closeTIReferenceDialog,
	openGIContactInfoDialog,
	closeGIContactInfoDialog,
	openGIGeneralInfoDialog,
	closeGIGeneralInfoDialog,
	openLOPCommercialDialog,
	closeLOPCommercialDialog,
	openLOPCoverageDialog,
	closeLOPCoverageDialog,
	openLOPCoPayDialog,
	closeLOPCoPayDialog,
	openLOPDeductibleDialog,
	closeLOPDeductibleDialog,
	openLOPReferenceDialog,
	closeLOPReferenceDialog,
	openLOPAttorneyDialog,
	closeLOPAttorneyDialog,
	openWorkersCommercialDialog,
	closeWorkersCommercialDialog,
	openWorkersCoverageDialog,
	closeWorkersCoverageDialog,
	openWorkersReferenceDialog,
	closeWorkersReferenceDialog,
	openAutoCommercialDialog,
	closeAutoCommercialDialog,
	openAutoCoverageDialog,
	closeAutoCoverageDialog,
	openAutoReferenceDialog,
	closeAutoReferenceDialog,
	openAutoAttorneyDialog,
	closeAutoAttorneyDialog,
	openPreivewDialog,
	closePreviewDialog,
	updateNavigationBlocked,
} = insuranceInfoSlice.actions;

export default insuranceInfoSlice.reducer;

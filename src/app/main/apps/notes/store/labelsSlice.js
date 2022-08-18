import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getLabels = createAsyncThunk('notesApp/labels/getLabels', async () => {
	const response = await axios.get(API_URL.GET_NOTELABELS);
	const data = await response.data.data;

	return data;
});

export const updateLabels = createAsyncThunk('notesApp/labels/updateLabels', async labels => {
	const response = await axios.post(API_URL.SAVE_NOTELABELS, { labels: Object.values(labels) });
	const data = await response.data.data;

	return data;
});

const labelsAdapter = createEntityAdapter({});

export const {
	selectAll: selectLabels,
	selectEntities: selectLabelsEntities,
	selectById: selectLabelById
} = labelsAdapter.getSelectors(state => state.notesApp.labels);

const labelsSlice = createSlice({
	name: 'notesApp/labels',
	initialState: labelsAdapter.getInitialState({ labelsDialogOpen: false }),
	reducers: {
		openLabelsDialog: (state, action) => {
			state.labelsDialogOpen = true;
		},
		closeLabelsDialog: (state, action) => {
			state.labelsDialogOpen = false;
		}
	},
	extraReducers: {
		[getLabels.fulfilled]: labelsAdapter.setAll,
		[updateLabels.fulfilled]: labelsAdapter.setAll
	}
});

export const { openLabelsDialog, closeLabelsDialog } = labelsSlice.actions;

export default labelsSlice.reducer;

import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getWidgets = createAsyncThunk('projectDashboardApp/widgets/getWidgets', async () => {
	//const response = await axios.get('/api/project-dashboard-app/widgets');
    const response = await axios.get('https://x5wmutlt70.execute-api.us-east-1.amazonaws.com/Prod/getGraphdata');
	const data = await response.data;

	return data;
});

export const getNoShowGraph = createAsyncThunk('projectDashboardApp/widgets/getNoShowGraph', async (params) => {
    //API_URL.NO_SHOW_GRAPH
	const response = await axios.get("https://34459y5f3c.execute-api.us-east-1.amazonaws.com/no-show-graph?type=ByDay");
	const data = await response.data;
	return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(

	state => state.projectDashboardApp.widgets
)


const widgetsSlice = createSlice({
	name: 'projectDashboardApp/widgets',
	initialState: widgetsAdapter.getInitialState({
		noShow: undefined
	}),
	reducers: {},
	extraReducers: {
		[getWidgets.fulfilled]: widgetsAdapter.setAll,
		[getNoShowGraph.fulfilled]: (state, action) => {
			state.noShow = action.payload;
		},
	}
});

export default widgetsSlice.reducer;

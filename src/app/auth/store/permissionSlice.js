import { createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';

const initialState = {
	permissionData: []
};

const permissionSlice = createSlice({
	name: 'auth/permission',
	initialState,
	reducers: {
		setUserPermission: (state, action) => action.payload
	},
	extraReducers: {}
});

export const { setUserPermission } = permissionSlice.actions;

export default permissionSlice.reducer;

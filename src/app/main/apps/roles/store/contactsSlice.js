import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserData } from './userSlice';
import { API_URL } from 'app/config';

export const getContacts = createAsyncThunk('rolesApp/contacts/getContacts', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().contactsApp.contacts.routeParams;
    console.log(routeParams);
    const headers = {
		'Content-Type': 'application/json'
	};
	const response = await axios.get(API_URL.GET_ALL_USER_TYPE, {
		params: routeParams, headers: headers
	});
	//const data = JSON.parse(response.data.body);
    console.log(response);
    const data = await response.data;
	return { data, routeParams };
});

export const getPermissions = createAsyncThunk('rolesApp/contacts/getPermissions', async (routeParams, { getState }) => {
    routeParams = routeParams || getState().rolesApp.contacts.routeParams;
    const response = await axios.post(API_URL.GET_PERMISSON_BY_USER_TYPE, {
		"user_type":routeParams.id
	});
	//const data = JSON.parse(response.data.body);
    const data = await response.data;
	return {data};
});

export const updateContact = createAsyncThunk('rolesApp/contacts/updateContact', 
    async (contact, { dispatch, getState }) => {
		try{
			const currentUser = JSON.parse(localStorage.getItem('USER'));  
			const response = await axios.post(API_URL.ADD_PERMISSON, { ...contact, user_id: currentUser.data.userId });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);

export const addUserType = createAsyncThunk('rolesApp/contacts/addUserType', 
    async (contact, { dispatch, getState }) => {
		try{
			const currentUser = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.ADD_USER_TYPE, { ...contact, user_id: currentUser.data.userId });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);

export const deleteUserType = createAsyncThunk('rolesApp/contacts/deleteUserType', 
    async (contact, { dispatch, getState }) => {
		try{
			const currentUser = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.DELETE_USER_TYPE, { ...contact, user_id: currentUser.data.userId });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);

export const updateUserType = createAsyncThunk('rolesApp/contacts/updateUserType', 
    async (contact, { dispatch, getState }) => {
		try{
			const currentUser = JSON.parse(localStorage.getItem('USER'));
			const response = await axios.post(API_URL.UPDATE_USER_TYPE, { ...contact, user_id: currentUser.data.userId });
			const data = await response.data;
			return { data, isUpdateSuccess: true };
		}
		catch(e) {
			return { isUpdateError: true };
		}
	}
);

//const initialState = []
const rolesAdapter = createEntityAdapter({});
const contactsSlice = createSlice({
  name: 'rolesApp/contacts',
 
  initialState: rolesAdapter.getInitialState({
        getContacts: null,
        permissionlist: [],
        confirmationDialog: {
            props: {
                open: false
            },
            data: null,
        },
        roleDialog: {
            props: {
                open: false
            },
            data: null,
        },
        isRolePermissionUpdated: false,
        isRolePermissionUpdatedError: false,
        isRoleAdded: false,
        isRoleAddedError: false,
        isRoleUpdated: false,
        isRoleUpdatedError: false,
        isRoleDeleted: false,
        isRoleDeletedError: false,
    }),
  reducers: {
    openConfirmDialog: (state, action) => {
        state.confirmationDialog = {
          props: {
                open: true
            },
            data: action.payload,
            
        };
    },
    closeConfirmDialog: (state, action) => {
        state.confirmationDialog = {
          props: {
                open: false
            },
        
        };
    },
    openNewRoleDialog: (state, action) => {
        state.roleDialog = {
            type: 'new',
            props: {
                open: true
            },
            data: action.payload,
            
        };
    },
    closeNewRoleDialog: (state, action) => {
        state.roleDialog = {
            type: 'new',
            props: {
                open: false
            },
        
        };
    },
    openEditRoleDialog: (state, action) => {
        state.roleDialog = {
            type: 'edit',
            props: {
                open: true
            },
            data: action.payload,
            
        };
    },
    closeEditRoleDialog: (state, action) => {
        state.roleDialog = {
            type: 'edit',
            props: {
                open: false
            },
        
        };
    },
  },
  extraReducers: {
    [getContacts.fulfilled]: (state, action) => {
        /// return action.payload
        const { data } = action.payload;
        state.getContacts = data;
        state.isRoleUpdated = false;
        state.isRoleDeleted = false;
        state.isRoleAdded = false;
    },
    [getPermissions.fulfilled]: (state, action) => {
        const { data } = action.payload;
        state.permissionlist = data;
    },
    [updateContact.fulfilled]: (state, action) => {
        const { isUpdateSuccess, isUpdateError } = action.payload;
        state.isRolePermissionUpdated = isUpdateSuccess;
        state.isRolePermissionUpdatedError = isUpdateError;
	},
    [addUserType.fulfilled]: (state, action) => {
        const { isUpdateSuccess, isUpdateError } = action.payload;
        state.isRoleAdded = isUpdateSuccess;
        state.isRoleAddedError = isUpdateError;
	},
    [deleteUserType.fulfilled]: (state, action) => {
        const { isUpdateSuccess, isUpdateError } = action.payload;
        state.isRoleDeleted = isUpdateSuccess;
        state.isRoleDeletedError = isUpdateError;
	},
    [updateUserType.fulfilled]: (state, action) => {
        const { isUpdateSuccess, isUpdateError } = action.payload;
        state.isRoleUpdated = isUpdateSuccess;
        state.isRoleUpdatedError = isUpdateError;
	},
  }
})

export const {
	openConfirmDialog,
	closeConfirmDialog,
    openNewRoleDialog,
    openEditRoleDialog,
    closeNewRoleDialog,
    closeEditRoleDialog
} = contactsSlice.actions;

export default contactsSlice.reducer



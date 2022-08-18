import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from 'app/config';

export const getLocation = createAsyncThunk('login/getLocation', async () => {
	const token = JSON.parse(localStorage.getItem('AUTH_TOKEN'));
	const headers = {
		'Content-Type': 'application/json'
	};
	const response = await axios.get(API_URL.HOMESCREEN_DATA, {
		headers: headers
	  });
	const data = response.data;
	return data;
});

const initialState = []

const loginSlice = createSlice({
  name: 'login/getLocationData',
  initialState,
  reducers: {},
  extraReducers: {
    [getLocation.fulfilled]: (state, action) => {
      return action.payload
    }
  }
})

export default loginSlice.reducer
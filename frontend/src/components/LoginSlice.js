import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        token: null,
        isAuthenticated: false,
        role: null,
        error: null
    },
    reducers: {
        signin: (state, action) => {
            localStorage.setItem('JOBZ_TOKEN', action.payload.token);
            axios.defaults.headers.common['x-auth-token'] = action.payload.token;

            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.error = null;
        },
        signout: (state, action) => {
            localStorage.removeItem('JOBZ_TOKEN');
            delete axios.defaults.headers.common['x-auth-token'];

            state.token = null;
            state.isAuthenticated = false;
            state.role = null;
        },
        signerror: (state, action) => {
            state.error = action.payload.message;
        }
    }
});

const { signin, signout, signerror } = loginSlice.actions;

export { signin, signout, signerror };

export default loginSlice.reducer;
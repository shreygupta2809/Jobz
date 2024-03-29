import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import loginReducer from '../components/LoginSlice';

import rootReducer from './rootReducer';
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;

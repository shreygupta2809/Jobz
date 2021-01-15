import { combineReducers } from 'redux';
import loginReducer from '../components/LoginSlice';

export default combineReducers({
    // define your reducers here
    login: loginReducer
});

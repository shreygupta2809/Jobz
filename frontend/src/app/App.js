import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from '../components/Home';
import Main from '../components/Main';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Register from '../components/Register';
import './App.css';

import store from './store';

function App() {
    return (
        <StoreProvider store={store}>
            <Router>
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/profile" exact component={Profile} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/navbar" exact component={Navbar} />
                </Switch>
            </Router>
        </StoreProvider>
    );
}

export default App;

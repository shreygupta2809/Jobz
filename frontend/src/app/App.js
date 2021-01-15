import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Profile from '../components/Home';
import Main from '../components/Main';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';

import './App.css';

import store from './store';

function App() {
    return (
        <StoreProvider store={store}>
            <Router>
                <Navbar>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            exact
                            component={() => <Redirect to="/login"></Redirect>}
                        />
                        <Route exact path="/dashboard" exact component={Dashboard} />
                        <Route exact path="/login" exact component={Login} />
                        {/* <Route exact path="/login" exact component={Login} />
                        <Route exact path="/navbar" exact component={Navbar} /> */}
                    </Switch>
                </Navbar>
            </Router>
        </StoreProvider>
    );
}

export default App;

import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Profile from '../components/Profile';
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import MyApplication from '../components/MyApplication';

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
                        <Route
                            exact
                            path="/myapplication"
                            exact
                            component={MyApplication}
                        />
                        <Route exact path="/login" exact component={Login} />
                        <Route exact path="/register" exact component={Register} />
                        <Route exact path="/profile" exact component={Profile} />
                        {/* <Route exact path="/login" exact component={Login} />
                        <Route exact path="/navbar" exact component={Navbar} /> */}
                    </Switch>
                </Navbar>
            </Router>
        </StoreProvider>
    );
}

export default App;

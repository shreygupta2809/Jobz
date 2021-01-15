import { React, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './LoginSlice';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MyAlert from './MyAlert';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

const Login = () => {
    const classes = useStyles();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const dispatch = useDispatch();

    const loggedIn = useSelector(state => state.isAuthenticated);
    const role = useSelector(state => state.role);
    const error = useSelector(state => state.error);

    let alert;
    if (error) {
        alert = <MyAlert />;
    }

    if (loggedIn) return <Redirect to="/dashboard" />;

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        dispatch(login(formData.email, formData.password));
    };

    return (
        <Container component="main" maxWidth="xs">
            {alert}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <form onSubmit={onSubmit} className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        autoComplete="email"
                        onChange={onChange}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={onChange}
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Log In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="/register" variant="body2">
                                {"Don't have an account? Register Now"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default Login;

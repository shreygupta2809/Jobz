import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2)
        }
    }
}));

const MyAlert = () => {
    const classes = useStyles();
    const error = useSelector(state => state.login.error);

    return (
        <div className={classes.root}>
            <Alert variant="outlined" severity="error">
                {error}
            </Alert>
        </div>
    );
};

export default MyAlert;

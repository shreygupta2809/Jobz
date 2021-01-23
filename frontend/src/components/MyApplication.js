import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signerror, signnoerror } from './LoginSlice';
import api from '../utils/apiCalls';
import MyAlert from './MyAlert';

import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const MyApplication = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.login.isAuthenticated);
    const error = useSelector(state => state.login.error);
    const [app, setApp] = useState(undefined);

    const [rate, setRate] = useState('');
    const [open, setOpen] = useState(false);
    const [id, setId] = useState('');
    const [hasrate, setHasRate] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setRate('');
        setId('');
    };

    function getRecruiterName(params) {
        return params.getValue('job').recruiter.name;
    }

    function getSalary(params) {
        return params.getValue('job').salary;
    }

    function getTitle(params) {
        return params.getValue('job').title;
    }

    function getRating(params) {
        return params.getValue('job').avgRating;
    }

    function getDate(params) {
        const status = params.getValue('status');
        if (status !== 'Accepted') return 'NA';
        var localDate = new Date(params.getValue('date'));
        return localDate.toDateString();
    }

    const rateJob = async () => {
        setOpen(false);
        // console.log(id, rate);
        try {
            const response = await api.post(`/api/ratings/job/${id}`, {
                body: { value: rate }
            });
            // const result = response.data.data.data;
            // const jobID = result.job;
            // let appz = [...app];
            // appz.forEach(el => {
            //     if (el.id === jobID) {
            //         el.applied = 'Applied';
            //     }
            // });
            // setApp(appz);
            setHasRate(!hasrate);
            dispatch(signnoerror());
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    function renderRate(id) {
        setOpen(true);
        setRate('3');
        var appEle = app.filter(el => {
            return el.id === id;
        });
        setId(appEle[0].job._id);
    }

    function rateButton(params) {
        const status = params.getValue('status');
        const hasRated = params.getValue('hasRated');
        if (status === 'Accepted') {
            return (
                <strong>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={hasRated ? true : false}
                        onClick={() => renderRate(params.getValue('id'))}
                        style={{ marginLeft: 16 }}
                    >
                        Rate
                    </Button>
                </strong>
            );
        }
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled
                    style={{ marginLeft: 16 }}
                >
                    NA
                </Button>
            </strong>
        );
    }

    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            width: 250,
            valueGetter: getTitle,
            sortable: false
        },
        {
            field: 'date',
            headerName: 'Date of Joining',
            width: 150,
            valueFormatter: getDate,
            sortable: false
        },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 150,
            valueGetter: getSalary,
            sortable: false
        },
        {
            field: 'recuiter',
            headerName: 'Recruiter',
            width: 250,
            valueGetter: getRecruiterName,
            sortable: false
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            sortable: false
        },
        {
            field: 'avgRating',
            headerName: 'Rating',
            valueGetter: getRating,
            width: 150,
            sortable: false
        },
        {
            field: 'rate',
            headerName: 'Rate',
            renderCell: rateButton,
            width: 150,
            sortable: false
        }
    ];

    const getMyApps = async () => {
        try {
            const res = await axios.get('api/applicant/myApp');
            let result = res.data.data.data;
            result.forEach(a => {
                a.id = a._id;
            });
            setApp(result);
            dispatch(signnoerror());
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    const rateChange = e => {
        setRate(e.target.value);
        // console.log(e.target.value);
    };

    const history = useHistory();

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getMyApps();
    }, [loggedIn, hasrate]);

    if (!app) {
        return <h1>loading</h1>;
    }

    return (
        <>
            {error && <MyAlert />}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">RATE</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        {/* <FormLabel component="legend">Rating</FormLabel> */}
                        <RadioGroup
                            aria-label="rate"
                            name="rate"
                            value={rate}
                            onChange={rateChange}
                        >
                            <FormControlLabel value="1" control={<Radio />} label="1" />
                            <FormControlLabel value="2" control={<Radio />} label="2" />
                            <FormControlLabel value="3" control={<Radio />} label="3" />
                            <FormControlLabel value="4" control={<Radio />} label="4" />
                            <FormControlLabel value="5" control={<Radio />} label="5" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={rateJob} color="primary">
                        Rate
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={app ? app : []}
                    columns={columns.map(column => ({
                        ...column,
                        disableClickEventBubbling: true
                    }))}
                    disableColumnMenu="true"
                />
            </div>
        </>
    );
};

export default MyApplication;

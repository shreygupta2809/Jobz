import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signerror, signnoerror } from './LoginSlice';
import api from '../utils/apiCalls';
import MyAlert from './MyAlert';

import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const Application = props => {
    const { jobId } = (props.location && props.location.state) || {};
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.login.isAuthenticated);
    const error = useSelector(state => state.login.error);
    const [app, setApp] = useState(undefined);

    const [change, setChange] = useState(false);
    const [sorts, setSort] = useState({
        sortName: '',
        sortRating: '',
        sortDate: ''
    });

    function getName(params) {
        return params.getValue('applicant').name;
    }

    function getEducation(params) {
        const eds = params.getValue('applicant').education;
        return (
            <List dense style={{ marginBottom: '0px' }}>
                {eds.map(sk => (
                    <ListItemText
                        primary={`${sk.institute}, ${sk.startYear}, ${sk.endYear}`}
                    />
                ))}
            </List>
        );
    }

    function getSkills(params) {
        return params.getValue('applicant').skill;
    }

    function getRating(params) {
        return params.getValue('applicant').avgRating;
    }

    function getDate(params) {
        var localDate = new Date(params.getValue('date'));
        return localDate.toDateString();
    }

    const changeStatus = async (id, changedState) => {
        try {
            const response = await api.patch(`/api/applications/${id}`, {
                body: { status: changedState }
            });
            dispatch(signnoerror());
            setSort({
                sortName: '',
                sortRating: '',
                sortDate: ''
            });
            setChange(!change);
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    // function renderRate(id) {
    //     setOpen(true);
    //     setRate('3');
    //     var appEle = emp.filter(el => {
    //         return el.id === id;
    //     });
    //     setId(appEle[0].applicant._id);
    // }

    function acceptButton(params) {
        const stat = params.getValue('status');
        if (stat === 'Applied') {
            return (
                <strong>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => changeStatus(params.getValue('id'), 'Shortlisted')}
                        style={{ marginLeft: 16 }}
                    >
                        Shortlist
                    </Button>
                </strong>
            );
        } else {
            return (
                <strong>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={stat !== 'Shortlisted' ? true : false}
                        onClick={() => changeStatus(params.getValue('id'), 'Accepted')}
                        style={{ marginLeft: 16 }}
                    >
                        Accept
                    </Button>
                </strong>
            );
        }
    }

    function rejectButton(params) {
        const stat = params.getValue('status');
        return (
            <strong>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    disabled={stat === 'Accepted' || stat === 'Rejected' ? true : false}
                    onClick={() => changeStatus(params.getValue('id'), 'Rejected')}
                    style={{ marginLeft: 16 }}
                >
                    Reject
                </Button>
            </strong>
        );
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 170,
            valueGetter: getName,
            sortable: false
        },
        {
            field: 'date',
            headerName: 'Date of Applying',
            width: 170,
            valueFormatter: getDate,
            sortable: false
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            sortable: false
        },
        {
            field: 'sop',
            headerName: 'SOP',
            width: 340,
            sortable: false
        },
        {
            field: 'avgRating',
            headerName: 'Rating',
            valueGetter: getRating,
            width: 100,
            sortable: false
        },
        {
            field: 'education',
            headerName: 'Education',
            valueFormatter: getEducation,
            renderCell: getEducation,
            width: 200,
            sortable: false
        },
        {
            field: 'skill',
            headerName: 'Skills',
            valueFormatter: getSkills,
            width: 350,
            sortable: false
        },
        {
            field: 'accept',
            headerName: 'Accept',
            renderCell: acceptButton,
            width: 130,
            sortable: false
        },
        {
            field: 'reject',
            headerName: 'Reject',
            renderCell: rejectButton,
            width: 130,
            sortable: false
        }
    ];

    const getJobApp = async () => {
        try {
            const res = await axios.get(`api/recruiter/${jobId}`);
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

    const sortApp = e => {
        let apsss = [...app];
        apsss.sort((app1, app2) => {
            if (sorts.sortName) {
                if (app1.applicant.name < app2.applicant.name)
                    return sorts.sortName === 'Asc' ? -1 : 1;
                if (app1.applicant.name > app2.applicant.name)
                    return sorts.sortName === 'Asc' ? 1 : -1;
            }

            if (sorts.sortRating) {
                if (app1.applicant.avgRating < app2.applicant.avgRating)
                    return sorts.sortRating === 'Asc' ? -1 : 1;
                if (app1.applicant.avgRating > app2.applicant.avgRating)
                    return sorts.sortRating === 'Asc' ? 1 : -1;
            }

            if (sorts.sortDate) {
                if (app1.date < app2.date) return sorts.sortDate === 'Asc' ? -1 : 1;
                if (app1.date > app2.date) return sorts.sortDate === 'Asc' ? 1 : -1;
            }
        });
        setApp(apsss);
    };

    // const rateChange = e => {
    //     setRate(e.target.value);
    // };

    const sortsChange = e => {
        setSort({
            ...sorts,
            [e.target.name]: e.target.value
        });
    };

    const history = useHistory();

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getJobApp();
    }, [loggedIn, change]);

    if (!app) {
        return <h1>loading</h1>;
    }

    return (
        <>
            {error && <MyAlert />}
            {/* <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">RATE</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
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
                    <Button onClick={rateEmp} color="primary">
                        Rate
                    </Button>
                </DialogActions>
            </Dialog> */}
            <Grid container spacing={5} style={{ marginTop: '20px' }}>
                <Grid item xs={3}>
                    <InputLabel id="sortName">Sort Name:</InputLabel>
                    <Select
                        labelId="sortName"
                        id="sortName"
                        value={sorts.sortName}
                        onChange={sortsChange}
                        name="sortName"
                        style={{ width: '100%' }}
                    >
                        <MenuItem value={''}>Unsort</MenuItem>
                        <MenuItem value={'Asc'}>Ascending</MenuItem>
                        <MenuItem value={'Des'}>Descending</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <InputLabel id="sortRating">Sort Rating:</InputLabel>
                    <Select
                        labelId="sortRating"
                        id="sortRating"
                        value={sorts.sortRating}
                        onChange={sortsChange}
                        name="sortRating"
                        style={{ width: '100%' }}
                    >
                        <MenuItem value={''}>Unsort</MenuItem>
                        <MenuItem value={'Asc'}>Ascending</MenuItem>
                        <MenuItem value={'Des'}>Descending</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <InputLabel id="sortDate">Sort Date of Applying:</InputLabel>
                    <Select
                        labelId="sortDate"
                        id="sortDate"
                        value={sorts.sortDate}
                        onChange={sortsChange}
                        name="sortDate"
                        style={{ width: '100%' }}
                    >
                        <MenuItem value={''}>Unsort</MenuItem>
                        <MenuItem value={'Asc'}>Ascending</MenuItem>
                        <MenuItem value={'Des'}>Descending</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={3}>
                    <Button onClick={sortApp}>Sort</Button>
                </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%', marginTop: '30px' }}>
                <DataGrid
                    rows={app ? app : []}
                    columns={columns.map(column => ({
                        ...column,
                        disableClickEventBubbling: true
                    }))}
                    disableColumnMenu="true"
                    rowHeight={100}
                />
            </div>
        </>
    );
};

export default Application;

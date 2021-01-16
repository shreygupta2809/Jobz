import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';

function getRecruiterName(params) {
    return params.getValue('recruiter').name;
}

function getDeadline(params) {
    var localDate = new Date(params.getValue('deadline'));
    return localDate.toDateString();
}

function getDuration(params) {
    const dur = params.getValue('duration');
    if (dur) return `${dur} Months`;
    else return 'Indefinite';
}

function applyButton(params) {
    let applied = params.getValue('applied');
    const full = params.getValue('full');
    if (applied === 'Apply' && !full) {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                >
                    Apply
                </Button>
            </strong>
        );
    }
    return (
        <strong>
            <Button
                variant="contained"
                size="small"
                color="primary"
                disabled
                style={{ marginLeft: 16 }}
            >
                {applied === 'Applied' ? 'Applied' : 'Full'}
            </Button>
        </strong>
    );
}

const columns = [
    {
        field: 'title',
        headerName: 'Title',
        width: 150,
        sortable: false
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 150,
        sortable: false
    },
    {
        field: 'recuiter',
        headerName: 'Recruiter',
        width: 150,
        valueGetter: getRecruiterName,
        sortable: false
    },
    {
        field: 'salary',
        headerName: 'Salary',
        sortable: false
    },
    {
        field: 'duration',
        headerName: 'Duration',
        width: 150,
        valueFormatter: getDuration,
        sortable: false
    },
    {
        field: 'deadline',
        headerName: 'Deadline',
        width: 150,
        valueFormatter: getDeadline,
        sortable: false
    },
    {
        field: 'avgRating',
        headerName: 'Rating',
        sortable: false
    },
    {
        field: 'apply',
        headerName: 'Apply',
        renderCell: applyButton,
        width: 150,
        sortable: false
    }
];

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary
    }
}));

const Dashboard = () => {
    const loggedIn = useSelector(state => state.login.isAuthenticated);
    const [jobs, setJobs] = useState(undefined);

    const classes = useStyles();
    // const [type, setType] = useState('');
    // const [dur, setDur] = useState('');
    // const [minsal, setMinSal] = useState('');
    // const [maxsal, setMaxSal] = useState('');

    const [filter, setFilter] = useState({
        jobType: '',
        duration: '',
        salary: ''
    });
    const [value, setValue] = useState(['', '']);
    const [maxi, setMaxi] = useState();

    const getAllJobs = async () => {
        const res = await axios.get(`/api/applicant`);
        console.log(res);
        let result = res.data.data.data;
        let maxi = -1;
        result.forEach(job => {
            job.id = job._id;
            maxi = job.salary > maxi ? job.salary : maxi;
        });
        setJobs(result);
        setMaxi(maxi);
    };
    const history = useHistory();

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getAllJobs();
    }, [loggedIn]);

    const onChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const salaryChange = (e, newValue) => {
        console.log(newValue);
        setValue(newValue);
        const minmaxsal = newValue.join('-');
        setFilter({
            ...filter,
            salary: minmaxsal
        });
    };

    console.log(filter);
    if (!jobs) {
        return <h1>loading</h1>;
    }

    return (
        <>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={jobs ? jobs : []}
                    columns={columns.map(column => ({
                        ...column,
                        disableClickEventBubbling: true
                    }))}
                    disableColumnMenu="true"
                />
            </div>
            <div style={{ marginTop: '25px', marginLeft: '15px', marginRight: '15px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <InputLabel id="jobType">Job Type</InputLabel>
                        <Select
                            labelId="jobType"
                            id="jobType"
                            value={filter.jobType}
                            onChange={onChange}
                            name="jobType"
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={'Full-Time'}>Full Time</MenuItem>
                            <MenuItem value={'Part-Time'}>Part Time</MenuItem>
                            <MenuItem value={'Work-From-Home'}>Work From Home</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography id="range-slider" gutterBottom>
                            Salary
                        </Typography>
                        <Slider
                            value={value}
                            onChange={salaryChange}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            max={maxi}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel id="duration">Duration</InputLabel>
                        <Select
                            labelId="duration"
                            id="duration"
                            value={filter.duration}
                            onChange={onChange}
                            name="duration"
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={'1'}>1</MenuItem>
                            <MenuItem value={'2'}>2</MenuItem>
                            <MenuItem value={'3'}>3</MenuItem>
                            <MenuItem value={'4'}>4</MenuItem>
                            <MenuItem value={'5'}>5</MenuItem>
                            <MenuItem value={'6'}>6</MenuItem>
                            <MenuItem value={'7'}>7</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <Button>Filter</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <InputLabel id="duration">Duration</InputLabel>
                        <Select
                            labelId="duration"
                            id="duration"
                            value={filter.duration}
                            onChange={onChange}
                            name="duration"
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={''}>Unsort</MenuItem>
                            <MenuItem value={'Asc'}>Ascending</MenuItem>
                            <MenuItem value={'Des'}>Descending</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel id="duration">Rating</InputLabel>
                        <Select
                            labelId="duration"
                            id="duration"
                            value={filter.duration}
                            onChange={onChange}
                            name="duration"
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={''}>Unsort</MenuItem>
                            <MenuItem value={'Asc'}>Ascending</MenuItem>
                            <MenuItem value={'Des'}>Descending</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel id="duration">Salary</InputLabel>
                        <Select
                            labelId="duration"
                            id="duration"
                            value={filter.duration}
                            onChange={onChange}
                            name="duration"
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={''}>Unsort</MenuItem>
                            <MenuItem value={'Asc'}>Ascending</MenuItem>
                            <MenuItem value={'Des'}>Descending</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <Button>Sort</Button>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default Dashboard;

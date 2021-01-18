import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signerror, signnoerror } from './LoginSlice';
import api from '../utils/apiCalls';
import MyAlert from './MyAlert';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const Dashboard = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.login.isAuthenticated);
    const error = useSelector(state => state.login.error);
    const [jobs, setJobs] = useState(undefined);
    const [finaljobs, setFinalJobs] = useState(undefined);

    const [filter, setFilter] = useState({
        jobType: '',
        duration: '',
        salary: ''
    });
    const [sorts, setSort] = useState({
        sortDuration: '',
        sortRating: '',
        sortSalary: ''
    });

    const [change, setChange] = useState(false);
    const [search, setSearch] = useState('');
    const [maxSal, setMaxSal] = useState('');
    const [minSal, setMinSal] = useState('');
    const [sop, setSop] = useState('');
    const [url, setUrl] = useState('/api/applicant');
    const [open, setOpen] = useState(false);
    const [id, setId] = useState('');

    const handleClose = () => {
        setOpen(false);
        setSop('');
        setId('');
        dispatch(signnoerror());
    };

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

    const applyJob = async () => {
        try {
            const response = await api.post(`/api/jobs/${id}`, { body: { sop } });
            // const result = response.data.data.data;
            // const jobID = result.job;
            // let jobz = [...jobs];
            // jobz.forEach(job => {
            //     if (job.id === jobID) {
            //         job.applied = 'Applied';
            //     }
            // });
            // setJobs(jobz);
            dispatch(signnoerror());
            setOpen(false);
            setChange(!change);
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    function renderSop(id) {
        setOpen(true);
        setSop('');
        setId(id);
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
                        onClick={() => renderSop(params.getValue('id'))}
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
            width: 150,
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
            width: 150,
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

    const getAllJobs = async () => {
        try {
            const res = await axios.get(url);
            let result = res.data.data.data;
            result.forEach(job => {
                job.id = job._id;
            });
            setJobs(result);
            setFinalJobs(result);
            setSearch('');
            dispatch(signnoerror());
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };
    const history = useHistory();

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getAllJobs();
    }, [loggedIn, url, change]);

    useEffect(() => {
        console.log(search, finaljobs);
        if (finaljobs) {
            // let tempJobs = finaljobs.map(el => {
            //     if (el.title.replace(/\s+/g, '').includes(search)) return el;
            // });
            const tempJobs = finaljobs.filter(el =>
                el.title.replace(/\s+/g, '').includes(search)
            );
            console.log(tempJobs);
            setJobs(tempJobs);
        }
    }, [search]);

    const filterJobs = e => {
        setUrl(
            `/api/applicant?jobType=${filter.jobType}&salary=${filter.salary}&duration=${filter.duration}`
        );
        setSort({
            sortDuration: '',
            sortRating: '',
            sortSalary: ''
        });
    };

    const sortJObs = e => {
        let jobsss = [...jobs];
        jobsss.sort((job1, job2) => {
            if (sorts.sortDuration) {
                if (job1.duration < job2.duration)
                    return sorts.sortDuration === 'Asc' ? -1 : 1;
                if (job1.duration > job2.duration)
                    return sorts.sortDuration === 'Asc' ? 1 : -1;
            }
            if (sorts.sortSalary) {
                if (job1.salary < job2.salary) return sorts.sortSalary === 'Asc' ? -1 : 1;
                if (job1.salary > job2.salary) return sorts.sortSalary === 'Asc' ? 1 : -1;
            }
            if (sorts.sortRating) {
                if (job1.avgRating < job2.avgRating)
                    return sorts.sortRating === 'Asc' ? -1 : 1;
                if (job1.avgRating > job2.avgRating)
                    return sorts.sortRating === 'Asc' ? 1 : -1;
            }
        });
        setJobs(jobsss);
    };

    const onChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const sortsChange = e => {
        setSort({
            ...sorts,
            [e.target.name]: e.target.value
        });
    };

    const sopChange = e => {
        setSop(e.target.value);
    };

    const searchChange = e => {
        setSearch(e.target.value);
    };

    const minSalaryChange = e => {
        setMinSal(e.target.value);
        const minmaxsal = [e.target.value, maxSal].join('-');
        setFilter({
            ...filter,
            salary: minmaxsal
        });
    };

    const maxSalaryChange = (e, newValue) => {
        setMaxSal(e.target.value);
        const minmaxsal = [minSal, e.target.value].join('-');
        setFilter({
            ...filter,
            salary: minmaxsal
        });
    };

    if (!finaljobs) {
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
                <DialogTitle id="form-dialog-title">Enter SOP</DialogTitle>
                {error && <MyAlert />}
                <DialogContent>
                    <TextField
                        id="outlined-textarea"
                        label="Sop"
                        placeholder="Placeholder"
                        multiline
                        variant="outlined"
                        fullWidth
                        name="sop"
                        value={sop}
                        onChange={sopChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={applyJob} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={3} style={{ marginBottom: '15px' }}>
                <Grid item xs={9}>
                    <TextField
                        id="outlined-search"
                        label="Search field"
                        type="search"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={searchChange}
                    />
                </Grid>
            </Grid>

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
                            <MenuItem value={''}>Remove</MenuItem>
                            <MenuItem value={'Full-Time'}>Full Time</MenuItem>
                            <MenuItem value={'Part-Time'}>Part Time</MenuItem>
                            <MenuItem value={'Work-From-Home'}>Work From Home</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            id="standard-basic"
                            label="Min"
                            value={minSal}
                            onChange={minSalaryChange}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            id="standard-basic"
                            label="Max"
                            value={maxSal}
                            onChange={maxSalaryChange}
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
                            <MenuItem value={''}>Remove</MenuItem>
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
                        <Button onClick={filterJobs}>Filter</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <InputLabel id="sortDuration">Sort Duration By:</InputLabel>
                        <Select
                            labelId="sortDuration"
                            id="sortDuration"
                            value={sorts.sortDuration}
                            onChange={sortsChange}
                            name="sortDuration"
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={''}>Unsort</MenuItem>
                            <MenuItem value={'Asc'}>Ascending</MenuItem>
                            <MenuItem value={'Des'}>Descending</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel id="sortSalary">Sort Salary By:</InputLabel>
                        <Select
                            labelId="sortSalary"
                            id="sortSalary"
                            value={sorts.sortSalary}
                            onChange={sortsChange}
                            name="sortSalary"
                            style={{ width: '100%' }}
                        >
                            <MenuItem value={''}>Unsort</MenuItem>
                            <MenuItem value={'Asc'}>Ascending</MenuItem>
                            <MenuItem value={'Des'}>Descending</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel id="sortRating">Sort Rating By:</InputLabel>
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
                        <Button onClick={sortJObs}>Sort</Button>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default Dashboard;

import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signerror, signnoerror } from './LoginSlice';
import api from '../utils/apiCalls';
import MyAlert from './MyAlert';
import Application from './Application';

import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const MyJobs = props => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.login.isAuthenticated);
    const error = useSelector(state => state.login.error);
    const [jobs, setJobs] = useState(undefined);
    const [change, setChange] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [editForm, setEditForm] = useState({
        maxPos: '',
        maxApp: '',
        deadline: ''
    });
    const [addForm, setAddForm] = useState({
        title: '',
        salary: 0,
        deadline: '',
        skill: [],
        type: '',
        duration: 0,
        maxPos: 0,
        maxApp: 0
    });
    const [skill, setSkill] = useState(['']);
    const [id, setId] = useState('');

    const handleClose = () => {
        setOpenEdit(false);
        setEditForm({
            maxPos: '',
            maxApp: '',
            deadline: ''
        });
        setId('');
    };

    const handleAddClose = () => {
        setOpenAdd(false);
        setAddForm({
            title: '',
            salary: 0,
            deadline: '',
            skill: [],
            type: '',
            duration: 0,
            maxPos: 0,
            maxApp: 0
        });
        setSkill(['']);
        dispatch(signnoerror());
    };

    function getDate(params) {
        var localDate = new Date(params.getValue('datePost'));
        return localDate.toDateString();
    }

    const editJob = async () => {
        setOpenEdit(false);
        try {
            const response = await api.patch(`/api/jobs/${id}`, {
                body: editForm
            });
            setChange(!change);
            dispatch(signnoerror());
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    const addJob = async () => {
        console.log(addForm);
        try {
            const response = await api.post(`/api/jobs/`, {
                body: addForm
            });
            setChange(!change);
            dispatch(signnoerror());
            setOpenAdd(false);
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    const deleteJob = async id => {
        try {
            const response = await api.delete(`/api/jobs/${id}`);
            setChange(!change);
            dispatch(signnoerror());
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    function renderEdit(id) {
        setOpenEdit(true);
        setOpenAdd(false);
        setEditForm({
            maxPos: '',
            maxApp: '',
            deadline: ''
        });
        setId(id);
    }

    function addJobRender() {
        setOpenAdd(true);
        setOpenEdit(false);
        setAddForm({
            title: '',
            salary: 0,
            deadline: '',
            skill: [],
            type: '',
            duration: 0,
            maxPos: 0,
            maxApp: 0
        });
        setSkill(['']);
    }

    function editButton(params) {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => renderEdit(params.getValue('id'))}
                    style={{ marginLeft: 16 }}
                >
                    Edit
                </Button>
            </strong>
        );
    }

    function deleteButton(params) {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => deleteJob(params.getValue('id'))}
                    style={{ marginLeft: 16 }}
                >
                    Delete
                </Button>
            </strong>
        );
    }

    function viewButton(params) {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="default"
                    size="small"
                    onClick={() =>
                        props.history.push({
                            pathname: '/app',
                            state: { jobId: params.getValue('id') }
                        })
                    }
                    style={{ marginLeft: 16 }}
                >
                    View
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
            field: 'datePost',
            headerName: 'Date Posted',
            width: 150,
            valueFormatter: getDate,
            sortable: false
        },
        {
            field: 'maxPos',
            headerName: 'Max Positions',
            width: 150,
            sortable: false
        },
        {
            field: 'posLeft',
            headerName: 'Positions Left',
            width: 150,
            sortable: false
        },
        {
            field: 'numApplicants',
            headerName: 'Number Applied',
            width: 150,
            sortable: false
        },
        {
            field: 'edit',
            headerName: 'Edit',
            renderCell: editButton,
            width: 150,
            sortable: false
        },
        {
            field: 'delete',
            headerName: 'Delete',
            renderCell: deleteButton,
            width: 150,
            sortable: false
        },
        {
            field: 'view',
            headerName: 'View Applications',
            renderCell: viewButton,
            width: 150,
            sortable: false
        }
    ];

    const getMyJobs = async () => {
        try {
            const res = await axios.get('api/recruiter/');
            let result = res.data.data.data;
            result.forEach(a => {
                a.id = a._id;
            });
            setJobs(result);
            dispatch(signnoerror());
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    const editFormChange = e => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const addFormChange = e => {
        setAddForm({
            ...addForm,
            [e.target.name]: e.target.value
        });
    };

    const addSkillField = () => {
        setSkill([...skill, '']);
    };

    const removeSkillField = index => {
        let skills = [...skill];
        skills.splice(index, 1);
        setSkill(skills);
        setAddForm({
            ...addForm,
            skill: skills
        });
    };

    const skillChange = (index, event) => {
        const skills = [...skill];
        skills[index] = event.target.value;
        setSkill(skills);
        setAddForm({
            ...addForm,
            skill: skills
        });
    };

    const checkChange = event => {
        const skills = [...skill];
        if (event.target.checked) {
            skills.push(event.target.name);
        } else {
            const index = skill.indexOf(event.target.name);
            skills.splice(index, 1);
        }
        setSkill(skills);
        setAddForm({
            ...addForm,
            skill: skills
        });
    };

    const history = useHistory();

    const checkSkill = ['C', 'Python', 'Java'];

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getMyJobs();
    }, [loggedIn, change]);

    if (!jobs) {
        return <h1>loading</h1>;
    }

    return (
        <>
            {error && <MyAlert />}
            <Dialog
                open={openAdd}
                onClose={handleAddClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">ADD JOB</DialogTitle>
                {error && <MyAlert />}
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <TextField
                                id="standard-basic"
                                label="Title"
                                name="title"
                                value={addForm.title}
                                onChange={addFormChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="standard-basic"
                                label="Salary"
                                name="salary"
                                value={addForm.salary}
                                onChange={addFormChange}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                id="standard-basic"
                                label="Deadline YYYY-MM-DD"
                                name="deadline"
                                value={addForm.deadline}
                                onChange={addFormChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <TextField
                                id="standard-basic"
                                label="Max Positions"
                                name="maxPos"
                                value={addForm.maxPos}
                                onChange={addFormChange}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="standard-basic"
                                label="Max Applications"
                                name="maxApp"
                                value={addForm.maxApp}
                                onChange={addFormChange}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <InputLabel id="duration">Duration</InputLabel>
                            <Select
                                labelId="Duration"
                                id="duration"
                                value={addForm.duration}
                                onChange={addFormChange}
                                name="duration"
                                style={{ width: '100%' }}
                            >
                                <MenuItem value={'0'}>0</MenuItem>
                                <MenuItem value={'1'}>1</MenuItem>
                                <MenuItem value={'2'}>2</MenuItem>
                                <MenuItem value={'3'}>3</MenuItem>
                                <MenuItem value={'4'}>4</MenuItem>
                                <MenuItem value={'5'}>5</MenuItem>
                                <MenuItem value={'6'}>6</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <InputLabel id="jobType">Job Type</InputLabel>
                            <Select
                                labelId="Type"
                                id="type"
                                value={addForm.type}
                                onChange={addFormChange}
                                name="type"
                                style={{ width: '100%' }}
                            >
                                <MenuItem value={'Full-Time'}>Full Time</MenuItem>
                                <MenuItem value={'Part-Time'}>Part Time</MenuItem>
                                <MenuItem value={'Work-From-Home'}>
                                    Work From Home
                                </MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                    <div style={{ marginTop: '20px' }}>
                        <InputLabel id="skills">Skills</InputLabel>
                    </div>
                    {checkSkill.map(e => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={skill.includes(e)}
                                    onChange={event => checkChange(event)}
                                    name={e}
                                />
                            }
                            label={e}
                        />
                    ))}
                    {skill.map((e, index) => (
                        <div key={index}>
                            <TextField
                                name="skill"
                                label="Skill"
                                value={e}
                                onChange={event => skillChange(index, event)}
                            />
                            <IconButton
                                disabled={skill.length === 1}
                                onClick={() => removeSkillField(index)}
                            >
                                <RemoveIcon />
                            </IconButton>
                        </div>
                    ))}
                    <IconButton onClick={addSkillField}>
                        <AddIcon />
                    </IconButton>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addJob} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openEdit}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">EDIT</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <TextField
                                id="standard-basic"
                                label="Max Applicants"
                                name="maxApp"
                                value={editForm.maxApp}
                                onChange={editFormChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="standard-basic"
                                label="Max Positions"
                                name="maxPos"
                                value={editForm.maxPos}
                                onChange={editFormChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="standard-basic"
                                label="Deadline YYYY-MM-DD"
                                name="deadline"
                                value={editForm.deadline}
                                onChange={editFormChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={editJob} color="primary">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
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
            <Button
                style={{ marginTop: '30px', width: '100%', height: '50px' }}
                variant="outlined"
                color="primary"
                onClick={() => addJobRender()}
            >
                Add Job
            </Button>
        </>
    );
};

export default MyJobs;

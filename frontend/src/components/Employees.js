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
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const Employees = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.login.isAuthenticated);
    const error = useSelector(state => state.login.error);
    const [emp, setEmp] = useState(undefined);

    const [rate, setRate] = useState('');
    const [open, setOpen] = useState(false);
    const [id, setId] = useState('');
    const [hasrate, setHasRate] = useState(false);
    const [sorts, setSort] = useState({
        sortName: '',
        sortRating: '',
        sortTitle: '',
        sortDate: ''
    });

    const handleClose = () => {
        setOpen(false);
        setRate('');
        setId('');
    };

    function getName(params) {
        return params.getValue('applicant').name;
    }

    function getTitle(params) {
        return params.getValue('job').title;
    }

    function getType(params) {
        return params.getValue('job').type;
    }

    function getRating(params) {
        return params.getValue('applicant').avgRating;
    }

    function getDate(params) {
        var localDate = new Date(params.getValue('dateAcc'));
        return localDate.toDateString();
    }

    const rateEmp = async () => {
        setOpen(false);
        try {
            const response = await api.post(`/api/ratings/applicant/${id}`, {
                body: { value: rate }
            });
            setHasRate(!hasrate);
            setSort({
                sortName: '',
                sortRating: '',
                sortTitle: '',
                sortDate: ''
            });
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
        var appEle = emp.filter(el => {
            return el.id === id;
        });
        setId(appEle[0].applicant._id);
    }

    function rateButton(params) {
        const hasRated = params.getValue('hasRated');
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

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
            valueGetter: getName,
            sortable: false
        },
        {
            field: 'dateAcc',
            headerName: 'Date of Joining',
            width: 180,
            valueFormatter: getDate,
            sortable: false
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 250,
            valueGetter: getTitle,
            sortable: false
        },
        {
            field: 'type',
            headerName: 'Job Type',
            valueGetter: getType,
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

    const getMyEmp = async () => {
        try {
            const res = await axios.get('api/recruiter/emp');
            let result = res.data.data.data;
            result.forEach(a => {
                a.id = a._id;
            });
            setEmp(result);
            dispatch(signnoerror());
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    const sortEmp = e => {
        let empss = [...emp];
        empss.sort((emp1, emp2) => {
            if (sorts.sortName) {
                if (emp1.applicant.name < emp2.applicant.name)
                    return sorts.sortName === 'Asc' ? -1 : 1;
                if (emp1.applicant.name > emp2.applicant.name)
                    return sorts.sortName === 'Asc' ? 1 : -1;
            }

            if (sorts.sortTitle) {
                if (emp1.job.title < emp2.job.title)
                    return sorts.sortTitle === 'Asc' ? -1 : 1;
                if (emp1.job.title > emp2.job.title)
                    return sorts.sortTitle === 'Asc' ? 1 : -1;
            }

            if (sorts.sortRating) {
                if (emp1.applicant.avgRating < emp2.applicant.avgRating)
                    return sorts.sortRating === 'Asc' ? -1 : 1;
                if (emp1.applicant.avgRating > emp2.applicant.avgRating)
                    return sorts.sortRating === 'Asc' ? 1 : -1;
            }

            if (sorts.sortDate) {
                if (emp1.date < emp2.date) return sorts.sortDate === 'Asc' ? -1 : 1;
                if (emp1.date > emp2.date) return sorts.sortDate === 'Asc' ? 1 : -1;
            }
        });
        setEmp(empss);
    };

    const rateChange = e => {
        setRate(e.target.value);
    };

    const sortsChange = e => {
        setSort({
            ...sorts,
            [e.target.name]: e.target.value
        });
    };

    const history = useHistory();

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getMyEmp();
    }, [loggedIn, hasrate]);

    if (!emp) {
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
            </Dialog>
            <Grid container spacing={5} style={{ marginTop: '20px' }}>
                <Grid item xs={2}>
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
                <Grid item xs={2}>
                    <InputLabel id="sortTitle">Sort Title:</InputLabel>
                    <Select
                        labelId="sortTitle"
                        id="sortTitle"
                        value={sorts.sortTitle}
                        onChange={sortsChange}
                        name="sortTitle"
                        style={{ width: '100%' }}
                    >
                        <MenuItem value={''}>Unsort</MenuItem>
                        <MenuItem value={'Asc'}>Ascending</MenuItem>
                        <MenuItem value={'Des'}>Descending</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={2}>
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
                    <InputLabel id="sortDate">Sort Date of Joining:</InputLabel>
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
                    <Button onClick={sortEmp}>Sort</Button>
                </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%', marginTop: '30px' }}>
                <DataGrid
                    rows={emp ? emp : []}
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

export default Employees;

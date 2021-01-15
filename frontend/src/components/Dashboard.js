import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/apiCalls';

import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
    {
        field: 'title',
        headerName: 'Title'
    },
    {
        field: 'recuiter',
        headerName: 'Recruiter Name'
    },
    {
        field: 'salary',
        headerName: 'Salary'
    },
    {
        field: 'duration',
        headerName: 'Duration'
    },
    {
        field: 'date',
        headerName: 'Deadline to Apply'
    },
    {
        field: 'avgRating',
        headerName: 'rating'
    },
    {
        renderCell: params => (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                >
                    {params.status}
                </Button>
            </strong>
        )
    }
];

const Dashboard = () => {
    const loggedIn = useSelector(state => state.login.isAuthenticated);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllJobs = async () => {
        setLoading(true);
        const res = await axios.get(`/api/applicant`);
        console.log(res);
        setJobs(res.data.data.data);
        setLoading(false);
    };
    const history = useHistory();

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getAllJobs();
    }, [loggedIn]);

    // if (!loggedIn) return <Redirect to="/login" />;

    console.log(jobs);
    if (loading) {
        return <h1>loading</h1>;
    }
    // const jobs = [];
    return (
        <div style={{ height: 300, width: '100%' }}>
            {/* <DataGrid rows={jobs ? jobs : []} columns={columns} /> */}
            {JSON.stringify(jobs)}
        </div>
    );
};

export default Dashboard;

import { React, useState } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
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
    // let response;
    // axios.get(`/api/applicant`).then(res => {
    //     response = res.data.data;
    //     const rows = response.data;
    //     return (
    //         <div style={{ height: 300, width: '100%' }}>
    //             <DataGrid rows={rows} columns={columns} />
    //         </div>
    //     );
    // });
    // console.log(response);
    const loggedIn = useSelector(state => state.isAuthenticated);
    if (!loggedIn) return <Redirect to="/login" />;
    const rows = [];
    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
};

export default Dashboard;

import { React, useState, useEffect } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin, signout, signerror, signnoerror } from './LoginSlice';
import api from '../utils/apiCalls';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MyAlert from './MyAlert';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%'
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '100%'
    },
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

const Profile = () => {
    const dispatch = useDispatch();

    const loggedIn = useSelector(state => state.login.isAuthenticated);

    const role = useSelector(state => state.login.role);
    const error = useSelector(state => state.login.error);

    const [loading, setLoading] = useState(false);
    const [upd, setUpd] = useState(false);

    const update = async formData => {
        try {
            const response = await api.patch('/api/users/update', {
                body: formData
            });
            const result = response.data;
            dispatch(signnoerror());
            setUpd(!upd);
        } catch (err) {
            setUpd(!upd);
            const message = err.response.data.errors[0].msg;
            // dispatch(signout());
            dispatch(signerror({ message }));
            console.error(err);
        }
    };

    const classes = useStyles();

    const [formData, setFormData] = useState({
        role: '',
        email: '',
        password: '',
        name: '',
        bio: '',
        education: [],
        skill: [],
        contact: ''
    });

    const [edu, setEdu] = useState([{ institute: '', startYear: '', endYear: '' }]);
    const [skill, setSkill] = useState(['']);

    const getMe = async () => {
        setLoading(true);
        const res = await axios.get(`/api/users/`);
        // console.log(res);
        const result = res.data.data.data;
        // console.log(result);
        setFormData(result);
        setEdu(result.education);
        setSkill(result.skill);
        setLoading(false);
    };
    const history = useHistory();

    useEffect(() => {
        if (!loggedIn) history.push('/login');
        else getMe();
    }, [loggedIn, upd]);

    // if (!loggedIn) return <Redirect to="/login" />;

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addEduField = () => {
        setEdu([...edu, { institute: '', startYear: '', endYear: '' }]);
    };

    const removeEduField = index => {
        const education = [...edu];
        education.splice(index, 1);
        setEdu(education);
        setFormData({
            ...formData,
            education: education
        });
    };

    const addSkillField = () => {
        setSkill([...skill, '']);
    };

    const removeSkillField = index => {
        let skills = [...skill];
        skills.splice(index, 1);
        setSkill(skills);
        setFormData({
            ...formData,
            skill: skills
        });
    };

    const skillChange = (index, event) => {
        const skills = [...skill];
        skills[index] = event.target.value;
        setSkill(skills);
        setFormData({
            ...formData,
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
        setFormData({
            ...formData,
            skill: skills
        });
    };

    const educationChange = (index, event) => {
        const education = [...edu];
        education[index][event.target.name] = event.target.value;
        setEdu(education);
        setFormData({
            ...formData,
            education: education
        });
    };

    const checkSkill = ['C', 'Python', 'Java'];

    const onSubmit = e => {
        e.preventDefault();
        // console.log(formData);
        update(formData);
    };
    if (loading) {
        return <h1>loading</h1>;
    }

    return (
        <Container component="main" maxWidth="xs">
            {error && <MyAlert />}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <PersonIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Profile
                </Typography>
                <form onSubmit={onSubmit} className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        value={formData.name}
                        autoComplete="name"
                        onChange={onChange}
                        autoFocus
                    />
                    <TextField
                        disabled
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
                        disabled
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
                    {role === 'Applicant' && (
                        <Typography component="h1" variant="h6">
                            Education
                        </Typography>
                    )}
                    {role === 'Applicant' &&
                        edu.map((e, index) => (
                            <div key={index}>
                                <TextField
                                    name="institute"
                                    label="Institute"
                                    value={e.institute}
                                    onChange={event => educationChange(index, event)}
                                />
                                <TextField
                                    name="startYear"
                                    label="Start Year"
                                    value={e.startYear}
                                    onChange={event => educationChange(index, event)}
                                />
                                <TextField
                                    name="endYear"
                                    label="End Year"
                                    value={e.endYear}
                                    onChange={event => educationChange(index, event)}
                                />
                                <IconButton
                                    disabled={edu.length === 1}
                                    onClick={() => removeEduField(index)}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </div>
                        ))}
                    {role === 'Applicant' && (
                        <IconButton onClick={addEduField}>
                            <AddIcon />
                        </IconButton>
                    )}
                    {role === 'Applicant' && (
                        <Typography component="h1" variant="h6">
                            Skills
                        </Typography>
                    )}
                    {role === 'Applicant' &&
                        checkSkill.map(e => (
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
                    {role === 'Applicant' &&
                        skill.map((e, index) => (
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
                    {role === 'Applicant' && (
                        <IconButton onClick={addSkillField}>
                            <AddIcon />
                        </IconButton>
                    )}
                    {role === 'Recruiter' && (
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="bio"
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            autoComplete="bio"
                            onChange={onChange}
                            autoFocus
                        />
                    )}
                    {role === 'Recruiter' && (
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="contact"
                            label="Contact"
                            type="number"
                            id="contact"
                            value={formData.contact}
                            onChange={onChange}
                        />
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Update
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default Profile;

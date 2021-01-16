import { React, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin, signout, signerror } from './LoginSlice';
import api from '../utils/apiCalls';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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

const Register = () => {
    const dispatch = useDispatch();
    const register = async formData => {
        try {
            const response = await api.post('/api/users/signup', {
                body: formData
            });
            const result = response.data;
            dispatch(signin({ token: result.token, role: result.role }));
        } catch (err) {
            const message = err.response.data.errors[0].msg;
            dispatch(signout());
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

    const loggedIn = useSelector(state => state.login.isAuthenticated);

    const role = useSelector(state => state.login.role);
    const error = useSelector(state => state.login.error);

    if (loggedIn) return <Redirect to="/dashboard" />;

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
        console.log(formData);
        register(formData);
    };

    return (
        <Container component="main" maxWidth="xs">
            {error && <MyAlert />}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <form onSubmit={onSubmit} className={classes.form} noValidate>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="role">Role</InputLabel>
                        <Select
                            labelId="Role"
                            id="role"
                            value={formData.role}
                            onChange={onChange}
                            name="role"
                        >
                            <MenuItem value={'Applicant'}>Applicant</MenuItem>
                            <MenuItem value={'Recruiter'}>Recruiter</MenuItem>
                        </Select>
                    </FormControl>
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
                    {formData.role === 'Applicant' &&
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
                    {formData.role === 'Applicant' && (
                        <IconButton onClick={addEduField}>
                            <AddIcon />
                        </IconButton>
                    )}
                    {formData.role === 'Applicant' &&
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
                    {formData.role === 'Applicant' &&
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
                    {formData.role === 'Applicant' && (
                        <IconButton onClick={addSkillField}>
                            <AddIcon />
                        </IconButton>
                    )}
                    {formData.role === 'Recruiter' && (
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
                    {formData.role === 'Recruiter' && (
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
                        Register
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="/login" variant="body2">
                                {'Already have an account? Login Now'}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default Register;

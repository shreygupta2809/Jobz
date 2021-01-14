// import React from 'react';
// // import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, makeStyles, Link } from '@material-ui/core';

// const useStyles = makeStyles({
//     header: {
//         backgroundColor: 'blue',
//         color: 'white',
//         opacity: 0.9
//     }
// });

// const linkStyle = {
//     fontSize: '20px',
//     cursor: 'pointer',
//     marginRight: '15px',
//     textDecoration: 'none'
// };

// function Navbar() {
//     const classes = useStyles();

//     let links = [];
//     const loggedIn = 1;
//     const role = 'Applicant';
//     if (!loggedIn) {
//         links = [
//             { title: 'Login', to: '/login' },
//             { title: 'Register', to: '/register' }
//         ];
//     } else {
//         if (role === 'Applicant') {
//             links = [
//                 { title: 'Jobs', to: '/' },
//                 { title: 'My Applications', to: '/' },
//                 { title: 'Profile', to: '/' }
//             ];
//         }
//         if (role === 'Recruiter') {
//             links = [
//                 { title: 'My Jobs', to: '/' },
//                 { title: 'My Employees', to: '/' },
//                 { title: 'Profile', to: '/' }
//             ];
//         }
//         links.push({ title: 'Logout', to: '/' });
//     }

//     return (
//         <div>
//             <AppBar position="static" className={classes.header}>
//                 <Toolbar>
//                     {links.map(link => (
//                         <Link href={link.to} color="inherit" style={linkStyle}>
//                             {link.title}
//                         </Link>
//                     ))}
//                 </Toolbar>
//             </AppBar>
//         </div>
//     );
// }

// export default Navbar;

import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import WorkIcon from '@material-ui/icons/Work';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import DescriptionIcon from '@material-ui/icons/Description';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }
}));

const Navbar = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    let links = [];
    const loggedIn = 1;
    const role = 'Applicant';

    if (!loggedIn) {
        links = [
            { title: 'Login', to: '/login', icon: <LockOpenIcon /> },
            { title: 'Register', to: '/register', icon: <PersonAddIcon /> }
        ];
    } else {
        if (role === 'Applicant') {
            links = [
                { title: 'Jobs', to: '/', icon: <DashboardIcon /> },
                { title: 'My Applications', to: '/', icon: <DescriptionIcon /> },
                { title: 'Profile', to: '/', icon: <PersonIcon /> }
            ];
        }
        if (role === 'Recruiter') {
            links = [
                { title: 'My Jobs', to: '/', icon: <WorkIcon /> },
                { title: 'My Employees', to: '/', icon: <GroupIcon /> },
                { title: 'Profile', to: '/', icon: <PersonIcon /> }
            ];
        }
        links.push({ title: 'Logout', to: '/', icon: <LockIcon /> });
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Jobz
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {links.map(link => (
                        <ListItem button key={link.title}>
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText primary={link.title} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Typography paragraph>Body</Typography>
            </main>
        </div>
    );
}

export default Navbar;

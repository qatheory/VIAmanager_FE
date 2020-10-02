import React from 'react';
import clsx from 'clsx';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import {
    toggleDrawer,
    selectDrawerStatus
} from 'store/reducers/viewSettings'
import InsertChartIcon from '@material-ui/icons/InsertChart';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import PeopleIcon from '@material-ui/icons/People';
import BuildIcon from '@material-ui/icons/Build';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({

    userNameText: {
        "font-size": "24px",
        "font-weight": 600,
        color: "rgba(0,0,0,0.55)",
    },

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 2),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        // justifyContent: 'flex-end',
    },
}))
let navigatePath = {
    main:
        [
            {
                text: "Thống kê",
                path: "overview",
                icon: "InsertChartIcon"
            },
            {
                text: "Quản lý",
                path: "manage",
                icon: "BuildIcon"
            },
            {
                text: "Người dùng",
                path: "users",
                icon: "PeopleIcon"

            }]
    ,
    personal:
        [
            {
                text: "Hồ sơ",
                path: "user",
                icon: "AccountCircleIcon"
            }
        ]
}

function getIcon(icon) {
    switch (icon) {
        case 'InsertChartIcon':
            return (<InsertChartIcon />);
        case 'BuildIcon':
            return (<BuildIcon />);
        case 'PeopleIcon':
            return (<PeopleIcon />);
        case "AccountCircleIcon":
            return (<AccountCircleIcon />);
        default:
            return (<SentimentVeryDissatisfiedIcon />)
    }
}

// const [open, setOpen] = React.useState(false);

function MyDrawer() {
    const drawerStatus = useSelector(selectDrawerStatus)
    const classes = useStyles();
    return (

        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={drawerStatus}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <div>
                    <div className={classes.userNameText}>Admin</div>
                    <div>admin@admin.com</div>
                </div>
            </div>
            <Divider />

            <List>
                {navigatePath.main.map((path, index) => (
                    <ListItem component={Link} to={`/${path.path}`} button key={index}>
                        <ListItemIcon>{getIcon(path.icon)}</ListItemIcon>
                        <ListItemText >{path.text} </ListItemText>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {navigatePath.personal.map((path, index) => (
                    <ListItem component={Link} to={`/${path.path}`} button key={index}>
                        <ListItemIcon >{getIcon(path.icon)}</ListItemIcon>
                        <ListItemText primary={path.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default MyDrawer;
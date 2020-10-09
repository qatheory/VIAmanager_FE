
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { setLoggedIn, setUsername } from "store/reducers/viewSettings";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import Constants from "_helpers/constants.js"
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();
    const dispatch = useDispatch()
    let [formUsername, setFormUsername] = React.useState("")
    let [formPassword, setFormPassword] = React.useState("")
    let [remember, setRemember] = React.useState(false)
    const handleChangeUsername = (event) => {
        setFormUsername(event.target.value)
    }
    const handleChangePassword = (event) => {
        setFormPassword(event.target.value)
    }
    const handleChangeRemember = (event) => {
        setRemember(event.target.value)
    }
    const handleLogin = (event) => {
        event.preventDefault();

        let url = `${Constants.API_DOMAIN}token-auth/`
        console.log(url)
        let userInfo = { username: formUsername, password: formPassword }
        axios({
            url: `${Constants.API_DOMAIN}token-auth/`,
            method: 'POST',
            data: userInfo
        })
            .then(res => {
                if (res.data.token) {
                    if (remember) {
                        localStorage.setItem('token', res.data.token)
                    } else {
                        sessionStorage.setItem('token', res.data.token)
                    }

                    dispatch(setLoggedIn())
                    dispatch(setUsername(res.data.user.username))
                    props.history.push('/admin/manage-via');
                }
            })
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Đăng nhập
        </Typography>
                <form className={classes.form} onSubmit={handleLogin} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tài khoản"
                        name="username"
                        autoComplete="username"
                        value={formUsername} onChange={handleChangeUsername}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        value={formPassword} onChange={handleChangePassword}
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        value={remember} onChange={handleChangeRemember}
                        className={classes.submit}
                    >
                        Đăng nhập
                    </Button>
                    {/* <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
              </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid> */}
                </form>
            </div>
        </Container>
    );
}


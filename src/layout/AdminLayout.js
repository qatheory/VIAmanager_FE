import React from "react";
import { Route, Switch } from "react-router-dom";
import clsx from "clsx";
import Home from "pages/Home";
import ManageVIA from "pages/manage/manageVIA/manageVIA";
import CreateVIA from "pages/manage/createVIA/createVIA";
import ManageBM from "pages/manage/manageBM/manageBM";
import AdsAccounts from "pages/adsAccounts/adsAccounts";
import { useSelector } from "react-redux";
import { selectDrawerStatus } from "store/reducers/viewSettings";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import "./AdminLayout.css";
import {
  CssBaseline,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Container,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MailIcon from "@material-ui/icons/Mail";
import RouterURL from "../routerURL/RouterURL";
import { BrowserRouter as Router } from "react-router-dom";
import DrawerCustom from "./components/drawer";
import AppBarCustom from "./components/appBar";
import manageWorkspace from "../pages/manageWorkspace/manageWorkspace";
const drawerWidth = 300;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: "#f44336",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing(3, 0),
    // "margin-top": "64px",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    //marginLeft: -drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2, 2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: 'flex-end',
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    // padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

function AdminLayout(props) {
  const classes = useStyles();

  const drawerStatus = useSelector(selectDrawerStatus);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBarCustom
          openMenu={handleProfileMenuOpen}
          openMobileMenu={handleMobileMenuOpen}
        />
        {renderMobileMenu}
        {renderMenu}
        <DrawerCustom />
        <Container>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route exact path="/admin" component={Home} />
              <Route exact path="/admin/manage-via" component={ManageVIA} />
              <Route exact path="/admin/manage-bm" component={ManageBM} />
              <Route exact path="/admin/ads-accounts" component={AdsAccounts} />
              <Route exact path="/admin/manage-workspace" component={manageWorkspace} />
              <Route
                exact
                path="/admin/manage-via/create"
                component={CreateVIA}
              />
            </Switch>
          </main>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default AdminLayout;

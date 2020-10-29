import React from "react";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { toggleDrawer, selectDrawerStatus } from "store/reducers/viewSettings";
import { fade, makeStyles } from "@material-ui/core/styles";
import "../AdminLayout.css";
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	InputBase,
	Badge,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/More";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexGrow: 1,
	},
	grow: {
		flexGrow: 1,
	},
	title: {
		// display: "none",
		// [theme.breakpoints.up("sm")]: {
		display: "block",
		// },
	},
	title_thin: {
		"font-weight": "lighter",
	},
	title_bold: {
		"font-size": "28px",
		"font-weight": "bolder",
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
		},
	},
	sectionMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	appBar: {
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(["margin", "width"], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: "none",
	},
	floatRight: {
		"margin-left": "auto",
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
}));

function AppBarCustom(props) {
	const classes = useStyles();
	const drawerStatus = useSelector(selectDrawerStatus);
	const dispatch = useDispatch();
	const handleDrawer = () => {
		dispatch(toggleDrawer());
	};

	const handleProfileMenuOpen = (event) => {
		props.openMenu(event);
	};

	const handleMobileMenuOpen = (event) => {
		props.openMobileMenu(event);
	};
	const menuId = "primary-search-account-menu";

	const mobileMenuId = "primary-search-account-menu-mobile";

	return (
		<AppBar
			position="fixed"
			className={clsx(classes.appBar, {
				[classes.appBarShift]: drawerStatus,
			})}
		>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawer}
					edge="start"
					className={clsx(classes.menuButton)}
				>
					{drawerStatus ? <ChevronLeftIcon /> : <MenuIcon />}
				</IconButton>
				<Typography
					className={clsx(classes.title_bold, classes.title)}
					noWrap
				>
					{`VIA`}
				</Typography>
				<Typography
					className={clsx(classes.title_thin, classes.title)}
					variant="h6"
					noWrap
				>
					MANAGE
				</Typography>
				{/* <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </div> */}
				<div className={classes.grow} />
				<div className={classes.sectionDesktop}>
					{/* <IconButton aria-label="show 4 new mails" color="inherit">
						<Badge badgeContent={4} color="secondary">
							<MailIcon />
						</Badge>
					</IconButton>
					<IconButton
						aria-label="show 17 new notifications"
						color="inherit"
					>
						<Badge badgeContent={17} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton>
					<IconButton
						edge="end"
						aria-label="account of current user"
						aria-controls={menuId}
						aria-haspopup="true"
						onClick={handleProfileMenuOpen}
						color="inherit"
					>
						<AccountCircleIcon />
					</IconButton>
				</div>
				<div className={classes.sectionMobile}>
					<IconButton
						aria-label="show more"
						aria-controls={mobileMenuId}
						aria-haspopup="true"
						onClick={handleMobileMenuOpen}
						color="inherit"
					>
						<MoreIcon />
					</IconButton> */}
				</div>
			</Toolbar>
		</AppBar>
	);
}

export default AppBarCustom;

import React, { useEffect } from "react";
// import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import {
	Drawer,
	Divider,
	List,
	ListItem,
	ListItemText,
	Collapse,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import {
	closeDrawer,
	selectDrawerStatus,
	setLoggedOut,
	selectUsername,
} from "store/reducers/viewSettings";

import InsertChartIcon from "@material-ui/icons/InsertChart";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import PeopleIcon from "@material-ui/icons/People";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import { Link } from "react-router-dom";
const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
	userNameText: {
		"font-size": "24px",
		"font-weight": 600,
		color: "rgba(0,0,0,0.55)",
	},
	workspaceSelect: {
		width: "100%",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(2, 2),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		// justifyContent: 'flex-end',
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));
let navigatePath = {
	main: [
		// {
		//   text: "Thống kê",
		//   path: "/admin/overview",
		//   icon: "InsertChartIcon",
		// },
		{
			text: "Tài khoản Ads",
			path: "/admin/ads-accounts",
			icon: "LocalActivityIcon",
		},
		{
			text: "Quản lý Via",
			path: "/admin/manage-via",
			icon: "AccountBoxIcon",
		},
		{
			text: "Quản lý BM",
			path: "/admin/manage-bm",
			icon: "BusinessCenterIcon",
		},
	],
	personal: [
		// {
		//   text: "Hồ sơ",
		//   path: "/admin/profile",
		//   icon: "AccountCircleIcon",
		// },
		{
			text: "Nhân sự",
			path: "/admin/users",
			icon: "PeopleAltIcon",
		},
	],
};

function getIcon(icon) {
	switch (icon) {
		case "InsertChartIcon":
			return <InsertChartIcon />;
		case "AccountBoxIcon":
			return <AccountBoxIcon />;
		case "PeopleIcon":
			return <PeopleIcon />;
		case "AccountCircleIcon":
			return <AccountCircleIcon />;
		case "LocalActivityIcon":
			return <LocalActivityIcon />;
		case "PeopleAltIcon":
			return <PeopleAltIcon />;
		case "BusinessCenterIcon":
			return <BusinessCenterIcon />;
		default:
			return <SentimentVeryDissatisfiedIcon />;
	}
}
class DrawerState {
	constructor(path, val) {
		this.child = { manage: false, overview: false };
		this.set(path, val);
	}
	get(path) {
		return this.child[path];
	}
	set(path, val) {
		this.child[path] = val;
	}
}
// const [open, setOpen] = React.useState(false);

function DrawerCustom() {
	let drawerStatus = useSelector(selectDrawerStatus);
	let username = useSelector(selectUsername);

	const classes = useStyles();
	let [manageChildPath, setManageChildPath] = React.useState(
		new DrawerState()
	);
	const dispatch = useDispatch();
	const updateDrawerState = (childPath, val) => {
		setManageChildPath(new DrawerState(childPath, val));
	};
	const handleDrawerClose = () => {
		if (drawerStatus === true) {
			dispatch(closeDrawer());
		}
	};
	const handleLogout = () => {
		localStorage.removeItem("token");
		sessionStorage.removeItem("token");
		dispatch(setLoggedOut());
	};
	return (
		<Drawer
			className={classes.drawer}
			variant="temporary"
			anchor="left"
			onEscapeKeyDown={handleDrawerClose}
			onBackdropClick={handleDrawerClose}
			open={drawerStatus}
			classes={{
				paper: classes.drawerPaper,
			}}
		>
			<div className={classes.drawerHeader}>
				<div>
					<div className={classes.userNameText}>{username}</div>
					<div>admin@admin.com</div>
				</div>
			</div>
			<Divider />

			<List>
				{navigatePath.main.map((path, index) => {
					if (path.childPath) {
						return (
							<React.Fragment>
								<ListItem
									button
									onClick={() =>
										updateDrawerState(
											path.path,
											!manageChildPath.get(path.path)
										)
									}
									key={index}
								>
									<ListItemIcon>
										{getIcon(path.icon)}
									</ListItemIcon>
									<ListItemText>{path.text} </ListItemText>
									{manageChildPath.get(path.path) ? (
										<ExpandLess />
									) : (
										<ExpandMore />
									)}
								</ListItem>
								<Collapse
									in={manageChildPath.get(path.path)}
									timeout="auto"
									unmountOnExit
								>
									<List component="div" disablePadding>
										{path.childPath.map(
											(child, childIndex) => {
												return (
													<ListItem
														component={Link}
														to={`${child.path}`}
														button
														key={`manage${childIndex}`}
														className={
															classes.nested
														}
													>
														<ListItemIcon>
															{getIcon(
																child.icon
															)}
														</ListItemIcon>
														<ListItemText
															primary={child.text}
														/>
													</ListItem>
												);
											}
										)}
									</List>
								</Collapse>
							</React.Fragment>
						);
					}
					return (
						<ListItem
							component={Link}
							to={`${path.path}`}
							button
							key={index}
						>
							<ListItemIcon>{getIcon(path.icon)}</ListItemIcon>
							<ListItemText>{path.text} </ListItemText>
						</ListItem>
					);
				})}
			</List>
			<Divider />
			<List>
				{navigatePath.personal.map((path, index) => (
					<ListItem
						component={Link}
						to={`${path.path}`}
						button
						key={index}
					>
						<ListItemIcon>{getIcon(path.icon)}</ListItemIcon>
						<ListItemText primary={path.text} />
					</ListItem>
				))}
				<ListItem button onClick={() => handleLogout()} key={"logout"}>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Đăng xuất" />
				</ListItem>
			</List>
		</Drawer>
	);
}

export default DrawerCustom;

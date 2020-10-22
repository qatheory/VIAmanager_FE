import React from "react";
import clsx from "clsx";
import { makeStyles, fade } from "@material-ui/core/styles";
import { Button, InputBase, Grid } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RefreshIcon from "@material-ui/icons/Refresh";
import SearchIcon from "@material-ui/icons/Search";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	card__header__item: {
		margin: theme.spacing(1, 1),
	},
	full__width: {
		[theme.breakpoints.down("sm")]: {
			//   marginLeft: theme.spacing(3),
			width: "100%",
		},
	},
	auto_float_right: {
		[theme.breakpoints.down("sm")]: {
			"margin-left": "auto",
			width: "229px",
		},
	},
	floatLeft: {
		"margin-right": "auto",
	},
	floatRight: {
		"margin-left": "auto",
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
			width: "100%",
		},
	},
	search: {
		position: "relative",
		borderRadius: 8,
		borderColor: "#bdbdbd",
		border: 2,
		borderStyle: "solid",
		backgroundColor: fade("#ffffff", 0.15),
		"&:hover": {
			backgroundColor: fade("#e0e0e0", 0.15),
		},
		// marginRight: theme.spacing(0),
		marginLeft: 0,
		width: "100%",
		// [theme.breakpoints.up("md")]: {
		//   //   marginLeft: theme.spacing(3),
		//   width: "60%",
		// },
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
}));
function BmHeader(props) {
	const classes = useStyles();
	return (
		<Grid container spacing={0}>
			<Grid container justify="flex-start" item xs={12} md={8}>
				<div
					className={clsx(
						classes.card__header__item,
						classes.full__width
					)}
				>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Tìm BM..."
							classes={{
								input: classes.inputInput,
								root: classes.inputRoot,
							}}
							inputProps={{ "aria-label": "search" }}
						/>
					</div>
				</div>
				<Button
					variant="outlined"
					color="primary"
					className={clsx(
						classes.card__header__item,
						classes.auto_float_right
					)}
					endIcon={<ListAltIcon></ListAltIcon>}
				>
					Tìm kiếm nâng cao
				</Button>
			</Grid>
			<Grid container justify="flex-end" item md={4}>
				<Button
					variant="outlined"
					color="primary"
					className={clsx(
						classes.card__header__item,
						classes.floatRight
					)}
					endIcon={<RefreshIcon></RefreshIcon>}
				>
					Làm mới
				</Button>
			</Grid>
		</Grid>
	);
}

export default BmHeader;

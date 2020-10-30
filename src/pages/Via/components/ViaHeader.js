import React from "react";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, fade } from "@material-ui/core/styles";
import {
	Button,
	InputBase,
	Grid,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	TextField,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RefreshIcon from "@material-ui/icons/Refresh";
import SearchIcon from "@material-ui/icons/Search";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { Link } from "react-router-dom";
import { setLoadViasStatus, setSearchParams } from "store/reducers/via";

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
function ViaHeader({ props }) {
	const [advancedSearch, setAdvancedSearch] = React.useState(false);
	const [searchParamsForm, setSearchParamsForm] = React.useState({
		params: {
			name: "",
			fbName: "",
			fbid: "",
			label: "",
			email: "",
			status: "",
		},
	});
	const classes = useStyles();
	const dispatch = useDispatch();
	const handleRefresh = () => {
		dispatch(setLoadViasStatus(true));
	};

	const keyPress = (e) => {
		if (e.keyCode == 13) {
			let { params } = searchParamsForm;
			dispatch(setSearchParams({ ...params }));
			dispatch(setLoadViasStatus(true));
		}
	};
	const handleOpenAdvancedSearch = () => {
		setAdvancedSearch(true);
	};
	const handleCloseAdvancedSearch = () => {
		let { params } = searchParamsForm;
		dispatch(setSearchParams({ ...params }));
		dispatch(setLoadViasStatus(true));
		setAdvancedSearch(false);
	};
	const handleSubmitAdvancedSearch = () => {
		let { params } = searchParamsForm;
		dispatch(setSearchParams({ ...params }));
		dispatch(setLoadViasStatus(true));
		setAdvancedSearch(false);
	};
	const handleEraseAdvancedSearch = () => {
		let { params } = searchParamsForm;
		params.fbName = "";
		params.fbid = "";
		params.email = "";
		params.label = "";
		params.status = "";
		setSearchParamsForm({
			params,
		});
		dispatch(setSearchParams({ ...params }));
		dispatch(setLoadViasStatus(true));
		setAdvancedSearch(false);
	};
	const handleChange = ({ target }) => {
		let { params } = searchParamsForm;
		params[target.getAttribute("data-name")] = target.value;
		setSearchParamsForm({ params });
	};
	const handleAddVia = () => {
		props.history.push("/admin/manage-via/create");
	};
	return (
		<React.Fragment>
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
								placeholder="Tìm VIA..."
								classes={{
									input: classes.inputInput,
									root: classes.inputRoot,
								}}
								inputProps={{
									"aria-label": "search",
									"data-name": "name",
								}}
								name="viaName"
								value={searchParamsForm.params.name}
								onChange={handleChange}
								onKeyDown={keyPress}
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
						onClick={handleOpenAdvancedSearch}
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
						onClick={handleRefresh}
					>
						Làm mới
					</Button>
					<Button
						variant="outlined"
						color="primary"
						className={clsx(classes.card__header__item)}
						endIcon={<PersonAddIcon></PersonAddIcon>}
						onClick={handleAddVia}
					>
						Thêm
					</Button>
				</Grid>
			</Grid>
			<Dialog
				open={advancedSearch}
				onClose={handleCloseAdvancedSearch}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">
					Chỉnh sửa thông tin Via
				</DialogTitle>
				<DialogContent>
					{/* <DialogContentText>
						To subscribe to this website, please enter your email
						address here. We will send updates occasionally.
					</DialogContentText> */}
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								id="viaName"
								name="viaName"
								param_name="name"
								label="Tên VIA"
								inputProps={{
									"data-name": "name",
								}}
								value={searchParamsForm.params.name}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id="viaFbid"
								name="viaFbid"
								param_name="fbid"
								label="Facebook ID"
								inputProps={{
									"data-name": "fbid",
								}}
								value={searchParamsForm.params.fbid}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="viaEmail"
								name="viaEmail"
								label="email"
								param_name="email"
								inputProps={{
									"data-name": "email",
								}}
								fullWidth
								autoComplete="email"
								value={searchParamsForm.params.email}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="viaFbName"
								name="viaFbName"
								param_name="fbName"
								label="Tên Facebook"
								inputProps={{
									"data-name": "fbName",
								}}
								value={searchParamsForm.params.fbName}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="viaLabel"
								name="viaLabel"
								param_name="label"
								inputProps={{
									"data-name": "label",
								}}
								label="Ghi chú"
								value={searchParamsForm.params.label}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEraseAdvancedSearch} color="primary">
						Xóa bộ lọc
					</Button>
					<Button
						onClick={handleSubmitAdvancedSearch}
						color="primary"
					>
						Tìm kiếm
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

export default ViaHeader;

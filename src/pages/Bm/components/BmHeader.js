import React from "react";
import clsx from "clsx";
import { makeStyles, fade } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import {
	Button,
	InputBase,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Input,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RefreshIcon from "@material-ui/icons/Refresh";
import GetAppIcon from "@material-ui/icons/GetApp";
import SearchIcon from "@material-ui/icons/Search";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { Link } from "react-router-dom";
import {
	setLoadBmStatus,
	setSelectedVia,
	setBmVerificationStatus,
	setBmStatus,
	setDownloadStatus,
} from "store/reducers/bm";
import Commons from "_helpers/commons.js";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
import BmsServices from "_services/bms.js";
import { TramRounded } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
	card__header__item: {
		margin: theme.spacing(1, 1),
	},
	full__width: {
		// [theme.breakpoints.down("sm")]: {
		//   marginLeft: theme.spacing(3),
		width: "100%",
		// },
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
	formControl: {
		width: "100%",
		height: "100%",
		[theme.breakpoints.up("sm")]: {
			minWidth: 160,
		},
	},
}));
function BmHeader(props) {
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	let selectedVia = useSelector((state) => state.bm.selectedVia);
	let selectedVerificationStatus = useSelector(
		(state) => state.bm.bmVerificationStatus
	);
	let selectedStatus = useSelector((state) => state.bm.bmStatus);
	const [listVias, setListVias] = React.useState([]);
	const dispatch = useDispatch();
	React.useEffect(() => {
		getViasList();
	}, []);

	const getViasList = () => {
		let header = Commons.header();
		axios({
			url: `${Constants.API_DOMAIN}/api/vias/`,
			method: "GET",
			headers: header,
		})
			.then((resp) => {
				setListVias(resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const handleChangeVia = (event) => {
		dispatch(setSelectedVia(event.target.value));
		dispatch(setLoadBmStatus(true));
	};
	const handleChangeVerficationStatus = (event) => {
		dispatch(setBmVerificationStatus(event.target.value));
		dispatch(setLoadBmStatus(true));
	};
	const handleChangeStatus = (event) => {
		dispatch(setBmStatus(event.target.value));
		dispatch(setLoadBmStatus(true));
	};
	const handleRefresh = () => {
		dispatch(setLoadBmStatus(true));
	};
	const handleCheckAllBm = async () => {
		enqueueSnackbar("Xin hãy đợi trong giây lát");
		let response = await BmsServices.checkAllBm();
		if (response.success) {
			if (response.status === true) {
				enqueueSnackbar(response.message, {
					variant: "success",
				});
			} else {
				enqueueSnackbar(response.message, {
					variant: "warning",
				});
			}
		} else {
			enqueueSnackbar(response.message, {
				variant: "error",
			});
		}
	};
	const handleExport = () => {
		dispatch(setDownloadStatus(true));
	};
	return (
		<Grid container spacing={0}>
			<Grid container justify="flex-end" item xs={12} md={12}>
				<Grid container justify="flex-start" item xs={12} sm={4}>
					<div
						className={clsx(
							classes.card__header__item,
							classes.full__width
						)}
					>
						<FormControl className={classes.formControl}>
							<InputLabel id="bmViaLabel">
								Tìm theo via
							</InputLabel>
							<Select
								labelId="vmViaLabel"
								id="bmVia"
								value={selectedVia}
								onChange={handleChangeVia}
								input={<Input />}
								//   MenuProps={MenuProps}
							>
								<MenuItem key={0} value={""}>
									Tất cả
								</MenuItem>
								{listVias.map((via) => (
									<MenuItem key={via.id} value={via.id}>
										{via.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</Grid>
				{/* <Grid container justify="flex-start" item xs={12} sm={4}>
					<div
						className={clsx(
							classes.card__header__item,
							classes.full__width
						)}
					>
						<FormControl className={classes.formControl}>
							<InputLabel id="adsAccStatusLabel">
								Tìm theo trạng thái xác minh
							</InputLabel>
							<Select
								labelId="adsAccStatusLabel"
								id="adsAccStatus"
								value={selectedVerificationStatus}
								onChange={handleChangeVerficationStatus}
								input={<Input />}
								//   MenuProps={MenuProps}
							>
								<MenuItem key={0} value={0}>
									Mọi trạng thái
								</MenuItem>
								<MenuItem key={1} value={1}>
									Đã xác minh
								</MenuItem>
								<MenuItem key={2} value={2}>
									Chưa xác minh
								</MenuItem>
							</Select>
						</FormControl>
					</div>
				</Grid> */}
				<Grid container justify="flex-start" item xs={12} sm={4}>
					<div
						className={clsx(
							classes.card__header__item,
							classes.full__width
						)}
					>
						<FormControl className={classes.formControl}>
							<InputLabel id="adsAccStatusLabel">
								Tìm theo trạng thái
							</InputLabel>
							<Select
								labelId="adsAccStatusLabel"
								id="adsAccStatus"
								value={selectedStatus}
								onChange={handleChangeStatus}
								input={<Input />}
								//   MenuProps={MenuProps}
							>
								<MenuItem key={0} value={0}>
									Đang giới hạn
								</MenuItem>
								<MenuItem key={1} value={1}>
									Đang hoạt động
								</MenuItem>
								<MenuItem key={2} value={2}>
									Chưa kiểm tra
								</MenuItem>
							</Select>
						</FormControl>
					</div>
				</Grid>
			</Grid>
			<Grid container justify="flex-end" item md={12}>
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
					className={clsx(
						classes.card__header__item
						// classes.floatRight
					)}
					endIcon={<GetAppIcon></GetAppIcon>}
					onClick={handleCheckAllBm}
				>
					Kiểm tra BM
				</Button>
				<Button
					variant="outlined"
					color="primary"
					className={clsx(
						classes.card__header__item
						// classes.floatRight
					)}
					endIcon={<GetAppIcon></GetAppIcon>}
					onClick={handleExport}
				>
					Tải xuống
				</Button>
			</Grid>
		</Grid>
	);
}

export default BmHeader;

import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import { useSelector, useDispatch } from "react-redux";
import Commons from "_helpers/commons.js";
import ViasServices from "_services/vias.js";
import {
	Paper,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	IconButton,
	Tooltip,
	LinearProgress,
} from "@material-ui/core";
import { red, amber } from "@material-ui/core/colors";

import {
	toggleDetailsDialog,
	openDetailsDialog,
	setViaDetailID,
	setLoadViasStatus,
	setViaDeleteName,
	openDeleteDialog,
	closeLoginDialog,
	openLoginDialog,
	setViaLoginInfo,
	setViaDeleteID,
} from "store/reducers/via";
import { useSnackbar } from "notistack";
import blue from "@material-ui/core/colors/blue";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
const convertViaStatus = (status) => {
	switch (status) {
		case 0:
			return "Dừng hoạt động";
		case 1:
			return "Đang hoạt động";
		case null:
			return "Chưa xác định";
		default:
			return "Chưa xác định";
	}
};
const columns = [
	{ id: "name", label: "VIA", minWidth: 100 },
	{ id: "email", label: "Email", minWidth: 170 },
	{ id: "password", label: "Password", minWidth: 170 },
	{
		id: "status",
		label: "Trạng thái",
		align: "right",
		format: convertViaStatus,
	},
	{
		id: "tfa",
		label: "Key",
		minWidth: 100,
		align: "right",
	},
	{
		id: "options",
		label: "Tùy chọn",
		minWidth: 200,
		align: "right",
	},
];

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		padding: "0px",
	},
	container: {
		maxHeight: 440,
	},
	optionButton: {
		padding: "0px",
		"margin-left": "12px",
	},
	rowDanger: {
		background: red[50],
	},
	rowWarning: {
		background: amber[50],
	},
	loadingRow: {
		height: "4px",
	},
	loadingCell: {
		padding: "0px",
	},
	tableHeaderCell: { "border-bottom": "0px !important" },
	progress: {
		color: blue[500],
		position: "relative",
		// top: "0%",
		width: "100%",
		// left: "50%",
		// marginTop: -34,
		// marginLeft: -34,
		"z-index": 3,
	},
	progressLoading: {
		backgroundColor: "rgba(0,0,0,0.05)",
	},
}));

export default function VIAList() {
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [loading, setLoading] = React.useState(false);

	const dispatch = useDispatch();
	let isLoadingVias = useSelector((state) => state.via.isLoadingVias);
	let searchParams = useSelector((state) => state.via.searchParams);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [listVias, setListVias] = React.useState([]);
	React.useEffect(() => {
		if (isLoadingVias == true) {
			getViasList();
		}
		dispatch(setLoadViasStatus(false));
	}, [isLoadingVias]);

	React.useEffect(() => {
		getViasList();
	}, []);

	const getViasList = () => {
		let header = Commons.header();
		setLoading(true);
		axios({
			url: `${Constants.API_DOMAIN}/api/vias/`,
			method: "GET",
			headers: header,
			params: searchParams,
		})
			.then((resp) => {
				dispatch(setLoadViasStatus(false));
				setListVias(resp.data);
				setLoading(false);
			})
			.catch((err) => {
				dispatch(setLoadViasStatus(false));
				console.log(err);
				setLoading(false);
				enqueueSnackbar("Đã có lỗi xảy ra!!!", {
					variant: "error",
				});
			});
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleClickOpenViaDetails = (viaID) => {
		dispatch(setViaDetailID(viaID));
		dispatch(openDetailsDialog());
	};
	const handleClickOpenViaDelete = (id, name) => {
		dispatch(setViaDeleteID(id));
		dispatch(setViaDeleteName(name));
		dispatch(openDeleteDialog());
	};
	const handleClickOpenViaLogin = (name, email, password, tfa) => {
		dispatch(setViaLoginInfo({ name, email, password, tfa }));
		dispatch(openLoginDialog());
	};
	const handleClickCheckStoredVia = async (id, rowIndex) => {
		setLoading(true);
		let viaStatus = await ViasServices.checkStoredVia(id);
		if (viaStatus.success) {
			if (viaStatus.status == true) {
				enqueueSnackbar(viaStatus.messages, {
					variant: "success",
				});
				let newListVias = [...listVias];
				newListVias[rowIndex].status = 1;
				setListVias(newListVias);
			} else if (viaStatus.status == false) {
				enqueueSnackbar(viaStatus.messages, {
					variant: "warning",
				});
				let newListVias = [...listVias];
				newListVias[rowIndex].status = 0;
				setListVias(newListVias);
			}
		} else {
			enqueueSnackbar(viaStatus.messages, {
				variant: "error",
			});
		}
		setLoading(false);
	};
	const checkIfDanger = (status) => {
		return status == 0 ? true : false;
	};
	const checkIfWarning = (status) => {
		return status == null || status == 2 ? true : false;
	};
	return (
		<React.Fragment>
			<Paper variant="outlined" className={classes.root}>
				<TableContainer>
					<Table aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										className={classes.tableHeaderCell}
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
							<TableRow className={classes.loadingRow}>
								<TableCell
									className={classes.loadingCell}
									colSpan={columns.length}
								>
									{loading && (
										<LinearProgress
											className={classes.progress}
										/>
									)}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody
							className={clsx({
								[classes.progressLoading]: loading,
							})}
						>
							{listVias
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, rowIndex) => {
									return (
										<TableRow
											className={clsx({
												[classes.rowDanger]: checkIfDanger(
													row.status
												),
												[classes.rowWarning]: checkIfWarning(
													row.status
												),
											})}
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.id}
										>
											{columns.map((column, colIndex) => {
												const value = row[column.id];
												if (column.id == "options") {
													return (
														<TableCell
															key={column.id}
															align={column.align}
														>
															<Tooltip
																title="Kiểm tra Via"
																placement="top"
															>
																<IconButton
																	component="div"
																	className={
																		classes.optionButton
																	}
																	aria-label="Tài khoản ads"
																	color="primary"
																	disabled={
																		loading
																	}
																	onClick={() =>
																		handleClickCheckStoredVia(
																			row.id,
																			rowIndex
																		)
																	}
																>
																	<AssignmentTurnedInIcon />
																</IconButton>
															</Tooltip>
															<Tooltip
																title="Thông tin đăng nhập"
																placement="top"
															>
																<IconButton
																	component="div"
																	className={
																		classes.optionButton
																	}
																	aria-label="Thông tin đăng nhập"
																	color="primary"
																	disabled={
																		loading
																	}
																	onClick={() =>
																		handleClickOpenViaLogin(
																			row.name,
																			row.email,
																			row.password,
																			row.tfa
																		)
																	}
																>
																	<HowToRegIcon />
																</IconButton>
															</Tooltip>
															<Tooltip
																title="Chi tiết"
																placement="top"
															>
																<IconButton
																	component="div"
																	className={
																		classes.optionButton
																	}
																	aria-label="Chi tiết"
																	color="primary"
																	disabled={
																		loading
																	}
																	onClick={() =>
																		handleClickOpenViaDetails(
																			row.id
																		)
																	}
																>
																	<EditIcon />
																</IconButton>
															</Tooltip>
															<Tooltip
																title="Xóa"
																placement="top"
															>
																<IconButton
																	component="div"
																	className={
																		classes.optionButton
																	}
																	aria-label="Xóa"
																	disabled={
																		loading
																	}
																	onClick={() =>
																		handleClickOpenViaDelete(
																			row.id,
																			row.name
																		)
																	}
																>
																	<DeleteIcon />
																</IconButton>
															</Tooltip>
														</TableCell>
													);
												}
												return (
													<TableCell
														key={column.id}
														align={column.align}
													>
														{column.format &&
														typeof value ===
															"number"
															? column.format(
																	value
															  )
															: value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25, 100]}
					component="div"
					count={listVias.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</React.Fragment>
	);
}

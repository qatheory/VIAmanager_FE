import React, { useEffect } from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { red, amber } from "@material-ui/core/colors";

import Commons from "_helpers/commons.js";
import {
	Paper,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	Tooltip,
	IconButton,
	LinearProgress,
} from "@material-ui/core";
import {
	setBmOwnersId,
	setBmOwnersName,
	openBmOwnersDialog,
	setLoadBmStatus,
	setAdsAccOwnedId,
	setAdsAccOwnedName,
	openAdsAccOwnedDialog,
	setAdsAccOwnedVia,
} from "store/reducers/bm";
import { useSnackbar } from "notistack";
import blue from "@material-ui/core/colors/blue";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
const convertVerificationStatus = (status) => {
	switch (status) {
		case "verified":
			return "Đã xác minh";
		case "not_verified":
			return "Chưa xác minh";
		default:
			return "";
	}
};
const columns = [
	{ id: "name", label: "BM", minWidth: 100 },
	{ id: "id", label: "ID", minWidth: 100 },
	{
		id: "verification_status",
		label: "Trạng thái",
		align: "right",
		format: convertVerificationStatus,
	},
	{
		id: "options",
		label: "Tùy chọn",
		minWidth: 170,
		align: "right",
	},
];

const useStyles = makeStyles({
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
});

export default function BMList() {
	let header = Commons.header();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [loading, setLoading] = React.useState(false);

	const classes = useStyles();
	const dispatch = useDispatch();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [listBMs, setListBMs] = React.useState([]);
	let isLoadingBm = useSelector((state) => state.bm.isLoadingBm);
	let selectedVia = useSelector((state) => state.bm.selectedVia);
	let selectedStatus = useSelector((state) => state.bm.bmStatus);
	React.useEffect(() => {
		if (isLoadingBm == true) {
			getBmList();
		}
	}, [isLoadingBm]);
	React.useEffect(() => {
		getBmList();
	}, []);
	const getBmList = () => {
		setLoading(true);
		axios({
			url: `${Constants.API_DOMAIN}/api/bms/`,
			method: "GET",
			headers: header,
			params: { via: selectedVia, status: selectedStatus },
		})
			.then((resp) => {
				console.log(resp);
				setListBMs(resp.data.data);
				if (resp.data.error.viaError.length != 0) {
					enqueueSnackbar(
						`Xảy ra lỗi với Via: ${resp.data.error.viaError.join(
							", "
						)}`,
						{
							variant: "error",
						}
					);
				}
				dispatch(setLoadBmStatus(false));
				setLoading(false);
			})
			.catch((err) => {
				dispatch(setLoadBmStatus(false));
				console.log(err.response.data);
				setLoading(false);
				enqueueSnackbar("Đã có lỗi xảy ra!!!", {
					variant: "error",
				});
			});
	};

	const checkIfNotVerified = (status) => {
		return status == "not_verified" ? true : false;
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleClickOpenOwnedAdsAcc = (name, id, owners) => {
		dispatch(setAdsAccOwnedId(id));
		dispatch(setAdsAccOwnedName(name));
		dispatch(setAdsAccOwnedVia(owners[0].id));
		dispatch(openAdsAccOwnedDialog());
	};
	const handleClickOpenBmOwners = (name, owners) => {
		owners = owners.map((owner) => owner.id);
		dispatch(setBmOwnersId(owners));
		dispatch(setBmOwnersName(name));
		dispatch(openBmOwnersDialog());
	};

	return (
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
						{listBMs
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map((row) => {
								return (
									<TableRow
										className={clsx({
											[classes.rowDanger]: checkIfNotVerified(
												row.verification_status
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
															title="Tài khoản ads"
															placement="top"
														>
															<IconButton
																className={
																	classes.optionButton
																}
																aria-label="Tài khoản ads"
																color="primary"
																disabled={
																	loading
																}
																onClick={() =>
																	handleClickOpenOwnedAdsAcc(
																		row.name,
																		row.id,
																		row.owner
																	)
																}
															>
																<LocalActivityIcon />
															</IconButton>
														</Tooltip>
														<Tooltip
															title="Via sở hữu"
															placement="top"
														>
															<IconButton
																className={
																	classes.optionButton
																}
																aria-label="Via sở hữu"
																color="primary"
																disabled={
																	loading
																}
																onClick={() =>
																	handleClickOpenBmOwners(
																		row.name,
																		row.owner
																	)
																}
															>
																<AccountBoxIcon />
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
													typeof value === "number"
														? column.format(value)
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
				count={listBMs.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

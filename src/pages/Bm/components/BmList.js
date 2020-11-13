import React, { useEffect } from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { red, amber } from "@material-ui/core/colors";
import * as moment from "moment";
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
	Checkbox,
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
import SaveIcon from "@material-ui/icons/Save";
import axios from "axios";
import copy from "copy-to-clipboard";
import BmsServices from "_services/bms.js";
import { ExportToCsv } from "export-to-csv";

import Constants from "_helpers/localConstants.js";
import { setDownloadStatus } from "../../../store/reducers/bm";
const formatDate = (expirationDate) => {
	if (expirationDate == "") {
		return "";
	}
	return moment(expirationDate).format("DD-MM-YYYY");
};

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
		id: "backup_email",
		label: "Email backup",
		align: "right",
	},
	{
		id: "backup_link",
		label: "Link backup",
		align: "right",
	},
	{
		id: "expiration_date",
		label: "Ngày hết hạn",
		align: "right",
		format: formatDate,
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
	backupLink: {
		cursor: "copy",
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
	const [selected, setSelected] = React.useState([]);
	const [numSelected, setNumSelected] = React.useState(0);
	const [rowCount, setRowCount] = React.useState(0);
	let isLoadingBm = useSelector((state) => state.bm.isLoadingBm);
	let selectedVia = useSelector((state) => state.bm.selectedVia);
	let selectedStatus = useSelector((state) => state.bm.bmStatus);
	let downloadStatus = useSelector((state) => state.bm.downloadStatus);
	React.useEffect(() => {
		if (isLoadingBm == true) {
			getBmList();
		}
	}, [isLoadingBm]);
	React.useEffect(() => {
		getBmList();
	}, []);
	React.useEffect(() => {
		if (downloadStatus == true) {
			try {
				downloadBmBackupLink();
			} finally {
				dispatch(setDownloadStatus(false));
			}
		}
	}, [downloadStatus]);
	const downloadBmBackupLink = () => {
		let options = {
			fieldSeparator: ",",
			quoteStrings: '"',
			decimalSeparator: ".",
			filename: "Tổng hợp link backup",
			showLabels: true,
			// showTitle: true,
			// title: "Tổng hợp link backup",
			useTextFile: false,
			useBom: true,
			useKeysAsHeaders: true,
		};
		const csvExporter = new ExportToCsv(options);
		let selectedBms = listBMs.filter((bm) => {
			if (selected.indexOf(bm.id) !== -1) {
				return true;
			}
			return false;
		});
		if (selectedBms.length === 0) {
			return;
		}
		let data = selectedBms.map((bm) => {
			bm = {
				via: bm.name,
				backup_link: bm.backup_link,
				expiration_date: moment(bm.expiration_date).format(
					"DD-MM-YYYY"
				),
			};
			return bm;
		});
		csvExporter.generateCsv(data);
	};
	const getBmList = () => {
		setLoading(true);
		axios({
			url: `${Constants.API_DOMAIN}/api/bms/`,
			method: "GET",
			headers: header,
			params: { via: selectedVia, status: selectedStatus },
		})
			.then((resp) => {
				setListBMs(resp.data.data);
				if (resp.data.error.viaError.length != 0) {
					enqueueSnackbar(
						`Xảy ra lỗi với Via: ${resp.data.error.viaError.join(
							", "
						)}.\nHãy kiểm tra lại Accesss Token`,
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
				// console.log(err.response.data);
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
	const handleClickOpenOwnedAdsAcc = (event, name, id, owners) => {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		dispatch(setAdsAccOwnedId(id));
		dispatch(setAdsAccOwnedName(name));
		dispatch(setAdsAccOwnedVia(owners[0].id));
		dispatch(openAdsAccOwnedDialog());
	};
	const handleClickOpenBmOwners = (event, name, owners) => {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		owners = owners.map((owner) => owner.id);
		dispatch(setBmOwnersId(owners));
		dispatch(setBmOwnersName(name));
		dispatch(openBmOwnersDialog());
	};
	const handleClickCopyBackupLink = (event, value) => {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();

		copy(value);
		enqueueSnackbar(`Đã copy back email`, {
			variant: "success",
		});
	};
	const handleClickCreateBackup = async (event, bmid, owners, rowIndex) => {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		setLoading(true);
		let response = await BmsServices.requestBackup(bmid, owners);
		if (response.success) {
			if (response.status == "success") {
				enqueueSnackbar(response.messages, {
					variant: "success",
				});
				let newListBms = listBMs.slice();
				newListBms[rowIndex].backup_email = response.data.backup_email;
				newListBms[rowIndex].backup_link = response.data.backup_link;
				newListBms[rowIndex].expiration_date =
					response.data.expiration_date;
				setListBMs(newListBms);
			} else if (response.status == false) {
				enqueueSnackbar(response.messages, {
					variant: "warning",
				});
			}
		} else {
			enqueueSnackbar(response.messages, {
				variant: "error",
			});
		}
		setLoading(false);
	};
	const isSelected = (name) => selected.indexOf(name) !== -1;
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = listBMs.map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};
	const handleClickSelect = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	return (
		<Paper variant="outlined" className={classes.root}>
			<TableContainer>
				<Table aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell
								padding="checkbox"
								className={classes.tableHeaderCell}
							>
								<Checkbox
									color="primary"
									indeterminate={
										selected.length > 0 &&
										selected.length < listBMs.length
									}
									checked={
										selected.length > 0 &&
										selected.length === listBMs.length
									}
									onChange={handleSelectAllClick}
									inputProps={{
										"aria-label": "Chọn tất cả BM",
									}}
								/>
							</TableCell>
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
								colSpan={columns.length + 1}
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
							.map((row, rowIndex) => {
								const isItemSelected = isSelected(row.id);
								return (
									<TableRow
										// className={clsx({
										// 	[classes.rowDanger]: checkIfNotVerified(
										// 		row.verification_status
										// 	),
										// })}
										onClick={(event) =>
											handleClickSelect(event, row.id)
										}
										hover
										role="checkbox"
										aria-checked={isItemSelected}
										selected={isItemSelected}
										tabIndex={-1}
										key={row.id}
									>
										<TableCell padding="checkbox">
											<Checkbox
												color="primary"
												checked={isItemSelected}
												// inputProps={{
												// 	"aria-labelledby": labelId,
												// }}
											/>
										</TableCell>
										{columns.map((column, colIndex) => {
											const value = row[column.id];
											if (column.id == "backup_link") {
												return (
													<TableCell
														key={column.id}
														align={column.align}
													>
														<Tooltip
															title="Click để copy"
															placement="top"
														>
															<div
																className={
																	classes.backupLink
																}
																onClick={(
																	event
																) => {
																	handleClickCopyBackupLink(
																		event,
																		value
																	);
																}}
															>
																{column.format
																	? column.format(
																			value
																	  )
																	: value}
															</div>
														</Tooltip>
													</TableCell>
												);
											}
											if (column.id == "options") {
												return (
													<TableCell
														key={column.id}
														align={column.align}
													>
														<Tooltip
															title="Tạo backup"
															placement="top"
														>
															<IconButton
																component="div"
																className={
																	classes.optionButton
																}
																aria-label="Tạo backup"
																color="primary"
																disabled={
																	loading
																}
																onClick={(
																	event
																) =>
																	handleClickCreateBackup(
																		event,
																		row.id,
																		row.owner,
																		rowIndex
																	)
																}
															>
																<SaveIcon />
															</IconButton>
														</Tooltip>
														<Tooltip
															title="Tài khoản ads"
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
																onClick={(
																	event
																) =>
																	handleClickOpenOwnedAdsAcc(
																		event,
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
																component="div"
																className={
																	classes.optionButton
																}
																aria-label="Via sở hữu"
																color="primary"
																disabled={
																	loading
																}
																onClick={(
																	event
																) =>
																	handleClickOpenBmOwners(
																		event,
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
													{column.format
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

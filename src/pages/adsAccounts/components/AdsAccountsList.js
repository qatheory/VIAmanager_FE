import React, { useEffect } from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
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
import { red, amber } from "@material-ui/core/colors";
import {
	toggleDetailsDialog,
	openDetailsDialog,
	setAdsAccDetailID,
	setLoadAdsAccStatus,
	openAdsAccOwnersDialog,
	setAdsAccOwnersId,
	setAdsAccOwnersName,
} from "store/reducers/adsAcc";
import { useSnackbar } from "notistack";
import blue from "@material-ui/core/colors/blue";

import AdsAccountsDetails from "pages/AdsAccounts/components/AdsAccountsDetails";
// import AdsAccountVia from "pages/AdsAccounts/components/AdsAccountVia";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
const showAccountStatus = (statusID) => {
	switch (statusID) {
		case 1:
			return "Đang hoạt động";
		case 2:
			return "Không hoạt động";
		case 3:
			return "Không ổn định";
		case 7:
			return "Đang được xét duyệt";
		case 8:
			return "Đang chờ xử lý";
		case 9:
			return "Đang chờ gia hạn";
		case 101:
			return "Chuẩn bị dừng hoạt động";
		case 102:
			return "Đã dừng hoạt động";
		case 201:
			return "Hoạt động";
		case 202:
			return "Không hoạt động";
		default:
			return "Không xác định";
	}
};

const showAccountDisableReason = (statusID) => {
	switch (statusID) {
		case 0:
			return "Vẫn đang chạy ngon";
		case 1:
			return "Vi phạm chính sách quảng cáo";
		case 2:
			return "Kiểm tra vi phạm IP";
		case 3:
			return "Vi phạm tài khoản thanh toán";
		case 4:
			return "Tài khoản đã dừng hoạt động";
		case 5:
			return "Đang review ads";
		case 6:
			return "Vi phạm do BM";
		case 7:
			return "Bị dừng vĩnh viễn";
		case 8:
			return "Đã dừng hoạt động";
		case 9:
			return "Tài khoản Reseller không được sử dụng";
		case 10:
			return "Tài khoản đã không được sử dụng";
		default:
			return "Không xác định";
	}
};

const columns = [
	{ id: "name", label: "Tài khoản", minWidth: 100 },
	{ id: "businessName", label: "BM", minWidth: 100 },
	{
		id: "account_status",
		label: "Trạng thái",
		minWidth: 170,
		format: showAccountStatus,
	},
	{
		id: "disable_reason",
		label: "Lý do dừng hoạt động",
		minWidth: 170,
		format: showAccountDisableReason,
	},
	{
		id: "amount_spent",
		label: "Số tiền đã tiêu",
		align: "right",
	},
	{
		id: "balance",
		label: "Hóa đơn",
		align: "right",
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
});

export default function AdsAccountsList() {
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [loading, setLoading] = React.useState(false);

	const dispatch = useDispatch();
	let isLoadingAdsAcc = useSelector((state) => state.adsAcc.isLoadingAdsAcc);
	let selectedVia = useSelector((state) => state.adsAcc.selectedVia);
	let selectedStatus = useSelector((state) => state.adsAcc.adsAccStatus);

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [listAdsAccounts, setListAdsAccounts] = React.useState([]);
	React.useEffect(() => {
		if (isLoadingAdsAcc == true) {
			getAdsAccList();
		}
		dispatch(setLoadAdsAccStatus(false));
	}, [isLoadingAdsAcc]);

	React.useEffect(() => {
		getAdsAccList();
	}, []);

	const getAdsAccList = () => {
		let header = Commons.header();
		setLoading(true);
		axios({
			url: `${Constants.API_DOMAIN}/api/ads_acc/`,
			method: "GET",
			headers: header,
			params: { via: selectedVia, status: selectedStatus },
		})
			.then((resp) => {
				console.log(resp);
				let adsAccounts = resp.data.data.map((adsAcc) => {
					return adsAcc.business
						? { ...adsAcc, businessName: adsAcc.business.name }
						: adsAcc;
				});
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
				dispatch(setLoadAdsAccStatus(false));
				setListAdsAccounts(adsAccounts);
				setLoading(false);
			})
			.catch((err) => {
				dispatch(setLoadAdsAccStatus(false));
				console.log(err.response.data);
				if (err.response.data.error) {
					enqueueSnackbar("Access token không hợp lệ", {
						variant: "error",
					});
					setLoading(false);
					return;
				}
				enqueueSnackbar("Đã có lỗi xảy ra!!!", {
					variant: "error",
				});
				setLoading(false);
			});
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleClickOpenAdsAccDetails = (adsAccID) => {
		dispatch(setAdsAccDetailID(adsAccID));
		dispatch(openDetailsDialog());
	};
	const handleClickOpenAdsAccOwners = (owners, name) => {
		owners = owners.map((owner) => owner.viaId);
		dispatch(setAdsAccOwnersName(name));
		dispatch(setAdsAccOwnersId(owners));
		dispatch(openAdsAccOwnersDialog());
	};
	const checkIfDanger = (status) => {
		if (status == 2 || status == 101 || status == 102 || status == 202) {
			return true;
		}
		return false;
	};
	const checkIfWarning = (status) => {
		if (status == 3 || status == 7 || status == 8 || status == 9) {
			return true;
		}
		return false;
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
						<TableBody>
							{listAdsAccounts
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row) => {
									return (
										<TableRow
											className={clsx({
												[classes.rowDanger]: checkIfDanger(
													row.account_status
												),
												[classes.rowWarning]: checkIfWarning(
													row.account_status
												),
											})}
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.id}
										>
											{columns.map((column, colIndex) => {
												const value = row[column.id];
												if (colIndex == 6) {
													return (
														<TableCell
															key={column.id}
															align={column.align}
														>
															{/* <Tooltip title="Chi tiết" placement="top">
                                <IconButton
                                  className={classes.optionButton}
                                  aria-label="Chi tiết"
                                  color="primary"
                                  onClick={() =>
                                    handleClickOpenAdsAccDetails(row.id)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip> */}
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
																		handleClickOpenAdsAccOwners(
																			row.owner,
																			row.name
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
					count={listAdsAccounts.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<AdsAccountsDetails />
			{/* <AdsAccountVia /> */}
		</React.Fragment>
	);
}

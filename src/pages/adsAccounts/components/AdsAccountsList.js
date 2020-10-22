import React, { useEffect } from "react";
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
} from "@material-ui/core";
import { red, amber } from "@material-ui/core/colors";
import {
	toggleDetailsDialog,
	openDetailsDialog,
	setAdsAccDetailID,
	setLoadAdsAccStatus,
} from "store/reducers/adsAcc";
import clsx from "clsx";
import AdsAccountsDetails from "pages/AdsAccounts/components/AdsAccountsDetails";
// import AdsAccountVia from "pages/AdsAccounts/components/AdsAccountVia";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import axios from "axios";
import Constants from "_helpers/constants.js";

const showAccountStatus = (statusID) => {
	switch (statusID) {
		case 1:
			return "Đang hoạt động";
		case 2:
			return "Vô hiệu hóa";
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
	{ id: "via", label: "VIA", minWidth: 100 },
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
});

export default function AdsAccountsList() {
	const classes = useStyles();
	const dispatch = useDispatch();
	let isLoadingAdsAcc = useSelector((state) => state.via.isLoadingAdsAcc);
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
		axios({
			url: `${Constants.API_DOMAIN}/api/ads_acc/`,
			method: "GET",
			headers: header,
		})
			.then((resp) => {
				dispatch(setLoadAdsAccStatus(false));
				setListAdsAccounts(resp.data);
			})
			.catch((err) => {
				dispatch(setLoadAdsAccStatus(false));
				console.log(err);
			});
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleClickOpenViaDetails = (adsAccID) => {
		dispatch(setAdsAccDetailID(adsAccID));
		dispatch(openDetailsDialog());
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
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
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
															<Tooltip
																title="Chi tiết"
																placement="top"
															>
																<IconButton
																	className={
																		classes.optionButton
																	}
																	aria-label="Chi tiết"
																	color="primary"
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
																title="Thông tin Via"
																placement="top"
															>
																<IconButton
																	className={
																		classes.optionButton
																	}
																	aria-label="Thông tin Via"
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

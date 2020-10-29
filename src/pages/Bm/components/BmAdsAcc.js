import React, { useEffect } from "react";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Table,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
	toggleDetailsDialog,
	closeAdsAccOwnedDialog,
	setAdsAccOwnedId,
	setAdsAccOwnedName,
	setAdsAccOwnedVia,
} from "store/reducers/bm";
import { authenticator } from "otplib";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/constants.js";
import axios from "axios";

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
	{ id: "name", label: "Tài khoản Ads", minWidth: 100 },
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
];

export default function BmAdsAcc(props) {
	let dispatch = useDispatch();
	const [bmAdsAccList, setBmAdsAccList] = React.useState([]);

	let bmAdsAccStatus = useSelector((state) => state.bm.adsAccOwnedDialog);
	let bmAdsAccId = useSelector((state) => state.bm.AdsAccOwnedId);
	let bmAdsAccName = useSelector((state) => state.bm.AdsAccOwnedName);
	let bmAdsAccOwnedVia = useSelector((state) => state.bm.AdsAccOwnedVia);
	useEffect(() => {
		if (bmAdsAccId != "") {
			let header = Commons.header();
			axios({
				url: `${Constants.API_DOMAIN}/api/bms/ads_acc/`,
				method: "GET",
				headers: header,
				params: { bm: bmAdsAccId, via: bmAdsAccOwnedVia },
			})
				.then((resp) => {
					let AdsAccList = resp.data.map((AdsAcc) => {
						return {
							id: AdsAcc.id,
							name: AdsAcc.name,
							account_status: AdsAcc.account_status,
							disable_reason: AdsAcc.disable_reason,
						};
					});
					setBmAdsAccList(AdsAccList);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [bmAdsAccId]);
	// const handleClickOpen = () => {
	//   setOpen(true);
	// };

	const handleClose = () => {
		dispatch(setAdsAccOwnedId(""));
		dispatch(setAdsAccOwnedName(""));
		dispatch(setAdsAccOwnedVia(""));
		dispatch(closeAdsAccOwnedDialog());
	};

	return (
		<React.Fragment>
			{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
			<Dialog
				open={bmAdsAccStatus}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">
					{`Tài khoản Ads mà BM ${bmAdsAccName} đang sở hữu`}
				</DialogTitle>
				<DialogContent>
					<TableContainer>
						<Table aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell
											key={column.id}
											align={column.align}
											style={{
												minWidth: column.minWidth,
											}}
										>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{bmAdsAccList.slice().map((row) => {
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.id}
										>
											{columns.map((column, colIndex) => {
												const value = row[column.id];
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
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Đóng
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

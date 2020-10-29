import React, { useEffect } from "react";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
	closeUserDeleteDialog,
	setUserDeleteId,
	setUserDeleteName,
	setLoadUsersStatus,
} from "store/reducers/user";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/constants.js";
import axios from "axios";

export default function UserDeleteAlert(props) {
	let dispatch = useDispatch();
	let userDeleteDialogStatus = useSelector(
		(state) => state.user.deleteDialog
	);
	let userDeleteId = useSelector((state) => state.user.userDeleteId);
	let userDeleteName = useSelector((state) => state.user.userDeleteName);
	const handleClose = () => {
		dispatch(setUserDeleteId(""));
		dispatch(setUserDeleteName(""));
		dispatch(closeUserDeleteDialog());
	};

	const handleSubmit = () => {
		let header = Commons.header();
		axios({
			url: `${Constants.API_DOMAIN}/api/user/${userDeleteId}/`,
			method: "DELETE",
			headers: header,
		})
			.then((resp) => {
				handleClose();
				dispatch(setUserDeleteId(""));
				dispatch(setUserDeleteName(""));

				dispatch(setLoadUsersStatus(true));
			})
			.catch((err) => {
				handleClose();
				dispatch(setUserDeleteId(""));
				dispatch(setUserDeleteName(""));
				console.log(err);
			});
	};

	return (
		<Dialog
			open={userDeleteDialogStatus}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{`Bạn có chắc chắn muốn xóa tài khoản ${userDeleteName}?`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Sau khi thực hiện xóa tài khoản, sẽ không có bất cứ cách nào
					có thể lấy lại được tài khoản đã bị xóa!
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Thôi
				</Button>
				<Button onClick={handleSubmit} color="primary" autoFocus>
					Ok, Xóa
				</Button>
			</DialogActions>
		</Dialog>
	);
}

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
	closeDeleteDialog,
	setViaDeleteID,
	setViaDeleteName,
	setLoadViasStatus,
} from "store/reducers/via";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/constants.js";
import axios from "axios";

export default function ViaDetails(props) {
	let dispatch = useDispatch();
	let viaDeleteDialogStatus = useSelector((state) => state.via.deleteDialog);
	let viaDeleteID = useSelector((state) => state.via.viaDeleteID);
	let viaDeleteName = useSelector((state) => state.via.viaDeleteName);

	const handleClose = () => {
		dispatch(setViaDeleteID(""));
		dispatch(setViaDeleteName(""));
		dispatch(closeDeleteDialog());
	};

	const handleSubmit = () => {
		let header = Commons.header();
		console.log(header);
		axios({
			url: `${Constants.API_DOMAIN}/api/via/${viaDeleteID}/`,
			method: "PUT",
			headers: header,
			data: { isDeleted: true },
		})
			.then((resp) => {
				handleClose();
				dispatch(setLoadViasStatus(true));
			})
			.catch((err) => {
				handleClose();
				console.log(err);
			});
	};

	return (
		<Dialog
			open={viaDeleteDialogStatus}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{`Bạn có chắc chắn muốn xóa Via ${viaDeleteName}?`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Sau khi thực hiện xóa Via, sẽ không có bất cứ cách nào có
					thể lấy lại được Via đã bị xóa!
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

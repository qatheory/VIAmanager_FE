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
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import {
	toggleDetailsDialog,
	closeUserResetPasswordDialog,
	setUserResetPasswordId,
	setUserResetPasswordName,
	setLoadUsersStatus,
} from "store/reducers/user";
import { authenticator } from "otplib";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/localConstants.js";
import axios from "axios";

const columns = [
	{ id: "name", label: "VIA", minWidth: 100 },
	{ id: "email", label: "Email", minWidth: 170 },
	{
		id: "password",
		label: "Password",
		minWidth: 100,
	},
	{
		id: "tfa",
		label: "TFA Key",
	},
];
const useStyles = makeStyles((theme) => ({
	textField: {
		margin: theme.spacing(0, 3),
	},
}));
export default function UsersResetPassword(props) {
	const classes = useStyles();
	let dispatch = useDispatch();
	const [userNewPassword, setUserNewPassword] = React.useState([]);
	let userResetPasswordDialogStatus = useSelector(
		(state) => state.user.resetPasswordDialog
	);

	let userResetPasswordId = useSelector(
		(state) => state.user.userResetPasswordId
	);
	let userResetPasswordName = useSelector(
		(state) => state.user.userResetPasswordName
	);
	const handleSubmit = () => {
		let header = Commons.header();
		axios({
			url: `${Constants.API_DOMAIN}/api/user/reset-password/${userResetPasswordId}/`,
			method: "PUT",
			headers: header,
			data: { password: userNewPassword.trim() },
		})
			.then((resp) => {
				console.log(resp);
				handleClose();
				dispatch(setLoadUsersStatus(true));
			})
			.catch((err) => {
				handleClose();
				dispatch(setLoadUsersStatus(true));
				console.log(err);
			});
	};

	const handleClose = () => {
		dispatch(setUserResetPasswordId([]));
		dispatch(setUserResetPasswordName(""));
		dispatch(closeUserResetPasswordDialog());
	};
	const handleChange = (e) => {
		setUserNewPassword(e.target.value);
	};
	return (
		<React.Fragment>
			{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
			<Dialog
				open={userResetPasswordDialogStatus}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">
					{`Đổi mật khẩu tài khoản ${userResetPasswordName}`}
				</DialogTitle>
				<DialogContent>
					Sau khi thực hiện xóa tài khoản, sẽ không có bất cứ cách nào
					có thể lấy lại được tài khoản đã bị xóa!
				</DialogContent>
				<TextField
					className={classes.textField}
					id="outlined-search"
					label="Mật khẩu mới"
					variant="outlined"
					value={userNewPassword}
					onChange={handleChange}
				/>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Đóng
					</Button>
					<Button onClick={handleSubmit} color="primary" autoFocus>
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

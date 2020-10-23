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
import { closeLoginDialog } from "store/reducers/via";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/constants.js";
import axios from "axios";
import { totp } from "otplib";

export default function ViaLogin(props) {
	let dispatch = useDispatch();
	let viaLoginDialogStatus = useSelector((state) => state.via.loginDialog);
	let viaLoginInfo = useSelector((state) => state.via.loginInfo);

	const handleClose = () => {
		dispatch(closeLoginDialog());
	};

	const getTFAcode = (tfa) => {
		return totp.generate(tfa);
	};

	return (
		<Dialog
			open={viaLoginDialogStatus}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{`Thông tin đăng nhập của ${viaLoginInfo.name}?`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<p>{`Email: ${viaLoginInfo.email}`}</p>
					<p>{`Password: ${viaLoginInfo.password}`}</p>
					<p>{`TFA::${getTFAcode(viaLoginInfo.tfa)}`}</p>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
}

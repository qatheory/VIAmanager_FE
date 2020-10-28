import React, { useEffect, useState } from "react";
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
import { authenticator } from "otplib";

export default function ViaLogin(props) {
	let dispatch = useDispatch();
	let viaLoginDialogStatus = useSelector((state) => state.via.loginDialog);
	let viaLoginInfo = useSelector((state) => state.via.loginInfo);
	const [tfaCode, setTfaCode] = useState("Đang tạo");
	const handleClose = () => {
		dispatch(closeLoginDialog());
	};
	useEffect(() => {
		console.log(viaLoginInfo);
		getTFAcode(viaLoginInfo.tfa);
	}, [viaLoginInfo]);
	const getTFAcode = (tfa) => {
		if (tfa) setTfaCode(authenticator.generate(tfa));
	};

	return (
		<Dialog
			open={viaLoginDialogStatus}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{`Thông tin đăng nhập của ${viaLoginInfo.name}`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{`Email: ${viaLoginInfo.email}`}
				</DialogContentText>
				<DialogContentText>
					{`Password: ${viaLoginInfo.password}`}
				</DialogContentText>
				<DialogContentText>{`TFA: ${tfaCode}`}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
}

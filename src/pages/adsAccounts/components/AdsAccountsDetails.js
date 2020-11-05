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
	toggleDetailsDialog,
	closeDetailsDialog,
	setAdsAccDetailID,
} from "store/reducers/adsAcc";

import Commons from "_helpers/commons.js";
import Constants from "_helpers/localConstants.js";
import axios from "axios";

export default function AdsAccountsDetails(props) {
	// const [open, setOpen] = React.useState(false);
	const [formState, setFormState] = React.useState({
		formValues: {
			viaName: "",
			viaFbid: "",
			viaEmail: "",
			viaPassword: "",
			viaEmailPassword: "",
			viaAccessToken: "",
			viaTFA: "",
			viaFbName: "",
			viaFbLink: "",
			viaGender: "",
			viaDob: "",
			viaLabel: "",
		},
	});
	const handleChange = ({ target }) => {
		const { formValues } = formState;
		formValues[target.name] = target.value;
		setFormState({ formValues });
		// handleValidation(target);
	};
	let dispatch = useDispatch();
	let adsAccDetailsDialogStatus = useSelector(
		(state) => state.adsAcc.detailsDialog
	);
	let adsAccID = useSelector((state) => state.adsAcc.adsAccID);
	useEffect(() => {
		if (adsAccID != "") {
			let header = Commons.header();
			axios({
				url: `${Constants.API_DOMAIN}/api/ads_acc/${adsAccID}/`,
				method: "GET",
				headers: header,
			})
				.then((resp) => {
					const { formValues } = formState;
					formValues.viaName = resp.data.name || "";
					formValues.viaFbid = resp.data.fbid || "";
					formValues.viaEmail = resp.data.email || "";
					formValues.viaPassword = resp.data.password || "";
					formValues.viaEmailPassword = resp.data.emailPassword || "";
					formValues.viaAccessToken = resp.data.accessToken || "";
					formValues.viaTFA = resp.data.tfa || "";
					formValues.viaFbName = resp.data.fbName || "";
					formValues.viaFbLink = resp.data.fbLink || "";
					formValues.viaGender = resp.data.gender || "";
					formValues.viaDob = resp.data.dateOfBirth || "";
					formValues.viaLabel = resp.data.label || "";
					setFormState({ formValues });
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [adsAccID]);
	// const handleClickOpen = () => {
	//   setOpen(true);
	// };

	const handleClose = () => {
		dispatch(setAdsAccDetailID(""));
		dispatch(closeDetailsDialog());
	};

	const handleSubmit = () => {
		const { formValues } = formState;

		let header = Commons.header();
		let data = {
			name: formValues.viaName.trim(),
			fbid: formValues.viaFbid.trim(),
			email: formValues.viaEmail.trim(),
			emailPassword: formValues.viaEmailPassword.trim(),
			password: formValues.viaPassword.trim(),
			accessToken: formValues.viaAccessToken.trim(),
			tfa: formValues.viaTFA.trim(),
			fbLink: formValues.viaFbLink.trim(),
			fbName: formValues.viaFbName.trim(),
			label: formValues.viaLabel.trim(),
		};
		if (formValues.viaDob) {
			data.dateOfBirth = formValues.viaDob.trim();
		}
		if (formValues.gender) {
			data.gender = formValues.gender.trim();
		}
		axios({
			url: `${Constants.API_DOMAIN}/api/via/${adsAccID}/`,
			method: "PUT",
			headers: header,
			data: data,
		})
			.then((resp) => {
				handleClose();
			})
			.catch((err) => {
				handleClose();
				console.log(err);
			});
	};

	return (
		<React.Fragment>
			{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
			<Dialog
				open={adsAccDetailsDialogStatus}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">
					Chỉnh sửa thông tin Via
				</DialogTitle>
				<DialogContent>
					{/* <DialogContentText>
						To subscribe to this website, please enter your email
						address here. We will send updates occasionally.
					</DialogContentText> */}
					<Grid container spacing={3}>
						<Grid item xs={12} sm={7}>
							<TextField
								id="viaName"
								name="viaName"
								label="Tên VIA"
								value={formState.formValues.viaName}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={5}>
							<TextField
								required
								id="viaFbid"
								name="viaFbid"
								label="Facebook ID"
								value={formState.formValues.viaFbid}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="viaEmail"
								name="viaEmail"
								label="email"
								fullWidth
								autoComplete="email"
								value={formState.formValues.viaEmail}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="viaPassword"
								name="viaPassword"
								label="Mật khẩu VIA"
								value={formState.formValues.viaPassword}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="viaEmailPassword"
								name="viaEmailPassword"
								label="Mật khẩu Email"
								value={formState.formValues.viaEmailPassword}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id="viaAccessToken"
								name="viaAccessToken"
								label="Access Token"
								value={formState.formValues.viaAccessToken}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id="viaTFA"
								name="viaTFA"
								label="TFA"
								value={formState.formValues.viaTFA}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="viaFbLink"
								name="viaFbLink"
								label="Link Facebook"
								value={formState.formValues.viaFbLink}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={5}>
							<TextField
								id="viaFbName"
								name="viaFbName"
								label="Tên Facebook"
								value={formState.formValues.viaFbName}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								id="viaDob"
								name="viaDob"
								label="Ngày sinh"
								value={formState.formValues.viaDob}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								id="viaGender"
								name="viaGender"
								label="Giới tính"
								value={formState.formValues.viaGender}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="viaLabel"
								name="viaLabel"
								label="Ghi chú"
								value={formState.formValues.viaLabel}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Hủy
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

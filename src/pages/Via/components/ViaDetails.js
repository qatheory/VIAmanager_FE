import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, theme } from "@material-ui/core/styles";

import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	CircularProgress,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
	toggleDetailsDialog,
	closeDetailsDialog,
	setViaDetailID,
} from "store/reducers/via";
import blue from "@material-ui/core/colors/blue";

import { useSnackbar } from "notistack";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/localConstants.js";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
	layout: {
		width: "auto",
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
			width: 600,
			marginLeft: "auto",
			marginRight: "auto",
		},
	},
	paper: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
			marginTop: theme.spacing(3),
			marginBottom: theme.spacing(6),
			padding: theme.spacing(3),
		},
	},
	buttons: {
		display: "flex",
		justifyContent: "flex-end",
	},
	button: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1),
	},
	progress: {
		color: blue[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -34,
		marginLeft: -34,
		"z-index": 3,
	},
	progressLoading: {
		backgroundColor: "rgba(0,0,0,0.05)",
	},
}));
export default function ViaDetails(props) {
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [loading, setLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);
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
	let viaDetailsDialogStatus = useSelector(
		(state) => state.via.detailsDialog
	);
	let viaID = useSelector((state) => state.via.viaID);
	useEffect(() => {
		setOpen(viaDetailsDialogStatus);
	}, [viaDetailsDialogStatus]);
	useEffect(() => {
		if (viaID != "") {
			let header = Commons.header();
			axios({
				url: `${Constants.API_DOMAIN}/api/via/${viaID}/`,
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
	}, [viaID]);
	// const handleClickOpen = () => {
	//   setOpen(true);
	// };

	const handleClose = () => {
		dispatch(setViaDetailID(""));
		dispatch(closeDetailsDialog());
	};
	const createVia = () => {
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
			url: `${Constants.API_DOMAIN}/api/via/${viaID}/`,
			method: "PUT",
			headers: header,
			data: data,
		})
			.then((resp) => {
				handleClose();
				setLoading(false);
			})
			.catch((err) => {
				handleClose();
				setLoading(false);
				console.log(err);
			});
	};
	const handleSubmit = () => {
		const { formValues } = formState;
		setLoading(true);
		axios({
			url: `https://graph.facebook.com/v8.0/me`,
			method: "GET",
			params: { access_token: formValues.viaAccessToken.trim() },
		})
			.then((resp) => {
				createVia();
			})
			.catch((err) => {
				console.log(err.response.data);
				if (err.response.data.error) {
					enqueueSnackbar("Access token không hoạt động", {
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

	return (
		<React.Fragment>
			{/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				className={clsx({
					[classes.progressLoading]: loading,
				})}
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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								id="viaPassword"
								name="viaPassword"
								label="Mật khẩu VIA"
								value={formState.formValues.viaPassword}
								onChange={handleChange}
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
								disabled={loading}
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
				{loading && (
					<CircularProgress size={68} className={classes.progress} />
				)}
			</Dialog>
		</React.Fragment>
	);
}

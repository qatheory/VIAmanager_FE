import React from "react";
import { makeStyles, theme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import {
	Paper,
	Typography,
	Fade,
	Grid,
	TextField,
	FormControlLabel,
	Checkbox,
	Button,
} from "@material-ui/core";
import axios from "axios";
import Constants from "_helpers/constants.js";
import Commons from "_helpers/commons.js";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "0px",
	},
	cardHeader: {
		// "justify-content": "flex-end",
		display: "flex",
	},
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
}));
function CreateVIA(props) {
	const classes = useStyles();
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
			viaGender: undefined,
			viaDob: undefined,
			viaLabel: "",
		},
	});
	const handleChange = ({ target }) => {
		const { formValues } = formState;
		formValues[target.name] = target.value;
		setFormState({ formValues });
		// handleValidation(target);
	};
	const handleCancel = () => {
		props.history.push("/admin/manage-via");
	};
	const handleSubmit = () => {
		const { formValues } = formState;

		let header = Commons.header();
		console.log(header);
		let data = {
			name: formValues.viaName,
			fbid: formValues.viaFbid,
			email: formValues.viaEmail,
			emailPassword: formValues.viaEmailPassword,
			password: formValues.viaPassword,
			accessToken: formValues.viaAccessToken,
			tfa: formValues.viaTFA,
			fbLink: formValues.viaFbLink,
			fbName: formValues.viaFbName,
			label: formValues.viaLabel,
			status: 1,
		};
		if (formValues.viaDob) {
			data.dateOfBirth = formValues.viaDob;
		}
		if (formValues.viaDob) {
			data.gender = formValues.viaGender;
		}
		console.log(data);
		axios({
			url: `${Constants.API_DOMAIN}/api/vias/`,
			method: "POST",
			headers: header,
			data: data,
		})
			.then((resp) => {
				props.history.push("/admin/manage-via");
				// console.log(resp.data);
			})
			.catch((err) => {
				props.history.push("/admin/manage-via");
				console.log(err);
			});
	};
	return (
		<div>
			<Fade in={true}>
				<div className={classes.layout}>
					<Paper className={classes.paper}>
						<Typography variant="h6" gutterBottom>
							Thêm VIA mới
						</Typography>
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
									value={
										formState.formValues.viaEmailPassword
									}
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
						<div className={classes.buttons}>
							<Button
								variant="contained"
								color="secondary"
								onClick={handleCancel}
								className={classes.button}
							>
								Thoát
							</Button>

							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								className={classes.button}
							>
								Tạo VIA
							</Button>
						</div>
					</Paper>
				</div>
			</Fade>
		</div>
	);
}

export default CreateVIA;

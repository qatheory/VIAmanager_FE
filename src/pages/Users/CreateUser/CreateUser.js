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
import Constants from "_helpers/localConstants.js";
import Commons from "_helpers/commons.js";
import { FlashOnRounded } from "@material-ui/icons";

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
function CreateUser(props) {
	const classes = useStyles();
	const [formState, setFormState] = React.useState({
		formValues: {
			username: "",
			first_name: "",
			last_name: "",
			password: "",
			password_repeat: "",
			group: "",
			label: "",
		},
		formErrors: {
			password: "",
			password_repeat: "",
		},
		formValidity: {
			password: false,
			password_repeat: false,
		},
	});
	const handleChange = ({ target }) => {
		const { formValues } = formState;
		formValues[target.name] = target.value;
		setFormState({ formValues });
		handleValidation(target);
	};

	const handleValidation = (target) => {
		const { name, value } = target;
		const fieldValidationErrors = formState.formErrors;
		const validity = formState.formValidity;
		// const isEmail = name === "username";
		const isPassword = name === "password";
		const isPasswordRepeat = name === "password_repeat";

		// const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

		validity[name] = value.length > 0;
		// fieldValidationErrors[name] = validity[name]
		// 	? ""
		// 	: `${name} is required and cannot be empty`;

		if (validity[name]) {
			// if (isEmail) {
			// 	validity[name] = emailTest.test(value);
			// 	fieldValidationErrors[name] = validity[name]
			// 		? ""
			// 		: `${name} should be a valid email address`;
			// }
			if (isPassword) {
				validity[name] = value.length >= 3;
				fieldValidationErrors[name] = validity[name]
					? ""
					: `${name} cần ít nhất 3 ký tự`;
			}
			if (isPasswordRepeat) {
				validity[name] = value == formState.formValues.password;
				fieldValidationErrors[name] = validity[name]
					? ""
					: `Mật khẩu nhập lại phải trùng với mật khẩu đã cho`;
			}
		}

		setFormState({
			...formState,
			formErrors: fieldValidationErrors,
			formValidity: validity,
		});
	};

	const handleCancel = () => {
		props.history.push("/admin/users");
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		const { formValues, formValidity } = formState;
		if (
			Object.values(formValidity).every(
				Boolean
				//   (checkValid) => {
				// 	return checkValid == false;
				// }
			)
		) {
			let header = Commons.header();
			let data = {
				username: formValues.username.trim(),
				first_name: formValues.first_name.trim(),
				last_name: formValues.last_name.trim(),
				password: formValues.password.trim(),
				profile: {
					group: formValues.group.trim(),
					label: formValues.label.trim(),
				},
			};
			axios({
				url: `${Constants.API_DOMAIN}/api/users/`,
				method: "POST",
				headers: header,
				data: data,
			})
				.then((resp) => {
					props.history.push("/admin/users");
					// console.log(resp.data);
				})
				.catch((err) => {
					props.history.push("/admin/users");
					console.log(err);
				});
		} else {
			for (let key in formValues) {
				let target = {
					name: key,
					value: formValues[key],
				};
				handleValidation(target);
			}
		}
	};
	return (
		<div>
			<Fade in={true}>
				<div className={classes.layout}>
					<Paper className={classes.paper}>
						<form onSubmit={handleSubmit}>
							<Typography variant="h6" gutterBottom>
								Thêm tài khoản mới
							</Typography>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<TextField
										id="username"
										name="username"
										label="Username"
										value={formState.formValues.username}
										onChange={handleChange}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										required
										id="first_name"
										name="first_name"
										label="First name"
										value={formState.formValues.first_name}
										onChange={handleChange}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										id="last_name"
										name="last_name"
										label="Last name"
										fullWidth
										value={formState.formValues.last_name}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										id="password"
										name="password"
										label="Mật khẩu"
										error={!formState.formValidity.password}
										value={formState.formValues.password}
										helperText="Mật khẩu cần ít nhất 3 ký tự"
										type="password"
										onChange={handleChange}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										id="password_repeat"
										name="password_repeat"
										label="nhập lại mật khẩu"
										error={
											!formState.formValidity
												.password_repeat
										}
										value={
											formState.formValues.password_repeat
										}
										helperText="Mật khẩu nhập lại phải trùng với mật khẩu đã cho"
										type="password"
										onChange={handleChange}
										fullWidth
										required
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										id="group"
										name="group"
										label="Nhóm"
										value={formState.formValues.group}
										onChange={handleChange}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} sm={9}>
									<TextField
										id="label"
										name="label"
										label="Ghi Chú"
										value={formState.formValues.label}
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
									// onClick={handleSubmit}
									className={classes.button}
									type="submit"
								>
									Tạo tài khoản
								</Button>
							</div>
						</form>
					</Paper>
				</div>
			</Fade>
		</div>
	);
}

export default CreateUser;

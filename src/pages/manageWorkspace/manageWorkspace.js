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
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		padding: theme.spacing(2),
		[theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
			marginTop: theme.spacing(6),
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
	let header = Commons.header();
	const classes = useStyles();
	let currentWorkspace = useSelector(
		(state) => state.workspaces.currentWorkspace
	);

	const [formState, setFormState] = React.useState({
		formValues: {
			workspaceName: "",
			accessToken: "",
			AppID: "",
		},
	});
	React.useEffect(() => {
		if (currentWorkspace.id != null) {
			axios({
				url: `${Constants.API_DOMAIN}/api/workspace/${currentWorkspace.id}/`,
				method: "GET",
				headers: header,
			})
				.then((resp) => {
					console.log(resp.data);
					setFormState({
						formValues: {
							workspaceName: resp.data.name,
							accessToken: resp.data.accessToken,
							AppID: resp.data.appID,
						},
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [currentWorkspace.id]);
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
		console.log(formValues);
		var bodyFormData = new FormData();
		bodyFormData.append("name", formValues.workspaceName);
		bodyFormData.append("accessToken", formValues.accessToken);
		bodyFormData.append("appID", formValues.AppID);
		axios({
			url: `${Constants.API_DOMAIN}/api/workspace/${currentWorkspace.id}/`,
			method: "PUT",
			headers: header,
			data: bodyFormData,
		}).then((resp) => {
			console.log(resp.data);
		});
		// .catch((err) => {
		//     console.log(err);
		// });
	};
	return (
		<div>
			<Fade in={true}>
				<div className={classes.layout}>
					<Paper className={classes.paper}>
						<Typography variant="h6" gutterBottom>
							Cập nhật nhóm
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField
									required
									id="workspace"
									name="workspaceName"
									label="Tên nhóm"
									value={formState.formValues.workspaceName}
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							{/* <Grid item xs={12} sm={4}>
                <TextField
                  id="viaAlternative"
                  name="viaAlternative"
                  label="Tên thay thế cho VIA"
                  value={formState.formValues.viaAlternative}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid> */}
							<Grid item xs={12}>
								<TextField
									required
									id="accessToken"
									name="accessToken"
									label="Access Token"
									fullWidth
									value={formState.formValues.accessToken}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									id="AppID"
									name="AppID"
									label="App ID"
									value={formState.formValues.AppID}
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
								Cập nhật nhóm
							</Button>
						</div>
					</Paper>
				</div>
			</Fade>
		</div>
	);
}

export default CreateVIA;

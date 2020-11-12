import React from "react";
import clsx from "clsx";
import * as XLSX from "xlsx";
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
	CircularProgress,
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
import blue from "@material-ui/core/colors/blue";

import { useSnackbar } from "notistack";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
import Commons from "_helpers/commons.js";
let defaultFormState = {
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
};
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
const columns = [
	{ id: "name", label: "VIA", minWidth: 100 },
	{ id: "note", label: "Ghi chú", minWidth: 170 },
	{
		id: "status",
		label: "Trạng thái",
		minWidth: 100,
	},
];
function CreateVIA(props) {
	const classes = useStyles();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [loading, setLoading] = React.useState(false);
	const [batchUploadStatus, setBatchUploadStatus] = React.useState(false);
	const [queueId, setQueueId] = React.useState(false);
	const [batchUploadVias, setBatchUploadVias] = React.useState([]);
	const [formState, setFormState] = React.useState(defaultFormState);
	const handleChange = ({ target }) => {
		const { formValues } = formState;
		formValues[target.name] = target.value;
		setFormState({ formValues });
		// handleValidation(target);
	};
	const handleCancel = () => {
		props.history.push("/admin/manage-via");
	};
	const createVia = async (event, queueId) => {
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
			status: 1,
		};
		if (formValues.viaDob) {
			data.dateOfBirth = formValues.viaDob.trim();
		}
		if (formValues.viaDob) {
			data.gender = formValues.viaGender.trim();
		}
		axios({
			url: `${Constants.API_DOMAIN}/api/vias/`,
			method: "POST",
			headers: header,
			data: data,
		})
			.then((resp) => {
				setLoading(false);
				if (queueId) {
					let newBatchUploadVias = [...batchUploadVias];
					if (resp.data.status == "updated") {
						newBatchUploadVias.note = "cập nhật thành công";
						newBatchUploadVias.status = "updated";
					}
					if (resp.data.status == "created") {
						newBatchUploadVias.note = "Thêm via thành công";
						newBatchUploadVias.status = "created";
					}
					return;
				}
				props.history.push("/admin/manage-via");
				// console.log(resp.data);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
				if (queueId) {
					let newBatchUploadVias = [...batchUploadVias];
					newBatchUploadVias.note = "Đã xảy ra lỗi không xác định";
					newBatchUploadVias.status = "error";
					return;
				}
				props.history.push("/admin/manage-via");
			});
	};
	const handleSubmit = async (event, queueId) => {
		console.log(queueId);
		const { formValues } = formState;
		setLoading(true);
		axios({
			url: `https://graph.facebook.com/v8.0/me`,
			method: "GET",
			params: { access_token: formValues.viaAccessToken.trim() },
		})
			.then((resp) => {
				createVia(queueId);
			})
			.catch((err) => {
				console.log(err.response.data);
				if (err.response.data.error) {
					enqueueSnackbar("Access token không hợp lệ", {
						variant: "error",
					});
					setLoading(false);
					if (queueId) {
						let newBatchUploadVias = [...batchUploadVias];
						newBatchUploadVias.note = "Access token không hợp lệ";
						newBatchUploadVias.status = "error";
						return;
					}
					return;
				}
				enqueueSnackbar("Đã có lỗi xảy ra!!!", {
					variant: "error",
				});
				setLoading(false);
				if (queueId) {
					let newBatchUploadVias = [...batchUploadVias];
					newBatchUploadVias.note = "Xảy ra lỗi không xác định";
					newBatchUploadVias.status = "error";
					return;
				}
				return;
			});
	};
	const convertToJson = (csv) => {
		var lines = csv.split("\n");

		var result = [];

		var headers = lines[0].split(",");

		for (var i = 1; i < lines.length; i++) {
			var obj = {};
			var currentline = lines[i].split(",");

			for (var j = 0; j < headers.length; j++) {
				obj[headers[j]] = currentline[j];
			}
			if (obj.via != "") {
				result.push(obj);
			}
		}

		//return result; //JavaScript object
		return result; //JSON
	};

	// START Batch create section

	const handleUploadFile = (event) => {
		let file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (evt) => {
			// evt = on_file_select event
			/* Parse data */
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: "binary" });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
			/* Update state */
			let listCreateVias = convertToJson(data); // shows data in json format
			listCreateVias = listCreateVias.map((via) => {
				return {
					name: via.via,
					data: via,
					note: "",
					status: "waiting",
				};
			});
			setBatchUploadVias(listCreateVias);
			importVias(listCreateVias);
		};
		reader.readAsBinaryString(file);
		reader.close();
	};
	const importVias = async (listCreateVias) => {
		setBatchUploadStatus(true);
		for (let i = 0; i < listCreateVias.length; i++) {
			let viasCreateParams = {
				viaName: listCreateVias.via,
				viaFbid: listCreateVias.fbid,
				viaEmail: listCreateVias.email,
				viaPassword: listCreateVias.password,
				viaEmailPassword: listCreateVias.email_password,
				viaAccessToken: listCreateVias.access_token,
				viaTFA: listCreateVias.tfa,
			};

			let newBatchUploadVias = [...batchUploadVias];
			newBatchUploadVias[i].status = "process";
			newBatchUploadVias[i].note = "Đang xử lý";
			SubmitListCreateVias(viasCreateParams);
		}
		setFormState(defaultFormState);
		setQueueId(false);
	};
	const handleCloseBatchUpload = () => {
		setBatchUploadStatus(false);
	};
	// END Batch create section
	const getStatusIcon = (status) => {
		switch (status) {
			case "created":
				return <AddCircleOutlineOutlinedIcon />;
			case "updated":
				return <CheckCircleOutlineIcon />;
			case "error":
				return <ErrorOutlineIcon />;
			case "waiting":
				return <PauseCircleOutlineIcon />;
			default:
				return <CircularProgress />;
		}
	};
	return (
		<div>
			<Fade in={true}>
				<div className={classes.layout}>
					<Paper
						className={clsx({
							[classes.paper]: true,
							[classes.progressLoading]: loading,
						})}
					>
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
									value={
										formState.formValues.viaEmailPassword
									}
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
						<div className={classes.buttons}>
							<Button
								variant="contained"
								color="secondary"
								onClick={handleCancel}
								className={classes.button}
								disabled={loading}
							>
								Thoát
							</Button>

							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								className={classes.button}
								disabled={loading}
							>
								Tạo VIA
							</Button>

							<input
								accept=".csv"
								className={classes.input}
								style={{ display: "none" }}
								id="raised-button-file"
								multiple
								type="file"
								disabled={loading}
								onChange={handleUploadFile}
							/>
							<label htmlFor="raised-button-file">
								<Button
									component="span"
									variant="contained"
									color="primary"
									disabled={loading}
									className={classes.button}
								>
									Upload
								</Button>
							</label>
						</div>
					</Paper>
					{loading && (
						<CircularProgress
							size={68}
							className={classes.progress}
						/>
					)}
					<Dialog
						open={batchUploadStatus}
						onClose={handleCloseBatchUpload}
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">
							{`Đang tiến hành cập nhật Via`}
						</DialogTitle>
						<DialogContent>
							<TableContainer>
								<Table aria-label="sticky table">
									<TableHead>
										<TableRow>
											{columns.map((column) => (
												<TableCell
													key={column.id}
													align={column.align}
													style={{
														minWidth:
															column.minWidth,
													}}
												>
													{column.label}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{batchUploadVias.slice().map((row) => {
											return (
												<TableRow
													hover
													role="checkbox"
													tabIndex={-1}
													key={row.id}
												>
													{columns.map(
														(column, colIndex) => {
															const value =
																row[column.id];
															if (
																column.id ==
																"status"
															) {
																return (
																	<TableCell
																		key={
																			column.id
																		}
																		align={
																			column.align
																		}
																	>
																		{getStatusIcon(
																			value
																		)}
																	</TableCell>
																);
															}
															return (
																<TableCell
																	key={
																		column.id
																	}
																	align={
																		column.align
																	}
																>
																	{column.format
																		? column.format(
																				value
																		  )
																		: value}
																</TableCell>
															);
														}
													)}
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</TableContainer>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={handleCloseBatchUpload}
								color="primary"
							>
								Đóng
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</Fade>
		</div>
	);
}

export default CreateVIA;

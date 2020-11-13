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
import green from "@material-ui/core/colors/green";
import { useSnackbar } from "notistack";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
import Commons from "_helpers/commons.js";
import ViasServices from "_services/vias.js";

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
	const createVia = async () => {
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
		try {
			let createViaResult = await ViasServices.createVia(data);
			if (createViaResult.status == "success") {
				enqueueSnackbar(createViaResult.message, {
					variant: createViaResult.status,
				});
				return;
			} else {
				enqueueSnackbar(createViaResult.message, {
					variant: createViaResult.status,
				});
				return;
			}
		} catch (err) {
			enqueueSnackbar("Đã có lỗi xảy ra!!!", {
				variant: "error",
			});
			setLoading(false);
			return;
		} finally {
			setLoading(false);
			props.history.push("/admin/manage-via");
		}
	};
	const handleSubmit = async () => {
		const { formValues } = formState;
		setLoading(true);
		try {
			let checkViasResult = await ViasServices.checkVia(
				formValues.viaAccessToken.trim()
			);
			if (checkViasResult.status == "success") {
				createVia();
			} else {
				enqueueSnackbar(checkViasResult.message, {
					variant: checkViasResult.status,
				});
				setLoading(false);
				return;
			}
		} catch (err) {
			enqueueSnackbar("Đã có lỗi xảy ra!!!", {
				variant: "error",
			});
			setLoading(false);
			return;
		}
	};

	// START Batch create section

	const convertToJson = (csv) => {
		var lines = csv.split("\n");

		var result = [];
		let isValidExcelFile = true;
		let missingFields = [];

		var headers = lines[0].split(",");
		headers.map((field) => {
			return field.trim().toLowerCase();
		});
		console.log(headers);
		if (headers.indexOf("via") === -1) {
			isValidExcelFile = false;
			missingFields.push("via");
		}
		if (headers.indexOf("fbid") === -1) {
			isValidExcelFile = false;
			missingFields.push("fbid");
		}
		if (headers.indexOf("access_token") === -1) {
			isValidExcelFile = false;
			missingFields.push("access_token");
		}
		if (isValidExcelFile == false) {
			return { error: { missingFields: missingFields } };
		}
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

		return result; //JSON
	};

	const handleUploadFile = async (event) => {
		let file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = async (evt) => {
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
			if (listCreateVias.error) {
				enqueueSnackbar(
					`File không đúng quy định, thiếu trường ${listCreateVias.error.missingFields.join(
						", "
					)}`,
					{
						variant: "error",
					}
				);
				return;
			}
			listCreateVias = listCreateVias.map((via) => {
				return {
					name: via.via,
					data: via,
					note: "",
					status: "waiting",
				};
			});
			await setBatchUploadVias(listCreateVias);
			await importVias(listCreateVias);
		};
		await reader.readAsBinaryString(file);
		event.target.value = null;
		// reader.close();
	};
	const importVias = async (listCreateVias) => {
		setBatchUploadStatus(true);
		for (let i = 0; i < listCreateVias.length; i++) {
			let viaCreateParams = {
				viaName: listCreateVias[i].data.via,
				viaFbid: listCreateVias[i].data.fbid,
				viaEmail: listCreateVias[i].data.email,
				viaPassword: listCreateVias[i].data.password,
				viaEmailPassword: listCreateVias[i].data.email_password,
				viaAccessToken: listCreateVias[i].data.access_token,
				viaTFA: listCreateVias[i].data.tfa,
			};

			listCreateVias[i].status = "process";
			listCreateVias[i].note = "Đang xử lý";
			setBatchUploadVias([...listCreateVias]);

			let result = await submitListCreateVias(viaCreateParams);
			listCreateVias[i].status = result.status;
			listCreateVias[i].note = result.note;
			setBatchUploadVias([...listCreateVias]);
		}
		setBatchUploadVias([...listCreateVias]);
	};

	const submitListCreateVias = async (viaCreateParams) => {
		setLoading(true);
		try {
			await axios({
				url: `https://graph.facebook.com/v8.0/me`,
				method: "GET",
				params: { access_token: viaCreateParams.viaAccessToken.trim() },
			});
			let createViaResult = await createViaByList(viaCreateParams);
			return createViaResult;
		} catch (err) {
			console.log(err);
			if (err) {
				enqueueSnackbar("Access token không hoạt động", {
					variant: "error",
				});
				setLoading(false);
				return {
					note: "Access token không hoạt động",
					status: "error",
				};
			}
			enqueueSnackbar("Đã có lỗi xảy ra!!!", {
				variant: "error",
			});
			setLoading(false);
			return {
				note: "Xảy ra lỗi không xác định",
				status: "error",
			};
		}
	};
	const createViaByList = async (viaCreateParams) => {
		let header = Commons.header();
		let data = {
			name: viaCreateParams.viaName.trim(),
			fbid: viaCreateParams.viaFbid.trim(),
			email: viaCreateParams.viaEmail.trim(),
			emailPassword: viaCreateParams.viaEmailPassword.trim(),
			password: viaCreateParams.viaPassword.trim(),
			accessToken: viaCreateParams.viaAccessToken.trim(),
			tfa: viaCreateParams.viaTFA.trim(),
			status: 1,
		};
		try {
			let resp = await axios({
				url: `${Constants.API_DOMAIN}/api/vias/`,
				method: "POST",
				headers: header,
				data: data,
			});
			if (resp.data.status == "updated") {
				return {
					note: "Cập nhật thành công",
					status: "updated",
				};
			}
			if (resp.data.status == "created") {
				return {
					note: "Thêm via thành công",
					status: "created",
				};
			}
			return {
				note: "Không nhận được phản hồi từ server",
				status: "error",
			};
		} catch (err) {
			console.log(err);
			return {
				note: "Đã xảy ra lỗi không xác định",
				status: "error",
			};
		} finally {
			setLoading(false);
		}
	};
	const handleCloseBatchUpload = () => {
		setBatchUploadStatus(false);
	};
	// END Batch create section
	const getStatusIcon = (status) => {
		switch (status) {
			case "created":
				return (
					<AddCircleOutlineOutlinedIcon
						style={{ color: green[500] }}
					/>
				);
			case "updated":
				return <CheckCircleOutlineIcon color="primary" />;
			case "error":
				return <ErrorOutlineIcon color="secondary" />;
			case "waiting":
				return <PauseCircleOutlineIcon color="action" />;
			default:
				return <CircularProgress size={24} />;
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
								<Table
									size="small"
									aria-label="sticky dense table"
								>
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
													key={row.data.name}
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

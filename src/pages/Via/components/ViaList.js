import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Commons from "_helpers/commons.js";
import {
	Paper,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	IconButton,
	Tooltip,
} from "@material-ui/core";
import {
	toggleDetailsDialog,
	openDetailsDialog,
	setViaDetailID,
	setLoadViasStatus,
	setViaDeleteName,
	openDeleteDialog,
	closeLoginDialog,
	openLoginDialog,
	setViaLoginInfo,
	setViaDeleteID,
} from "store/reducers/via";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import HowToRegIcon from "@material-ui/icons/HowToReg";

import axios from "axios";
import Constants from "_helpers/constants.js";
const columns = [
	{ id: "name", label: "VIA", minWidth: 100 },
	{ id: "email", label: "Email", minWidth: 170 },
	{ id: "password", label: "Password", minWidth: 170 },
	{
		id: "status",
		label: "Trạng thái",
		align: "right",
	},
	{
		id: "tfa",
		label: "Key",
		minWidth: 100,
		align: "right",
	},
	{
		id: "options",
		label: "Tùy chọn",
		minWidth: 170,
		align: "right",
	},
];

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		padding: "0px",
	},
	container: {
		maxHeight: 440,
	},
	optionButton: {
		padding: "0px",
		"margin-left": "12px",
	},
}));

export default function VIAList() {
	const classes = useStyles();
	const dispatch = useDispatch();
	let isLoadingVias = useSelector((state) => state.via.isLoadingVias);
	let searchParams = useSelector((state) => state.via.searchParams);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [listVias, setListVias] = React.useState([]);
	React.useEffect(() => {
		if (isLoadingVias == true) {
			getViasList();
		}
		dispatch(setLoadViasStatus(false));
	}, [isLoadingVias]);

	React.useEffect(() => {
		getViasList();
	}, []);

	const getViasList = () => {
		let header = Commons.header();
		axios({
			url: `${Constants.API_DOMAIN}/api/vias/`,
			method: "GET",
			headers: header,
			params: searchParams,
		})
			.then((resp) => {
				dispatch(setLoadViasStatus(false));
				setListVias(resp.data);
			})
			.catch((err) => {
				dispatch(setLoadViasStatus(false));
				console.log(err);
			});
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const handleClickOpenViaDetails = (viaID) => {
		dispatch(setViaDetailID(viaID));
		dispatch(openDetailsDialog());
	};
	const handleClickOpenViaDelete = (id, name) => {
		dispatch(setViaDeleteID(id));
		dispatch(setViaDeleteName(name));
		dispatch(openDeleteDialog());
	};
	const handleClickOpenViaLogin = (name, email, password, tfa) => {
		dispatch(setViaLoginInfo({ name, email, password, tfa }));
		dispatch(openLoginDialog());
	};

	return (
		<React.Fragment>
			<Paper variant="outlined" className={classes.root}>
				<TableContainer>
					<Table aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{listVias
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row) => {
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.id}
										>
											{columns.map((column, colIndex) => {
												const value = row[column.id];
												if (colIndex == 3) {
													return (
														<TableCell
															key={column.id}
															align={column.align}
														>
															{value == 1
																? "Đang hoạt động"
																: "Dừng hoạt động"}
														</TableCell>
													);
												}
												// if (colIndex == 4) {
												// 	return (
												// 		<TableCell
												// 			key={column.id}
												// 			align={column.align}
												// 		>
												// 			this is key
												// 		</TableCell>
												// 	);
												// }
												if (colIndex == 5) {
													return (
														<TableCell
															key={column.id}
															align={column.align}
														>
															<Tooltip
																title="Thông tin đăng nhập"
																placement="top"
															>
																<IconButton
																	className={
																		classes.optionButton
																	}
																	aria-label="Thông tin đăng nhập"
																	color="primary"
																	onClick={() =>
																		handleClickOpenViaLogin(
																			row.name,
																			row.email,
																			row.password,
																			row.tfa
																		)
																	}
																>
																	<HowToRegIcon />
																</IconButton>
															</Tooltip>
															<Tooltip
																title="Chi tiết"
																placement="top"
															>
																<IconButton
																	className={
																		classes.optionButton
																	}
																	aria-label="Chi tiết"
																	color="primary"
																	onClick={() =>
																		handleClickOpenViaDetails(
																			row.id
																		)
																	}
																>
																	<EditIcon />
																</IconButton>
															</Tooltip>
															<Tooltip
																title="Xóa"
																placement="top"
															>
																<IconButton
																	className={
																		classes.optionButton
																	}
																	aria-label="Xóa"
																	onClick={() =>
																		handleClickOpenViaDelete(
																			row.id,
																			row.name
																		)
																	}
																>
																	<DeleteIcon />
																</IconButton>
															</Tooltip>
														</TableCell>
													);
												}
												return (
													<TableCell
														key={column.id}
														align={column.align}
													>
														{column.format &&
														typeof value ===
															"number"
															? column.format(
																	value
															  )
															: value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25, 100]}
					component="div"
					count={listVias.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</React.Fragment>
	);
}

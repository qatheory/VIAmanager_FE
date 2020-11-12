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
	Tooltip,
	IconButton,
} from "@material-ui/core";
import { red, amber } from "@material-ui/core/colors";
import {
	openDetailsDialog,
	setUserDetailId,
	setLoadUsersStatus,
	openUserDeleteDialog,
	setUserDeleteId,
	setUserDeleteName,
	setUserResetPasswordId,
	setUserResetPasswordName,
	openUserResetPasswordDialog,
} from "store/reducers/user";
import clsx from "clsx";
import UsersDetails from "pages/Users/components/UsersDetails";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import axios from "axios";
import Constants from "_helpers/localConstants.js";
const getProfileGroup = (profile) => {
	return profile ? profile.group : "";
};
const getProfileLabel = (profile) => {
	return profile ? profile.label : "";
};
const columns = [
	{ id: "username", label: "Tài khoản", minWidth: 100 },
	{ id: "profile", label: "Nhóm", minWidth: 100, format: getProfileGroup },
	{
		id: "profile",
		label: "Chú thích",
		minWidth: 100,
		format: getProfileLabel,
	},
	{
		id: "options",
		label: "Tùy chọn",
		// minWidth: 170,
		align: "right",
	},
];

const useStyles = makeStyles({
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
	rowDanger: {
		background: red[50],
	},
	rowWarning: {
		background: amber[50],
	},
});

export default function UsersList() {
	const classes = useStyles();
	const dispatch = useDispatch();
	let isLoadingUsers = useSelector((state) => state.user.isLoadingUsers);
	let searchParams = useSelector((state) => state.user.searchParams);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [listUsers, setListUsers] = React.useState([]);
	React.useEffect(() => {
		if (isLoadingUsers == true) {
			getUsersList();
		}
		dispatch(setLoadUsersStatus(false));
	}, [isLoadingUsers]);

	React.useEffect(() => {
		getUsersList();
	}, []);

	const getUsersList = () => {
		let header = Commons.header();
		axios({
			url: `${Constants.API_DOMAIN}/api/users/`,
			method: "GET",
			headers: header,
			params: searchParams,
		})
			.then((resp) => {
				dispatch(setLoadUsersStatus(false));
				setListUsers(resp.data);
			})
			.catch((err) => {
				dispatch(setLoadUsersStatus(false));
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
	const handleClickOpenUsersDetails = (usersID) => {
		dispatch(setUserDetailId(usersID));
		dispatch(openDetailsDialog());
	};
	const handleClickDeleteUser = (usersID, username) => {
		dispatch(setUserDeleteId(usersID));
		dispatch(setUserDeleteName(username));
		dispatch(openUserDeleteDialog());
	};
	const handleClickOpenUserResetPassword = (userId, username) => {
		dispatch(setUserResetPasswordId(userId));
		dispatch(setUserResetPasswordName(username));
		dispatch(openUserResetPasswordDialog());
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
							{listUsers
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
															{/* <Tooltip title="Chi tiết" placement="top">
                                <IconButton
                                  className={classes.optionButton}
                                  aria-label="Chi tiết"
                                  color="primary"
                                  onClick={() =>
                                    handleClickOpenUsersDetails(row.id)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip> */}
															<Tooltip
																title="Reset mật khẩu"
																placement="top"
															>
																<IconButton
																	className={
																		classes.optionButton
																	}
																	aria-label="Reset mật khẩu"
																	color="primary"
																	onClick={() =>
																		handleClickOpenUserResetPassword(
																			row.id,
																			row.username
																		)
																	}
																>
																	<LockOpenIcon />
																</IconButton>
															</Tooltip>
															<Tooltip
																title="Xoá tài khoản"
																placement="top"
															>
																<IconButton
																	className={
																		classes.optionButton
																	}
																	aria-label="Xóa tài khoản"
																	color="primary"
																	onClick={() =>
																		handleClickDeleteUser(
																			row.id,
																			row.username
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
														{column.format
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
					count={listUsers.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			{/* <UsersDetails /> */}
		</React.Fragment>
	);
}

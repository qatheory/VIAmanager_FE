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
  toggleDetailsDialog,
  openDetailsDialog,
  setUsersDetailID,
  setLoadUsersStatus,
  openUsersOwnersDialog,
  setUsersOwnersId,
  setUsersOwnersName,
} from "store/reducers/users";
import clsx from "clsx";
import UsersDetails from "pages/Users/components/UsersDetails";
// import UsersountVia from "pages/Users/components/UsersountVia";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import axios from "axios";
import Constants from "_helpers/constants.js";
const showAccountStatus = (statusID) => {
  switch (statusID) {
    case 1:
      return "Đang hoạt động";
    case 2:
      return "Vô hiệu hóa";
    case 3:
      return "Không ổn định";
    case 7:
      return "Đang được xét duyệt";
    case 8:
      return "Đang chờ xử lý";
    case 9:
      return "Đang chờ gia hạn";
    case 101:
      return "Chuẩn bị dừng hoạt động";
    case 102:
      return "Đã dừng hoạt động";
    case 201:
      return "Hoạt động";
    case 202:
      return "Không hoạt động";
    default:
      return "Không xác định";
  }
};

const showAccountDisableReason = (statusID) => {
  switch (statusID) {
    case 0:
      return "Vẫn đang chạy ngon";
    case 1:
      return "Vi phạm chính sách quảng cáo";
    case 2:
      return "Kiểm tra vi phạm IP";
    case 3:
      return "Vi phạm tài khoản thanh toán";
    case 4:
      return "Tài khoản đã dừng hoạt động";
    case 5:
      return "Đang review ads";
    case 6:
      return "Vi phạm do BM";
    case 7:
      return "Bị dừng vĩnh viễn";
    case 8:
      return "Đã dừng hoạt động";
    case 9:
      return "Tài khoản Reseller không được sử dụng";
    case 10:
      return "Tài khoản đã không được sử dụng";
    default:
      return "Không xác định";
  }
};

const columns = [
  { id: "name", label: "Tài khoản", minWidth: 100 },
  { id: "group", label: "Nhóm", minWidth: 100 },
  { id: "label", label: "Chú thích", minWidth: 100 },
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
  let isLoadingUsers = useSelector((state) => state.users.isLoadingUsers);
  let searchParams = useSelector((state) => state.users.searchParams);
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
    dispatch(setUsersDetailID(usersID));
    dispatch(openDetailsDialog());
  };
  const handleClickDeleteUser = (usersID, username) => {
    dispatch(setUserDeleteID(id));
    dispatch(setUserDeleteName(username));
    dispatch(openDeleteDialog());
  };
  const handleClickOpenUserResetPassword = (userId) => {
    dispatch(setUserResetPasswordID(userId));
    dispatch(openResetPasswordDialog());
  };
  const checkIfDanger = (status) => {
    if (status == 2 || status == 101 || status == 102 || status == 202) {
      return true;
    }
    return false;
  };
  const checkIfWarning = (status) => {
    if (status == 3 || status == 7 || status == 8 || status == 9) {
      return true;
    }
    return false;
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
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column, colIndex) => {
                        const value = row[column.id];
                        if (colIndex == 3) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Tooltip title="Chi tiết" placement="top">
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
                              </Tooltip>
                              <Tooltip title="Reset mật khẩu" placement="top">
                                <IconButton
                                  className={classes.optionButton}
                                  aria-label="Reset mật khẩu"
                                  color="primary"
                                  onClick={() =>
                                    handleClickOpenUserResetPassword(row.id)
                                  }
                                >
                                  <LockOpenIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reset mật khẩu" placement="top">
                                <IconButton
                                  className={classes.optionButton}
                                  aria-label="Reset mật khẩu"
                                  color="primary"
                                  onClick={() => handleClickDeleteUser(row.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value) : value}
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
      <UsersDetails />
      {/* <UsersountVia /> */}
    </React.Fragment>
  );
}

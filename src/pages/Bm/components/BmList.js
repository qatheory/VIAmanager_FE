import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { red, amber } from "@material-ui/core/colors";
import clsx from "clsx";

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
import {
  setBmOwnersId,
  setBmOwnersName,
  openBmOwnersDialog,
  setLoadBmStatus,
  setAdsAccOwnedId,
  setAdsAccOwnedName,
  openAdsAccOwnedDialog,
  setAdsAccOwnedVia,
} from "store/reducers/bm";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import axios from "axios";
import Constants from "_helpers/constants.js";
const convertVerificationStatus = (status) => {
  switch (status) {
    case "verified":
      return "Đã xác minh";
    case "not_verified":
      return "Chưa xác minh";
    default:
      return "";
  }
};
const columns = [
  { id: "name", label: "BM", minWidth: 100 },
  { id: "id", label: "ID", minWidth: 100 },
  {
    id: "verification_status",
    label: "Trạng thái",
    align: "right",
    format: convertVerificationStatus,
  },
  {
    id: "options",
    label: "Tùy chọn",
    minWidth: 170,
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
});

export default function BMList() {
  let header = Commons.header();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listBMs, setListBMs] = React.useState([]);
  let isLoadingBm = useSelector((state) => state.bm.isLoadingBm);
  let selectedVia = useSelector((state) => state.bm.selectedVia);
  let selectedStatus = useSelector((state) => state.bm.bmStatus);
  React.useEffect(() => {
    if (isLoadingBm == true) {
      getBmList();
    }
  }, [isLoadingBm]);
  React.useEffect(() => {
    getBmList();
  }, []);
  const getBmList = () => {
    axios({
      url: `${Constants.API_DOMAIN}/api/bms/`,
      method: "GET",
      headers: header,
      params: { via: selectedVia, status: selectedStatus },
    })
      .then((resp) => {
        dispatch(setLoadBmStatus(false));
        setListBMs(resp.data);
      })
      .catch((err) => {
        dispatch(setLoadBmStatus(false));
        console.log(err);
      });
  };

  const checkIfNotVerified = (status) => {
    return status == "not_verified" ? true : false;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClickOpenOwnedAdsAcc = (name, id, owners) => {
    dispatch(setAdsAccOwnedId(id));
    dispatch(setAdsAccOwnedName(name));
    dispatch(setAdsAccOwnedVia(owners[0].id));
    dispatch(openAdsAccOwnedDialog());
  };
  const handleClickOpenBmOwners = (name, owners) => {
    owners = owners.map((owner) => owner.id);
    dispatch(setBmOwnersId(owners));
    dispatch(setBmOwnersName(name));
    dispatch(openBmOwnersDialog());
  };

  return (
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
            {listBMs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    className={clsx({
                      [classes.rowDanger]: checkIfNotVerified(
                        row.verification_status
                      ),
                    })}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column, colIndex) => {
                      const value = row[column.id];
                      if (column.id == "options") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Tooltip title="Tài khoản ads" placement="top">
                              <IconButton
                                className={classes.optionButton}
                                aria-label="Tài khoản ads"
                                color="primary"
                                onClick={() =>
                                  handleClickOpenOwnedAdsAcc(
                                    row.name,
                                    row.id,
                                    row.owner
                                  )
                                }
                              >
                                <LocalActivityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Via sở hữu" placement="top">
                              <IconButton
                                className={classes.optionButton}
                                aria-label="Via sở hữu"
                                color="primary"
                                onClick={() =>
                                  handleClickOpenBmOwners(row.name, row.owner)
                                }
                              >
                                <AccountBoxIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
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
        count={listBMs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

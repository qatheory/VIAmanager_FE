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
} from "@material-ui/core";
import axios from "axios";
import Constants from "_helpers/constants.js";
const columns = [
  { id: "name", label: "BM", minWidth: 100 },
  { id: "BMID", label: "ID", minWidth: 170 },
  { id: "accessToken", label: "Token", minWidth: 170 },
  {
    id: "status",
    label: "Trạng thái",
    align: "right",
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
});

export default function BMList() {
  const classes = useStyles();
  let currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  // React.useEffect(() => {
  // console.log(currentWorkspace.id);

  // });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listBMs, setListBMs] = React.useState([]);
  React.useEffect(() => {
    if (currentWorkspace.id != null) {
      axios({
        url: `${Constants.API_DOMAIN}/api/bms/`,
        method: "GET",
        headers: Commons.header,
        params: {
          workspace: currentWorkspace.id,
        },
      })
        .then((resp) => {
          setListBMs(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentWorkspace.id]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column, colIndex) => {
                      const value = row[column.id];
                      if (colIndex == 3) {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            this is key
                          </TableCell>
                        );
                      }
                      if (colIndex == 4) {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            this is options
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

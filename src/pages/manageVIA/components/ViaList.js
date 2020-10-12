import React from "react";
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
  { id: "via", label: "VIA", minWidth: 100 },
  { id: "viaID", label: "ID", minWidth: 170 },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 100,
    align: "right",
  },
  {
    id: "ads",
    label: "Tài khoản Ads",
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

function createData(via, viaID, status, ads, options) {
  return { via, viaID, status, ads, options };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    padding: "0px",
  },
  container: {
    maxHeight: 440,
  },
});
let stateWorkspace = null;

export default function VIAList() {
  const classes = useStyles();
  let currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  let listVias = [];
  // React.useEffect(() => {
  // console.log(currentWorkspace.id);
  if (currentWorkspace.id && currentWorkspace.id != stateWorkspace) {
    stateWorkspace = currentWorkspace.id;
    axios({
      url: `${Constants.API_DOMAIN}/api/vias/`,
      method: "GET",
      headers: Commons.header,
      params: {
        workspace: currentWorkspace.id,
      },
    })
      .then((resp) => {
        console.log(resp);
        listVias = resp.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
            {listVias
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.viaID}>
                    {columns.map((column, colIndex) => {
                      const value = row[column.id];
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
        count={listVias.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

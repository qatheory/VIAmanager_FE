import React, { useEffect } from "react";
import {
  Button,
  TextField,
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

import { useSelector, useDispatch } from "react-redux";
import {
  toggleDetailsDialog,
  closeBmOwnersDialog,
  setBmOwnersId,
  setBmOwnersName,
} from "store/reducers/bm";
import { authenticator } from "otplib";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/constants.js";
import axios from "axios";

const columns = [
  { id: "name", label: "VIA", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "password",
    label: "Password",
    minWidth: 100,
  },
  {
    id: "tfa",
    label: "TFA Key",
  },
];

export default function BmOwners(props) {
  let dispatch = useDispatch();
  const [bmOwnersInfo, setBmOwnersInfo] = React.useState([]);

  let bmOwnersDialogStatus = useSelector((state) => state.bm.ownersDialog);
  const getTFAcode = (tfa) => {
    if (tfa) return authenticator.generate(tfa);
  };
  let bmOwnersId = useSelector((state) => state.bm.bmOwnersId);
  let bmOwnersName = useSelector((state) => state.bm.bmOwnersName);

  useEffect(() => {
    if (bmOwnersId.length != 0) {
      let header = Commons.header();
      axios({
        url: `${Constants.API_DOMAIN}/api/vias/`,
        method: "GET",
        headers: header,
        params: { id: bmOwnersId.join(",") },
      })
        .then((resp) => {
          let bmOwners = resp.data.map((bmOwner) => {
            return {
              name: bmOwner.name,
              id: bmOwner.id,
              email: bmOwner.email,
              password: bmOwner.password,
              tfa: bmOwner.tfa,
            };
          });
          setBmOwnersInfo(bmOwners);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [bmOwnersId]);
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    dispatch(setBmOwnersId([]));
    dispatch(setBmOwnersName(""));
    dispatch(closeBmOwnersDialog());
    setBmOwnersInfo([])
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={bmOwnersDialogStatus}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {`Via sở hữu BM ${bmOwnersName}`}
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
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bmOwnersInfo.slice().map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column, colIndex) => {
                        const value = row[column.id];
                        if (colIndex == 3) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {getTFAcode(value)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

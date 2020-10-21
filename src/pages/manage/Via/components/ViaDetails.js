import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleDetailsDialog,
  closeDetailsDialog,
  setViaDetailID,
} from "store/reducers/via";
import Commons from "_helpers/commons.js";
import Constants from "_helpers/constants.js";
import axios from "axios";

export default function ViaDetails(props) {
  const [open, setOpen] = React.useState(false);
  const [via, setVia] = React.useState({
    viaInfo: {
      viaName: "",
      viaFbid: "",
      viaEmail: "",
      viaPassword: "",
      viaEmailPassword: "",
      viaAccessToken: "",
      viaTFA: "",
      viaFbName: "",
      viaFbLink: "",
      viaGender: "",
      viaDob: "",
      viaLabel: "",
    },
  });
  let dispatch = useDispatch();
  let viaDetailsDialogStatus = useSelector((state) => state.via.detailsDialog);
  let viaID = useSelector((state) => state.via.viaID);
  useEffect(() => {
    setOpen(viaDetailsDialogStatus);
  }, [viaDetailsDialogStatus]);
  useEffect(() => {
    if (viaID != "") {
      let header = Commons.header();
      axios({
        url: `${Constants.API_DOMAIN}/api/via/${viaID}/`,
        method: "GET",
        headers: header,
      })
        .then((resp) => {
          const { viaInfo } = via;
          viaInfo.viaName = resp.data.name;
          viaInfo.viaFbid = resp.data.fbid;
          viaInfo.viaEmail = resp.data.email;
          viaInfo.viaPassword = resp.data.password;
          viaInfo.viaEmailPassword = resp.data.emailPassword;
          viaInfo.viaAccessToken = resp.data.accessToken;
          viaInfo.viaTFA = resp.data.tfa;
          viaInfo.viaFbName = resp.data.fbName;
          viaInfo.viaFbLink = resp.data.fbLink;
          viaInfo.viaGender = resp.data.gender;
          viaInfo.viaDob = resp.data.dateOfBirth;
          viaInfo.viaLabel = resp.data.label;
          setVia({ viaInfo });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [viaID]);
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    dispatch(setViaDetailID(""));
    dispatch(closeDetailsDialog());
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

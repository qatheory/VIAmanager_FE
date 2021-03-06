import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Fade, Button, Icon } from "@material-ui/core";
import ViaList from "./components/ViaList";
import ViaHeader from "./components/ViaHeader";
import ViaDetails from "pages/Via/components/ViaDetails";
import ViaDeleteAlert from "pages/Via/components/ViaDeleteAlert";
import ViaLogin from "pages/Via/components/ViaLogin";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px",
  },
  cardHeader: {
    // "justify-content": "flex-end",
    display: "flex",
  },
}));
function ManageVIA(props) {
  const classes = useStyles();
  return (
    <div>
      <Fade in={true}>
        <Card>
          <CardContent className={classes.cardHeader}>
            <ViaHeader props={props} />
          </CardContent>
          <CardContent className={classes.root}>
            <ViaList />
          </CardContent>
        </Card>
      </Fade>
      <ViaDetails />
      <ViaDeleteAlert />
      <ViaLogin />
    </div>
  );
}

export default ManageVIA;

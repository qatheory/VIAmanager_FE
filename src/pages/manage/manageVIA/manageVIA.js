import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Fade, Button, Icon } from "@material-ui/core";
import ViaList from "./components/ViaList";
import ViaHeader from "./components/ViaHeader";
const useStyles = makeStyles({
  root: {
    padding: "0px",
  },
  cardHeader: {
    // "justify-content": "flex-end",
    display: "flex",
  },
});
function ManageVIA(props) {
  const classes = useStyles();
  return (
    <div>
      <Fade in={true}>
        <Card>
          <CardContent className={classes.cardHeader}>
            <ViaHeader />
          </CardContent>
          <CardContent className={classes.root}>
            <ViaList />
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
}

export default ManageVIA;

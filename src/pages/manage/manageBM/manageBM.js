import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Fade, Button, Icon } from "@material-ui/core";
import BMList from "./components/BmList";
import BMHeader from "./components/BmHeader";
const useStyles = makeStyles({
  root: {
    padding: "0px",
  },
  cardHeader: {
    // "justify-content": "flex-end",
    display: "flex",
  },
});
function ManageBM(props) {
  const classes = useStyles();
  return (
    <div>
      <Fade in={true}>
        <Card>
          <CardContent className={classes.cardHeader}>
            <BMHeader />
          </CardContent>
          <CardContent className={classes.root}>
            <BMList />
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
}

export default ManageBM;

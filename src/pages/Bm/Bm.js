import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Fade, Button, Icon } from "@material-ui/core";
import BmList from "./components/BmList";
import BmHeader from "./components/BmHeader";
import BmOwners from "./components/BmOwners";
import BmAdsAcc from "./components/BmAdsAcc";
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
            <BmHeader />
          </CardContent>
          <CardContent className={classes.root}>
            <BmList />
          </CardContent>
        </Card>
      </Fade>
      <BmOwners />
      <BmAdsAcc />
    </div>
  );
}

export default ManageBM;

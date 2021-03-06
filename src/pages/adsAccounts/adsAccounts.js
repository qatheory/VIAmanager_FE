import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Fade, Button, Icon } from "@material-ui/core";
import AdsAccountsList from "./components/AdsAccountsList.js";
import AdsAccountsHeader from "./components/AdsAccountsHeader";
import AdsAccountsOwners from "./components/AdsAccountsOwners";
const useStyles = makeStyles({
  root: {
    padding: "0px",
  },
  cardHeader: {
    // "justify-content": "flex-end",
    display: "flex",
  },
});
function AdsAccounts(props) {
  const classes = useStyles();
  return (
    <div>
      <Fade in={true}>
        <Card>
          <CardContent className={classes.cardHeader}>
            <AdsAccountsHeader />
          </CardContent>
          <CardContent className={classes.root}>
            <AdsAccountsList />
          </CardContent>
        </Card>
      </Fade>
      <AdsAccountsOwners />
    </div>
  );
}

export default AdsAccounts;

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Fade, Button, Icon } from "@material-ui/core";
import UsersList from "./components/UsersList.js";
import UsersHeader from "./components/UsersHeader";
import UsersOwners from "./components/UsersOwners";
const useStyles = makeStyles({
  root: {
    padding: "0px",
  },
  cardHeader: {
    // "justify-content": "flex-end",
    display: "flex",
  },
});
function Users(props) {
  const classes = useStyles();
  return (
    <div>
      <Fade in={true}>
        <Card>
          <CardContent className={classes.cardHeader}>
            <UsersHeader />
          </CardContent>
          <CardContent className={classes.root}>
            <UsersList />
          </CardContent>
        </Card>
      </Fade>
      <UsersOwners />
    </div>
  );
}

export default Users;

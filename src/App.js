import React from "react";
import AdminLayout from "layout/AdminLayout.js";
import SignIn from "pages/auth/SignIn";
import SignUp from "pages/auth/SignUp";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import {
  selectLoggedIn,
  setUsername,
  setLoggedOut,
} from "store/reducers/viewSettings";
import axios from "axios";
import Constants from "_helpers/constants.js";
import Commons from "_helpers/commons.js";
import {
  selectCurrentWorkspace,
  setCurrentWorkspace,
  setListWorkspaces,
} from "./store/reducers/workspaceSettings";

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
            <Redirect to={{ pathname: "/login" }} />
          )
      }
    />
  );
}

function App(props) {
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoggedIn);
  React.useEffect(() => {
    if (loggedIn) {
      axios({
        url: `${Constants.API_DOMAIN}/api/current_user/`,
        method: "GET",
        data: {
          token: sessionStorage.getItem("token")
            ? sessionStorage.getItem("token")
            : localStorage.getItem("token"),
        },
        headers: Commons.header,
      }).then((resp) => {
        dispatch(setUsername(resp.data.username));
        // if (sessionStorage.getItem("token")) {
        //   sessionStorage.setItem("token", resp.data.token);
        // } else {
        //   localStorage.setItem("token");
        // }

        // if (resp.data.user.workspaces.length == 0) {
        //   props.history.push("/admin/workspaces/create");
        // }

        dispatch(
          setCurrentWorkspace({
            id: resp.data.workspaces[0].id,
            name: resp.data.workspaces[0].name,
          })
        );
        let listWorkspaces = resp.data.workspaces.map((workspace) => {
          return {
            id: workspace.id,
            name: workspace.name,
          };
        });
        dispatch(setListWorkspaces(listWorkspaces));
      })
        .catch((err) => {
          console.log(err);
          props.history.push("/signin");
          dispatch(setLoggedOut());
        });
    }
  });
  const handleRedirection = () => {
    if (loggedIn) {
      return <Redirect to="/admin/manage-via" />;
    }
    return <Redirect to="/signin" />;
  };
  return (
    <Switch>
      <PrivateRoute authed={loggedIn} path="/admin" component={AdminLayout} />
      <Route component={SignIn} path="/signin"></Route>
      <Route component={SignUp} path="/signup"></Route>
      {handleRedirection()}
    </Switch>
  );
}

export default withRouter(App);

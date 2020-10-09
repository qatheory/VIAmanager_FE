import React from "react";
import AdminLayout from "layout/AdminLayout.js";
import SignIn from "pages/auth/SignIn"
import SignUp from "pages/auth/SignUp"
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import { selectLoggedIn, setUsername, setLoggedOut } from "store/reducers/viewSettings";
import axios from 'axios';
import Constants from "_helpers/constants.js"
import Commons from "_helpers/commons.js"

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login' }} />}
    />
  )
}

function App(props) {
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoggedIn);
  React.useEffect(() => {
    if (loggedIn) {
      axios({
        url: `${Constants.API_DOMAIN}api/current_user/`,
        method: 'GET',
        headers: Commons.header()
      })
        .then(resp => {
          dispatch(setUsername(resp.data.username))
        })
        .catch(err => {
          props.history.push('/signin');
          dispatch(setLoggedOut())
        });

    }
  });
  const handleRedirection = () => {
    if (loggedIn) {
      return (<Redirect to="/admin/manage-via" />)
    }
    return (<Redirect to="/signin" />)
  }
  return (

    <Switch>
      <PrivateRoute authed={loggedIn} path='/admin' component={AdminLayout} />
      <Route component={SignIn} path="/signin"></Route>
      <Route component={SignUp} path="/signup"></Route>
      {handleRedirection()}
    </Switch>
  );
}

export default withRouter(App);

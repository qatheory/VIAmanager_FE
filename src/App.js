import React from "react";
import AdminLayout from "layout/AdminLayout.js";
import SignIn from "pages/auth/SignIn"
import SignUp from "pages/auth/SignUp"
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { selectLoggedIn, setUsername } from "store/reducers/viewSettings";
function App() {
  const dispatch = useDispatch();
  const loggenIn = useSelector(selectLoggedIn);

  React.useEffect(() => {
    if (loggenIn) {
      fetch('http://127.0.0.1:8000/api/current_user/', {
        method: 'GET',
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(resp => {
          dispatch(setUsername(resp.username))
        })
        .catch(err => console.log(err));
    }
  });
  return (
    <Router>
      <Switch>
        <Route component={AdminLayout} path="/admin"></Route>
        <Route component={SignIn} path="/signin"></Route>
        <Route component={SignUp} path="/signup"></Route>
        <Redirect to="/admin/manage-via" />
      </Switch>
    </Router>
  );
}

export default App;

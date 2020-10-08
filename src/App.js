import React from "react";
import AdminLayout from "layout/AdminLayout.js";

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route component={AdminLayout} path="/admin"></Route>
        <Redirect to="/admin/manage-via" />
      </Switch>
    </Router>
  );
}

export default App;

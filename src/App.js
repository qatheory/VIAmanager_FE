import React from "react";
import AdminLayout from "layout/AdminLayout.js";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route component={AdminLayout} path="/admin"></Route>
      </Switch>
    </Router>
  );
}

export default App;

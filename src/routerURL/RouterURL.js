import React, { Component } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Home from "../pages/Home"
import Edit from "../pages/Edit"
class RouterURL extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/edit" component={Edit} />
                </div>
            </Router>
        )
    }

}

export default RouterURL
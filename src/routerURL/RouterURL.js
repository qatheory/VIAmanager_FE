import React, { Component } from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Home from "../../pages/Home"
import Edit from "../../pages/Edit"
class RouterURL extends Component {
    render() {
        return (
            <div>
                <Route exact path="/home" component={Home} />
                <Route path="/edit" component={Edit} />
            </div>
        )
    }

}

export default RouterURL
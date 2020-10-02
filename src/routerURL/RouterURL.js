import React, { Component } from "react"
import { Route } from "react-router-dom"
import Home from "pages/Home"
import Edit from "pages/Edit"
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
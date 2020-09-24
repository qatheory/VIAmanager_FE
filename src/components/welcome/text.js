import React, { Component } from "react"

class Text extends Component {
    clickDelete = () => {
        this.props.delete(this.props.index)
    }
    render() {
        return (
            <p onClick={() => { this.clickDelete() }}>
                With props name {this.props.name} Edit {this.props.editLink} and save to reload.
            </p>
        )
    }
}
export default Text
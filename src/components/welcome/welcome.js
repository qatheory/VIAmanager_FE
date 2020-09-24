import React, { Component } from "react";
import Text from "./text"
class WelcomeText extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: "",
            texts: [
                { name: "name1", editLink: "link1" },
                { name: "name2", editLink: "link2" },
                { name: "name3", editLink: "link3" },
                { name: "name4", editLink: "link4" },
                { name: "name5", editLink: "link5" },
                { name: "name6", editLink: "link6" },
                { name: "name7", editLink: "link7" },
            ]
        }
    }
    addText = () => {
        this.setState(state => {
            console.log(...state.texts)
            const texts = [...state.texts, { name: "name" + this.state.texts.length + 1, editLink: "link" + this.state.texts.length + 1 }]
            return { texts }
        })
        console.log(`added new text with name${this.state.texts.length + 1}`)
    }
    deleteText = (id) => {
        let arrTexts = this.state.texts.slice()
        arrTexts.splice(id, 1)
        this.setState({ texts: arrTexts })
        console.log("deleted text with ID:", id)
    }
    showAllText = () => {
        const listText = this.state.texts.map((text, index) =>
            <div key={index} onClick={() => this.setState({ selected: this.state.texts[index].name })}>
                <Text index={index} delete={(index) => { this.deleteText(index) }} name={text.name} editLink={text.editLink} />
            </div>
        )
        return listText
    }
    render() {
        return (
            <div>
                <p onClick={() => { this.addText() }}>selected link: {this.state.selected}</p>
                {this.showAllText()}
            </div>
        )
    }
}

export default WelcomeText
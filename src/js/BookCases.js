import React from 'react'

class Shelves extends React.Component {
    constructor() {
        super()
        this.state = {
            cases: [],
            libraryid: 43
        }
        this.loadCases.bind(this.loadCases)
        this.drawCanvas.bind(this.drawCanvas)
    }

    componentDidMount() {
        this.loadCases()
    }

    render() {
        if (!this.state.cases) {
            return (
                <div id="bookcases"></div>
            )
        }
        return (
            <div id="bookcases">
                <canvas ref="bookcase-canvas" />
            </div>
        )
    }

    loadCases() {
        fetch("/libraries/" + this.state.libraryid + "/cases")
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    cases: data
                })
                console.log(data)
                drawCanvas()
            })
            .catch(console.log)
    }

    drawCanvas() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
    }
}

export default Shelves
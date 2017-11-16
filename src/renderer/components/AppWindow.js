import React from 'react'
import { ipcRenderer, remote } from 'electron'

class Video extends React.Component {
    render() {
        return (
            <div></div>
        )
    }
}

export default class extends React.Component {
    constructor() {
        super()
        
        const globalState = remote.getGlobal('HotSTube')
        this.state = Object.assign({}, globalState)
    }
    componentDidMount() {
        ipcRenderer.on('HOTSTUBE_STATE_CHANGE', (evt, arg) => {
            const globalState = { ...this.state, [arg.prop]: arg.newValue }

            this.setState(globalState)
        })
    }
    render() {
        let globals = JSON.stringify(this.state, null, 4)

        return <pre>{globals}</pre>
    }
}
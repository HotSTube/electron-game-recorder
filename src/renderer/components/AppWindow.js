import React from 'react'
import { ipcRenderer, remote } from 'electron'
import * as recorder from '../game/recorder'

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
        this.state = { globals: Object.assign({}, globalState) }
    }
    componentDidMount() {
        ipcRenderer.on('HOTSTUBE_STATE_CHANGE', (evt, arg) => {
            const globalState = { ...this.state.globals, [arg.prop]: arg.newValue }

            this.setState({ globals: globalState })

            if (arg.prop == 'programActive' && !arg.oldValue && arg.newValue) {
                recorder.source().then((src) => {
                    this.setState({ src: src })
                }, (err) => {})
            }
        })
        recorder.source().then((src) => {
            this.setState({ src: src })
        }, (err) => {})
    }
    renderSrc() {
        if (!this.state.src) {
            return null
        }

        navigator.getUserMedia({ 
            auto: true, 
            video: { 
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: this.state.src.id,
                width: 1280, 
                height: 720 
            }}, (stream) => {
            console.log('hello')
        }, (err) => {
            throw err
        })


        return (
            <img src={this.state.src.thumbnail.toDataURL()} />
        )
    }
    render() {
        let globals = JSON.stringify(this.state.globals, null, 4)
                
        return (
            <div>
                <pre>{globals}</pre>
                {this.renderSrc()}
            </div>
        )
        
    }
}
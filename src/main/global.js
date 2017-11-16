const { BrowserWindow } = require('electron')

export default new Proxy({
    programActive: false,
    gameActive: false,
    lastReplayFile: '',
    lastGame90SecondMarkAt: null
}, {
    get: (target, name) => {
        return target[name]
    },

    set: (target, name, value) => {
        console.log(target, name, value)
        let win = BrowserWindow.getAllWindows()[0]

        win.webContents.send(
            'HOTSTUBE_STATE_CHANGE', {
                prop: name,
                newValue: value,
                oldValue: target[name]
            })

        target[name] = value
        return true
    }
})
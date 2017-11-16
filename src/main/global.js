export default new Proxy({
    programRunning: false
}, {
    get: function(target, name) {
        return target[name]
    },

    set: function(target, name, value) {
        target[name] = value
        return true
    }
})
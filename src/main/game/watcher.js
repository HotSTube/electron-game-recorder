import psList from 'ps-list'
import * as dirs from './dirs'
import path from 'path'

// Scan the program list for Heroes of the Storm
const PROGRAM_NAME = 'Heroes of the Storm'

function program() {
    setInterval(() => {
        psList().then((ps) => {
            let active = false

            for (let p in ps) {
                const program = ps[p]

                if (program.name === PROGRAM_NAME) {
                    active = true
                }
            }

            global.HotSTube.programRunning = active
        })
    }, 5000)
}


function game() {
    const opts = {
        persistent: true,
        ignorePermissionErrors: true
    }
    const accountWatcher = chokidar.watch(dirs.account, opts)
    const replayWatcher = chokidar.watch(dirs.lobby, { ...opts, awaitWriteFinish: true })
    const saveWatcher = chokidar.watch(dir.saves(), opts)

    const watcher = chokidar.watch([dirs.lobby, ...dirs.saves(), ...dirs.replays()])

    watchery.on('read', () => {
        watcher.on('add', (path) => {
            const ext = path.extname(path)

            if (ext === '.StormReplay') {
                // Game ended
            } else if (ext === '.StormSave') {
                // 90 second mark
            }
            if (path.win32.basename(path) === 'replay.tracker.events') {
                // Game started
            }
        })
    })
}

function watcher() {
    program()


}

export default watcher
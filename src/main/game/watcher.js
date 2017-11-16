import psList from 'ps-list'
import * as dirs from './dirs'
import path from 'path'
import chokidar from 'chokidar'

// Scan the program list for Heroes of the Storm
const PROGRAM_BINARY_NAME = 'HeroesOfTheStorm_x64.exe'

function program() {
    const scan = () => {
        psList().then((ps) => {
            let active = false

            for (let p in ps) {
                const program = ps[p]

                if (program.name === PROGRAM_BINARY_NAME) {
                    active = true
                }
            }

            global.HotSTube.programActive = active

            // Poll more infrequently if running to prevent frequent CPU usage
            setTimeout(scan, active ? 60000 : 5000)
        })
    }

    scan()
}


function game() {
    const watcher = chokidar.watch([dirs.lobby, dirs.account], {
        persistent: true,
        ignorePermissionErrors: true
    })

    let gameTime = 0
    let timer = null

    watcher.on('ready', () => {
        watcher.on('add', (file) => {
            const ext = path.extname(file)

            if (ext === '.StormReplay') {
                global.HotSTube.gameActive = false
                global.HotSTube.lastReplayFile = file
                timer = null
                gameTime = 0
            } else if (ext === '.StormSave') {
                global.HotSTube.lastGame90SecondMarkAt = gameTime - 90
            }
            if (path.win32.basename(file) === 'replay.tracker.events') {
                global.HotSTube.gameActive = true
                timer = setInterval(() => {
                    gameTime += 1
                }, 1000)
            }
        })
    })
}

function watcher() {
    program()
    game()
}

export default watcher
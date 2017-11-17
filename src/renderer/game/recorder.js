const WINDOW_TITLE = 'Heroes of the Storm'
const {desktopCapturer,screen} = require('electron')

let recorder, chunks

function source() {
    return new Promise((resolve, reject) => {
        desktopCapturer.getSources({ types: ['window', 'screen']}, (err, sources) => {
            if (err) {
                reject(err)
            }
            for (let i = 0; i < sources.length; i++) {
                let src = sources[i]
    
                if (src.name === WINDOW_TITLE) {
                    return resolve(src)
                }
            }
            reject('Game not found')
        })
    })
    
}

function start() {
    source().then((src) => {
        const display = screen.getPrimaryDisplay().size
        const ratio = display.width / display.height

        const resolutions = {
            '480p': { width: parseInt(ratio*480), height: 480 },
            '720p': { width: parseInt(ratio*720), height: 720 },
            '1080p': { width: parseInt(ratio*1080), height: 1080 }
        }

        const resolution = '720p'
        
        const width = resolutions[resolution].width,
              height = resolutions[resolution].height

        
        let constraints = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: src.id,
                    minWidth: width,
                    maxWidth: width,
                    minHeight: height,
                    maxHeight: height
                }
            }
        }

        navigator.webkitGetUserMedia(constraints, (stream) => {
            recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' })
            chunks = []

            recorder.ondataavailable = (evt) => {
                chunks.push(evt.data)
            }

            recorder.start()
        }, (err) => {
            throw err
        })
    }, (err) => {
        throw err
    })
}

function stop() {
    if (!recorder) {
        return
    }

    recorder.stop()

    setImmediate(() => {
        toArrayBuffer(new Blob(chunks, { type: 'video/webm' }))
    })
}

function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function() {
        let arrayBuffer = this.result
        cb(arrayBuffer)
    };
    fileReader.readAsArrayBuffer(blob)
}

function toBuffer(ab) {
    let buffer = new Buffer(ab.byteLength)
    let arr = new Uint8Array(ab)
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i]
    }
    return buffer;
}

export { source, start, stop }
import os from 'os'
import path from 'path'
import glob from 'glob'

let lobby, account

if (os.platform() == 'win32') {
    account = path.join(os.homedir(),'Documents','Heroes of the Storm','Accounts')
    lobby  = path.join(os.tmpdir(),'Heroes of the Storm')
} else if (os.platform() == 'darwin') {
    account = path.join(os.homedir(),'Library','Application Support','Blizzard','Heroes of the Storm','Accounts')
    lobby = path.join(os.homedir(),'Library','Caches','TemporaryItems','Blizzard','Heroes of the Storm')
} else {
    throw new Error(os.platform() + ' is unsupported')
}

const replays = () => {
    return  glob.sync(account + '/**/Replays/')
}

const saves = () => {
    return glob.sync(account + '/**/Saves/')
}

export { account, lobby, replays, saves }
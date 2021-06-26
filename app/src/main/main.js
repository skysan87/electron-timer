const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let win

async function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      webSecurity: false, // ローカルファイルの読込許可
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.MODE === 'dev') {
    win.loadURL('http://localhost:3000/')

    win.webContents.openDevTools()
  } else {
    // production構成時
    await win.loadFile(path.resolve(__dirname, '../../dist/index.html'))
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

/**
 * タイマーIPC通信
 */
let timerId = null
let leftTime = 0

/**
 * タイマー開始
 */
ipcMain.on('timer-start', (evt, leftTime_) => {
  leftTime = leftTime_

  timerId = setInterval(() => {
    leftTime--
    win.webContents.send('timer-tick', leftTime)
    if (leftTime <= 0) {
      clearInterval(timerId)
    }
  }, 1000)
})

/**
 * タイマー停止
 */
 ipcMain.on('timer-stop', () => {
  clearInterval(timerId)
  console.log('timer stop')
})

/**
 * タイマー初期化
 */
 ipcMain.on('timer-reset', () => {
  leftTime = 0
})

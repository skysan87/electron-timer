const { app, BrowserWindow, Tray, ipcMain, screen } = require('electron')
const path = require('path')

let win = null
let tray = null

const isMacOS = process.platform === 'darwin'
const isWindows = process.platform === 'win32'

/**
 * Window作成
 */
const createWindow = async () => {
  win = new BrowserWindow({
    width: 320,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      // レンダラープロセスに公開するAPI
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.MODE === 'dev') {
    win.loadURL('http://localhost:3000/')

    // win.webContents.openDevTools()
  } else {
    // production構成時
    await win.loadFile(path.resolve(__dirname, '../../dist/index.html'))
  }

  // Windowからフォーカスが外れたらWindowを隠す
  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

/**
 * トレイにアイコン作成
 */
const createTray = () => {
  // Mac
  tray = new Tray(path.resolve(__dirname, '../img/icon_s16_white.png'))
  tray.on('click', () => {
      toggleWindow();
  })
}

/**
 * Windowの表示・非表示の切り替え
 */
const toggleWindow = () => {
  win.isVisible() ? win.hide() : showWindow()
}

/**
 * Window表示
 */
const showWindow = () => {
  const position = calcWindowPosition()
  win.setPosition(position.x, position.y, false)
  win.show()
}

/**
 * Windowの位置を計算
 */
const calcWindowPosition = () => {
  const windowBounds = win.getBounds()
  const trayBounds = tray.getBounds()
  // ready前にscreenモジュールを呼び出せないため
  const screenBounds = screen.getPrimaryDisplay().bounds

  let x, y
  if(isWindows) {
    // とりあえず右下
    x = Math.round(screenBounds.width - windowBounds.width)
    y = Math.round(screenBounds.height - windowBounds.height - trayBounds.height)
  } else {
    // macOS: トレイアイコンの下に表示
    x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
    y = Math.round(trayBounds.y + trayBounds.height)
  }

  return {x: x, y: y}
}

// ============================================

if (isMacOS) {
  app.dock.hide()
}

app.on('ready', () => {
  createTray()
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

// ============================================

/**
 * レンダラープロセスとのIPC通信
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

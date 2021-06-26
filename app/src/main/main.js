const { app, BrowserWindow, Tray, ipcMain, screen } = require('electron')
const { exec } = require('child_process')
const path = require('path')

let win = null
let tray = null

const isMacOS = process.platform === 'darwin'
const isWindows = process.platform === 'win32'

const ICON_WHITE = path.resolve(__dirname, '../img/icon_s16_white.png')
const ICON_BLACK = path.resolve(__dirname, '../img/icon_s16_black.png')
const ICON_RED = path.resolve(__dirname, '../img/icon_s16_red.png')

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
  tray = new Tray(ICON_WHITE)
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

const toDigit = (val) => {
  if (val === null || val === undefined) {
    return ''
  }
  return val.toString().padStart(2, '0')
}

const updateTrayTitle = (leftTime) => {
  const min = Math.floor(leftTime / 60)
  const sec = leftTime % 60
  let title = `${toDigit(min)}:${toDigit(sec)}`
  tray.setTitle(title)
}

const updateTrayImage = (isWorking) => {
  if (isWorking) {
    tray.setImage(ICON_RED)
  } else {
    tray.setImage(ICON_WHITE)
  }
}

/**
 * 音声メッセージを再生
 *   macOS: sayコマンドを実行
 * @param {String} message 再生するメッセージ
 */
const notifyMessage = (message) => {
  // NOTE: macOSのみ対応
  if (isMacOS) {
    exec(`say ${message}`)
  }
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
  updateTrayTitle(leftTime)
  updateTrayImage(true)

  timerId = setInterval(() => {
    leftTime--
    updateTrayTitle(leftTime)

    win.webContents.send('timer-tick', leftTime)
    if (leftTime <= 0) {
      clearInterval(timerId)
      updateTrayImage(false)
      tray.setTitle('')
      notifyMessage('時間です')
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
  updateTrayImage(false)
  tray.setTitle('')
})

const { contextBridge, ipcRenderer } = require('electron')

// rendererプロセスで呼ぶIPC通信処理を書く
// ex) window.electron.メソッド名(引数)
contextBridge.exposeInMainWorld(
  'electron', {
    TimerStart: (leftTime) => ipcRenderer.send('timer-start', leftTime),
    TimerStop: () => ipcRenderer.send('timer-stop'),
    TimerReset: () => ipcRenderer.send('timer-reset'),
    onTimerTick: (listener) => {
      ipcRenderer.on('timer-tick', (event, leftTime) => listener(leftTime));
    }
  }
)

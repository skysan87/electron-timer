export class MainTimerService {
  constructor () {
    window.electron.onTimerTick((leftTime_) => {
      dispatchEvent(new CustomEvent('tick', { detail: { leftTime: leftTime_ } }))
    })
  }

  start (leftTime) {
    window.electron.TimerStart(leftTime)
  }

  stop () {
    window.electron.TimerStop()
  }

  reset () {
    window.electron.TimerReset()
  }
}

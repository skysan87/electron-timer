export class RendererTimerService {
  constructor () {
    this.leftTime = 0
    this.timerId = ''
  }

  start (leftTime) {
    this.leftTime = leftTime
    this.timerId = setInterval(() => {
      this.leftTime--
      dispatchEvent(new CustomEvent('tick', { detail: { leftTime: this.leftTime } }))
    }, 1000)
  }

  stop () {
    clearInterval(this.timerId)
    console.log('timer stopped.')
  }

  reset () {
    this.leftTime = 0
  }
}

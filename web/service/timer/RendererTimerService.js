export class RendererTimerService {
  constructor () {
    this.timerId = ''
  }

  start () {
    this.timerId = setInterval(() => {
      dispatchEvent(new CustomEvent('tick'))
    }, 1000)
  }

  stop () {
    clearInterval(this.timerId)
    console.log('timer stopped.')
  }
}

import { MainTimerService } from './timer/MainTimerService'
import { RendererTimerService } from './timer/RendererTimerService'

const isMainProcess = ('electron' in window)

export const createTimerService = () => {
  return isMainProcess ? new MainTimerService() : new RendererTimerService()
}

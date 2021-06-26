import { RendererTimerService } from './timer/RendererTimerService'

export const createTimerService = () => {
  return new RendererTimerService()
}

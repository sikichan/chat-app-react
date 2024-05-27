import { throttle } from "throttle-debounce"

const throttleFunc = (func: () => any, delay = 600) => {
  return throttle(delay, func, { noLeading: false, noTrailing: false })
}
export { throttleFunc as throttle }

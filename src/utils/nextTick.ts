import isUndefined from './isUndefined'
import isNode from './isNode'

let nextTick: ((cb: () => void, delay?: number) => void) | undefined

if (isNode) {
  nextTick = global.setImmediate || process.nextTick
} else if (!isUndefined(MutationObserver)) {
  nextTick = function (cb) {
    const div = document.createElement('div')
    const observer = new MutationObserver(cb)
    observer.observe(div, { attributes: true })
    div.classList.toggle('nextTick')
  }
} else if (!isUndefined(MessageChannel)) {
  nextTick = function (cb) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = cb
    port.postMessage('nextTick')
  }
} else if (!isUndefined(setTimeout)) {
  nextTick = setTimeout
}

export default nextTick

import { isFunction, isNode } from './src/utils/'
import Promise from './src/promise'

declare global {
  interface Window { Promise?: any }
}

export default function () {
  if (typeof window !== 'undefined' && !isFunction(window.Promise)) {
    window.Promise = Promise
  } else if (isNode) {
    global.Promise = Promise
  }
}

export { Promise }

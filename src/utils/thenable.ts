import isFunction from './isFunction'
import isObject from './isObject'

interface Thenable {
  then?: (onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any) => void
  isThenable: boolean
}

export default function (value?: any): Thenable {
  const then = (value || {}).then
  return { then, isThenable: isObject(value) && isFunction(then) }
}

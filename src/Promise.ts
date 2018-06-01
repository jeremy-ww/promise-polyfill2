import { validateIsIterable, nextTick } from './decorators/'
import { isFunction, thenable, isObject } from './utils/'

export enum PromiseStates {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED'
}

interface PromiseHandler {
  onFulfilled?: (value?: any) => void
  onRejected?: (reason?: any) => void
}

export default class Promise {
  private observers: PromiseHandler[] = []
  private value: any = undefined
  private state = PromiseStates.PENDING

  @nextTick
  private schedule () {
    const { observers, state, value } = this

    while (observers.length > 0) {
      const { state, value } = this
      const handler = observers.shift()![state === PromiseStates.FULFILLED ? 'onFulfilled' : 'onRejected']

      if (isFunction(handler)) {
        const lastPromiseChainValue = handler!(value)
        if (observers.length === 0) this.value = lastPromiseChainValue
      }
    }
  }

  private settle (value: any | undefined, state: PromiseStates) {
    this.state = state
    this.value = value
    this.schedule()
  }

  constructor (
    executor: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void
  ) {
    if (!isFunction(executor))
      throw new TypeError(`Promise resolver ${executor} is not a function`)

    const onResolveHandler = (value?: any) => {
      if (this.state !== PromiseStates.PENDING) return
      if (value === this)
        throw new TypeError('Chaining cycle detected for promise')

      if (value instanceof Promise) {
        switch (value.state) {
          case PromiseStates.FULFILLED:
            this.settle(value.value, PromiseStates.FULFILLED)
            break
          case PromiseStates.REJECTED:
            onRejectHandler(value.value)
            break
          case PromiseStates.PENDING:
            value.then(onResolveHandler, onRejectHandler)
            break
        }
      } else {
        let isThenablePromiseSettled = false
        try {
          const { then, isThenable } = thenable(value)
          const wrap = (handler: (value?: any) => void) => {
            return (value?: any) => {
              if (isThenablePromiseSettled) return
              handler(value)
              isThenablePromiseSettled = true
            }
          }
          if (isThenable) {
            then!.call(value, wrap(onResolveHandler), wrap(onRejectHandler))
          } else {
            this.settle(value, PromiseStates.FULFILLED)
          }
        } catch (reason) {
          if (!isThenablePromiseSettled) onRejectHandler(reason)
        }
      }
    }

    const onRejectHandler = (reason?: any) => {
      if (this.state !== PromiseStates.PENDING) return
      if (reason === this)
        throw new TypeError('Chaining cycle detected for promise')

      this.settle(reason, PromiseStates.REJECTED)
    }

    try {
      executor(onResolveHandler, onRejectHandler)
    } catch (reason) {
      if (this.state !== PromiseStates.FULFILLED) onRejectHandler(reason)
    }
  }

  static resolve (value?: any) {
    return value instanceof Promise
      ? value
      : new Promise(resolve => resolve(value))
  }

  static reject (reason?: any) {
    return new Promise((resolve, reject) => reject(reason))
  }

  @validateIsIterable
  static all (iterable: any[]) {
    return new Promise((resolve, reject) => {
      let iteratorSize = 0
      const iteratorRecord: any[] = []
      const recordFulfilledValue = (value: any, key: number) => {
        iteratorRecord[key] = value
        if (iteratorRecord.length === iteratorSize) resolve(iteratorRecord)
      }

      for (let promise of iterable) {
        (key => {
          Promise.resolve(promise)
            .then((value: any) => recordFulfilledValue(value, key), reject)
        })(iteratorSize++)
      }
    })
  }

  then (onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any) {
    return new Promise((
      resolve: (value: any) => void,
      reject: (reason?: any) => void
    ) => {
      const wrapThenFulfilled = (value?: any) => {
        try {
          resolve(isFunction(onFulfilled) ? onFulfilled!(value) : value)
        } catch (reason) {
          reject(reason)
        }
      }

      const wrapThenRejected = (reason?: any) => {
        try {
          if (isFunction(onRejected)) {
            resolve(onRejected!(reason))
          } else {
            reject(reason)
          }
        } catch (reason) {
          reject(reason)
        }
      }

      this.observers.push({
        onFulfilled: wrapThenFulfilled,
        onRejected: wrapThenRejected
      })

      if (this.state !== PromiseStates.PENDING) this.schedule()
    })
  }

  catch (onRejected: (reason?: any) => void) {
    return this.then(undefined, onRejected)
  }

  finally (onFinally?: () => void) {
    const wrapFinallyHandler = (value: any) => {
      return Promise.resolve(
        isFunction(onFinally) && onFinally!()
      ).then(() => value)
    }

    return this.then(
      (value: any) => wrapFinallyHandler(value),
      (reason: any) => wrapFinallyHandler(reason)
    )
  }
}

const { Promise } = require('../libs/promise-polyfill2.js')

const adapter = {
  resolved: value => new Promise(resolve => resolve(value)),
  rejected: reason => new Promise((resolve, reject) => reject(reason)),
  deferred () {
    const deferred = {}
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    return deferred
  }
}

require('promises-aplus-tests')(adapter)

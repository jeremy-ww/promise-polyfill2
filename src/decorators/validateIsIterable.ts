import isIterable from '../utils/isIterable'

export default function (
  target: any,
  key: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const { value: func } = descriptor
  return Object.defineProperty(target, key, {
    ...descriptor,
    value (iterable: Iterator<any>) {
      if (iterable == null)
        throw new TypeError('Cannot read property \'Symbol(Symbol.iterator)\' of undefined')

      if (!isIterable(iterable))
        throw new TypeError('undefined is not a function')

      return func.call(this, iterable)
    }
  })
}

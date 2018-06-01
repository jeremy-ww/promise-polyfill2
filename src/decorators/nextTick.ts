import nextTick from '../utils/nextTick'

export default function (
  target: any,
  key: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const { value: func } = descriptor
  return Object.defineProperty(target, key, {
    value (...args: any[]) {
      nextTick!(func.bind(this, ...args))
    }
  })
}

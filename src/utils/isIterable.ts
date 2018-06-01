export default <T> (iterable: Iterable<T> | any): boolean => {
  return iterable != null && typeof iterable[Symbol.iterator] === 'function'
}

import { isObject, isString } from './typeutils'

function f (decorated) {
  if (decorated === undefined) {
    // used as a decorator
    return (inner) => f(inner)
  }
  const ret = function (...args) {
    return decorated(...args)
  }
  ret._dataRendererApply = true
  return ret
}

/**
 * description
 * @param funcOrValue
 * @param extra {context, layout, data, paths, value, values, pathValues}
 * @param recursive
 * @returns {{}|*}
 */
function applyFunctions (funcOrValue, extra,
  recursive = true) {
  if (funcOrValue === null || funcOrValue === undefined) {
    return funcOrValue
  }
  if (isString(funcOrValue)) {
    return funcOrValue
  }
  if (funcOrValue instanceof Function) {
    if (funcOrValue._dataRendererApply) {
      // the result of a function is supposed to be resolved, so do not resolve again
      return funcOrValue(extra)
    } else {
      return funcOrValue
    }
  }

  if (recursive) {
    if (Array.isArray(funcOrValue)) {
      return funcOrValue.map(x => applyFunctions(x, extra, recursive))
    }
    if (isObject(funcOrValue)) {
      return Object.getOwnPropertyNames(funcOrValue).filter(x => (!x.startsWith('__')))
        .reduce((prev, code) => {
          prev[code] = applyFunctions(funcOrValue[code], extra,
            // do not recurse children, they should be evaluated when their kvpair is rendererd
            recursive && code !== 'children' && code !== 'item')
          return prev
        }, {})
    }
  }
  return funcOrValue
}

export {
  f,
  applyFunctions
}

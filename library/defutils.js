import { isString, isObject } from './typeutils'

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

function applyFunctions (funcOrValue, extra /*{context, layout, data, paths, value, values, pathValues}*/,
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
            return Object.getOwnPropertyNames(funcOrValue)
                .reduce((prev, current) => {
                    prev[current] = applyFunctions(funcOrValue[current], extra,
                        // do not recurse children, they should be evaluated when their kvpair is rendererd
                        recursive && current !== 'children')
                    return prev
                }, {})
        }
    }
    return funcOrValue
}

function findPathInDict (paths, mapper, element, schemaCode) {
    if (element) {
        element = `${element}-`
    } else {
        element = ''
    }
    paths = paths || []
    if (!paths.length) {
        return undefined
    }
    if (!mapper || !Object.getOwnPropertyNames(mapper).length) {
        return undefined
    }
    let value = mapper[`-${element}${paths[0]}$${schemaCode}`]
    if (value !== undefined) {
        return value
    }
    value = mapper[`-${element}${paths[0]}`]
    if (value !== undefined) {
        return value
    }
    for (const path of paths) {
        value = mapper[`${element}${path}$${schemaCode}`]
        if (value !== undefined) {
            return value
        }
        value = mapper[`${element}${path}`]
        if (value !== undefined) {
            return value
        }
    }
    return undefined
}

export {
    f,
    applyFunctions,
    findPathInDict
}

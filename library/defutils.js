import { isString, isObject } from './typeutils'

function applyFunctions (funcOrValue, extra /*{context, definition, data, paths, value, values, pathValues}*/, recursive = true) {
    if (funcOrValue === null || funcOrValue === undefined) {
        return funcOrValue
    }
    if (isString(funcOrValue)) {
        return funcOrValue
    }
    if (funcOrValue instanceof Function) {
        // the result of a function is supposed to be resolved, so do not resolve again
        return funcOrValue(extra)
    }
    if (recursive) {
        if (Array.isArray(funcOrValue)) {
            return funcOrValue.map(x => applyFunctions(x, extra, recursive))
        }
        if (isObject(funcOrValue)) {
            return Object.getOwnPropertyNames({ ...funcOrValue })
                .reduce((prev, current) => {
                    if (current !== 'labelTranslator') {
                        if (current === 'component' || current === 'element') {
                            prev[current] = applyFunctions(funcOrValue[current], extra, false)
                        } else {
                            prev[current] = applyFunctions(funcOrValue[current], extra, recursive)
                        }
                    }
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
    applyFunctions,
    findPathInDict
}

function isString (obj) {
    return (Object.prototype.toString.call(obj) === '[object String]')
}

function isObject (obj) {
    return Object(obj) === obj
}

function isBool (obj) {
    return Boolean(obj) === obj
}

export {
    isString,
    isObject,
    isBool
}

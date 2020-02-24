function isString (obj) {
    return (Object.prototype.toString.call(obj) === '[object String]')
}

function isObject (obj) {
    return Object(obj) === obj
}

export {
    isString,
    isObject
}

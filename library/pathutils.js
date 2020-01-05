import { JSONPath } from 'jsonpath-plus'

function decomposePointer (pointer) {
    pointer = pointer.split('/')
    return pointer.filter(x => !!x && !x.match(/^[0-9]$/))
}

function evaluatePath (jsonPath, context, jsonPointer, paths, key) {
    if (!jsonPath) {
        if (key) {
            return [{
                jsonPointer: jsonPointer,
                paths: [
                    ...(paths || []).map(x => `${x}/${key}`),
                    key
                ],
                value: context
            }]
        } else {
            return [{ jsonPointer: jsonPointer, paths: paths, value: context }]
        }
    }
    let values = JSONPath({ path: jsonPath, json: context, resultType: 'all', flatten: true })
    if (!values) {
        return []
    }
    // if the result of values is an array of arrays, return as if [*] was at the end
    values = values.map(val => {
        if (Array.isArray(val.value)) {
            return val.value.map((x, idx) => ({
                pointer: `${val.pointer}/${idx}`,
                value: x
            }))
        } else {
            return val
        }
    }).flat()
    return values.map(value => {
        const decomposedPointer = decomposePointer(value.pointer)
        const pointerWithoutArrays = decomposedPointer.join('/')
        const _paths = [
            ...(paths || []).map(x => `${x}/${key || pointerWithoutArrays}`),
            ...(
                key ? [key] : decomposedPointer.reduce((arr, path) => {
                    return [...arr.map(x => `${x}/${path}`), path]
                }, []))
        ]
        return {
            jsonPointer: `${jsonPointer}${value.pointer}`,
            paths: _paths,
            value: value.value
        }
    })
}

export {
    evaluatePath
}

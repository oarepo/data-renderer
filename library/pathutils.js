import { JSONPath } from 'jsonpath-plus'

function decomposePointer (pointer) {
    pointer = pointer.split('/')
    return pointer.filter(x => x !== '').map(x=>x.replace(/^[0-9]$/, 'arritm'))
}

function addPointerToPaths (paths, key, pointer) {
    if (pointer === undefined) {
        return [
            ...(paths || []).map(x => `${x}/${key}`),
            key
        ]
    }
    const decomposedPointer = decomposePointer(pointer)
    const pointerWithoutArrays = decomposedPointer.join('/')
    return [
        ...(paths || []).map(x => `${x}/${key || pointerWithoutArrays}`),
        ...(
            key ? [key] : decomposedPointer.reduce((arr, path) => {
                return [...arr.map(x => `${x}/${path}`), path]
            }, []))
    ]
}

function evaluatePath (jsonPath, context, jsonPointer, paths, key) {
    if (!jsonPath) {
        if (key) {
            return [{
                jsonPointer: jsonPointer,
                paths: addPointerToPaths(paths, key),
                value: context
            }]
        } else {
            return [{ jsonPointer: jsonPointer, paths: paths, value: context }]
        }
    }
    let values = JSONPath({ path: jsonPath, json: context, resultType: 'all', flatten: true })
    if (!values) {
        return undefined
    }
    if (values.length === 0) {
        return undefined
    }
    return values.map(value => {
        return {
            jsonPointer: `${jsonPointer}${value.pointer}`,
            paths: addPointerToPaths(paths, key, value.pointer),
            value: value.value
        }
    })
}

export {
    evaluatePath,
    addPointerToPaths
}

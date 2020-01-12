import { JSONPath } from 'jsonpath-plus'

function decomposePointer (pointer) {
    pointer = pointer.split('/')
    return pointer.filter(x => x !== '').map(x=>x.replace(/^[0-9]$/, 'arritm'))
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
        return undefined
    }
    if (values.length === 0) {
        return undefined
    }
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

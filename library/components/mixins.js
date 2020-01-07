import { findPathInDict } from '../defutils'
import { SKIP_WRAPPER } from './KVPairComponent'

const RendererMixin = {
    methods: {
        renderElement (collected, h, layout, code, options, renderChildren, classCode) {
            if (collected[code] === undefined) {
                collected[code] = []
            }
            if (classCode === undefined) {
                classCode = code
            }
            const elDef = layout[code]
            const slot = findPathInDict(options.paths, this.$scopedSlots, code, this.currentSchemaCode)
            if (slot) {
                const ret = slot(options)
                collected[code].push(...ret)
                return ret
            }

            const component = elDef.component
            if (component === null) {
                return []
            }
            if (component !== undefined && component !== SKIP_WRAPPER) {
                const ret = [
                    h(component, {
                        class: [
                            ...(elDef.class || []),
                            `iqdr-${classCode}`,
                            ...options.paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
                        ],
                        style: elDef.style,
                        attrs: elDef.attrs,
                        props: options
                    })
                ]
                collected[code].push(...ret)
                return ret
            }
            const element = elDef.element
            if (element === null) {
                return []
            }
            if (element !== undefined && element !== SKIP_WRAPPER) {
                const ret = [
                    h(element, {
                            class: [
                                ...(elDef.class || []),
                                `iqdr-${classCode}`,
                                ...options.paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
                            ],
                            style: elDef.style,
                            attrs: elDef.attrs,
                            props: options
                        },
                        renderChildren ? renderChildren(collected, h, layout, options) : [])
                ]
                collected[code].push(...ret)
                return ret
            }
            return renderChildren ? renderChildren(collected, h, layout, options) : []
        },
    },
}

export {
    RendererMixin
}

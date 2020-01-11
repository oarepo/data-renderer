import { evaluatePath } from '../pathutils'
import { applyFunctions as _applyFunctions, findPathInDict } from '../defutils'
import { isObject, isString } from '../typeutils'
import deepmerge from 'deepmerge'
import { RendererMixin } from './mixins'
import { SKIP_WRAPPER } from './const'

const KVPairComponent = {
    props: {
        context: Object,
        data: Object,
        layout: [Object, String],
        paths: {
            type: Array,
            default: () => []
        },
        jsonPointer: {
            type: String,
            default: ''
        },
        layoutMergeOptions: {
            type: Object,
            default: () => {
            }
        },
        pathLayouts: {
            type: Object,
            default: () => {
            }
        },
        url: String,
        schema: {
            type: String,
            default: 'inline'
        },
        nestedChildren: Boolean,
        showEmpty: Boolean,
        labelTranslator: Function,
        layoutTranslator: Function,
        layoutPostProcessor: Function,
        dynamic: Boolean,
        extraProps: Object
    },
    mixins: [
        RendererMixin
    ],
    render (h) {
        if (this.layout === undefined) {
            return h('div')
        }
        const layout = this.currentLayout
        if (layout === null) {
            return h('div')
        }
        const pathValues = this.pathValues
        const values = this.values
        let ret = []
        const collected = {}
        const options = {
            ...(this.extraProps || {}),
            context: this.context,
            layout: this.currentLayout,
            data: this.data,
            vue: this,
            paths: pathValues.length ? pathValues[0].paths : this.paths,
            value: values.length === 1 ? values[0] : values,
            url: this.url,
            values,
            pathValues,
            schema: this.currentSchemaCode,
            currentSchema: this.currentSchema
        }
        if (values.length || this.currentShowEmpty) {
            ret.push(...this.renderWrapper(collected, h, layout, options).flat())
        }
        if (this.currentLayoutPostProcessor) {
            this.currentLayoutPostProcessor(collected, options)
        }
        if (ret.length === 1) {
            return ret[0]
        }
        return h('div', {
            class: ret.length === 0 ? 'iqdr-empty' : `iqdr-multiple-${ret.length}`
        }, ret)
    },
    methods: {
        renderWrapper (collected, h, def, options) {
            return this.renderElement(collected, h, def, 'wrapper', options, this.renderWrapperChildren)
        },
        renderWrapperChildren (collected, h, def, options) {
            const ret = []
            let label = def.label.value || def.label.label
            label = this.currentLabelTranslator ? this.currentLabelTranslator(label, options) : label
            if (label || (def.icon && def.icon.value)) {
                ret.push(...this.renderElement(collected, h, def, 'label', {
                    ...options,
                    label: label
                }, () => {
                    const rr = []
                    if (def.icon && def.icon.value) {
                        rr.push(...this.renderElement(collected, h, def, 'icon', {
                            ...options,
                            label: label
                        }))
                    }
                    if (label) {
                        rr.push(label)
                    }
                    return rr
                }))
            }
            if ((this.currentChildrenDef && this.currentNestedChildren) ||
                (!this.currentChildrenDef && options.values.length > 0)) {
                ret.push(...this.renderElement(collected, h, def, 'value-wrapper', {
                    ...options
                }, this.renderValues))
            }
            if (!this.currentNestedChildren) {
                ret.push(...this.renderChildren(collected, h, def, options))
            }
            return ret.flat()
        },
        renderValues (collected, h, def, options) {
            const ret = []
            if (!this.currentChildrenDef) {
                ret.push(...options.values.map((value, idx) => {
                    const renderedValue = this.renderElement(collected, h, def, 'value', {
                        ...options,
                        value: value,
                        valueIndex: idx
                    }, () => isString(value) ? value : JSON.stringify(value))
                    if (def.link) {
                        return this.renderElement(collected, h, def, 'link-wrapper', {
                            ...options,
                            value: value,
                            valueIndex: idx
                        }, () => renderedValue, 'link')
                    }
                    return renderedValue
                }))
            }
            if (this.currentChildrenDef && this.currentNestedChildren) {
                ret.push(...this.renderChildren(collected, h, def, options))
            }
            return ret.flat()
        },
        renderChildren (collected, h, def, options) {
            if (!this.currentChildrenDef) {
                return []
            }
            const ret = this.renderElement(collected, h, def, 'children-wrapper', options,
                (collected, h, def, options) => {
                    if (collected.children === undefined) {
                        collected.children = []
                    }
                    return options.pathValues.map(
                        pathValue => this.currentChildrenDef.map(
                            childDef => {
                                const ret = h(
                                    KVPairComponent,
                                    {
                                        props: {
                                            context: isObject(pathValue.value) ? pathValue.value : this.context,
                                            data: this.data,
                                            layout: childDef,
                                            paths: pathValue.paths,
                                            jsonPointer: pathValue.jsonPointer,
                                            layoutMergeOptions: this.layoutMergeOptions,
                                            pathLayouts: this.pathLayouts,
                                            url: this.url,
                                            schema: this.currentSchemaCode,
                                            nestedChildren: this.nestedChildren,
                                            showEmpty: this.showEmpty,
                                            labelTranslator: this.labelTranslator,
                                            dynamic: this.currentDynamic,
                                            layoutTranslator: this.layoutTranslator,
                                            layoutPostProcessor: this.layoutPostProcessor,
                                            extraProps: this.extraProps
                                        },
                                        scopedSlots: this.$scopedSlots,
                                        slots: this.slots
                                    }
                                )
                                collected.children.push(ret)
                                return ret
                            }
                        )
                    ).flat()
                }
            )
            return ret
        },
        applyFunctions (what, ifneeded, recursive = true) {
            if (ifneeded && !(what instanceof Function)) {
                return what
            }
            const pathValues = this.pathValues
            const values = this.values
            return _applyFunctions(what, {
                context: this.context,
                layout: this.layout,
                data: this.data,
                vue: this,
                paths: pathValues.length ? pathValues[0].paths : this.paths,
                value: values.length === 1 ? values[0] : values,
                url: this.url,
                values,
                pathValues
            }, recursive)
        },
        getWithDefault (propName, applyFunctions = true) {
            const layout = this.currentLayout
            if (layout === undefined) {
                return false
            }
            let tnc = applyFunctions ? this.applyFunctions(layout[propName], true) : layout[propName]
            if (tnc !== undefined) {
                return tnc
            }
            tnc = applyFunctions ? this.applyFunctions(this[propName], true) : this[propName]
            if (tnc !== undefined) {
                return tnc
            }
            tnc = applyFunctions ? this.applyFunctions(this.currentSchema[propName], true) : this.currentSchema[propName]
            if (tnc !== undefined) {
                return tnc
            }
            return applyFunctions ?
                this.applyFunctions(this.$oarepo.dataRenderer[propName], true) : this.$oarepo.dataRenderer[propName]
        }
    },
    computed: {
        pathValues () {
            return evaluatePath(isString(this.layout) ? this.layout : this.layout.path,
                this.context, this.jsonPointer, this.paths, this.layout.key)
        },
        values () {
            return this.pathValues.map(x => x.value)
        },
        currentSchemaCode () {
            return this.schema || 'inline'
        },
        currentSchema () {
            return this.applyFunctions(this.$oarepo.dataRenderer.schemas[this.currentSchemaCode])
        },
        currentLayout () {
            const pathValues = this.pathValues
            let def = this.applyFunctions(this.layout, true, false)
            if (isString(def)) {
                def = {
                    path: def
                }
            }
            if (isString(def.label)) {
                def = {
                    ...def,
                    label: {
                        value: def.label
                    }
                }
            }

            let overridenLayout = findPathInDict(
                pathValues.length ? pathValues[0].paths : this.paths,
                this.pathLayouts,
                null,
                this.currentSchemaCode)

            if (overridenLayout === null) {
                return null
            }
            overridenLayout = this.applyFunctions(overridenLayout, true, false)
            const ret = this.applyFunctions(
                ((this.layoutMergeOptions || {}).merge || deepmerge.all)(
                    [
                        this.currentSchema,
                        def,
                        (overridenLayout || {})
                    ], this.layoutMergeOptions)
            )
            if (this.layoutTranslator) {
                return this.layoutTranslator(
                    ret,
                    {
                        pathValues: this.pathValues,
                        paths: pathValues.length ? pathValues[0].paths : this.paths,
                        schema: this.currentSchemaCode,
                        vue: this,
                        url: this.url,
                        values: this.values
                    }
                )
            }
            return ret
        },
        currentChildrenDef () {
            const def = this.currentLayout
            if (!def) {
                return undefined
            }
            if (def.children !== undefined) {
                return def.children
            }
            if (!this.currentDynamic) {
                return undefined
            }
            let children = {}
            this.pathValues.forEach(x => {
                if (!isObject(x.value)) {
                    return
                }
                Object.keys(x.value).forEach(k => {
                    children[k] = true
                })
            })
            children = Object.keys(children)
            if (children.length) {
                return children.map(x => ({
                    path: x,
                    label: x
                }))
            } else {
                return undefined
            }
        },
        currentNestedChildren () {
            return this.getWithDefault('nestedChildren')
        },
        currentShowEmpty () {
            return this.getWithDefault('showEmpty')
        },
        currentLabelTranslator () {
            return this.getWithDefault('labelTranslator', false)
        },
        currentDynamic () {
            return this.getWithDefault('dynamic')
        },
        currentLayoutPostProcessor () {
            return this.getWithDefault('layoutPostProcessor', false)
        }
    }
}

export default KVPairComponent
export { SKIP_WRAPPER }

import { evaluatePath } from '../pathutils'
import { applyFunctions as _applyFunctions, findPathInDict } from '../defutils'
import { isObject, isString } from '../typeutils'
import deepmerge from 'deepmerge'

const SKIP_WRAPPER = '---skip-wrapper---'

const KVPairComponent = {
    props: {
        context: Object,
        data: Object,
        definition: [Object, String],
        paths: {
            type: Array,
            default: () => []
        },
        jsonPointer: {
            type: String,
            default: ''
        },
        definitionMergeOptions: {
            type: Object,
            default: () => {
            }
        },
        pathDefinitions: {
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
        definitionTranslator: Function,
        layoutTranslator: Function,
        dynamic: Boolean
    },
    render (h) {
        if (this.definition === undefined) {
            return h('div')
        }
        const def = this.currentDef
        if (def === null) {
            return h('div')
        }
        const pathValues = this.pathValues
        const values = this.values
        let ret = []
        const collected = {}
        const options = {
            context: this.context,
            definition: this.definition,
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
            ret.push(...this.renderWrapper(collected, h, def, options).flat())
        }
        if (this.currentLayoutTranslator) {
            this.currentLayoutTranslator(collected, options)
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
            if (label) {
                ret.push(...this.renderElement(collected, h, def, 'label', {
                    ...options,
                    label: label
                }, () => {
                    return label
                }))
            }
            if ((this.currentChildrenDef && this.currentNestedChildren) ||
                (!this.currentChildrenDef && options.values.length>0))
            {
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
                    }, () => isString(value) ? value: JSON.stringify(value))
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
                                            definition: childDef,
                                            paths: pathValue.paths,
                                            jsonPointer: pathValue.jsonPointer,
                                            definitionMergeOptions: this.definitionMergeOptions,
                                            pathDefinitions: this.pathDefinitions,
                                            url: this.url,
                                            schema: this.currentSchemaCode,
                                            nestedChildren: this.nestedChildren,
                                            showEmpty: this.showEmpty,
                                            labelTranslator: this.labelTranslator,
                                            dynamic: this.currentDynamic,
                                            definitionTranslator: this.definitionTranslator,
                                            layoutTranslator: this.layoutTranslator
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
        renderElement (collected, h, def, code, options, renderChildren, classCode) {
            if (collected[code] === undefined) {
                collected[code] = []
            }
            if (classCode === undefined) {
                classCode = code
            }
            const elDef = def[code]
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
                        renderChildren ? renderChildren(collected, h, def, options) : [])
                ]
                collected[code].push(...ret)
                return ret
            }
            return renderChildren ? renderChildren(collected, h, def, options) : []
        },
        applyFunctions (what, ifneeded) {
            if (ifneeded && !(what instanceof Function)) {
                return what
            }
            const pathValues = this.pathValues
            const values = this.values
            return _applyFunctions(what, {
                context: this.context,
                definition: this.definition,
                data: this.data,
                vue: this,
                paths: pathValues.length ? pathValues[0].paths : this.paths,
                value: values.length === 1 ? values[0] : values,
                url: this.url,
                values,
                pathValues
            })
        },
        getWithDefault (propName, applyFunctions = true) {
            const def = this.currentDef
            if (def === undefined) {
                return false
            }
            let tnc = applyFunctions ? this.applyFunctions(def[propName], true) : def[propName]
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
            return evaluatePath(isString(this.definition) ? this.definition: this.definition.path,
                this.context, this.jsonPointer, this.paths, this.definition.key)
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
        currentDef () {
            const pathValues = this.pathValues
            let def = this.applyFunctions(this.definition)
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

            let overridenDefinition = findPathInDict(
                pathValues.length ? pathValues[0].paths : this.paths,
                this.pathDefinitions,
                null,
                this.currentSchemaCode)

            if (overridenDefinition === null) {
                return null
            }
            overridenDefinition = this.applyFunctions(overridenDefinition)
            const ret = ((this.definitionMergeOptions || {}).merge || deepmerge.all)(
                [this.currentSchema, def, (overridenDefinition || {})], this.definitionMergeOptions)
            if (this.definitionTranslator) {
                return this.definitionTranslator(
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
            const def = this.currentDef
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
        currentLayoutTranslator () {
            return this.getWithDefault('layoutTranslator', false)
        }
    }
}

export default KVPairComponent
export { SKIP_WRAPPER }

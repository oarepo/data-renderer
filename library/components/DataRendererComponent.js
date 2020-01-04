import { JSONPath } from 'jsonpath-plus'
import deepmerge from 'deepmerge'

function isString (obj) {
    return (Object.prototype.toString.call(obj) === '[object String]')
}

function isObject (obj) {
    return Object(obj) === obj
}

function applyDefault(...args) {
    return args.find(x => x !== undefined)
}

export default {
    name: 'data-renderer',
    props: {
        data: Object,
        definition: {
            type: [Array, Object]
        },
        url: String,
        root: Object,
        showEmpty: Boolean,
        nestedChildren: Boolean,
        schema: [String, Object],
        labelTranslator: Function,
        dynamicDefinition: Boolean,
        pathDefinitions: {
            type: [Function, Object]
        },
        definitionMergeOptions: Object     // to be used for deepmerge
    },
    methods: {
        renderDefinitionList (h, data, definition, key, paths) {
            return definition.map(x => this.renderDefinition(h, data, x, key, paths))
                .flat()
        },
        setKeyedPaths: function (key, paths) {
            if (paths.length > 0) {
                paths = paths.map(x => `${x}-${key}`)
                paths.push(key)
            } else {
                paths = [key]
            }
            return paths
        },
        renderDefinition (h, data, definition, key, paths) {
            if (isString(definition)) {
                definition = {
                    path: definition,
                    label: definition
                }
            }
            // get the values
            let values = [data]
            let localKey = key
            if (definition.path) {
                values = JSONPath({
                    path: this.defunc(definition.path, { context: data, definition, paths }),
                    json: data
                }) || []
                if (definition.key) {
                    localKey = key + definition.key
                    paths = this.setKeyedPaths(definition.key, paths)
                } else {
                    const noArrayPath = definition.path.replace(/\[.*?\]/g, '')
                    localKey = key + noArrayPath
                    paths = this.setKeyedPaths(noArrayPath, paths)
                }
            } else if (definition.key) {
                localKey = key + definition.key
                paths = this.setKeyedPaths(definition.key, paths)
            }

            const overridenDefinition = this.currentPathDefinitions(
                {
                    context: data,
                    definition,
                    data: this.data,
                    paths: paths
                })
            if (overridenDefinition === null) {
                return []
            }
            if (overridenDefinition !== undefined) {
                definition = ((this.definitionMergeOptions || {}).merge || deepmerge)(
                    definition, overridenDefinition, this.definitionMergeOptions)
            }

            // do not show empty value unless explicitly asked for
            const showEmpty = this.defunc(definition.showEmpty, { context: data, definition, paths })
            if (values.length === 0 && (showEmpty === false || (showEmpty === undefined && this.showEmpty === false))) {
                return []
            }
            const layout = {}
            // create the definition of wrapper
            const wrapperDef = {
                ...this.currentSchema['wrapper'],
                ...(this.defunc(definition.wrapper, { context: data, definition, paths }, false) || {})
            }
            const wrapper = this.renderElement(h, data, definition,
                'wrapper', 'div',
                wrapperDef, key, paths, values)
            if (wrapper.content !== undefined) {
                // if handled via slot or component, return the rendering
                return wrapper.content
            }

            const wrapperContent = []

            // get the label definition
            let labelDef = this.defunc(definition.label, { context: data, definition, paths }, false) || {}
            // if the value is string, just take it as a shortcut to write label: str instead of label: { value: str }
            if (isString(labelDef)) {
                labelDef = {
                    ...this.currentSchema['label'],
                    value: labelDef
                }
            } else {
                labelDef = {
                    ...this.currentSchema['label'],
                    ...labelDef
                }
            }

            const label = this.renderElement(h, data, definition,
                'label', 'label',
                labelDef, key, paths, values)
            if (label.content !== undefined) {
                // if handled via slot or component, use as is
                wrapperContent.push(...label.content)
                layout.label = label.content
            } else {
                // otherwise apply the value of the label
                let labelValue = this.defunc(labelDef.value, { context: data, definition, paths })
                const translatedValue = this.currentLabelTranslator(
                    {
                        label: labelValue,
                        context: data,
                        definition,
                        data: this.data,
                        vue: this,
                        paths,
                        schema: this.currentSchemaCode
                    })
                if (translatedValue !== undefined) {
                    labelValue = translatedValue
                }

                if (labelValue) {
                    const labelTree = label.factory(labelValue)
                    wrapperContent.push(...labelTree)
                    layout.label = labelTree
                }
            }

            const childrenWrapperTree = []
            const childrenWrapperDef = {
                ...this.currentSchema['childrenWrapper'],
                ...(this.defunc(definition.childrenWrapper, { context: data, definition, paths }, false) || {})
            }
            const childrenWrapper = this.renderElement(h, data, definition,
                'children-wrapper', 'div',
                childrenWrapperDef, key, paths, values)
            if (childrenWrapper.content !== undefined) {
                childrenWrapperTree.push(...childrenWrapper.content)
            } else {
                if (definition.children && definition.children.length > 0) {
                    childrenWrapperTree.push(...values.map(
                        (value, idx) => childrenWrapper.factory(this.renderDefinitionList(h, value,
                            definition.children || [], `${localKey}{${idx}}.`, paths)))
                        .flat())
                } else if (this.dynamicRendering || definition.dynamic) {
                    values.forEach((value, idx) => {
                        if (isObject(value)) {
                            childrenWrapperTree.push(...childrenWrapper.factory(
                                this.renderDefinitionList(h, value,
                                    this.createDynamicDefinition(data, definition, paths, value),
                                    `${localKey}{${idx}}.`, paths)
                            ))
                        }
                    })
                }
            }
            const nestedChildren = applyDefault(
                this.defunc(definition.nestedChildren, { context: data, definition, paths }),
                this.defunc(this.nestedChildren, { context: data, definition, paths }) ||
                this.currentSchema.nestedChildren)

            const valueWrapperDef = {
                ...this.currentSchema['valueWrapper'],
                ...(this.defunc(definition.valueWrapper, { context: data, definition, paths }, false) || {})
            }
            const valueWrapper = this.renderElement(h, data, definition,
                'value-wrapper', 'div',
                valueWrapperDef, key, paths, values)
            if (valueWrapper.content !== undefined) {
                wrapperContent.push(...valueWrapper.content)
                layout.valueWrapper = valueWrapper.content
            } else {
                // render values
                const renderedValues = []
                // render values by default only if there are no children
                if (!childrenWrapperTree.length) {
                    values.forEach(value => {
                        const renderedValueDef = {
                            ...this.currentSchema['value'],
                            ...(this.defunc(definition.value, { context: data, definition, paths }, false) || {})
                        }
                        const renderedValue = this.renderElement(h, data, definition,
                            'value', 'div',
                            renderedValueDef, key, paths, value)
                        if (renderedValue.content !== undefined) {
                            // if handled via slot or component, return the rendering
                            if (definition.link && this.url !== undefined && this.url !== null) {
                                renderedValues.push(
                                    ...this.createLink(h, definition.link, ...renderedValue.content,
                                        definition, data, key + '{link}', paths, values))
                            } else {
                                renderedValues.push(...renderedValue.content)
                            }
                        } else {
                            if (!isString(value)) {
                                // TODO: render value as tree
                                value = JSON.stringify(value, null, 4)
                                    .replace(',', ', ')
                            }
                            if (definition.link && this.url !== undefined && this.url !== null) {
                                renderedValues.push(
                                    ...this.createLink(h, definition.link, renderedValue.factory(value),
                                        definition, data, key + '{link}', paths, values))
                            } else {
                                renderedValues.push(...renderedValue.factory(value))
                            }
                        }
                    })
                }
                layout.values = renderedValues

                const valueWrapperTree = valueWrapper.factory(nestedChildren ? [...renderedValues, ...childrenWrapperTree] : renderedValues)
                wrapperContent.push(...valueWrapperTree)
                layout.valueWrapper = valueWrapperTree
            }

            if (!nestedChildren) {
                wrapperContent.push(...childrenWrapperTree)
            }

            layout.childrenWrapper = childrenWrapperTree

            const wrapperTree = wrapper.factory(wrapperContent)
            layout.wraper = wrapperTree
            this.currentSchema.layoutCallback(layout)
            return wrapperTree
        },

        renderElement (h, data, definition, element, defaultTag, elDefinition, key, paths, values) {
            // at first try if there is a slot
            const slot = this.findSlot(paths, element)
            if (slot) {
                return {
                    content: [
                        slot({
                            context: data,
                            definition: definition,
                            data: this.data,
                            paths,
                            value: values,
                            values,
                            url: this.url,
                            vue: this
                        })
                    ]
                }
            }
            const defuncExtra = { context: data, definition, paths, value: values, values }
            // now check if there is a custom component
            const component = this.defunc(elDefinition.component, defuncExtra, false)
            if (component === null) {
                return {
                    content: []
                }
            }
            if (component !== undefined) {
                return {
                    content: [
                        h(component, {
                            class: [
                                ...(this.defunc(elDefinition.class, defuncExtra) || []),
                                `iqdr-${element}`,
                                `iqdr-${element}-${this.currentSchemaCode}`,
                                ...paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
                            ],
                            style: this.defunc(elDefinition.style, defuncExtra),
                            attrs: this.defunc(elDefinition.attrs, defuncExtra),
                            props: {
                                context: data,
                                definition: definition,
                                data: this.data,
                                paths,
                                value: values,
                                values,
                                url: this.url,
                                vue: this
                            }
                        })
                    ]
                }
            }

            const elementTag = this.defunc(elDefinition.element, { context: data, definition, paths })
            if (elementTag === null) {
                return []
            }

            // otherwise will render the element
            return {
                factory: (content) => {
                    const visible = this.defunc(elDefinition.visible, { context: data, definition, paths })
                    if (visible === false) {
                        return content
                    }
                    return [
                        h(
                            elementTag || defaultTag,
                            {
                                class: [
                                    ...(this.defunc(elDefinition.class, { context: data, definition, paths }) || []),
                                    `iqdr-${element}`, `iqdr-${element}-${this.currentSchemaCode}`,
                                    ...paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
                                ],
                                style: this.defunc(elDefinition.style, { context: data, definition, paths }),
                                attrs: this.defunc(elDefinition.attrs, { context: data, definition, paths }),
                                props: {
                                    context: data,
                                    definition: definition,
                                    data: this.data,
                                    paths,
                                    value: values,
                                    values,
                                    url: this.url,
                                    vue: this
                                }
                            },
                            content
                        )
                    ]
                }
            }
        },
        createLink (h, link, content, definition, context, key, paths, values) {
            if (link === true) {
                link = {}
            }
            if (!link.element && !link.component) {
                link = deepmerge(link, {
                    attrs: {
                        to: this.url
                    }
                })
            }
            const ret = this.renderElement(h, context, definition, 'link', 'router-link',
                link, key, paths, values)
            if (ret.content) {
                return ret.content
            }
            return ret.factory(content)
        },
        findPathInDict (paths, mapper, element) {
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
            let value = mapper[`-${element}${paths[0]}$${this.currentSchemaCode}`]
            if (value !== undefined) {
                return value
            }
            value = mapper[`-${element}${paths[0]}`]
            if (value !== undefined) {
                return value
            }
            for (const path of paths) {
                value = mapper[`${element}${path}$${this.currentSchemaCode}`]
                if (value !== undefined) {
                    return value
                }
                value = mapper[`${element}${path}`]
                if (value !== undefined) {
                    return value
                }
            }
            return undefined
        },
        findSlot (paths, element) {
            return this.findPathInDict(paths, this.$scopedSlots, element)
        },
        defunc (funcOrValue, extra /*{context, definition, paths, value, values}*/, recursive = true) {
            if (funcOrValue === null || funcOrValue === undefined) {
                return funcOrValue
            }
            if (isString(funcOrValue)) {
                return funcOrValue
            }
            if (funcOrValue instanceof Function) {
                // the result of a function is supposed to be resolved, so do not resolve again
                return this.defunc(
                    funcOrValue({
                        ...extra,
                        data: this.data,
                        vue: this,
                        url: this.url
                    }),
                    extra, false)
            }
            if (recursive) {
                if (Array.isArray(funcOrValue)) {
                    return funcOrValue.map(x => this.defunc(x, extra, recursive))
                }
                if (isObject(funcOrValue)) {
                    return Object.getOwnPropertyNames({ ...funcOrValue })
                        .reduce((prev, current) => {
                            if (current === 'component') {
                                prev[current] = this.defunc(funcOrValue[current], extra, false)
                            } else {
                                prev[current] = this.defunc(funcOrValue[current], extra, recursive)
                            }
                            return prev
                        }, {})
                }
            }
            return funcOrValue
        },
        createDynamicDefinition (context, definition, paths, data) {
            if (isObject(data)) {
                return Object.getOwnPropertyNames({ ...data })
                    .map(childName => {
                        const childPaths = paths.map(path => `${path}/${childName}`)
                        childPaths.push(childName)
                        return {
                            path: childName,
                            label: childName
                        }
                    }).filter(x => !!x)
            }
            return []
        }
    },
    computed: {
        currentPathDefinitions () {
            if (this.pathDefinitions instanceof Function) {
                return this.pathDefinitions
            }
            return ({ /* context, definition, data, */ paths }) => {
                return this.findPathInDict(paths, this.pathDefinitions || {}, null)
            }
        },
        currentSchema () {
            const schema = this.currentSchemaCode
            if (isString(schema)) {
                return this.$oarepo.dataRenderer.schemas[schema]
            }
            return schema
        },
        currentSchemaCode () {
            return this.schema || 'inline'
        },
        currentLabelTranslator () {
            if (this.labelTranslator) {
                return this.labelTranslator
            }
            return this.$oarepo.dataRenderer.labelTranslator
        },
        dynamicRendering () {
            if (this.definition === undefined) {
                return true
            }
            if (this.dynamicDefinition !== undefined) {
                return this.dynamicDefinition
            }
            return this.$oarepo.dataRenderer.dynamicDefinition
        }
    },
    render (h) {
        let ret
        let definition = this.definition
        if (definition === undefined) {
            definition = this.createDynamicDefinition(this.data, {}, [''], this.data)
        }
        if (Array.isArray(definition)) {
            ret = this.renderDefinitionList(h, this.data, definition, `data-${this.$_uid}/`, [])
        } else {
            ret = this.renderDefinition(h, this.data, definition, `data-${this.$_uid}/`, [])
        }
        const root = this.root ? this.root : this.currentSchema.root
        return h(root.element, {
            class: root.class,
            style: root.style,
            attrs: root.attrs
        }, ret)
    }
}

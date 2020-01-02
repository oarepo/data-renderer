import { JSONPath } from 'jsonpath-plus';

function isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
}

function isObject(obj) {
    return Object(obj) === obj;
}

export default {
    name: 'data-renderer',
    props: {
        data: Object,
        definition: {
            type: [Array, Object]
        },
        url: String,
        components: {
            type: [Function, Object],
        },
        root: Object,
        showEmpty: Boolean,
        nestedChildren: Boolean,
        schema: [String, Object],
        labelTranslator: Function,
        dynamicDefinition: Boolean,
        pathDefinitions: {
            type: [Function, Object]
        }
    },
    methods: {
        renderDefinitionList(h, data, definition, key, paths) {
            return definition.map(x => this.renderDefinition(h, data, x, key, paths))
                .flat();
        },
        renderDefinition(h, data, definition, key, paths) {

            // get the values
            let values = [data];
            let localKey = key;
            if (definition.path) {
                values = JSONPath({
                    path: this.defunc(definition.path, data, definition, paths),
                    json: data
                });
                const noArrayPath = definition.path.replace(/\[.*?\]/g, '');
                localKey = key + noArrayPath;
                if (paths.length > 0) {
                    paths = paths.map(x => `${x}/${noArrayPath}`);
                    paths.push(noArrayPath);
                } else {
                    paths = [noArrayPath];
                }
            }
            // do not show empty value unless explicitly asked for
            const showEmpty = this.defunc(definition.showEmpty, data, definition, paths);
            if (values.length === 0 && (showEmpty === false || (showEmpty === undefined && this.showEmpty === false))) {
                return [];
            }
            const layout = {};

            // create the definition of wrapper
            const wrapperDef = {
                ...this.currentSchema['wrapper'],
                ...(this.defunc(definition.wrapper, data, definition, paths, false) || {})
            };
            const wrapper = this.renderElement(h, data, definition,
                'wrapper', 'div',
                wrapperDef, key, paths, values);
            if (wrapper.content) {
                // if handled via slot or component, return the rendering
                return wrapper.content;
            }

            const wrapperContent = [];

            // get the label definition
            let labelDef = this.defunc(definition.label, data, definition, paths, false) || {};
            // if the value is string, just take it as a shortcut to write label: str instead of label: { value: str }
            if (isString(labelDef)) {
                labelDef = {
                    ...this.currentSchema['label'],
                    value: labelDef,
                };
            } else {
                labelDef = {
                    ...this.currentSchema['label'],
                    labelDef
                }
            }
            const labelValue = this.currentLabelTranslator(
                {
                    label: this.defunc(labelDef.value, data, definition, paths),
                    context: data,
                    definition,
                    data: this.data,
                    vue: this,
                    paths,
                    schema: this.currentSchemaCode
                });

            const label = this.renderElement(h, data, definition,
                'label', 'label',
                labelDef, key, paths, values);
            if (label.content) {
                // if handled via slot or component, use as is
                wrapperContent.push(...label.content);
                layout.label = label.content;
            } else {
                // otherwise apply the value of the label
                if (labelValue) {
                    const labelTree = label.factory(labelValue);
                    wrapperContent.push(...labelTree);
                    layout.label = labelTree;
                }
            }

            const childrenWrapperTree = [];
            const childrenWrapperDef = {
                ...this.currentSchema['childrenWrapper'],
                ...(this.defunc(definition.childrenWrapper, data, definition, paths, false) || {})
            };
            const childrenWrapper = this.renderElement(h, data, definition,
                'children-wrapper', 'div',
                childrenWrapperDef, key, paths, values);
            if (childrenWrapper.content) {
                childrenWrapperTree.push(...childrenWrapper.content);
            } else {
                if (definition.children && definition.children.length > 0) {
                    childrenWrapperTree.push(...values.map(
                        (value, idx) => childrenWrapper.factory(this.renderDefinitionList(h, value,
                            definition.children || [], `${localKey}{${idx}}.`, paths)))
                        .flat());
                } else if (this.dynamicRendering || definition.dynamic) {
                    values.forEach((value, idx) => {
                        if (isObject(value)) {
                            childrenWrapperTree.push(...childrenWrapper.factory(
                                this.renderDefinitionList(h, value,
                                    this.createDynamicDefinition(data, definition, paths, value),
                                    `${localKey}{${idx}}.`, paths)
                            ));
                        }
                    });
                }
            }
            const nestedChildren = this.defunc(definition.nestedChildren, data, definition, paths) || this.defunc(this.nestedChildren, data, definition, paths);

            const valueWrapperDef = {
                ...this.currentSchema['valueWrapper'],
                ...(this.defunc(definition.valueWrapper, data, definition, paths, false) || {})
            };
            const valueWrapper = this.renderElement(h, data, definition,
                'value-wrapper', 'div',
                valueWrapperDef, key, paths, values);
            if (valueWrapper.content) {
                wrapperContent.push(...valueWrapper.content);
                layout.valueWrapper = valueWrapper.content;
            } else {
                // render values
                const renderedValues = [];
                // render values by default only if there are no children
                if (!childrenWrapperTree.length) {
                    values.forEach(value => {
                        const renderedValueDef = {
                            ...this.currentSchema['value'],
                            ...(this.defunc(definition.value, data, definition, paths, false) || {})
                        };
                        const renderedValue = this.renderElement(h, data, definition,
                            'value', 'div',
                            renderedValueDef, key, paths, value);
                        if (renderedValue.content) {
                            // if handled via slot or component, return the rendering
                            renderedValues.push(...renderedValue.content);
                        } else {
                            if (!isString(value)) {
                                // TODO: render value as tree
                                value = JSON.stringify(value, null, 4)
                                    .replace(',', ', ');
                            }
                            renderedValues.push(...renderedValue.factory(value));
                        }
                    });
                }
                layout.values = renderedValues;

                const valueWrapperTree = valueWrapper.factory(nestedChildren ? [...renderedValues, ...childrenWrapperTree] : renderedValues);
                wrapperContent.push(...valueWrapperTree);
                layout.valueWrapper = valueWrapperTree;
            }

            if (!nestedChildren) {
                wrapperContent.push(...childrenWrapperTree);
            }

            layout.childrenWrapper = childrenWrapperTree;

            const wrapperTree = wrapper.factory(wrapperContent);
            layout.wraper = wrapperTree;
            this.currentSchema.layoutCallback(layout);
            return wrapperTree;
        },

        renderElement(h, data, definition, element, defaultTag, elDefinition, key, paths, values) {
            // at first try if there is a slot
            const slot = this.findSlot(paths, element);
            if (slot) {
                return {
                    content: [
                        slot({
                            context: data,
                            definition: definition,
                            data: this.data,
                            paths,
                            value: values,
                            values
                        })
                    ]
                };
            }

            // now check if there is a custom component
            const component =
                this.defunc(elDefinition.component, data, definition, paths, false) ||
                this.currentComponents({
                    context: data,
                    definition,
                    data: this.data,
                    paths,
                    element
                });
            if (component === null) {
                return {
                    content: []
                };
            }
            if (component !== undefined) {
                if (component.takesChildren) {
                    // create the component later with slot filled, so return a factory
                    return {
                        factory: (content) => {
                            return [
                                h(
                                    component,
                                    {
                                        class: [
                                            ...(this.defunc(elDefinition.class, data, definition, paths) || []),
                                            `iqdr-${element}`, `iqdr-${element}-${this.currentSchemaCode}`,
                                            ...paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
                                        ],
                                        style: this.defunc(elDefinition.style, data, definition, paths),
                                        attrs: this.defunc(elDefinition.attrs, data, definition, paths),
                                    },
                                    content
                                )
                            ];
                        }
                    };
                }
                return {
                    content: [
                        h(component, {
                            class: this.defunc(elDefinition.class, data, definition, paths) || `i-q-dr-${element}`,
                            style: this.defunc(elDefinition.style, data, definition, paths),
                            attrs: this.defunc(elDefinition.attrs, data, definition, paths),
                            props: {
                                context: data,
                                definition: definition,
                                data: this.data,
                                paths,
                                value: values,
                                values
                            }
                        })
                    ]
                };
            }

            // otherwise will render the element
            return {
                factory: (content) => {
                    const visible = this.defunc(elDefinition.visible, data, definition, paths);
                    if (visible === false) {
                        return content;
                    }
                    return [
                        h(
                            this.defunc(elDefinition.element, data, definition, paths) || defaultTag,
                            {
                                class: [
                                    ...(this.defunc(elDefinition.class, data, definition, paths) || []),
                                    `iqdr-${element}`, `iqdr-${element}-${this.currentSchemaCode}`,
                                    ...paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
                                ],
                                style: this.defunc(elDefinition.style, data, definition, paths),
                                attrs: this.defunc(elDefinition.attrs, data, definition, paths),
                            },
                            content
                        )
                    ];
                }
            };
        },
        findPathInDict(paths, mapper, element) {
            if (element) {
                element = `${element}-`;
            } else {
                element = '';
            }
            paths = paths || [];
            if (!paths.length) {
                return undefined;
            }
            if (!mapper || !Object.getOwnPropertyNames(mapper).length) {
                return undefined;
            }
            let value = mapper[`-${element}${paths[0]}$${this.currentSchemaCode}`];
            if (value !== undefined) {
                return value;
            }
            value = mapper[`-${element}${paths[0]}`];
            if (value !== undefined) {
                return value;
            }
            for (const path of paths) {
                value = mapper[`${element}${path}$${this.currentSchemaCode}`];
                if (value !== undefined) {
                    return value;
                }
                value = mapper[`${element}${path}`];
                if (value !== undefined) {
                    return value;
                }
            }
            return undefined;
        },
        findSlot(paths, element) {
            return this.findPathInDict(paths, this.$scopedSlots, element);
        },
        defunc(value, context, definition, paths, recursive = true) {
            if (value === null || value === undefined) {
                return value;
            }
            if (isString(value)) {
                return value;
            }
            if (value instanceof Function) {
                // the result of a function is supposed to be resolved, so do not resolve again
                return this.defunc(
                    value({
                        context,
                        definition,
                        data: this.data,
                        vue: this,
                        paths
                    }),
                    context, definition, paths, false);
            }
            if (recursive) {
                if (Array.isArray(value)) {
                    return value.map(x => this.defunc(x, context, definition, paths, recursive));
                }
                if (isObject(value)) {
                    return Object.getOwnPropertyNames({ ...value })
                        .reduce((prev, current) => {
                            if (current === 'component') {
                                prev[current] = this.defunc(value[current], context, definition, paths, false);
                            } else {
                                prev[current] = this.defunc(value[current], context, definition, paths, recursive);
                            }
                            return prev;
                        }, {});
                }
            }
            return value;
        },
        createDynamicDefinition(context, definition, paths, data) {
            if (isObject(data)) {
                return Object.getOwnPropertyNames({ ...data })
                    .map(childName => {
                        const childPaths = paths.map(path => `${path}/${childName}`);
                        childPaths.push(childName);
                        const ret = this.currentPathDefinitions(
                            {
                                context,
                                definition,
                                data: this.data,
                                paths: childPaths
                            });
                        if (ret !== undefined) return ret;
                        return {
                            path: childName,
                            label: childName
                        };
                    }).filter(x => !!x);
            }
            return [];
        }
    },
    computed: {
        currentComponents() {
            if (this.components instanceof Function) {
                return this.components;
            }
            return ({ /* context, definition, data, */ paths, element }) => {
                return this.findPathInDict(paths, this.components, element);
            };
        },
        currentPathDefinitions() {
            if (this.pathDefinitions instanceof Function) {
                return this.pathDefinitions;
            }
            return ({ /* context, definition, data, */ paths }) => {
                return this.findPathInDict(paths, this.pathDefinitions || {}, null);
            };
        },
        currentSchema() {
            const schema = this.currentSchemaCode;
            if (isString(schema)) {
                return this.$oarepo.dataRenderer.schemas[schema];
            }
            return schema;
        },
        currentSchemaCode() {
            return this.schema || 'inline';
        },
        currentLabelTranslator() {
            if (this.labelTranslator) {
                return this.labelTranslator;
            }
            return this.$oarepo.dataRenderer.labelTranslator;
        },
        dynamicRendering() {
            if (this.definition === undefined) {
                return true;
            }
            if (this.dynamicDefinition !== undefined) {
                return this.dynamicDefinition;
            }
            return this.$oarepo.dataRenderer.dynamicDefinition;
        }
    },
    render(h) {
        let ret;
        let definition = this.definition;
        if (definition === undefined) {
            definition = this.createDynamicDefinition(this.data, {}, [''], this.data);
        }
        if (Array.isArray(definition)) {
            ret = this.renderDefinitionList(h, this.data, definition, `data-${this.$_uid}/`, []);
        } else {
            ret = this.renderDefinition(h, this.data, definition, `data-${this.$_uid}/`, []);
        }
        const root = this.root ? this.root : this.currentSchema.root;
        return h(root.element, {
            class: root.class,
            style: root.style,
            attrs: root.attrs,
        }, ret);
    },
};

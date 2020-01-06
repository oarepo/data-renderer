import KVPairComponent from './KVPairComponent'
import deepmerge from 'deepmerge'

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
        schema: {
            type: String,
            default: 'inline'
        },
        labelTranslator: Function,
        dynamic: Boolean,
        pathDefinitions: {
            type: [Function, Object]
        },
        definitionTranslator: Function,
        layoutTranslator: Function,
        definitionMergeOptions: Object     // to be used for deepmerge
    },
    computed: {
        currentDefinitionMergeOptions () {
            return this.definitionMergeOptions || this.$oarepo.dataRenderer.definitionMergeOptions
        },
        currentSchema () {
            return this.$oarepo.dataRenderer.schemas[this.schema || 'inline']
        },
    },
    render (h) {
        let definition = this.definition
        if (definition instanceof Function) {
            definition = definition({
                context: this.data,
                definition,
                data: this.data,
                paths: [],
                value: this.data,
                values: [this.data],
                pathValues: [
                    {
                        paths: [],
                        jsonPointer: undefined,
                        value: this.data
                    }
                ]
            })
        }
        if (!Array.isArray(definition) && definition !== undefined) {
            definition = [definition]
        }
        return h(KVPairComponent, {
            props: {
                context: this.data,
                data: this.data,
                definition: {
                    ...((this.currentDefinitionMergeOptions || {}).merge || deepmerge.all)(
                        [
                            this.$oarepo.dataRenderer.root,
                            { wrapper: this.currentSchema.root } || {},
                            {
                                wrapper: {
                                    class: ['iqdr-root', `iqdr-root-${this.schema || 'inline'}`]
                                }
                            },
                            this.root || {}
                        ], this.currentDefinitionMergeOptions
                    ),
                    children: definition,
                    dynamic: this.dynamic || this.definition === undefined
                },
                paths: [],
                jsonPointer: undefined,
                definitionMergeOptions: this.currentDefinitionMergeOptions,
                pathDefinitions: this.pathDefinitions,
                url: this.url,
                schema: this.schema,
                nestedChildren: this.nestedChildren,
                showEmpty: this.showEmpty,
                labelTranslator: this.labelTranslator,
                dynamic: this.dynamic,
                definitionTranslator: this.definitionTranslator,
                layoutTranslator: this.layoutTranslator
            },
            scopedSlots: this.$scopedSlots,
            slots: this.slots
        })
    }
}

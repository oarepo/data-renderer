import KVPairComponent from './KVPairComponent'
import deepmerge from 'deepmerge'

export default {
    name: 'data-renderer',
    props: {
        data: Object,
        layout: {
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
        pathLayouts: {
            type: [Function, Object]
        },
        layoutTranslator: Function,
        layoutPostProcessor: Function,
        layoutMergeOptions: Object     // to be used for deepmerge
    },
    computed: {
        currentLayoutMergeOptions () {
            return this.layoutMergeOptions || this.$oarepo.dataRenderer.layoutMergeOptions
        },
        currentSchema () {
            return this.$oarepo.dataRenderer.schemas[this.schema || 'inline']
        },
    },
    render (h) {
        let layout = this.layout
        if (layout instanceof Function) {
            layout = layout({
                context: this.data,
                layout,
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
        if (!Array.isArray(layout) && layout !== undefined) {
            layout = [layout]
        }
        return h(KVPairComponent, {
            props: {
                context: this.data,
                data: this.data,
                layout: {
                    ...((this.currentLayoutMergeOptions || {}).merge || deepmerge.all)(
                        [
                            this.$oarepo.dataRenderer.root,
                            { wrapper: this.currentSchema.root } || {},
                            {
                                wrapper: {
                                    class: ['iqdr-root', `iqdr-root-${this.schema || 'inline'}`]
                                }
                            },
                            this.root || {}
                        ], this.currentLayoutMergeOptions
                    ),
                    children: layout,
                    dynamic: this.dynamic || this.layout === undefined
                },
                paths: [],
                jsonPointer: undefined,
                layoutMergeOptions: this.currentLayoutMergeOptions,
                pathLayouts: this.pathLayouts,
                url: this.url,
                schema: this.schema,
                nestedChildren: this.nestedChildren,
                showEmpty: this.showEmpty,
                labelTranslator: this.labelTranslator,
                dynamic: this.dynamic,
                layoutTranslator: this.layoutTranslator,
                layoutPostProcessor: this.layoutPostProcessor
            },
            scopedSlots: this.$scopedSlots,
            slots: this.slots
        })
    }
}

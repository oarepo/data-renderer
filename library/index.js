import DataRendererComponent from './components/DataRendererComponent'
import KVPairComponent, { SKIP_WRAPPER } from './components/KVPairComponent'
import { RendererMixin } from './components/mixins'

export default {
    install (Vue, options) {

        options = {
            labelTranslator: function (label, options) {
                if (!label) {
                    return label
                }
                if (options.schema === 'inline' && label) {
                    return `${label}: `
                }
                return label
            },
            ...options
        }

        Vue.component(options.dataRendererName || DataRendererComponent.name, DataRendererComponent)

        if (Vue.prototype.$oarepo === undefined) {
            Vue.prototype.$oarepo = {}
        }

        const icon = options.icon || {
            element: null,
            component: null
        }

        Vue.prototype.$oarepo.dataRenderer = {
            ...options,
            schemas: {
                inline: {
                    wrapper: {
                        element: 'div'
                    },
                    label: {
                        element: 'label'
                    },
                    icon,
                    'value-wrapper': {
                        element: 'div',
                        style: { display: 'inline' }
                    },
                    value: {
                        element: 'div',
                        style: { display: 'inline' }
                    },
                    'children-wrapper': {
                        element: 'div',
                        style: { 'margin-left': '30px' }
                    },
                    'link-wrapper': {
                        element: 'router-link',
                        attrs: {
                            to: (options) => options.url
                        }
                    },
                    root: {
                        element: 'div',
                        class: '',
                        style: '',
                        attrs: ''
                    },
                },
                block: {
                    wrapper: {
                        element: 'div'
                    },
                    label: {
                        element: 'div',
                        style: { 'vertical-align': 'top' }
                    },
                    icon,
                    'value-wrapper': {
                        element: 'div',
                        style: { display: 'block' }
                    },
                    value: {
                        element: 'div'
                    },
                    'children-wrapper': {
                        element: 'div',
                        style: { 'margin-left': '30px' }
                    },
                    'link-wrapper': {
                        element: 'router-link',
                        attrs: {
                            to: (options) => options.url
                        }
                    },
                    root: {
                        element: 'div',
                        class: '',
                        style: '',
                        attrs: ''
                    },
                },
                flex: {
                    wrapper: {
                        element: 'div',
                        class: ['row', 'q-col-gutter-sm']
                    },
                    label: {
                        element: 'div',
                        style: { 'vertical-align': 'top' },
                        class: ['col-3']
                    },
                    icon,
                    'value-wrapper': {
                        element: 'div',
                        style: { display: 'block' },
                        class: ['col-9']
                    },
                    value: {
                        element: 'div'
                    },
                    'children-wrapper': {
                        element: 'div'
                    },
                    'link-wrapper': {
                        element: 'router-link',
                        attrs: {
                            to: (options) => options.url
                        }
                    },
                    root: {
                        element: 'div',
                        class: '',
                        style: '',
                        attrs: ''
                    },
                },
                table: {
                    wrapper: {
                        element: 'tr'
                    },
                    label: {
                        element: 'td',
                        style: { 'vertical-align': 'top' }
                    },
                    icon,
                    'value-wrapper': {
                        element: 'td'
                    },
                    value: {
                        element: 'div'
                    },
                    'children-wrapper': {
                        element: 'table',
                        style: { 'border-collapse': 'collapse' }
                    },
                    'link-wrapper': {
                        element: 'router-link',
                        attrs: {
                            to: (options) => options.url
                        }
                    },
                    root: {
                        element: 'table',
                        class: '',
                        style: { 'border-collapse': 'collapse' },
                        attrs: ''
                    },
                    layoutPostProcessor: (layout/*, options*/) => {
                        if (!layout.label && layout['value-wrapper'] && layout['value-wrapper'].length === 1) {
                            layout['value-wrapper'][0].data.attrs = {
                                colspan: 2,
                                ...(layout['value-wrapper'][0].data.attrs || {})
                            }
                        }
                    },
                    nestedChildren: true
                }
            },
            root: {
                wrapper: {
                    element: 'div'
                },
                label: {
                    element: null,
                    component: null
                },
                'value-wrapper': {
                    element: SKIP_WRAPPER,
                    component: SKIP_WRAPPER
                },
                value: {
                    element: null,
                    component: null
                },
                'children-wrapper': {
                    element: SKIP_WRAPPER,
                    component: SKIP_WRAPPER
                }
            },
            layoutMergeOptions: {
            }
        }
    }
}

export {
    DataRendererComponent,
    KVPairComponent,
    SKIP_WRAPPER,
    RendererMixin
}

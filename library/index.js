import DataRendererComponent from './components/DataRendererComponent'
import KVPairComponent, { SKIP_WRAPPER } from './components/KVPairComponent'
import { RendererMixin } from './components/mixins'
import startCase from 'lodash.startcase'
import { f } from './defutils'

export default {
    install (Vue, options) {

        options = {
            labelTranslator: function (label, options) {
                if (!label) {
                    return label
                }
                label = startCase(label)
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
                            to: f((options) => options.url)
                        }
                    },
                    multiple: {
                        element: 'div',
                        style: {display: 'inline-table'},
                        class: [],
                        attrs: {}
                    },
                    'children-arritm-wrapper': {
                        element: 'div',
                        component: SKIP_WRAPPER,
                        style: {display: 'block'},
                        class: [],
                        attrs: {}
                    },
                    root: {
                        element: 'div',
                        class: '',
                        style: '',
                        attrs: ''
                    },
                    array_item: {
                        path: '*',
                        wrapper: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        label: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER,
                            value: null
                        },
                        icon: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'value-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        value: {
                            element: 'div',
                            style: {display: 'table-row'},
                        },
                        'children-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'link-wrapper': {
                            element: 'router-link',
                            attrs: {
                                to: f((options) => options.url)
                            }
                        },
                    }
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
                            to: f((options) => options.url)
                        }
                    },
                    'children-arritm-wrapper': {
                        element: 'div',
                        component: SKIP_WRAPPER,
                        style: {display: 'block'},
                        class: [],
                        attrs: {}
                    },
                    multiple: {
                        element: 'div',
                        style: {display: 'inline-table'},
                        class: [],
                        attrs: {}
                    },
                    root: {
                        element: 'div',
                        class: '',
                        style: '',
                        attrs: ''
                    },
                    array_item: {
                        path: '*',
                        wrapper: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        label: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER,
                            value: null
                        },
                        icon: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'value-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        value: {
                            element: 'div',
                            style: {display: 'table-row'},
                        },
                        'children-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'link-wrapper': {
                            element: 'router-link',
                            attrs: {
                                to: f((options) => options.url)
                            }
                        },
                    }
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
                            to: f((options) => options.url)
                        }
                    },
                    'children-arritm-wrapper': {
                        element: 'div',
                        component: SKIP_WRAPPER,
                        style: {display: 'block'},
                        class: [],
                        attrs: {}
                    },
                    multiple: {
                        element: 'div',
                        style: {display: 'inline-table'},
                        class: [],
                        attrs: {}
                    },
                    root: {
                        element: 'div',
                        class: '',
                        style: '',
                        attrs: ''
                    },
                    array_item: {
                        path: '*',
                        wrapper: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        label: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER,
                            value: null
                        },
                        icon: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'value-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        value: {
                            element: 'div',
                            style: {display: 'table-row'},
                        },
                        'children-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'link-wrapper': {
                            element: 'router-link',
                            attrs: {
                                to: f((options) => options.url)
                            }
                        },
                    }
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
                            to: f((options) => options.url)
                        }
                    },
                    'children-arritm-wrapper': {
                        element: 'div',
                        component: SKIP_WRAPPER,
                        style: {display: 'block'},
                        class: [],
                        attrs: {}
                    },
                    multiple: {
                        element: 'div',
                        style: {display: 'inline-table'},
                        class: [],
                        attrs: {}
                    },
                    root: {
                        element: 'table',
                        class: '',
                        style: { 'border-collapse': 'collapse' },
                        attrs: ''
                    },
                    array_item: {
                        path: '*',
                        wrapper: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        label: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER,
                            value: null
                        },
                        icon: {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'value-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        value: {
                            element: 'div',
                            style: {display: 'block'},
                        },
                        'children-wrapper': {
                            component: SKIP_WRAPPER,
                            element: SKIP_WRAPPER
                        },
                        'link-wrapper': {
                            element: 'router-link',
                            attrs: {
                                to: f((options) => options.url)
                            }
                        },
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
    RendererMixin,
    f
}

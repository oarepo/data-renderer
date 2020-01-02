import { expect } from 'chai'
import { /* shallowMount, */ mount, createLocalVue } from '@vue/test-utils'
import install, { DataRendererComponent } from '@oarepo/data-renderer'

describe('DataRendererComponent.vue', () => {

    it('renders empty data', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {},
                definition: []
            }
        })
        expect(wrapper.html()).to.include('<div class=""></div>')
    })

    it('renders simple data', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                },
                definition: [
                    {
                        path: 'title'
                    }
                ]
            }
        })
        expect(wrapper.html()).to.include(
            '<div class=""><div class="iqdr-wrapper iqdr-wrapper-inline iqdr-path-title">' +
            '<div class="iqdr-value-wrapper iqdr-value-wrapper-inline iqdr-path-title" style="display: inline;">' +
            '<div class="iqdr-value iqdr-value-inline iqdr-path-title" style="display: inline;">abc</div></div></div></div>')
    })

    it('renders dynamic data', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                }
            }
        })
        expect(wrapper.html()).to.include(
            '<div class=""><div class="iqdr-wrapper iqdr-wrapper-inline iqdr-path-title">' +
            '<label class="iqdr-label iqdr-label-inline iqdr-path-title">title: </label>' +
            '<div class="iqdr-value-wrapper iqdr-value-wrapper-inline iqdr-path-title" style="display: inline;">' +
            '<div class="iqdr-value iqdr-value-inline iqdr-path-title" style="display: inline;">abc</div></div></div></div>')
    })

    it('renders component', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                },
                definition: [
                    {
                        path: 'title',
                        wrapper: {
                            component: {
                                render (h) {
                                    return h('div', '123')
                                }
                            }
                        }
                    }
                ]
            }
        })
        expect(wrapper.html()).to.include(
            '<div class=""><div class="iqdr-wrapper iqdr-wrapper-inline iqdr-path-title">123</div></div>')
    })

    it('renders dynamic component', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                },
                pathDefinitions: {
                    'title': {
                        wrapper: {
                            component: {
                                render (h) {
                                    return h('div', '123')
                                }
                            }
                        }
                    }
                }
            }
        })
        expect(wrapper.html()).to.include(
            '<div class=""><div class="iqdr-wrapper iqdr-wrapper-inline iqdr-path-title">123</div></div>')
    })

    it('renders slots', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                }
            },
            scopedSlots: {
                'wrapper-title': '<div class="wr" />'
            }
        })
        expect(wrapper.html()).to.include(
            '<div class=""><div class="wr"></div></div>')
    })
})

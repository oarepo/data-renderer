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

    it('value slot gets value', () => {
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
                'value-title': (props) => {
                    return `${props.value}`
                }
            }
        })
        expect(wrapper.html()).to.include(
            '<div class=""><div class="iqdr-wrapper iqdr-wrapper-inline iqdr-path-title"><label class="iqdr-label iqdr-label-inline iqdr-path-title">title: </label><div class="iqdr-value-wrapper iqdr-value-wrapper-inline iqdr-path-title" style="display: inline;">abc</div></div></div>')
    })

    it('attr gets value', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    thumbnail: 'abc'
                },
                pathDefinitions: {
                    thumbnail: {
                        path: 'thumbnail',
                        label: 'Thumbnail',
                        value: {
                            component: 'img',
                            attrs: {
                                src: (args) => {
                                    expect(Object.keys(args)).to.contain('value')
                                    return args.value
                                },
                                width: '16'
                            }
                        }
                    }
                }
            }
        })
        expect(wrapper.html()).to.include(
            '<img src="abc" width="16" class="iqdr-value iqdr-value-inline iqdr-path-thumbnail" style="display: inline;">')
    })

    it('correct label component rendering in pathDefinitions', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    creator: 'abc'
                },
                pathDefinitions: {
                    creator: {
                        label: {
                            component: {
                                render (h) {
                                    return h('span', '**label**')
                                }
                            }
                        }
                    }
                }
            }
        })
        expect(wrapper.html()).to.include(
            '**label**')
    })

    it('renders default link', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    creator: 'abc'
                },
                pathDefinitions: {
                    creator: {
                        link: true
                    }
                },
                url: 'http://google.com'
            }
        })
        expect(wrapper.html()).to.include(
            '<router-link to="http://google.com" class="iqdr-link iqdr-link-inline iqdr-path-creator">')
    })

    it('renders default link with a class', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    creator: 'abc'
                },
                pathDefinitions: {
                    creator: {
                        link: {
                            class: ['test']
                        }
                    }
                },
                url: 'http://google.com'
            }
        })
        expect(wrapper.html()).to.include(
            '<router-link to="http://google.com" class="test iqdr-link iqdr-link-inline iqdr-path-creator">')
    })

    it('renders custom link', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    creator: 'abc'
                },
                pathDefinitions: {
                    creator: {
                        link: {
                            element: 'a',
                            attrs: {
                                href: ({ url }) => url
                            }
                        }
                    }
                },
                url: 'http://google.com'
            }
        })
        expect(wrapper.html()).to.include(
            '<a href="http://google.com" class="iqdr-link iqdr-link-inline iqdr-path-creator"><div class="iqdr-value iqdr-value-inline iqdr-path-creator" style="display: inline;">abc</div></a>')
    })

    it('renders correctly table in dynamic mode', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc',
                    location: {
                        street: '1'
                    }
                },
                pathDefinitions: {
                    path: 'location',
                    dynamic: true,
                    label: 'Location'
                },
                schema: 'table'
            }
        })
        expect(wrapper.html()).to.include('<td class="iqdr-value-wrapper iqdr-value-wrapper-table iqdr-path-location"><table class="iqdr-children-wrapper iqdr-children-wrapper-table iqdr-path-location" style="border-collapse: collapse;">')
    })

    it('renders string instead of definition', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc',
                },
                definition: ['title'],
            }
        })
        expect(wrapper.html()).to.include('abc')
    })

    it('custom path', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc',
                },
                definition: [{path: 'title', key: 'aaa'}],
            }
        })
        expect(wrapper.html()).to.include('iqdr-path-aaa')
        expect(wrapper.html()).to.not.include('iqdr-path-title')
    })
})

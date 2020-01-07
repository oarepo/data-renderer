import { expect } from 'chai'
import { /* shallowMount, */ mount, createLocalVue } from '@vue/test-utils'
import install, { DataRendererComponent } from '@oarepo/data-renderer'
import { html_beautify } from 'js-beautify'

describe('DataRendererComponent.vue', () => {

    it('renders empty data', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {},
                layout: []
            }
        })
        expect(wrapper.html()).to.include('<div class="iqdr-root iqdr-root-inline iqdr-wrapper"></div>')
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
                layout: [
                    {
                        path: 'title'
                    }
                ]
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include(
            '<div class="iqdr-root iqdr-root-inline iqdr-wrapper"><div class="iqdr-wrapper iqdr-path-title">' +
            '<div class="iqdr-value-wrapper iqdr-path-title" style="display: inline;">' +
            '<div class="iqdr-value iqdr-path-title" style="display: inline;">abc</div></div></div></div>')
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
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include(
            '<div class="iqdr-root iqdr-root-inline iqdr-wrapper"><div class="iqdr-wrapper iqdr-path-title">' +
            '<label class="iqdr-label iqdr-path-title">title: </label>' +
            '<div class="iqdr-value-wrapper iqdr-path-title" style="display: inline;">' +
            '<div class="iqdr-value iqdr-path-title" style="display: inline;">abc</div></div></div></div>')
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
                layout: [
                    {
                        path: 'title',
                        wrapper: {
                            component: {
                                render (h) {
                                    console.log(arguments.length)
                                    return h('div', '123')
                                }
                            }
                        }
                    }
                ]
            }
        })
        expect(wrapper.html()).to.include(
            '<div class="iqdr-root iqdr-root-inline iqdr-wrapper"><div class="iqdr-wrapper iqdr-path-title">123</div></div>')
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
                pathLayouts: {
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
            '<div class="iqdr-root iqdr-root-inline iqdr-wrapper"><div class="iqdr-wrapper iqdr-path-title">123</div></div>')
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
            '<div class="iqdr-root iqdr-root-inline iqdr-wrapper"><div class="wr"></div></div>')
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
            '<div class="iqdr-root iqdr-root-inline iqdr-wrapper"><div class="iqdr-wrapper iqdr-path-title"><label class="iqdr-label iqdr-path-title">title: </label><div class="iqdr-value-wrapper iqdr-path-title" style="display: inline;">abc</div></div></div>')
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
                pathLayouts: {
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
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include(
            '<img src="abc" width="16" class="iqdr-value iqdr-path-thumbnail" style="display: inline;">')
    })

    it('correct label component rendering in pathLayouts', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    creator: 'abc'
                },
                pathLayouts: {
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
                pathLayouts: {
                    creator: {
                        link: true
                    }
                },
                url: 'http://google.com'
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include(
            '<router-link to="http://google.com" class="iqdr-link iqdr-path-creator">')
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
                pathLayouts: {
                    creator: {
                        'link-wrapper': {
                            class: ['test']
                        },
                        link: true
                    }
                },
                url: 'http://google.com'
            }
        })
        expect(wrapper.html()).to.include(
            '<router-link to="http://google.com" class="test iqdr-link iqdr-path-creator">')
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
                pathLayouts: {
                    creator: {
                        'link-wrapper': {
                            element: 'a',
                            attrs: {
                                href: ({ url }) => url,
                                to: null
                            }
                        },
                        link: true
                    }
                },
                url: 'http://google.com'
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include(
            '<a href="http://google.com" class="iqdr-link iqdr-path-creator"><div class="iqdr-value iqdr-path-creator" style="display: inline;">abc</div></a>')
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
                pathLayouts: {
                    path: 'location',
                    dynamic: true,
                    label: 'Location'
                },
                schema: 'table'
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include('' +
            '<td class="iqdr-value-wrapper iqdr-path-location">' +
            '<table class="iqdr-children-wrapper iqdr-path-location" style="border-collapse: collapse;">')
    })

    it('renders table colspan', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc',
                },
                layout: [
                    {
                        path: 'title'
                    }
                ],
                schema: 'table'
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include('colspan="2"')
    })

    it('renders string instead of layout', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                },
                layout: ['title']
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
                    title: 'abc'
                },
                layout: [{ path: 'title', key: 'aaa' }]
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include('iqdr-path-aaa')
        expect(wrapper.html()).to.not.include('iqdr-path-title')
    })

    it('custom path on collection', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                },
                layout: [{ key: 'aaa', children: ['title'] }]
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include('iqdr-path-aaa')
        expect(wrapper.html()).to.include('iqdr-path-aaa-title')
    })

    it('layoutTranslator', () => {
        const localVue = createLocalVue()
        localVue.use(install)

        const wrapper = mount(DataRendererComponent, {
            localVue,
            propsData: {
                data: {
                    title: 'abc'
                },
                dynamic: true,
                layoutTranslator (def/*, options*/) {
                    def.wrapper.class = ['test']
                    return def
                }
            }
        })
        console.log(html_beautify(wrapper.html()))
        expect(wrapper.html()).to.include('class="test iqdr-wrapper"')
    })
})

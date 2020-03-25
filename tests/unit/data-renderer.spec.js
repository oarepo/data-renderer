import {expect} from 'chai'
import {createLocalVue, mount} from '@vue/test-utils'
import install, {DataRendererComponent} from '@oarepo/data-renderer'
import ObjectComponent from '../../library/components/ObjectComponent'
import ArrayComponent from '../../library/components/ArrayComponent'
import UndefinedComponent from '../../library/components/primitive/UndefinedComponent'
import BooleanComponent from '../../library/components/primitive/BooleanComponent'
import NumberComponent from '../../library/components/primitive/NumberComponent'
import StringComponent from '../../library/components/primitive/StringComponent'
import {f} from '../../library'

describe('DataRendererComponent.vue', () => {

  it('renders empty data', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(DataRendererComponent, {
      localVue,
      propsData: {
        data: {},
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include('<div class="iqdr-childrenWrapper" style="margin-left: 30px;"></div>')
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
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;">\n' +
      '  <div class="iqdr-wrapper iqdr-path-title"><label class="iqdr-label iqdr-path-title">Title: </label>\n' +
      '    <div class="iqdr-value iqdr-path-title" style="display: inline;">abc</div>\n' +
      '  </div>\n' +
      '</div>')
  })

  it('renders simple array', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(DataRendererComponent, {
      localVue,
      propsData: {
        data: {
          array: [1, 2, 3]
        },
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;">\n' +
      '  <div class="iqdr-wrapper iqdr-path-array"><label class="iqdr-label iqdr-path-array">Array: </label>\n' +
      '    <div class="iqdr-arrayWrapper iqdr-path-array" style="display: inline-table;">\n' +
      '      <div class="iqdr-wrapper iqdr-path-array-0 iqdr-path-0">\n' +
      '        <div class="iqdr-value iqdr-path-array-0 iqdr-path-0" style="display: inline;">1</div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-array-1 iqdr-path-1">\n' +
      '        <div class="iqdr-value iqdr-path-array-1 iqdr-path-1" style="display: inline;">2</div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-array-2 iqdr-path-2">\n' +
      '        <div class="iqdr-value iqdr-path-array-2 iqdr-path-2" style="display: inline;">3</div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>')
  })

  it('renders object with layout', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(DataRendererComponent, {
      localVue,
      propsData: {
        data: {
          object: { a: 1, b: 2 }
        },
        layout: {
          showEmpty: true,
          childrenWrapper: {
            element: 'div'
          },
          children: [
            {
              prop: 'object',
              label: {
                label: 'Object label'
              },
              children: [
                {
                  prop: 'a',
                  label: {
                    label: 'A'
                  }
                },
                {
                  prop: 'b',
                  label: {
                    label: 'B'
                  }
                }]
            }]
        }
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;">\n' +
      '  <div class="iqdr-wrapper iqdr-path-object"><label class="iqdr-label iqdr-path-object">Object Label: </label>\n' +
      '    <div class="iqdr-childrenWrapper iqdr-path-object" style="margin-left: 30px;">\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-a iqdr-path-a"><label class="iqdr-label iqdr-path-object-a iqdr-path-a">A: </label>\n' +
      '        <div class="iqdr-value iqdr-path-object-a iqdr-path-a" style="display: inline;">1</div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-b iqdr-path-b"><label class="iqdr-label iqdr-path-object-b iqdr-path-b">B: </label>\n' +
      '        <div class="iqdr-value iqdr-path-object-b iqdr-path-b" style="display: inline;">2</div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>')
  })

  it('renders array data', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(DataRendererComponent, {
      localVue,
      propsData: {
        data: {
          object: { a: 1, b: 2 }
        },
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;">\n' +
      '  <div class="iqdr-wrapper iqdr-path-object"><label class="iqdr-label iqdr-path-object">Object: </label>\n' +
      '    <div class="iqdr-childrenWrapper iqdr-path-object" style="margin-left: 30px;">\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-a iqdr-path-a"><label class="iqdr-label iqdr-path-object-a iqdr-path-a">A: </label>\n' +
      '        <div class="iqdr-value iqdr-path-object-a iqdr-path-a" style="display: inline;">1</div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-b iqdr-path-b"><label class="iqdr-label iqdr-path-object-b iqdr-path-b">B: </label>\n' +
      '        <div class="iqdr-value iqdr-path-object-b iqdr-path-b" style="display: inline;">2</div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>')
  })

  it('renders object component', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(ObjectComponent, {
      localVue,
      propsData: {
        value: {
          object: { a: 1, b: 2 }
        },
        paths: [],
        layout: {},
        rendererComponents: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;">\n' +
      '  <div class="iqdr-wrapper iqdr-path-object"><label class="iqdr-label iqdr-path-object">Object: </label>\n' +
      '    <div class="iqdr-childrenWrapper iqdr-path-object" style="margin-left: 30px;">\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-a iqdr-path-a"><label class="iqdr-label iqdr-path-object-a iqdr-path-a">A: </label>\n' +
      '        <div class="iqdr-value iqdr-path-object-a iqdr-path-a" style="display: inline;">1</div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-b iqdr-path-b"><label class="iqdr-label iqdr-path-object-b iqdr-path-b">B: </label>\n' +
      '        <div class="iqdr-value iqdr-path-object-b iqdr-path-b" style="display: inline;">2</div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>')
  })

  it('renders array component', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(ArrayComponent, {
      localVue,
      propsData: {
        value: [1, 2, 3],
        paths: [],
        layout: {},
        rendererComponents: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-arrayWrapper" style="display: inline-table;">\n' +
      '  <div class="iqdr-wrapper iqdr-path-0">\n' +
      '    <div class="iqdr-value iqdr-path-0" style="display: inline;">1</div>\n' +
      '  </div>\n' +
      '  <div class="iqdr-wrapper iqdr-path-1">\n' +
      '    <div class="iqdr-value iqdr-path-1" style="display: inline;">2</div>\n' +
      '  </div>\n' +
      '  <div class="iqdr-wrapper iqdr-path-2">\n' +
      '    <div class="iqdr-value iqdr-path-2" style="display: inline;">3</div>\n' +
      '  </div>\n' +
      '</div>')
  })

  it('renders string component', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(StringComponent, {
      localVue,
      propsData: {
        value: 'string',
        paths: [],
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-value" style="display: inline;">string</div>')
  })

  it('renders number component', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(NumberComponent, {
      localVue,
      propsData: {
        value: 1,
        paths: [],
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-value" style="display: inline;">1</div>')
  })

  it('renders boolean component', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(BooleanComponent, {
      localVue,
      propsData: {
        value: true,
        paths: [],
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-value" style="display: inline;">true</div>')
  })

  it('renders undefined component', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(UndefinedComponent, {
      localVue,
      propsData: {
        value: null,
        paths: [],
        layout: {}
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-value" style="display: inline;">---</div>')
  })

  it('renders custom html element', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(DataRendererComponent, {
      localVue,
      propsData: {
        data: { image: 'https://cis-login.vscht.cz/static/web/logo_small.png' },
        paths: [],
        layout: {
          showEmpty: true,
          childrenWrapper: {
            element: 'div'
          },
          children: [
            {
              prop: 'image',
              label: {
                label: 'Image'
              },
              value: {
                element: 'img',
                attrs: {
                  src: f(({value}) => {
                    return value
                  }),
                  width: '32'
                }
              }
            }]
        }
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;" paths="">\n' +
      '  <div class="iqdr-wrapper iqdr-path-image"><label class="iqdr-label iqdr-path-image">Image: </label><img src="https://cis-login.vscht.cz/static/web/logo_small.png" width="32" class="iqdr-value iqdr-path-image" style="display: inline;"></div>\n' +
      '</div>')
  })

  it('creates dynamic layout for objects and renders complex array', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(DataRendererComponent, {
      localVue,
      propsData: {
        data: { array: [{ a: 1 }, { b: 2 }, { c: 3 }] },
        paths: [],
        layout: {
          showEmpty: true,
          arrayWrapper: {
            element: 'div'
          },
          children: [
            {
              prop: 'array',
              label: {
                label: 'Array label'
              },
              item: {
                label: {
                  label: 'Item label'
                }
              }
            }
          ]
        }
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;" paths="">\n' +
      '  <div class="iqdr-wrapper iqdr-path-array"><label class="iqdr-label iqdr-path-array">Array Label: </label>\n' +
      '    <div class="iqdr-arrayWrapper iqdr-path-array" style="display: inline-table;">\n' +
      '      <div class="iqdr-wrapper iqdr-path-array-0 iqdr-path-0"><label class="iqdr-label iqdr-path-array-0 iqdr-path-0">Item Label: </label>\n' +
      '        <div class="iqdr-childrenWrapper iqdr-path-array-0 iqdr-path-0" style="margin-left: 30px;">\n' +
      '          <div class="iqdr-wrapper iqdr-path-array-0/a iqdr-path-0-a iqdr-path-a"><label class="iqdr-label iqdr-path-array-0/a iqdr-path-0-a iqdr-path-a">A: </label>\n' +
      '            <div class="iqdr-value iqdr-path-array-0/a iqdr-path-0-a iqdr-path-a" style="display: inline;">1</div>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-array-1 iqdr-path-1"><label class="iqdr-label iqdr-path-array-1 iqdr-path-1">Item Label: </label>\n' +
      '        <div class="iqdr-childrenWrapper iqdr-path-array-1 iqdr-path-1" style="margin-left: 30px;">\n' +
      '          <div class="iqdr-wrapper iqdr-path-array-1/b iqdr-path-1-b iqdr-path-b"><label class="iqdr-label iqdr-path-array-1/b iqdr-path-1-b iqdr-path-b">B: </label>\n' +
      '            <div class="iqdr-value iqdr-path-array-1/b iqdr-path-1-b iqdr-path-b" style="display: inline;">2</div>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-array-2 iqdr-path-2"><label class="iqdr-label iqdr-path-array-2 iqdr-path-2">Item Label: </label>\n' +
      '        <div class="iqdr-childrenWrapper iqdr-path-array-2 iqdr-path-2" style="margin-left: 30px;">\n' +
      '          <div class="iqdr-wrapper iqdr-path-array-2/c iqdr-path-2-c iqdr-path-c"><label class="iqdr-label iqdr-path-array-2/c iqdr-path-2-c iqdr-path-c">C: </label>\n' +
      '            <div class="iqdr-value iqdr-path-array-2/c iqdr-path-2-c iqdr-path-c" style="display: inline;">3</div>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>')
  })

  it('renders object with pathlayout', () => {
    const localVue = createLocalVue()
    localVue.use(install)

    const wrapper = mount(DataRendererComponent, {
      localVue,
      propsData: {
        data: {
          object: {
            a: '1',
            b: null
          }
        },
        layout: { showEmpty: true },
        pathLayouts: {
          object: {
            label: {
              label: 'label'
            }
          },
          a: {
            element: 'div',
            label: {
              element: 'span',
              label: 'aa',
              class: ['text-red']
            },
            value: {
              class: ['text-red']
            }
          },
          b: {
            element: 'span',
            label: {
              element: 'label',
              label: 'bb',
              class: ['text-blue']
            },
            value: {
              class: ['text-blue']
            }
          }
        }
      }
    })
    console.log(wrapper.html())
    expect(wrapper.html()).to.include(
      '<div class="iqdr-childrenWrapper" style="margin-left: 30px;">\n' +
      '  <div class="iqdr-wrapper iqdr-path-object"><label class="iqdr-label iqdr-path-object">Label: </label>\n' +
      '    <div class="iqdr-childrenWrapper iqdr-path-object" style="margin-left: 30px;">\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-a iqdr-path-a"><span class="text-red iqdr-label iqdr-path-object-a iqdr-path-a">Aa: </span>\n' +
      '        <div class="text-red iqdr-value iqdr-path-object-a iqdr-path-a" style="display: inline;">1</div>\n' +
      '      </div>\n' +
      '      <div class="iqdr-wrapper iqdr-path-object-b iqdr-path-b"><label class="text-blue iqdr-label iqdr-path-object-b iqdr-path-b">Bb: </label>\n' +
      '        <div class="text-blue iqdr-value iqdr-path-object-b iqdr-path-b" style="display: inline;">---</div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>')
  })
})

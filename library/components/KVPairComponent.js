import {RendererMixin} from './mixins'

const KVPairComponent = {
  name: 'DataRendererKVPair',
  mixins: [RendererMixin],
  props: {
    context: [Array, Object],
    prop: [String, Number],
    paths: Array
  },
  methods: {
    createLabel(h, label, value, extra) {
      const labelTranslator = this.layout.labelTranslator || this.$oarepo.dataRenderer.layouts[this.schema].labelTranslator
      return this.renderElement(h, label, {
        ...this.$props,
        value
      }, this.paths, () => [labelTranslator(label.label, extra)], 'label', {})
    },
    getValueWrapper(value) {
      const valueType = Object.prototype.toString.call(value)
      let type
      if (valueType === '[object String]') {
        type = 'string'
      } else if (valueType === '[object Number]') {
        type = 'number'
      } else if (valueType === '[object Boolean]') {
        type = 'boolean'
      } else if (valueType === '[object Array]') {
        type = 'array'
      } else if (valueType === '[object Object]') {
        type = 'object'
      } else if (this.layout.children !== undefined) {
        type = 'object'
      } else if (this.layout.item !== undefined) {
        type = 'array'
      } else {
        type = 'undefined'
      }
      const valueWrapper = this.rendererComponents[type] || this.$oarepo.dataRenderer.rendererComponents[type]
      return {...valueWrapper, ...(this.layout.valueWrapper || {}), valueType: type}
    },
    renderChildren(h, value, extra) {
      const ret = []
      const label = this.getLayout('label', extra)
      if (label.label) {
        ret.push(this.createLabel(h, label, value, extra))
      }
      const valueWrapper = this.getValueWrapper(value)
      ret.push(h(valueWrapper.component, {
        props: {
          value: value,
          schema: this.schema,
          layout: {...this.layout, valueWrapper},
          paths: this.paths,
          pathLayouts: this.pathLayouts,
          rendererComponents: this.rendererComponents,
          extraProps: this.extraProps,
          context: this.context,
          prop: this.prop,
          level: this.level
        },
        scopedSlots: this.$scopedSlots,
        slots: this.slots
      }))
      return ret
    }
  },
  render(h) {
    const value = this.context[this.prop]
    const extra = {
      ...this.$props,
      value
    }
    return this.renderElement(h, this.getLayout('wrapper', extra), {
      ...this.$props,
      value
    }, this.paths, () => {
      return this.renderChildren(h, value, extra)
    }, 'wrapper', {})
  }
}

export default KVPairComponent

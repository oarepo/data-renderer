import { RendererMixin } from '../mixins'

export default {
  name: 'data-renderer-string-component',
  mixins: [RendererMixin],
  props: {
    value: String,
    paths: Array
  },
  render (h) {
    const valueDef = this.getLayout('value', this.$props)
    return this.renderElement(h, valueDef, this.$props, this.paths, () => [this.value], 'value', {})
  },
  computed: {}
}

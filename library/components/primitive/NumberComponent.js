import { RendererMixin } from '../mixins'

export default {
  name: 'data-renderer-number-component',
  mixins: [RendererMixin],
  props: {
    value: Number,
    paths: Array
  },
  render (h) {
    const value = this.getLayout('value', this.$props)
    return this.renderElement(h, value, this.$props, this.paths, () => [this.value.toString()], 'value', {})
  },
  computed: {}
}

import { RendererMixin } from '../mixins'

export default {
  name: 'data-renderer-boolean-component',
  mixins: [RendererMixin],
  props: {
    value: Boolean,
    paths: Array
  },
  render (h) {
    const value = this.getLayout('value', this.$props)
    return this.renderElement(h, value, this.$props, this.paths, () => [this.value.toString()], 'value', {})
  },
  computed: {}
}

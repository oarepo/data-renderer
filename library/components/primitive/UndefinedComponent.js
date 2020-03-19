import { RendererMixin } from '../mixins'

export default {
  name: 'data-renderer-undefined-component',
  mixins: [RendererMixin],
  props: {
    value: [undefined, null],
    paths: Array
  },
  render (h) {
    const value = this.getLayout('value', this.$props)
    return this.renderElement(h, value, this.$props, this.paths, () => ['---'], 'value', {})
  },
  computed: {}
}

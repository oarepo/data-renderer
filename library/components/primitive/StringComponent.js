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
    const children = []
    if (this.$slots.before) {
      children.push(this.$slots.before)
    }
    children.push(this.value)
    if (this.$slots.after) {
      children.push(this.$slots.after)
    }
    return this.renderElement(h, valueDef, this.$props, this.paths, () => children, 'value', {})
  },
  computed: {}
}

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
    const children = []
    if (this.$slots.before) {
      children.push(this.$slots.before)
    }
    children.push(this.value.toString())
    if (this.$slots.after) {
      children.push(this.$slots.after)
    }
    return this.renderElement(h, value, this.$props, this.paths, () => children, 'value', {})
  },
  computed: {}
}

import KVPairComponent from './KVPairComponent'
import { RendererMixin } from './mixins'
import { range } from '../utils'

export default {
  name: 'data-renderer-array-component',
  mixins: [RendererMixin],
  props: {
    value: Array,
    paths: Array
  },
  render (h) {
    const layout = this.currentLayout
    let itemLayout = layout.item
    if (itemLayout === undefined) {
      itemLayout = this.$oarepo.dataRenderer.createDynamicArrayLayout({
        value: this.value,
        paths: this.paths,
        schema: this.schema,
        layout: layout,
        pathLayouts: this.pathLayouts,
        rendererComponents: this.rendererComponents,
        vue: this
      })
    }
    itemLayout.showEmpty = layout.showEmpty || this.$oarepo.dataRenderer.layouts[this.schema].showEmpty
    return this.renderElement(h, this.getLayout('arrayWrapper', this.$props), this.$props, this.paths, () => {
      if (!this.value) {
        return []
      }
      return range(this.value.length).map(index => {
        return h(KVPairComponent, {
          props: {
            context: this.value,
            prop: index,
            schema: this.schema,
            layout: itemLayout,
            paths: this.paths,
            pathLayouts: this.pathLayouts,
            rendererComponents: this.rendererComponents
          },
          scopedSlots: this.$scopedSlots,
          slots: this.slots
        })
      })
    }, 'arrayWrapper', {})
  },
  computed: {}
}

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
    const value = this.value ? this.value : []
    let itemLayout = layout.item
    if (itemLayout === undefined) {
      itemLayout = this.$oarepo.dataRenderer.createDynamicArrayLayout({
        value: value,
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
      if (!value) {
        return []
      }
      return range(value.length).map(index => {
        return h(KVPairComponent, {
          props: {
            context: value,
            prop: index,
            schema: this.schema,
            layout: {...this.$oarepo.dataRenderer.layouts[this.schema], ...itemLayout},
            // paths: this.paths,
            paths: [...this.paths.map(path => `${path}/${index}`), `${index}`],
            pathLayouts: this.pathLayouts,
            rendererComponents: this.rendererComponents,
            extraProps: this.extraProps
          },
          scopedSlots: this.$scopedSlots,
          slots: this.slots
        })
      })
    }, 'arrayWrapper', {})
  },
  computed: {}
}

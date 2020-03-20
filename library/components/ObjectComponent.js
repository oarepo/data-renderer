import KVPairComponent from './KVPairComponent'
import { RendererMixin } from './mixins'

export default {
  name: 'data-renderer-object-component',
  mixins: [RendererMixin],
  props: {
    value: Object,
    paths: Array
  },
  render (h) {
    const layout = this.currentLayout
    let childrenLayouts = layout.children
    if (childrenLayouts === undefined) {
      childrenLayouts = this.$oarepo.dataRenderer.createDynamicObjectLayout({
        value: this.value,
        paths: this.paths,
        schema: this.schema,
        layout: layout,
        rendererComponents: this.rendererComponents,
        vue: this
      })
    }
    const showEmpty = layout.showEmpty || this.$oarepo.dataRenderer.layouts[this.schema].showEmpty
    return this.renderElement(h, this.getLayout('childrenWrapper', this.$props), this.$props, this.paths, () => {
      const ret = []
      if (layout.before) {
        ret.push(this.renderBefore(h, layout.before))
      }
      const renderedItems = childrenLayouts.map(childLayout => {
        const prop = childLayout.prop
        if ((this.value[prop] === null || this.value[prop] === undefined) && !showEmpty) {
          return
        }
        ret.push(h(KVPairComponent, {
          props: {
            context: this.value,
            prop: prop,
            schema: this.schema,
            layout: {
              ...childLayout,
              showEmpty
            },
            paths: [...this.paths.map(path => `${path}/${prop}`), prop],
            pathLayouts: this.pathLayouts,
            rendererComponents: this.rendererComponents
          },
          scopedSlots: this.$scopedSlots,
          slots: this.slots
        }))
      })
      ret.push(renderedItems)
      if (layout.after) {
        ret.push(this.renderAfter(h, layout.after))
      }
      return ret
    }, 'childrenWrapper', {})
  },
  computed: {}
}

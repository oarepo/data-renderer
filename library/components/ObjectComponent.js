import KVPairComponent from './KVPairComponent'
import {RendererMixin} from './mixins'

export default {
  name: 'data-renderer-object-component',
  mixins: [RendererMixin],
  props: {
    value: Object,
    paths: Array
  },
  render(h) {
    const layout = this.currentLayout
    const value = this.value || {}
    let childrenLayouts = layout.children
    if (childrenLayouts === undefined) {
      childrenLayouts = this.$oarepo.dataRenderer.createDynamicObjectLayout({
        value: value,
        paths: this.paths,
        schema: this.schema,
        layout: layout,
        vue: this
      })
    }
    const showEmpty = layout.showEmpty || this.$oarepo.dataRenderer.layouts[this.schema].showEmpty
    return this.renderElement(h, this.getLayout('children-wrapper', this.$props), this.$props, this.paths, () => {
      const ret = []
      if (layout.before) {
        ret.push(this.renderBefore(h, layout.before))
      }
      const renderedItems = childrenLayouts.map(childLayout => {
        const prop = childLayout.prop
        if ((value[prop] === null || value[prop] === undefined) && !showEmpty) {
          return
        }
        ret.push(h(KVPairComponent, {
          props: {
            context: value,
            prop: prop,
            schema: this.schema,
            layout: childLayout,
            paths: [...this.paths.map(path => `${path}/${prop}`), prop],
            pathLayouts: this.pathLayouts,
            rendererComponents: this.rendererComponents,
            extraProps: this.extraProps,
            level: this.level + 1
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
    }, 'children-wrapper', {})
  },
  computed: {}
}

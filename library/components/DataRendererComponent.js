import ArrayComponent from './ArrayComponent'
import ObjectComponent from './ObjectComponent'

export default {
  name: 'data-renderer',
  props: {
    schema: {
      type: String,
      default: 'inline'
    },
    layout: Object,
    data: Object,
    pathLayouts: Object
  },
  render (h) {
    const context = this.data
    if (Array.isArray(context)) {
      return h(ArrayComponent, {
        props: {
          value: context,
          paths: [],
          schema: this.schema,
          layout: this.layout,
          pathLayouts: this.pathLayouts
        }
      })
    } else {
      return h(ObjectComponent, {
        props: {
          value: context,
          paths: [],
          schema: this.schema,
          layout: this.layout,
          pathLayouts: this.pathLayouts
        }
      })
    }
  }
}

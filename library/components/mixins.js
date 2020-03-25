import deepmerge from 'deepmerge'
import { applyFunctions } from '../layoututils'

const RendererMixin = {
  props: {
    schema: {
      type: String,
      default: 'inline'
    },
    layout: Object,
    pathLayouts: Object,
    rendererComponents: Object,
    extraProps: Object
  },
  methods: {
    renderBefore (h, before) {
      return h(before)
    },
    renderAfter (h, after) {
      return h(after)
    },
    getLayout (code, extra) {
      const schema = this.schema
      const localLayout = this.currentLayout[code] || {}
      const globalLayout = this.$oarepo.dataRenderer.layouts[schema][code]
      const pathLayout = this.getPathLayout(this.paths, code)
      const merged = (this.$oarepo.dataRenderer.merge || deepmerge.all)([globalLayout, localLayout, pathLayout], this.$oarepo.dataRenderer.layoutMergeOptions)
      return applyFunctions(merged, extra)
    },
    getPathLayout (paths, code) {
      if (this.pathLayouts === undefined) {
        return {}
      }
      for (let i=0; i < paths.length; i++) {
        const p = this.pathLayouts[paths[i]]
        if (p && p[code] !== undefined) {
          return p[code]
        }
      }
      return {}
    },
    renderElement (h, elDef, options, paths, renderChildren, classCode, extra) {
      const component = elDef.component
      if (component === null) {
        return []
      }
      if (component !== undefined) {
        const ret = [
          h(component, {
            ...extra,
            class: [
              ...(elDef.class || []),
              `iqdr-${classCode}`,
              ...paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
            ],
            style: elDef.style,
            attrs: elDef.attrs,
            props: options
          })
        ]
        return ret
      }
      const element = elDef.element
      if (element === null) {
        return []
      }
      if (element !== undefined) {
        const ret = [
          h(element, {
              ...extra,
              class: [
                ...(elDef.class || []),
                `iqdr-${classCode}`,
                ...paths.map(path => `iqdr-path-${path.replace('/', '-')}`)
              ],
              style: elDef.style,
              attrs: elDef.attrs,
              props: options
            },
            renderChildren ? renderChildren() : [])
        ]
        return ret
      }
      return renderChildren ? renderChildren() : []
    }
  },
  computed: {
    currentLayout () {
      return this.layout || {}
    }
  }
}

export {
  RendererMixin
}

function createDynamicArrayLayout ({ /*value, paths, layout,*/ schema, vue }) {
  return vue.$oarepo.dataRenderer.layouts[schema]
}

function createDynamicObjectLayout ({ /*paths,*/ layout, value, schema, vue }) {
  const props = Object.keys(value)
  const itemDef = vue.$oarepo.dataRenderer.layouts[schema]
  return props.map(prop => {
    let item = { ...itemDef, prop }
    if (!item.label.label) {
      item.label = { ...item.label, label: prop }
    }
    if (layout) {
      item = {...item, ...layout}
    }
    item.showEmpty = true
    return item
  })
}

export {
  createDynamicArrayLayout,
  createDynamicObjectLayout
}
